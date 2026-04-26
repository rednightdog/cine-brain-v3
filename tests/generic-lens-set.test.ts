import { describe, expect, it } from "vitest";

import {
    buildGenericLensVariantModel,
    getGenericLensVariantSpecs,
    getGenericLensSetSuggestion,
    inferKnownLensVariantSpecs,
} from "../lib/generic-lens-set";

describe("generic lens set suggestions", () => {
    it("knows the Thypoch Simera-C T1.5 focal lengths", () => {
        const suggestion = getGenericLensSetSuggestion("Simera-C T1.5 Cine Primes");

        expect(suggestion).toMatchObject({
            brand: "Thypoch",
            seriesName: "Simera-C",
            aperture: "T1.5",
            focalLengths: ["21", "28", "35", "50", "75"],
            mountOptions: ["E-Mount", "M-Mount"],
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

    it("fills real technical specs for Simera-C variants", () => {
        const suggestion = getGenericLensSetSuggestion("Simera-C T1.5 Cine Primes");
        const specs = getGenericLensVariantSpecs(suggestion, "75", "M-Mount");

        expect(specs).toMatchObject({
            coverage: "FF",
            mount: "M-Mount",
            lens_type: "Spherical",
            focal_length: "75mm",
            aperture: "T1.5",
            weight_kg: 0.435,
            front_diameter_mm: 72,
            image_circle_mm: 43.2,
        });
        expect(specs.specs_json).toContain("T1.5-T16");
    });

    it("infers known Simera-C specs from existing custom entries", () => {
        const specs = inferKnownLensVariantSpecs("Thypoch Simera-C 21mm T1.5", "E-Mount");

        expect(specs).toMatchObject({
            coverage: "FF",
            mount: "E-Mount",
            focal_length: "21mm",
            weight_kg: 0.491,
            front_diameter_mm: 67,
        });
    });
});
