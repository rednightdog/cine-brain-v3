import { describe, expect, it, vi } from "vitest";

import {
    validateDependencies,
    validateHardwareCompatibility,
    type HardwareSpecs,
} from "../lib/hardware-validator";

type EntityInput = {
    brand: string;
    model: string;
    category: string;
    subcategory?: string | null;
    specs?: HardwareSpecs;
};

function makeEntity(input: EntityInput): EntityInput {
    return input;
}

describe("validateHardwareCompatibility", () => {
    it("flags media slot mismatch and Venice 2 SD rule", () => {
        const camera = makeEntity({
            brand: "Sony",
            model: "Venice 2",
            category: "CAM",
            specs: {
                media_slots: ["AXS"],
                compatible_codecs: ["X-OCN"],
            },
        });
        const media = makeEntity({
            brand: "Generic",
            model: "SD Card Pro",
            category: "SUP",
            specs: {
                media_type: "SD",
                certified_for: ["ProRes"],
            },
        });

        const warnings = validateHardwareCompatibility(camera, media);
        const mediaErrors = warnings.filter((w) => w.type === "MEDIA" && w.severity === "ERROR");

        expect(mediaErrors.length).toBeGreaterThanOrEqual(2);
        expect(warnings.some((w) => w.message.includes("not compatible"))).toBe(true);
        expect(warnings.some((w) => w.message.includes("Venice 2 ana kayıt"))).toBe(true);
    });

    it("flags low voltage and mount mismatch for batteries", () => {
        const camera = makeEntity({
            brand: "ARRI",
            model: "Alexa 35",
            category: "CAM",
            specs: {
                power: {
                    min_voltage: 24,
                    mount_type: "B-Mount",
                },
            },
        });
        const battery = makeEntity({
            brand: "Core SWX",
            model: "Hypercore 14.4",
            category: "POW",
            specs: {
                voltage: "14.4V",
                mount_type: "V-Mount",
            },
        });

        const warnings = validateHardwareCompatibility(camera, battery);

        expect(warnings.some((w) => w.type === "POWER" && w.message.includes("Voltaj Yetersiz"))).toBe(true);
        expect(warnings.some((w) => w.type === "POWER" && w.message.includes("Mount Uyumsuzluğu"))).toBe(true);
    });

    it("flags tripod head/legs mismatch and suggests adapter", () => {
        const head = makeEntity({
            brand: "OConnor",
            model: "2575D",
            category: "SUP",
            subcategory: "Fluid Head",
            specs: { base: "Mitchell" },
        });
        const legs = makeEntity({
            brand: "Sachtler",
            model: "Flowtech 150",
            category: "SUP",
            subcategory: "Tripod Legs",
            specs: { mount: "150mm Bowl" },
        });

        const warnings = validateHardwareCompatibility(head, legs);

        const tripodWarning = warnings.find((w) => w.type === "TRIPOD");
        expect(tripodWarning).toBeDefined();
        expect(tripodWarning?.solution).toContain("Moy to 150mm");
    });

    it("flags rod standard mismatch", () => {
        const camera = makeEntity({
            brand: "ARRI",
            model: "Alexa Mini LF",
            category: "CAM",
            specs: { rod_standard: "19mm Studio" },
        });
        const support = makeEntity({
            brand: "Wooden Camera",
            model: "Lens Support",
            category: "SUP",
            specs: { rod_standard: "15mm LWS" },
        });

        const warnings = validateHardwareCompatibility(camera, support);
        expect(warnings.some((w) => w.type === "ROD" && w.severity === "ERROR")).toBe(true);
    });

    it("flags host-specific accessory mismatch and outdated Rialto", () => {
        const camera = makeEntity({
            brand: "Sony",
            model: "Venice 2",
            category: "CAM",
            specs: {},
        });
        const rialto = makeEntity({
            brand: "Sony",
            model: "Rialto Extension",
            category: "SUP",
            specs: {
                compatible_with: "ARRI Alexa 35",
            },
        });

        const warnings = validateHardwareCompatibility(camera, rialto);

        expect(warnings.some((w) => w.type === "GENERAL" && w.message.includes("only compatible"))).toBe(true);
        expect(warnings.some((w) => w.message.includes("RIALTO ERROR"))).toBe(true);
    });

    it("adds heavy lens support advice", () => {
        const camera = makeEntity({
            brand: "ARRI",
            model: "Alexa 35",
            category: "CAM",
            specs: { power: { mount_type: "PL" } },
        });
        const lens = makeEntity({
            brand: "Angenieux",
            model: "Optimo 24-290",
            category: "LNS",
            specs: { weight_kg: 2.4 },
        });

        const warnings = validateHardwareCompatibility(camera, lens);
        expect(warnings.some((w) => w.type === "WEIGHT" && w.severity === "WARNING")).toBe(true);
    });
});

describe("validateDependencies", () => {
    it("warns when required dependent items are missing on the same camera assignment", () => {
        const inventory = [
            {
                id: "entry-1",
                equipmentId: "item-1",
                assignedCam: "A",
                name: "Rialto 2",
                model: "Rialto 2",
            },
            {
                id: "entry-2",
                equipmentId: null,
                assignedCam: "A",
                name: "Extension Cable Long",
                model: null,
            },
        ];

        const catalog = [
            {
                id: "item-1",
                name: "Sony Rialto 2",
                specs_json: JSON.stringify({
                    needs: ["Extension Cable", "90 Degree SDI"],
                }),
            },
        ];

        const warnings = validateDependencies(inventory, catalog);

        expect(warnings).toHaveLength(1);
        expect(warnings[0].type).toBe("DEPENDENCY");
        expect(warnings[0].message).toContain("90 Degree SDI");
    });

    it("ignores invalid specs_json safely", () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        const inventory = [
            {
                id: "entry-1",
                equipmentId: "item-1",
                assignedCam: "A",
                name: "Broken Item",
                model: null,
            },
        ];
        const catalog = [
            {
                id: "item-1",
                name: "Broken",
                specs_json: "{invalid-json}",
            },
        ];

        const warnings = validateDependencies(inventory, catalog);
        expect(warnings).toHaveLength(0);
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
