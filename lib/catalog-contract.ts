export type CatalogDomain =
    | "camera"
    | "lens"
    | "camera_related"
    | "lens_related"
    | "monitor_peripheral"
    | "power"
    | "media"
    | "support";

export type DomainContract = {
    critical: string[];
    recommended: string[];
};

export type ContractEvaluation = {
    domain: CatalogDomain;
    missingCritical: string[];
    missingRecommended: string[];
    score: number;
};

type ItemLike = {
    category: string | null;
    subcategory: string | null;
    name: string | null;
    model: string | null;
    description: string | null;
} & Record<string, unknown>;

export const DOMAIN_CONTRACTS: Record<CatalogDomain, DomainContract> = {
    camera: {
        critical: ["mount", "sensor_size", "resolution", "recordingFormats"],
        recommended: ["technicalData", "labMetrics", "dynamic_range", "native_iso", "power_draw_w"],
    },
    lens: {
        critical: ["mount", "coverage", "focal_length", "aperture", "lens_type"],
        recommended: ["image_circle_mm", "close_focus_m", "front_diameter_mm", "technicalData", "squeeze"],
    },
    camera_related: {
        critical: ["subcategory", "description"],
        recommended: ["mount", "technicalData"],
    },
    lens_related: {
        critical: ["subcategory", "description"],
        recommended: ["mount", "technicalData"],
    },
    monitor_peripheral: {
        critical: ["subcategory", "description"],
        recommended: ["resolution", "technicalData", "power_draw_w"],
    },
    power: {
        critical: ["subcategory", "description"],
        recommended: ["power_draw_w", "mount", "technicalData"],
    },
    media: {
        critical: ["subcategory", "description"],
        recommended: ["technicalData"],
    },
    support: {
        critical: ["subcategory", "description"],
        recommended: ["payload_kg", "technicalData"],
    },
};

const CAMERA_RELATED_TOKENS = ["matte", "focus", "wireless", "transmitter", "receiver", "rod", "cage", "plate"];
const LENS_RELATED_TOKENS = ["filter", "diopter", "adapter", "anamorphic", "lens support"];
const MONITOR_TOKENS = ["monitor", "evf", "viewfinder", "lut box"];
const POWER_TOKENS = ["battery", "v-mount", "gold mount", "b-mount", "charger", "power", "d-tap", "cable"];
const MEDIA_TOKENS = ["cfexpress", "cfast", "sd card", "codex", "ssd", "media", "memory card"];
const SUPPORT_TOKENS = ["tripod", "head", "fluid", "bowl", "legs", "stand", "hi-hat", "slider", "dolly", "jib"];

function hasAny(text: string, tokens: string[]): boolean {
    return tokens.some((t) => text.includes(t));
}

export function detectCatalogDomain(item: ItemLike): CatalogDomain {
    const category = (item.category || "").toUpperCase();
    if (category === "CAM") return "camera";
    if (category === "LNS") return "lens";

    const text = `${item.subcategory || ""} ${item.name || ""} ${item.model || ""} ${item.description || ""}`.toLowerCase();

    if (hasAny(text, MONITOR_TOKENS)) return "monitor_peripheral";
    if (hasAny(text, POWER_TOKENS)) return "power";
    if (hasAny(text, MEDIA_TOKENS)) return "media";
    if (hasAny(text, SUPPORT_TOKENS)) return "support";
    if (hasAny(text, LENS_RELATED_TOKENS)) return "lens_related";
    if (hasAny(text, CAMERA_RELATED_TOKENS)) return "camera_related";

    return "camera_related";
}

export function hasFieldValue(item: Record<string, unknown>, field: string): boolean {
    const value = item[field];
    if (value == null) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (typeof value === "number") return Number.isFinite(value);
    if (typeof value === "boolean") return true;
    return true;
}

export function evaluateItemByContract(item: ItemLike): ContractEvaluation {
    const domain = detectCatalogDomain(item);
    const contract = DOMAIN_CONTRACTS[domain];

    const missingCritical = contract.critical.filter((field) => !hasFieldValue(item as Record<string, unknown>, field));
    const missingRecommended = contract.recommended.filter((field) => !hasFieldValue(item as Record<string, unknown>, field));

    let score = 100;
    score -= missingCritical.length * 20;
    score -= missingRecommended.length * 7;
    if (score < 0) score = 0;

    return { domain, missingCritical, missingRecommended, score };
}

