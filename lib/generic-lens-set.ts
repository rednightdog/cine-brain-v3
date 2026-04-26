export type GenericLensSetSuggestion = {
    brand?: string;
    seriesName: string;
    aperture?: string;
    focalLengths: string[];
    mountOptions?: string[];
    source: "known" | "query" | "common";
    note?: string;
};

export type GenericLensVariantSpecs = {
    coverage: string;
    mount: string;
    lens_type: string;
    focal_length: string;
    aperture: string;
    weight_kg?: number;
    front_diameter_mm?: number;
    image_circle_mm?: number;
    specs_json?: string;
};

const COMMON_PRIME_FOCALS = ["14", "16", "18", "21", "24", "25", "28", "32", "35", "40", "50", "65", "75", "85", "100", "135"];
const SIMERA_C_MOUNTS = ["E-Mount", "M-Mount"];
const SIMERA_C_SPECS: Record<string, {
    frontDiameterMm: number;
    filterSize: string;
    weightE: number;
    weightM: number;
}> = {
    "21": { frontDiameterMm: 67, filterSize: "M62 x 0.75", weightE: 0.491, weightM: 0.472 },
    "28": { frontDiameterMm: 67, filterSize: "M62 x 0.75", weightE: 0.395, weightM: 0.377 },
    "35": { frontDiameterMm: 67, filterSize: "M62 x 0.75", weightE: 0.402, weightM: 0.381 },
    "50": { frontDiameterMm: 67, filterSize: "M62 x 0.75", weightE: 0.369, weightM: 0.353 },
    "75": { frontDiameterMm: 72, filterSize: "M67 x 0.75", weightE: 0.453, weightM: 0.435 },
};

const KNOWN_LENS_SETS: Array<{
    patterns: string[];
    brand: string;
    seriesName: string;
    aperture: string;
    focalLengths: string[];
    note: string;
}> = [
    {
        patterns: ["simera c", "simera-c", "simera"],
        brand: "Thypoch",
        seriesName: "Simera-C",
        aperture: "T1.5",
        focalLengths: ["21", "28", "35", "50", "75"],
        note: "Known Thypoch Simera-C 5-lens set",
    },
];

export function getGenericLensSetSuggestion(query: string): GenericLensSetSuggestion {
    const normalized = normalizeLensSetText(query);
    const explicitFocals = extractFocalLengths(query);
    const known = KNOWN_LENS_SETS.find(set => set.patterns.some(pattern => normalized.includes(pattern)));

    if (known) {
        return {
            brand: known.brand,
            seriesName: known.seriesName,
            aperture: extractAperture(query) || known.aperture,
            focalLengths: explicitFocals.length > 0 ? explicitFocals : known.focalLengths,
            mountOptions: known.seriesName === "Simera-C" ? SIMERA_C_MOUNTS : undefined,
            source: "known",
            note: known.note,
        };
    }

    const aperture = extractAperture(query);
    const seriesName = inferSeriesName(query, aperture);
    if (explicitFocals.length > 0) {
        return {
            seriesName,
            aperture,
            focalLengths: explicitFocals,
            source: "query",
        };
    }

    if (looksLikePrimeSet(query)) {
        return {
            seriesName,
            aperture,
            focalLengths: COMMON_PRIME_FOCALS,
            source: "common",
            note: "Common prime focal lengths",
        };
    }

    return {
        seriesName,
        aperture,
        focalLengths: [],
        source: "query",
    };
}

export function buildGenericLensVariantModel(
    suggestion: GenericLensSetSuggestion,
    focalLength: string
): string {
    return [
        suggestion.seriesName,
        `${focalLength}mm`,
        suggestion.aperture,
    ].filter(Boolean).join(" ");
}

export function getGenericLensVariantSpecs(
    suggestion: GenericLensSetSuggestion,
    focalLength: string,
    mount: string | undefined
): GenericLensVariantSpecs {
    const selectedMount = normalizeLensMount(mount || suggestion.mountOptions?.[0] || "");
    if (suggestion.seriesName.toLowerCase() === "simera-c") {
        return buildSimeraCSpecs(focalLength, selectedMount || "E-Mount");
    }

    return {
        coverage: "FF",
        mount: selectedMount || "",
        lens_type: "Spherical",
        focal_length: `${focalLength}mm`,
        aperture: suggestion.aperture || "",
    };
}

