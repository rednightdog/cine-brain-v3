import { describe, expect, it } from "vitest";

import {
    buildGenericLensVariantModel,
    getGenericLensSetSuggestion,
} from "../lib/generic-lens-set";

describe("generic lens set suggestions", () => {
    it("knows the Thypoch Simera-C T1.5 focal lengths", () => {
        const suggestion = getGenericLensSetSuggestion("Simera-C T1.5 Cine Primes");

        expect(suggestion).toMatchObject({
            brand: "Thypoch",
            seriesName: "Simera-C",
            aperture: "T1.5",
            focalLengths: ["21", "28", "35", "50", "75"],
            source: "known",
        });
    });

    it("builds clean generic variant model names", () => {
        const suggestion = getGenericLensSetSuggestion("Simera-C T1.5 Cine Primes");

        expect(buildGenericLensVariantModel(suggestion, "35")).toBe("Simera-C 35mm T1.5");
    });

    it("uses explicit focal lengths when they are typed", () => {
        const suggestion = getGenericLensSetSuggestion("My Cine Primes 24mm 50mm 85mm T2.1");

        expect(suggestion.focalLengths).toEqual(["24", "50", "85"]);
        expect(suggestion.aperture).toBe("T2.1");
    });
});
