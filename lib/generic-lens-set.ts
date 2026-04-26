export type GenericLensSetSuggestion = {
    brand?: string;
    seriesName: string;
    aperture?: string;
    focalLengths: string[];
    source: "known" | "query" | "common";
    note?: string;
};

const COMMON_PRIME_FOCALS = ["14", "16", "18", "21", "24", "25", "28", "32", "35", "40", "50", "65", "75", "85", "100", "135"];

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
