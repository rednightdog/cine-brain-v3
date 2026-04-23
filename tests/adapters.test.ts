import { describe, expect, it } from "vitest";

import { findCompatibleAdapters, hasAdapter } from "../lib/adapters";

describe("adapters", () => {
    it("finds all matching PL -> RF adapters", () => {
        const result = findCompatibleAdapters("PL", "RF");

        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result.every((adapter) => adapter.from_mount === "PL" && adapter.to_mount === "RF")).toBe(true);
    });

    it("checks compatibility case-insensitively", () => {
        expect(hasAdapter("ef", "e-mount")).toBe(true);
    });

    it("returns false when combination does not exist", () => {
        expect(hasAdapter("LPL", "E-Mount")).toBe(false);
    });
});
