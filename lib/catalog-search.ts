export type CatalogSearchItem = {
    name?: string | null;
    brand?: string | null;
    model?: string | null;
    category?: string | null;
    subcategory?: string | null;
    coverage?: string | null;
    mount?: string | null;
    lens_type?: string | null;
    focal_length?: string | null;
    aperture?: string | null;
    description?: string | null;
    sensor_size?: string | null;
    sensor_type?: string | null;
    resolution?: string | null;
    dynamic_range?: string | null;
    native_iso?: string | null;
    recordingFormats?: string | null;
    specs_json?: string | null;
};

const OPTIONAL_SEARCH_WORDS = new Set([
    "cine",
    "cinema",
    "lens",
    "lense",
    "lenses",
    "prime",
    "primes",
    "set",
    "kit",
    "series",
]);

const TOKEN_ALIASES: Record<string, string> = {
    bodies: "body",
    lenses: "lens",
    primes: "prime",
};

export function normalizeCatalogSearchText(value: string | null | undefined): string {
    if (!value) return "";

    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[×]/g, "x")
        .replace(/[’']/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function tokenizeCatalogSearch(value: string | null | undefined): string[] {
    const normalized = normalizeCatalogSearchText(value);
    const rawTokens = normalized.match(/[a-z0-9]+(?:\.[0-9]+)?/g) || [];
    const tokens = rawTokens
        .map(token => TOKEN_ALIASES[token] || token)
        .map(token => token.endsWith("s") && token.length > 4 ? token.slice(0, -1) : token)
        .filter(token => token.length > 1);

    const meaningfulTokens = tokens.filter(token => !OPTIONAL_SEARCH_WORDS.has(token));
    return meaningfulTokens.length > 0 ? meaningfulTokens : tokens;
}

export function matchesCatalogSearch(item: CatalogSearchItem, query: string): boolean {
    const normalizedQuery = normalizeCatalogSearchText(query);
    if (!normalizedQuery) return true;

    const haystack = buildCatalogSearchHaystack(item);
    if (haystack.includes(normalizedQuery)) return true;

    const compactHaystack = haystack.replace(/\s+/g, "");
    const compactQuery = normalizedQuery.replace(/\s+/g, "");
    if (compactQuery && compactHaystack.includes(compactQuery)) return true;

    const tokens = tokenizeCatalogSearch(query);
    if (tokens.length === 0) return true;

    return tokens.every(token => haystack.includes(token) || compactHaystack.includes(token));
}

export function buildCatalogSearchHaystack(item: CatalogSearchItem): string {
    return normalizeCatalogSearchText([
        item.name,
        item.brand,
        item.model,
        item.category,
        item.subcategory,
        item.coverage,
        item.mount,
        item.lens_type,
        item.focal_length,
        item.aperture,
        item.description,
        item.sensor_size,
        item.sensor_type,
        item.resolution,
        item.dynamic_range,
        item.native_iso,
        item.recordingFormats,
        item.specs_json,
    ].filter(Boolean).join(" "));
}
