type LensSeriesItem = {
    name?: string | null;
    brand?: string | null;
    model?: string | null;
    aperture?: string | null;
};

export function getLensSeriesName(item: LensSeriesItem): string {
    const brand = item.brand?.trim() || "";
    const source = (item.model || item.name || "").trim();
    const withoutBrand = brand ? source.replace(new RegExp(`^${escapeRegExp(brand)}\\s+`, "i"), "") : source;

    const cleaned = withoutBrand
        .replace(/\b\d+(?:[.,]\d+)?\s*mm\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

    return cleaned || withoutBrand || source || "Lens Set";
}

export function formatLensGroupTitle(brand: string, series: string, aperture?: string | null): string {
    const cleanBrand = brand.trim();
    const cleanSeries = series.trim();
    const cleanAperture = aperture?.trim();
    const base = [cleanBrand, cleanSeries].filter(Boolean).join(" ");

    if (!cleanAperture || textHasAperture(base, cleanAperture)) return base;
    return [base, cleanAperture].filter(Boolean).join(" ");
}

export function inferLensAperture(item: LensSeriesItem): string {
    return item.aperture || item.name?.match(/[TF]\d+(\.\d+)?/i)?.[0] || "";
}

function textHasAperture(text: string, aperture: string): boolean {
    return normalizeApertureText(text).includes(normalizeApertureText(aperture));
}

function normalizeApertureText(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "");
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
