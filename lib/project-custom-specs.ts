import type { InventoryEntry, InventoryItem } from "@/components/CineBrainInterface";
import { inferKnownLensVariantSpecs } from "./generic-lens-set";

export type ProjectCustomSpecs = {
    coverage?: string | null;
    mount?: string | null;
    lens_type?: string | null;
    focal_length?: string | null;
    aperture?: string | null;
    weight_kg?: number | null;
    front_diameter_mm?: number | null;
    image_circle_mm?: number | null;
    specs_json?: string | null;
};

export function parseProjectCustomSpecs(configJson: string | null | undefined): ProjectCustomSpecs {
    if (!configJson) return {};
    try {
        const parsed: unknown = JSON.parse(configJson);
        if (typeof parsed !== "object" || parsed === null) return {};
        const record = parsed as Record<string, unknown>;
        const specs = record.customSpecs;
        return typeof specs === "object" && specs !== null ? specs as ProjectCustomSpecs : {};
    } catch {
        return {};
    }
}

export function stringifyProjectCustomConfig(
    configJson: string | null | undefined,
    specs: ProjectCustomSpecs
): string {
    let base: Record<string, unknown> = {};
    try {
        const parsed: unknown = configJson ? JSON.parse(configJson) : {};
        if (typeof parsed === "object" && parsed !== null) base = parsed as Record<string, unknown>;
    } catch { }

    const cleanSpecs = Object.fromEntries(
        Object.entries(specs).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );

    return JSON.stringify({
        ...base,
        customSpecs: cleanSpecs,
    });
}

export function getEntryCustomSpecs(entry: Pick<InventoryEntry, "configJson" | "name" | "model" | "brand">): ProjectCustomSpecs {
    const storedSpecs = parseProjectCustomSpecs(entry.configJson);
    const inferredSpecs = inferKnownLensVariantSpecs(
        [entry.brand, entry.model, entry.name].filter(Boolean).join(" "),
        storedSpecs.mount || undefined
    );

    return {
        ...inferredSpecs,
        ...storedSpecs,
    };
}

export function getEntryInventoryItem(entry: InventoryEntry, catalog: InventoryItem[]): InventoryItem | null {
    const catalogItem = catalog.find(item => item.id === entry.equipmentId);
    if (catalogItem) return catalogItem;

    if (entry.equipmentId) return null;

    const customSpecs = getEntryCustomSpecs(entry);
    return {
        id: entry.id,
        name: entry.name,
        brand: entry.brand,
        model: entry.model || entry.name,
        category: entry.category,
        subcategory: entry.subcategory || "Generic",
        description: entry.notes || "Project-only generic item",
        coverage: entry.coverage || customSpecs.coverage,
        mount: entry.mount || customSpecs.mount,
        lens_type: entry.lens_type || customSpecs.lens_type,
        focal_length: entry.focal_length || customSpecs.focal_length,
        aperture: entry.aperture || customSpecs.aperture,
        weight_kg: entry.weight_kg ?? customSpecs.weight_kg,
        front_diameter_mm: entry.front_diameter_mm ?? customSpecs.front_diameter_mm,
        image_circle_mm: entry.image_circle_mm ?? customSpecs.image_circle_mm,
        specs_json: entry.specs_json || customSpecs.specs_json,
        isPrivate: true,
    };
}
