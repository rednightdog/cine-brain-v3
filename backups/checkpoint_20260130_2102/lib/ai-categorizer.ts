export type AutoCategoryResult = {
    category: string;
    subcategory: string | null;
    confidence: number;
};

export const KEYWORD_RULES = [
    { keyword: "Rialto", category: "CAMERA", subcategory: "Extension", confidence: 1.0 },
    { keyword: "FIZ", category: "SUPPORT", subcategory: "Focus", confidence: 0.8 },
    { keyword: "Focus", category: "SUPPORT", subcategory: "Focus", confidence: 0.8 },
    { keyword: "Preston", category: "SUPPORT", subcategory: "Focus", confidence: 0.9 },
    { keyword: "WCU", category: "SUPPORT", subcategory: "Focus", confidence: 0.9 },
    { keyword: "Rain", category: "SUPPORT", subcategory: "Weather", confidence: 0.8 },
    { keyword: "Cover", category: "SUPPORT", subcategory: "Weather", confidence: 0.7 },
    { keyword: "Umbrella", category: "SUPPORT", subcategory: "Weather", confidence: 0.9 },
    { keyword: "Filter", category: "SUPPORT", subcategory: "Optics", confidence: 0.9 },
    { keyword: "Matte", category: "SUPPORT", subcategory: "Mechanical", confidence: 0.8 },
    { keyword: "OConnor", category: "SUPPORT", subcategory: "Mechanical", confidence: 0.9 },
    { keyword: "Tripod", category: "SUPPORT", subcategory: "Mechanical", confidence: 0.8 },
    { keyword: "Sachtler", category: "SUPPORT", subcategory: "Mechanical", confidence: 0.9 },
    { keyword: "Head", category: "SUPPORT", subcategory: "Mechanical", confidence: 0.7 },
    { keyword: "Monitor", category: "SUPPORT", subcategory: "Monitoring", confidence: 0.9 },
    { keyword: "SmallHD", category: "SUPPORT", subcategory: "Monitoring", confidence: 0.9 },
    { keyword: "Teradek", category: "SUPPORT", subcategory: "Monitoring", confidence: 0.9 },
    { keyword: "Battery", category: "SUPPORT", subcategory: "Power", confidence: 0.9 },
    { keyword: "Lens", category: "LENS", subcategory: null, confidence: 0.7 },
    { keyword: "Prime", category: "LENS", subcategory: "Primes", confidence: 0.8 },
    { keyword: "Zoom", category: "LENS", subcategory: "Zooms", confidence: 0.8 },
    { keyword: "Anamorphic", category: "LENS", subcategory: "Anamorphic", confidence: 0.9 },
];

export function autoCategorize(text: string): AutoCategoryResult | null {
    const normalized = text.toLowerCase();

    for (const rule of KEYWORD_RULES) {
        if (normalized.includes(rule.keyword.toLowerCase())) {
            return {
                category: rule.category,
                subcategory: rule.subcategory,
                confidence: rule.confidence
            };
        }
    }

    // Default fallback if strictly needed, or return null to ask user
    return null;
}
