import { describe, expect, it } from "vitest";

import {
    matchesCatalogSearch,
    normalizeCatalogSearchText,
    tokenizeCatalogSearch,
} from "../lib/catalog-search";

describe("catalog search matching", () => {
    it("normalizes punctuation and casing", () => {
        expect(normalizeCatalogSearchText("Simera-C T1.5 Cine Primes")).toBe("simera c t1.5 cine primes");
    });

    it("matches lens set style queries against individual lens metadata", () => {
        const item = {
            name: "Thypoch Simera C 35mm T1.5",
            brand: "Thypoch",
            model: "Simera-C",
            category: "LNS",
            subcategory: "Prime",
            focal_length: "35mm",
            aperture: "T1.5",
            description: "Cine prime lens",
        };

        expect(matchesCatalogSearch(item, "Simera-C T1.5 Cine Primes")).toBe(true);
    });

    it("matches compact punctuation variants like S4i and S4/i", () => {
        const item = {
            name: "Cooke S4/i 50mm",
            brand: "Cooke",
            model: "S4/i",
            category: "LNS",
        };

        expect(matchesCatalogSearch(item, "Cooke S4i")).toBe(true);
    });

    it("keeps generic words only when they are the whole query", () => {
        expect(tokenizeCatalogSearch("cine primes")).toEqual(["cine", "prime"]);
        expect(tokenizeCatalogSearch("Simera-C T1.5 Cine Primes")).toEqual(["simera", "t1.5"]);
    });

    it("does not match when a meaningful token is absent", () => {
        const item = {
            name: "Sigma Cine 35mm T1.5",
            brand: "Sigma",
            category: "LNS",
            aperture: "T1.5",
        };

        expect(matchesCatalogSearch(item, "Simera T1.5")).toBe(false);
    });
});
