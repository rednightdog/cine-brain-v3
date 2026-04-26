import { describe, expect, it } from "vitest";

import { getCompatibleOptions, getCropFactor, getNextCameraLetter, isCameraBody } from "../lib/inventory-utils";
import type { InventoryItem } from "../components/CineBrainInterface";

function makeItem(overrides: Partial<InventoryItem> = {}): InventoryItem {
    return {
        id: "item-1",
        name: "Generic Item",
        category: "SUP",
        ...overrides,
    };
}

describe("isCameraBody", () => {
    it("returns false when item is missing or not a camera", () => {
        expect(isCameraBody(undefined)).toBe(false);
        expect(isCameraBody(makeItem({ category: "LNS" }))).toBe(false);
    });

    it("returns true for camera bodies by subcategory", () => {
        const item = makeItem({
            category: "CAM",
            subcategory: "Bodies",
        });

        expect(isCameraBody(item)).toBe(true);
    });

    it("returns true for camera bodies inferred from keywords", () => {
        const item = makeItem({
            category: "CAM",
            name: "Sony Venice 2",
        });

        expect(isCameraBody(item)).toBe(true);
    });
});

describe("getCropFactor", () => {
    it("returns 1.0 for unknown sensors", () => {
        expect(getCropFactor(undefined)).toBe(1.0);
        expect(getCropFactor("Full Frame")).toBe(1.0);
    });

    it("returns expected factors for S35, MFT and LF", () => {
        expect(getCropFactor("S35")).toBe(1.5);
        expect(getCropFactor("micro four thirds")).toBe(2.0);
        expect(getCropFactor("Large Format")).toBe(0.9);
    });
});

describe("getNextCameraLetter", () => {
    it("starts with A when no camera units exist", () => {
        expect(getNextCameraLetter([])).toBe("A");
    });

    it("returns the first free camera unit letter", () => {
        expect(getNextCameraLetter(["A"])).toBe("B");
        expect(getNextCameraLetter(["A", "C"])).toBe("B");
        expect(getNextCameraLetter(["A", "B", "C"])).toBe("D");
    });

    it("ignores invalid or empty assigned camera values", () => {
        expect(getNextCameraLetter([null, undefined, "", "ALL", "A"])).toBe("B");
    });
});

describe("getCompatibleOptions", () => {
    it("returns Rialto and extension options for Venice hosts", () => {
        const host = makeItem({
            id: "cam-venice",
            category: "CAM",
            name: "Sony Venice 2",
        });
        const catalog = [
            makeItem({ id: "acc-1", name: "Rialto 2 Extension", subcategory: "Extension" }),
            makeItem({ id: "acc-2", name: "Cable Pack", subcategory: "Extension Cable" }),
            makeItem({ id: "acc-3", name: "Tripod Legs", subcategory: "Tripod Legs" }),
        ];

        const result = getCompatibleOptions(host, catalog);
        expect(result.map((item) => item.id)).toEqual(["acc-1", "acc-2"]);
    });

    it("returns empty list for non-Venice hosts", () => {
        const host = makeItem({
            id: "cam-alexa",
            category: "CAM",
            name: "ARRI Alexa 35",
        });
        const catalog = [makeItem({ id: "acc-1", name: "Rialto 2 Extension", subcategory: "Extension" })];

        expect(getCompatibleOptions(host, catalog)).toEqual([]);
    });
});
