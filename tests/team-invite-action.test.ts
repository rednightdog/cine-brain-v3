import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, revalidatePathMock, prismaMock } = vi.hoisted(() => {
    const auth = vi.fn();
    const revalidatePath = vi.fn();
    const prisma = {
        teamMember: {
            findUnique: vi.fn(),
        },
        user: {
            findUnique: vi.fn(),
        },
        invitation: {
            findFirst: vi.fn(),
            create: vi.fn(),
        },
    };

    return {
        authMock: auth,
        revalidatePathMock: revalidatePath,
        prismaMock: prisma,
    };
});

vi.mock("@/auth", () => ({
    auth: authMock,
}));

vi.mock("@/lib/db", () => ({
    prisma: prismaMock,
}));

vi.mock("next/cache", () => ({
    revalidatePath: revalidatePathMock,
}));

vi.mock("@/lib/catalog-research", () => ({
    normalizeName: (value: string) => value.toLowerCase(),
    researchEquipment: vi.fn(),
}));

import { inviteUserToTeamAction } from "../app/actions";

type SessionLike = {
    user?: {
        id?: string;
        email?: string | null;
    };
} | null;

describe("inviteUserToTeamAction", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        authMock.mockResolvedValue({
            user: {
                id: "owner-1",
                email: "owner@cinebrain.app",
            },
        } satisfies SessionLike);

        prismaMock.teamMember.findUnique.mockResolvedValue({ role: "OWNER" });
        prismaMock.user.findUnique.mockResolvedValue(null);
        prismaMock.invitation.findFirst.mockResolvedValue(null);
        prismaMock.invitation.create.mockResolvedValue({
            id: "inv-1",
            email: "new.user@cinebrain.app",
            teamId: "team-1",
        });
    });

    it("returns unauthorized when there is no authenticated user", async () => {
        authMock.mockResolvedValue(null);

        const result = await inviteUserToTeamAction("team-1", "new.user@cinebrain.app");

        expect(result).toEqual({ success: false, error: "Unauthorized" });
        expect(prismaMock.teamMember.findUnique).not.toHaveBeenCalled();
    });

    it("validates email format before any database invite writes", async () => {
        const result = await inviteUserToTeamAction("team-1", "invalid-email");

        expect(result).toEqual({ success: false, error: "Invalid email" });
        expect(prismaMock.invitation.create).not.toHaveBeenCalled();
    });

    it("blocks non-owner/non-admin members", async () => {
        prismaMock.teamMember.findUnique.mockResolvedValue({ role: "MEMBER" });

        const result = await inviteUserToTeamAction("team-1", "new.user@cinebrain.app");

        expect(result).toEqual({ success: false, error: "Insufficient permissions" });
        expect(prismaMock.invitation.create).not.toHaveBeenCalled();
    });

    it("prevents inviting yourself", async () => {
        const result = await inviteUserToTeamAction("team-1", "OWNER@CINEBRAIN.APP");

        expect(result).toEqual({ success: false, error: "You are already in this team" });
        expect(prismaMock.invitation.create).not.toHaveBeenCalled();
    });

    it("returns an error when target user is already a team member", async () => {
        prismaMock.user.findUnique.mockResolvedValue({ id: "member-2" });
        prismaMock.teamMember.findUnique
            .mockResolvedValueOnce({ role: "OWNER" })
            .mockResolvedValueOnce({ teamId: "team-1", userId: "member-2", role: "MEMBER" });

        const result = await inviteUserToTeamAction("team-1", "member@cinebrain.app");

        expect(result).toEqual({ success: false, error: "User is already a member of this team" });
        expect(prismaMock.invitation.create).not.toHaveBeenCalled();
    });

    it("reuses a pending invitation if one already exists", async () => {
        prismaMock.invitation.findFirst.mockResolvedValue({
            id: "inv-existing",
            email: "new.user@cinebrain.app",
            teamId: "team-1",
            accepted: false,
        });

        const result = await inviteUserToTeamAction("team-1", "new.user@cinebrain.app");

        expect(result).toMatchObject({ success: true, reused: true });
        expect(prismaMock.invitation.create).not.toHaveBeenCalled();
    });

    it("creates a normalized invitation and revalidates dashboard", async () => {
        const result = await inviteUserToTeamAction("team-1", " New.User@CineBrain.App ");

        expect(prismaMock.invitation.create).toHaveBeenCalledWith({
            data: {
                email: "new.user@cinebrain.app",
                teamId: "team-1",
                expires: expect.any(Date),
            },
        });
        expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard");
        expect(result).toMatchObject({ success: true, reused: false });
    });
});
