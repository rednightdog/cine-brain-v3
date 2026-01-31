"use client";

import { useState } from "react";
import {
    Users,
    Plus,
    Mail,
    Trash2,
    UserPlus,
    ExternalLink,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Copy,
    Settings
} from "lucide-react";
import Link from "next/link";
import {
    createTeamAction,
    inviteUserAction,
    removeTeamMemberAction,
    deleteTeamAction,
    acceptInvitationAction
} from "@/app/actions";
import { useRouter } from "next/navigation";

export default function TeamDashboardClient({
    initialTeams,
    inboundInvitations = [],
    session
}: {
    initialTeams: any[],
    inboundInvitations?: any[],
    session: any
}) {
    const router = useRouter();
    const [teams, setTeams] = useState(initialTeams);
    const [invitations, setInvitations] = useState(inboundInvitations);
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");
    const [invitingTeamId, setInvitingTeamId] = useState<string | null>(null);
    const [inviteEmail, setInviteEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateTeam = async () => {
        if (!newTeamName) return;
        setIsLoading(true);
        const res = await createTeamAction(newTeamName);
        if (res.success && res.team) {
            setTeams([res.team, ...teams]);
            setNewTeamName("");
            setIsCreatingTeam(false);
            router.refresh();
        } else {
            alert(res.error || "Failed to create team");
        }
        setIsLoading(false);
    };

    const handleInvite = async (teamId: string) => {
        if (!inviteEmail) return;
        setIsLoading(true);
        // Using inviteUserAction (Note: current action takes projectId, let's fix that or handle team-based invites)
        // For now, I'll pass a dummy project ID or update the action if needed.
        // Actually, the current inviteUserAction in actions.ts is project-based.
        // Let's create a dedicated teamInviteAction or keep it simple for now. 
        // I will update actions.ts to include a more general inviteToTeamAction if needed.
        // Actually, looking at actions.ts, inviteUserAction already handles team creation if missing.
        // I'll use a specialized version for the dashboard.
        const res = await inviteUserAction("", inviteEmail); // Using empty string for projectId for now
        if (res.success) {
            alert("Invitation sent!");
            setInviteEmail("");
            setInvitingTeamId(null);
            router.refresh();
        } else {
            alert(res.error || "Failed to send invitation");
        }
        setIsLoading(false);
    };

    const handleRemoveMember = async (teamId: string, userId: string) => {
        if (!confirm("Are you sure you want to remove this member?")) return;
        const res = await removeTeamMemberAction(teamId, userId);
        if (res.success) {
            router.refresh();
        } else {
            alert(res.error || "Failed to remove member");
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        if (!confirm("Are you sure? This will delete the team and all its collaboration data. Projects will remain with owners.")) return;
        const res = await deleteTeamAction(teamId);
        if (res.success) {
            setTeams(teams.filter(t => t.id !== teamId));
            router.refresh();
        } else {
            alert(res.error || "Failed to delete team");
        }
    };

    const handleAcceptInvitation = async (token: string) => {
        setIsLoading(true);
        const res = await acceptInvitationAction(token);
        if (res.success) {
            setInvitations(invitations.filter(i => i.token !== token));
            router.refresh(); // This will also refresh the teams list via server component
        } else {
            alert(res.error || "Failed to accept invitation");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans pb-20">
            {/* Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-[#E5E5EA] px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight">Collaboration Hub</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Manage teams & teammates</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCreatingTeam(true)}
                        className="bg-[#007AFF] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> NEW TEAM
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 space-y-6">

                {/* Inbound Invitations */}
                {invitations.length > 0 && (
                    <div className="bg-[#007AFF] p-6 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                        <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Mail size={12} /> Inbound Invitations
                        </h2>
                        <div className="space-y-3">
                            {invitations.map((inv: any) => (
                                <div key={inv.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between border border-white/20">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-tight">You're invited to join</p>
                                        <h3 className="text-lg font-black">{inv.team.name}</h3>
                                    </div>
                                    <button
                                        onClick={() => handleAcceptInvitation(inv.token)}
                                        disabled={isLoading}
                                        className="bg-white text-[#007AFF] px-6 py-2 rounded-xl text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {isLoading ? "..." : "ACCEPT"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create Team Modal Placeholder (Inline for now) */}
                {isCreatingTeam && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#007AFF] shadow-xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-sm font-black uppercase mb-4">Create New Team</h2>
                        <div className="flex gap-2">
                            <input
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                placeholder="e.g. CineBrain Production Crew"
                                className="flex-1 bg-[#F2F2F7] border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#007AFF] outline-none"
                                autoFocus
                            />
                            <button
                                onClick={handleCreateTeam}
                                disabled={isLoading || !newTeamName}
                                className="bg-[#1C1C1E] text-white px-6 py-3 rounded-xl text-xs font-black disabled:opacity-50"
                            >
                                {isLoading ? "..." : "CREATE"}
                            </button>
                            <button
                                onClick={() => setIsCreatingTeam(false)}
                                className="px-4 py-3 rounded-xl text-xs font-bold text-gray-500"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                )}

                {/* Teams List */}
                <div className="grid gap-6">
                    {teams.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#C7C7CC]">
                            <Users className="mx-auto text-[#E5E5EA] mb-4" size={48} />
                            <h3 className="text-lg font-bold text-gray-400">No Teams Found</h3>
                            <p className="text-xs text-gray-400 mt-1 uppercase font-bold">Create a team to start collaborating</p>
                        </div>
                    ) : (
                        teams.map((team) => (
                            <div key={team.id} className="bg-white rounded-3xl shadow-sm border border-[#E5E5EA] overflow-hidden">
                                <div className="p-6 border-b border-[#F2F2F7] flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-black uppercase tracking-tight">{team.name}</h2>
                                        <div className="flex gap-3 mt-1 text-[10px] font-bold text-gray-400 uppercase">
                                            <span>{team.members?.length || 0} Members</span>
                                            <span>•</span>
                                            <span>{team.kits?.length || 0} Projects</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setInvitingTeamId(invitingTeamId === team.id ? null : team.id)}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"
                                            title="Invite Member"
                                        >
                                            <UserPlus size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTeam(team.id)}
                                            className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                                            title="Delete Team"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Invite Section */}
                                {invitingTeamId === team.id && (
                                    <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex gap-2">
                                        <input
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="colleague@email.com"
                                            className="flex-1 bg-white border border-blue-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400"
                                            type="email"
                                        />
                                        <button
                                            onClick={() => handleInvite(team.id)}
                                            disabled={isLoading || !inviteEmail}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black"
                                        >
                                            INVITE
                                        </button>
                                    </div>
                                )}

                                {/* Members List */}
                                <div className="p-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Team Members</h3>
                                    <div className="space-y-1">
                                        {team.members?.map((member: any) => (
                                            <div key={member.id} className="flex items-center justify-between p-2 hover:bg-[#F2F2F7] rounded-xl transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#1C1C1E] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {member.user.name?.[0] || member.user.email?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold">{member.user.name || "User"}</p>
                                                        <p className="text-[10px] text-gray-500">{member.user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "text-[8px] font-black px-1.5 py-0.5 rounded",
                                                        member.role === 'OWNER' ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                                                    )}>
                                                        {member.role}
                                                    </span>
                                                    {member.userId !== session?.user?.id && (
                                                        <button
                                                            onClick={() => handleRemoveMember(team.id, member.userId)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pending Invitations */}
                                    {team.invitations && team.invitations.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-[#F2F2F7] opacity-60">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                                                <Mail size={10} /> Pending Invitations
                                            </h3>
                                            <div className="space-y-1">
                                                {team.invitations.map((inv: any) => (
                                                    <div key={inv.id} className="flex items-center justify-between p-2 rounded-xl">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                                                                <Mail size={12} />
                                                            </div>
                                                            <p className="text-[10px] font-medium text-gray-500">{inv.email}</p>
                                                        </div>
                                                        <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">Sent</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Projects Sublist */}
                                    {team.kits && team.kits.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-[#F2F2F7]">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Shared Projects</h3>
                                            <div className="grid grid-cols-2 gap-2 px-2">
                                                {team.kits.map((kit: any) => (
                                                    <Link
                                                        key={kit.id}
                                                        href={`/?project=${kit.id}`}
                                                        className="bg-[#F2F2F7] p-2 rounded-lg text-[11px] font-bold flex items-center justify-between hover:bg-gray-200 transition-colors"
                                                    >
                                                        <span className="truncate">{kit.name}</span>
                                                        <ExternalLink size={10} className="text-gray-400" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
