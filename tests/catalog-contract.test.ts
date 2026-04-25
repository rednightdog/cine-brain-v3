import { describe, expect, it } from "vitest";

import { detectCatalogDomain, evaluateItemByContract, hasFieldValue } from "../lib/catalog-contract";

type ItemInput = Record<string, unknown> & {
    category?: string | null;
    subcategory?: string | null;
    name?: string | null;
    model?: string | null;
    description?: string | null;
};

function makeItem(overrides: ItemInput = {}) {
    return {
        category: "SUP",
        subcategory: null,
        name: "Generic Item",
        model: "Generic Model",
        description: "Generic description",
        ...overrides,
    };
}

describe("detectCatalogDomain", () => {
    it("prioritizes explicit CAM/LNS categories", () => {
        const camera = makeItem({
            category: "CAM",
            name: "Battery Monitor Combo",
            description: "contains power keywords",
        });
        const lens = makeItem({
            category: "LNS",
            name: "Tripod Lens",
            description: "contains support keywords",
        });

        expect(detectCatalogDomain(camera)).toBe("camera");
        expect(detectCatalogDomain(lens)).toBe("lens");
    });

    it("detects monitor and power domains from free text tokens", () => {
        const monitor = makeItem({
            name: "SmallHD 703 Monitor",
        });
        const power = makeItem({
            name: "Core SWX V-Mount Battery",
            description: "14.4V battery pack",
        });

        expect(detectCatalogDomain(monitor)).toBe("monitor_peripheral");
        expect(detectCatalogDomain(power)).toBe("power");
    });

    it("falls back to camera_related when no known token is present", () => {
        const item = makeItem({
            name: "Generic Accessory",
            description: "no token match",
        });

        expect(detectCatalogDomain(item)).toBe("camera_related");
    });
});

describe("hasFieldValue", () => {
    it("returns false for null, undefined and blank strings", () => {
        expect(hasFieldValue({ x: null }, "x")).toBe(false);
        expect(hasFieldValue({}, "x")).toBe(false);
        expect(hasFieldValue({ x: "   " }, "x")).toBe(false);
    });

    it("returns false for non-finite numbers, true for booleans and objects", () => {
        expect(hasFieldValue({ x: Number.NaN }, "x")).toBe(false);
        expect(hasFieldValue({ x: Number.POSITIVE_INFINITY }, "x")).toBe(false);
        expect(hasFieldValue({ x: false }, "x")).toBe(true);
        expect(hasFieldValue({ x: { ok: true } }, "x")).toBe(true);
    });
});

describe("evaluateItemByContract", () => {
    it("returns perfect score for a complete camera item", () => {
        const item = makeItem({
            category: "CAM",
            mount: "PL",
            sensor_size: "S35",
            resolution: "6K",
            recordingFormats: "ProRes, RAW",
            technicalData: "{\"bodyWeightKg\":2.9}",
            labMetrics: "{\"snr\":53}",
            dynamic_range: "16+",
            native_iso: "800",
            power_draw_w: 78,
        });

        const result = evaluateItemByContract(item);
        expect(result.domain).toBe("camera");
        expect(result.missingCritical).toEqual([]);
        expect(result.missingRecommended).toEqual([]);
        expect(result.score).toBe(100);
    });

    it("applies expected penalty for missing critical and recommended fields", () => {
        const item = makeItem({
            category: "LNS",
            mount: "PL",
            coverage: "FF",
            focal_length: "50mm",
            aperture: "T2.1",
            // lens_type is missing (critical)
            // recommended fields are also missing by design
        });

        const result = evaluateItemByContract(item);
        expect(result.domain).toBe("lens");
        expect(result.missingCritical).toEqual(["lens_type"]);
        expect(result.missingRecommended).toEqual([
            "image_circle_mm",
            "close_focus_m",
            "front_diameter_mm",
            "technicalData",
            "squeeze",
        ]);
        expect(result.score).toBe(45);
    });
});
