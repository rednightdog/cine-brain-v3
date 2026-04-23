import { describe, expect, it } from "vitest";

import { autoCategorize } from "../lib/ai-categorizer";

describe("autoCategorize", () => {
    it("matches focus gear keywords case-insensitively", () => {
        const result = autoCategorize("arri wcu-4 wireless unit");

        expect(result).toEqual({
            category: "SUPPORT",
            subcategory: "Focus",
            confidence: 0.9,
        });
    });

    it("uses first matching rule precedence", () => {
        const result = autoCategorize("Prime Lens 50mm");

        expect(result?.category).toBe("LENS");
        expect(result?.subcategory).toBeNull();
        expect(result?.confidence).toBe(0.7);
    });

    it("returns null when no keyword matches", () => {
        expect(autoCategorize("mystery rig widget")).toBeNull();
    });
});