export function inferKnownLensVariantSpecs(text: string, mount?: string): Partial<GenericLensVariantSpecs> {
    const normalized = normalizeLensSetText(text);
    if (!normalized.includes("simera c") && !normalized.includes("simera")) return {};

    const focal = normalized.match(/\b(21|28|35|50|75)\s*mm\b/)?.[1];
    if (!focal) return {};

    return buildSimeraCSpecs(focal, normalizeLensMount(mount || "") || inferMountFromText(text) || "E-Mount");
}

export function normalizeLensSetText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function extractFocalLengths(query: string): string[] {
    const seen = new Set<string>();
    const matches = query.matchAll(/(\d+(?:[.,]\d+)?)\s*mm\b/gi);
    for (const match of matches) {
        const value = Number(match[1].replace(",", "."));
        if (Number.isFinite(value) && value > 0) {
            seen.add(Number.isInteger(value) ? String(value) : String(value));
        }
    }
    return Array.from(seen);
}

function extractAperture(query: string): string | undefined {
    const match = query.match(/\b([TtFf])\s*([0-9]+(?:[.,][0-9]+)?)\b/);
    if (!match) return undefined;
    return `${match[1].toUpperCase()}${match[2].replace(",", ".")}`;
}

function inferSeriesName(query: string, aperture?: string): string {
    let name = query
        .replace(/\b\d+(?:[.,]\d+)?\s*mm\b/gi, " ")
        .replace(/\b[TFtf]\s*[0-9]+(?:[.,][0-9]+)?\b/g, " ")
        .replace(/\b(cine|cinema|lens|lenses|prime|primes|set|kit|full frame|ff|s35|lf)\b/gi, " ")
        .replace(/[|/]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (aperture) {
        name = name.replace(aperture, "").replace(/\s+/g, " ").trim();
    }

    return name || "Generic Prime";
}

function looksLikePrimeSet(query: string): boolean {
    const normalized = normalizeLensSetText(query);
    return normalized.includes("prime") || normalized.includes("primes") || normalized.includes("lens set") || normalized.includes("cine");
}

function buildSimeraCSpecs(focalLength: string, mount: string): GenericLensVariantSpecs {
    const focal = focalLength.replace(/mm$/i, "");
    const spec = SIMERA_C_SPECS[focal];
    const normalizedMount = normalizeLensMount(mount) || "E-Mount";
    const weight = normalizedMount === "M-Mount" ? spec?.weightM : spec?.weightE;

    return {
        coverage: "FF",
        mount: normalizedMount,
        lens_type: "Spherical",
        focal_length: `${focal}mm`,
        aperture: "T1.5",
        weight_kg: weight,
        front_diameter_mm: spec?.frontDiameterMm,
        image_circle_mm: 43.2,
        specs_json: JSON.stringify({
            source: "Thypoch Simera-C published specs",
            source_url: "https://thypoch.com/en/simera-c",
            t_stop_range: "T1.5-T16",
            image_circle_mm: 43.2,
            coverage: "Full Frame",
            mount: normalizedMount,
            filter_size: spec?.filterSize,
            front_diameter_mm: spec?.frontDiameterMm,
            weight_kg: weight,
        }),
    };
}

function normalizeLensMount(mount: string): string {
    const normalized = mount.toLowerCase().replace(/\s+/g, "");
    if (!normalized) return "";
    if (normalized === "e" || normalized.includes("emount") || normalized === "sony-e") return "E-Mount";
    if (normalized === "m" || normalized.includes("mmount") || normalized.includes("leicam")) return "M-Mount";
    if (normalized === "l" || normalized.includes("lmount")) return "L-Mount";
    return mount;
}

function inferMountFromText(text: string): string {
    const normalized = normalizeLensSetText(text);
    if (normalized.includes("m mount") || normalized.includes("leica m")) return "M-Mount";
    if (normalized.includes("e mount") || normalized.includes("sony e")) return "E-Mount";
    return "";
}
