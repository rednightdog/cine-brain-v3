import { describe, expect, it } from "vitest";

import {
    getEntryCustomSpecs,
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
});
