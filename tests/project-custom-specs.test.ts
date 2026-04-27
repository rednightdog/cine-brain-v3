import { describe, expect, it } from "vitest";

import {
    getEntryCustomSpecs,
    getEntryInventoryItem,
    stringifyProjectCustomConfig,
} from "../lib/project-custom-specs";

describe("project custom specs", () => {
    it("stores custom technical specs inside configJson", () => {
        const config = stringifyProjectCustomConfig("{}", {
            coverage: "FF",
            mount: "E-Mount",
            focal_length: "35mm",
            aperture: "T1.5",
            weight_kg: 0.402,
            front_diameter_mm: 67,
            image_circle_mm: 43.2,
        });

        expect(JSON.parse(config)).toMatchObject({
            customSpecs: {
                coverage: "FF",
                mount: "E-Mount",
                focal_length: "35mm",
                aperture: "T1.5",
                weight_kg: 0.402,
                front_diameter_mm: 67,
                image_circle_mm: 43.2,
            },
        });
    });

    it("infers Simera-C specs for older project-only custom lens rows", () => {
        const specs = getEntryCustomSpecs({
            brand: "Thypoch",
            model: "Simera-C 50mm T1.5",
            name: "Thypoch Simera-C 50mm T1.5",
            configJson: "{}",
        });

        expect(specs).toMatchObject({
            coverage: "FF",
            mount: "E-Mount",
            focal_length: "50mm",
            aperture: "T1.5",
            weight_kg: 0.369,
            front_diameter_mm: 67,
        });
    });

    it("uses project custom specs as overrides over catalog specs", () => {
        const configJson = stringifyProjectCustomConfig("{}", {
            coverage: "FF",
            mount: "E-Mount",
            image_circle_mm: 43.2,
        });
        const item = getEntryInventoryItem({
            id: "kit-item-1",
            equipmentId: "catalog-lens-1",
            name: "Catalog Lens",
            brand: "Brand",
            model: "Catalog Lens",
            category: "LNS",
            subcategory: "Prime",
            assignedCam: "A",
            quantity: 1,
            notes: "",
            configJson,
            parentId: null,
        }, [{
            id: "catalog-lens-1",
            name: "Catalog Lens",
            brand: "Brand",
            model: "Catalog Lens",
            category: "LNS",
            subcategory: "Prime",
            description: "",
            coverage: "S35",
            mount: "PL",
            image_circle_mm: 31,
        }]);

        expect(item).toMatchObject({
            coverage: "FF",
            mount: "E-Mount",
            image_circle_mm: 43.2,
        });
    });
});
