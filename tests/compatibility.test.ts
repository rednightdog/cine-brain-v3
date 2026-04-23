import { describe, expect, it } from "vitest";

import { validateCompatibility } from "../lib/compatibility";
import type { InventoryEntry, InventoryItem } from "../components/CineBrainInterface";

function makeCatalogItem(item: InventoryItem): InventoryItem {
    return item;
}

function makeEntry(entry: InventoryEntry): InventoryEntry {
    return entry;
}

function cameraItem(overrides: Partial<InventoryItem> = {}): InventoryItem {
    return makeCatalogItem({
        id: "cam-1",
        name: "ARRI Alexa 35",
        brand: "ARRI",
        model: "Alexa 35",
        category: "CAM",
        subcategory: "Bodies",
        mount: "PL",
        sensor_size: "FF",
        ...overrides,
    });
}

function lensItem(overrides: Partial<InventoryItem> = {}): InventoryItem {
    return makeCatalogItem({
        id: "lens-1",
        name: "Sample Lens",
        brand: "Test",
        model: "Lens 50",
        category: "LNS",
        subcategory: "Prime",
        mount: "PL",
        coverage: "FF",
        ...overrides,
    });
}

function entryFor(item: InventoryItem, overrides: Partial<InventoryEntry> = {}): InventoryEntry {
    return makeEntry({
        id: `entry-${item.id}`,
        equipmentId: item.id,
        name: item.name,
        brand: item.brand || "",
        model: item.model || "",
        category: item.category,
        subcategory: item.subcategory || "",
        assignedCam: "A",
        quantity: 1,
        notes: "",
        configJson: "{}",
        parentId: null,
        ...overrides,
    });
}

describe("validateCompatibility", () => {
    it("returns impossible mount error for E-mount lens on PL camera", () => {
        const cam = cameraItem({ mount: "PL" });
        const lens = lensItem({ mount: "E-Mount", name: "Sony E Lens" });

        const warnings = validateCompatibility(
            [entryFor(cam), entryFor(lens)],
            [cam, lens]
        );

        const impossible = warnings.find((w) => w.type === "MOUNT" && w.severity === "ERROR");
        expect(impossible).toBeDefined();
        expect(impossible?.message).toContain("İMKANSIZ");
    });

    it("suggests adapter when known adapter path exists", () => {
        const cam = cameraItem({ mount: "RF", name: "RED V-Raptor", model: "V-Raptor" });
        const lens = lensItem({ mount: "PL", name: "Cooke S4/i" });

        const warnings = validateCompatibility(
            [entryFor(cam), entryFor(lens)],
            [cam, lens]
        );

        const mountWarning = warnings.find((w) => w.type === "MOUNT" && w.severity === "WARNING");
        expect(mountWarning).toBeDefined();
        expect(mountWarning?.message).toContain("ADAPTÖR LAZIM");
        expect((mountWarning?.suggestedAdapters || []).length).toBeGreaterThan(0);
    });

    it("returns hard error when no known adapter exists", () => {
        const cam = cameraItem({ mount: "LPL" });
        const lens = lensItem({ mount: "M42" });

        const warnings = validateCompatibility(
            [entryFor(cam), entryFor(lens)],
            [cam, lens]
        );

        const mountError = warnings.find((w) => w.type === "MOUNT" && w.severity === "ERROR");
        expect(mountError).toBeDefined();
        expect(mountError?.message).toContain("No known adapter");
    });

    it("warns for lens coverage below camera sensor size", () => {
        const cam = cameraItem({ sensor_size: "Full Frame" });
        const lens = lensItem({ coverage: "S35", mount: "PL" });

        const warnings = validateCompatibility(
            [entryFor(cam), entryFor(lens)],
            [cam, lens]
        );

        expect(warnings.some((w) => w.type === "SENSOR" && w.message.includes("vignette"))).toBe(true);
    });

    it("includes hardware power warnings from integrated validator", () => {
        const cam = cameraItem({
            specs_json: JSON.stringify({
                power: { min_voltage: 24, mount_type: "B-Mount" },
            }),
        });
        const battery = makeCatalogItem({
            id: "pow-1",
            name: "V-Mount Battery",
            brand: "Core SWX",
            model: "Hypercore",
            category: "POW",
            subcategory: "On-Board Battery",
            specs_json: JSON.stringify({
                voltage: "14.4V",
                mount_type: "V-Mount",
            }),
        });

        const warnings = validateCompatibility(
            [entryFor(cam), entryFor(battery)],
            [cam, battery]
        );

        const powerWarnings = warnings.filter((w) => w.type === "POWER");
        expect(powerWarnings.length).toBeGreaterThanOrEqual(2);
    });

    it("adds dependency warning for missing required accessories", () => {
        const cam = cameraItem();
        const accessory = makeCatalogItem({
            id: "acc-1",
            name: "Rialto 2 Core",
            brand: "Sony",
            model: "Rialto 2",
            category: "SUP",
            subcategory: "Extension",
            specs_json: JSON.stringify({
                needs: ["Extension Cable", "90 Degree SDI"],
            }),
        });

        const inventory = [entryFor(cam), entryFor(accessory)];
        const warnings = validateCompatibility(inventory, [cam, accessory]);

        const depWarning = warnings.find((w) => w.type === "DEPENDENCY");
        expect(depWarning).toBeDefined();
        expect(depWarning?.message).toContain("requires");
    });

    it("does not throw when specs_json is invalid", () => {
        const cam = cameraItem({
            id: "cam-bad",
            specs_json: "{invalid-json}",
        });
        const battery = makeCatalogItem({
            id: "pow-bad",
            name: "Battery",
            brand: "Generic",
            model: "V-Mount",
            category: "POW",
            subcategory: "On-Board Battery",
            specs_json: "{also-invalid}",
        });

        const run = () => validateCompatibility([entryFor(cam), entryFor(battery)], [cam, battery]);
        expect(run).not.toThrow();
    });
});
