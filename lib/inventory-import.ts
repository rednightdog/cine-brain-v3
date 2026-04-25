export type CsvImportIssue = {
    row: number;
    level: "error" | "warning";
    field: string;
    message: string;
};

export type ParsedCsvTable = {
    headers: string[];
    rows: Record<string, string>[];
    issues: CsvImportIssue[];
};

export type UpsertEquipmentData = {
    name: string;
    brand: string;
    model: string;
    category: string;
    description: string;
    daily_rate_est: number;
    subcategory?: string;
    mount?: string;
    weight_kg?: number;
    resolution?: string;
    dynamic_range?: string;
    native_iso?: string;
    focal_length?: string;
    aperture?: string;
    power_draw_w?: number;
    sensor_size?: string;
    sensor_type?: string;
    image_circle_mm?: number;
    lens_type?: string;
    close_focus_m?: number;
    front_diameter_mm?: number;
    length_mm?: number;
    squeeze?: string;
    coverage?: string;
    sensor_coverage?: string;
    recordingFormats?: string;
    technicalData?: string;
    labMetrics?: string;
    imageUrl?: string;
    payload_kg?: number;
    status?: "PENDING" | "APPROVED";
    isAiResearched?: boolean;
    sourceUrl?: string;
    isVerified?: boolean;
    isPrivate?: boolean;
    parentId?: string;
};

export type PreparedImportItem = {
    rowNumber: number;
    key: {
        brand: string;
        model: string;
        name: string;
    };
    category: string;
    data: UpsertEquipmentData;
};

const DESTINATION_FIELDS: Record<string, string> = {
    name: "name",
    brand: "brand",
    model: "model",
    category: "category",
    subcategory: "subcategory",
    description: "description",
    daily_rate_est: "daily_rate_est",
    mount: "mount",
    weight_kg: "weight_kg",
    resolution: "resolution",
    dynamic_range: "dynamic_range",
    native_iso: "native_iso",
    focal_length: "focal_length",
    aperture: "aperture",
    power_draw_w: "power_draw_w",
    sensor_size: "sensor_size",
    sensor_type: "sensor_type",
    image_circle_mm: "image_circle_mm",
    lens_type: "lens_type",
    close_focus_m: "close_focus_m",
    front_diameter_mm: "front_diameter_mm",
    length_mm: "length_mm",
    squeeze: "squeeze",
    coverage: "coverage",
    sensor_coverage: "sensor_coverage",
    recording_formats: "recordingFormats",
    recording_formats_json: "recordingFormats",
    recordingformats: "recordingFormats",
    recording_formatsjson: "recordingFormats",
    recording_formatsraw: "recordingFormats",
    recordingformatsjson: "recordingFormats",
    technical_data: "technicalData",
    technical_data_json: "technicalData",
    technicaldata: "technicalData",
    technicaldatajson: "technicalData",
    lab_metrics: "labMetrics",
    lab_metrics_json: "labMetrics",
    labmetrics: "labMetrics",
    labmetricsjson: "labMetrics",
    image_url: "imageUrl",
    imageurl: "imageUrl",
    payload_kg: "payload_kg",
    status: "status",
    is_ai_researched: "isAiResearched",
    ai_researched: "isAiResearched",
    isverified: "isVerified",
    is_verified: "isVerified",
    isprivate: "isPrivate",
    is_private: "isPrivate",
    source_url: "sourceUrl",
    sourceurl: "sourceUrl",
    parent_id: "parentId",
    parentid: "parentId",
};

const HEADER_ALIASES: Record<string, string> = {
    equipment_name: "name",
    item_name: "name",
    product_name: "name",
    title: "name",
    brand_name: "brand",
    model_name: "model",
    cat: "category",
    sub_category: "subcategory",
    subcat: "subcategory",
    daily_rate: "daily_rate_est",
    day_rate: "daily_rate_est",
    gunluk_ucret: "daily_rate_est",
    gunluk_ucret_tl: "daily_rate_est",
    recording_formats_text: "recordingFormats",
    recording_formats_notes: "recordingFormats",
    technical_notes: "technicalData",
    lab_notes: "labMetrics",
};

const BOOLEAN_TRUE = new Set(["1", "true", "yes", "y", "evet"]);
const BOOLEAN_FALSE = new Set(["0", "false", "no", "n", "hayir", "hayır"]);

const INTEGER_FIELDS = ["power_draw_w", "image_circle_mm", "front_diameter_mm", "length_mm"] as const;
const FLOAT_FIELDS = ["weight_kg", "close_focus_m", "payload_kg"] as const;
const STRING_FIELDS = [
    "subcategory",
    "description",
    "mount",
    "resolution",
    "dynamic_range",
    "native_iso",
    "focal_length",
    "aperture",
    "sensor_size",
    "sensor_type",
    "lens_type",
    "squeeze",
    "coverage",
    "sensor_coverage",
    "imageUrl",
    "sourceUrl",
    "parentId",
] as const;

function canonicalizeHeader(header: string): string {
    return header
        .replace(/^\uFEFF/, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function normalizeCell(value: string | undefined): string {
    return (value || "").trim();
}

function detectCsvDelimiter(csvText: string): "," | ";" | "\t" {
    const firstLine = csvText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find((line) => line.length > 0);

    if (!firstLine) return ",";

    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;

    if (tabCount > commaCount && tabCount > semicolonCount) return "\t";
    if (semicolonCount > commaCount) return ";";
    return ",";
}

function parseCsvMatrix(csvText: string, delimiter: "," | ";" | "\t"): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i += 1) {
        const char = csvText[i];

        if (char === "\"") {
            if (inQuotes && csvText[i + 1] === "\"") {
                current += "\"";
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === delimiter && !inQuotes) {
            row.push(current);
            current = "";
            continue;
        }

        if ((char === "\n" || char === "\r") && !inQuotes) {
            if (char === "\r" && csvText[i + 1] === "\n") {
                i += 1;
            }
            row.push(current);
            rows.push(row);
            row = [];
            current = "";
            continue;
        }

        current += char;
    }

    if (current.length > 0 || row.length > 0) {
        row.push(current);
        rows.push(row);
    }

    return rows;
}

export function parseCsvTable(csvText: string): ParsedCsvTable {
    const delimiter = detectCsvDelimiter(csvText);
    const matrix = parseCsvMatrix(csvText, delimiter);
    const issues: CsvImportIssue[] = [];

    if (matrix.length === 0) {
        issues.push({
            row: 1,
            level: "error",
            field: "file",
            message: "CSV dosyasi bos.",
        });
        return { headers: [], rows: [], issues };
    }

    const rawHeaders = matrix[0].map((h) => normalizeCell(h));
    const headerCounts = new Map<string, number>();

    const headers = rawHeaders.map((header, index) => {
        const canonical = canonicalizeHeader(header);
        if (!canonical) {
            issues.push({
                row: 1,
                level: "warning",
                field: `header_${index + 1}`,
                message: "Bos kolon basligi atlandi.",
            });
            return `__empty_${index + 1}`;
        }

        const mapped = HEADER_ALIASES[canonical] || DESTINATION_FIELDS[canonical] || canonical;
        headerCounts.set(mapped, (headerCounts.get(mapped) || 0) + 1);
        return mapped;
    });

    for (const [header, count] of headerCounts.entries()) {
        if (count > 1) {
            issues.push({
                row: 1,
                level: "warning",
                field: header,
                message: `Ayni kolon ${count} kez bulundu. Son deger kullanilacak.`,
            });
        }
    }

    const rows: Record<string, string>[] = [];
    for (let rowIndex = 1; rowIndex < matrix.length; rowIndex += 1) {
        const sourceRow = matrix[rowIndex];
        if (sourceRow.every((cell) => normalizeCell(cell).length === 0)) continue;

        const row: Record<string, string> = {};
        for (let colIndex = 0; colIndex < headers.length; colIndex += 1) {
            const header = headers[colIndex];
            if (header.startsWith("__empty_")) continue;
            row[header] = normalizeCell(sourceRow[colIndex]);
        }
        rows.push(row);
    }

    return { headers, rows, issues };
}

function normalizeCategory(raw: string | null): { category: string; recognized: boolean } {
    if (!raw) return { category: "SUP", recognized: true };

    const value = raw.toLowerCase().trim();
    const compact = value.replace(/\s+/g, "");

    if (compact === "cam" || value.includes("camera")) return { category: "CAM", recognized: true };
    if (compact === "lns" || value.includes("lens")) return { category: "LNS", recognized: true };
    if (compact === "lit" || value.includes("light")) return { category: "LIT", recognized: true };

    if (
        compact === "sup" ||
        value.includes("support") ||
        value.includes("accessor") ||
        value.includes("monitor") ||
        value.includes("tripod") ||
        value.includes("head") ||
        value.includes("battery") ||
        value.includes("power") ||
        value.includes("media") ||
        value.includes("card")
    ) {
        return { category: "SUP", recognized: true };
    }

    return { category: "SUP", recognized: false };
}

function parseLocaleNumber(raw: string, integer: boolean): number | null {
    let value = raw
        .trim()
        .replace(/\s+/g, "")
        .replace(/[^\d,.\-]/g, "");

    if (!value || value === "-" || value === "." || value === ",") return null;

    const lastComma = value.lastIndexOf(",");
    const lastDot = value.lastIndexOf(".");

    if (lastComma !== -1 && lastDot !== -1) {
        const decimalIndex = Math.max(lastComma, lastDot);
        const integerPart = value.slice(0, decimalIndex).replace(/[.,]/g, "");
        const decimalPart = value.slice(decimalIndex + 1).replace(/[^\d]/g, "");
        value = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    } else if (lastComma !== -1) {
        const parts = value.split(",");
        const decimalPart = parts[parts.length - 1];
        const likelyThousands = decimalPart.length === 3 && (parts.length > 2 || integer);
        value = likelyThousands ? parts.join("") : `${parts.slice(0, -1).join("")}.${decimalPart}`;
    } else if (lastDot !== -1) {
        const parts = value.split(".");
        const decimalPart = parts[parts.length - 1];
        const likelyThousands = decimalPart.length === 3 && (parts.length > 2 || integer);
        value = likelyThousands ? parts.join("") : `${parts.slice(0, -1).join("")}.${decimalPart}`;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return null;
    return integer ? Math.round(parsed) : parsed;
}

function parseOptionalInteger(raw: string | null): number | null {
    if (!raw) return null;
    return parseLocaleNumber(raw, true);
}

function parseOptionalFloat(raw: string | null): number | null {
    if (!raw) return null;
    return parseLocaleNumber(raw, false);
}

function parseOptionalBoolean(raw: string | null): boolean | null {
    if (!raw) return null;
    const normalized = raw.trim().toLowerCase();
    if (BOOLEAN_TRUE.has(normalized)) return true;
    if (BOOLEAN_FALSE.has(normalized)) return false;
    return null;
}

function parseStatus(raw: string | null): "PENDING" | "APPROVED" | null {
    if (!raw) return null;
    const normalized = raw.trim().toUpperCase();
    if (normalized === "PENDING" || normalized === "APPROVED") return normalized;
    return null;
}

function defaultDailyRate(category: string): number {
    if (category === "CAM") return 500;
    if (category === "LNS") return 150;
    if (category === "LIT") return 120;
    return 75;
}

function toRawList(value: string): string[] {
    return value
        .split("|")
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
}

function coerceJsonField(field: "recordingFormats" | "technicalData" | "labMetrics", raw: string | null): {
    value: string | null;
    warning: string | null;
} {
    if (!raw) return { value: null, warning: null };

    const trimmed = raw.trim();
    if (!trimmed) return { value: null, warning: null };

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            return { value: JSON.stringify(JSON.parse(trimmed)), warning: null };
        } catch {
            return {
                value: null,
                warning: `${field} JSON parse edilemedi, alan bos birakildi.`,
            };
        }
    }

    if (field === "recordingFormats") {
        const formats = toRawList(trimmed).map((format) => ({ format }));
        if (formats.length === 0) return { value: null, warning: null };
        return {
            value: JSON.stringify(formats),
            warning: "recordingFormats duz metinden otomatik JSON formata cevrildi.",
        };
    }

    if (field === "technicalData") {
        return {
            value: JSON.stringify([
                {
                    title: "Imported Notes",
                    items: [{ label: "Notes", value: trimmed }],
                },
            ]),
            warning: "technicalData duz metinden JSON alana cevrildi.",
        };
    }

    return {
        value: JSON.stringify({ notes: trimmed }),
        warning: "labMetrics duz metinden JSON alana cevrildi.",
    };
}

export function parseImportRow(row: Record<string, string>, rowNumber: number): {
    item: PreparedImportItem | null;
    issues: CsvImportIssue[];
} {
    const issues: CsvImportIssue[] = [];
    const read = (field: string) => normalizeCell(row[field]) || null;

    const brand = read("brand");
    const model = read("model");
    const name = read("name");
    if (!brand) {
        issues.push({ row: rowNumber, level: "error", field: "brand", message: "brand bos olamaz." });
    }
    if (!model) {
        issues.push({ row: rowNumber, level: "error", field: "model", message: "model bos olamaz." });
    }
    if (!name) {
        issues.push({ row: rowNumber, level: "error", field: "name", message: "name bos olamaz." });
    }

    const categoryRaw = read("category");
    const categoryInfo = normalizeCategory(categoryRaw);
    if (categoryRaw && !categoryInfo.recognized) {
        issues.push({
            row: rowNumber,
            level: "warning",
            field: "category",
            message: `Kategori '${categoryRaw}' taninamadi, SUP olarak kullanildi.`,
        });
    }

    const dailyRateRaw = read("daily_rate_est");
    let dailyRate = parseOptionalInteger(dailyRateRaw);
    if (dailyRateRaw && dailyRate == null) {
        issues.push({
            row: rowNumber,
            level: "warning",
            field: "daily_rate_est",
            message: `daily_rate_est sayi degil ('${dailyRateRaw}'), varsayilan deger kullanildi.`,
        });
    }
    if (dailyRate == null) {
        dailyRate = defaultDailyRate(categoryInfo.category);
    }

    const description = read("description") || `${brand || ""} ${model || ""}`.trim() || "Imported item";

    if (!brand || !model || !name) {
        return { item: null, issues };
    }

    const data: UpsertEquipmentData = {
        name,
        brand,
        model,
        category: categoryInfo.category,
        description,
        daily_rate_est: dailyRate,
    };

    for (const field of STRING_FIELDS) {
        const value = read(field);
        if (value) {
            (data as Record<string, unknown>)[field] = value;
        }
    }

    for (const field of INTEGER_FIELDS) {
        const rawValue = read(field);
        if (!rawValue) continue;
        const parsed = parseOptionalInteger(rawValue);
        if (parsed == null) {
            issues.push({
                row: rowNumber,
                level: "warning",
                field,
                message: `${field} sayi degil ('${rawValue}'), alan atlandi.`,
            });
            continue;
        }
        (data as Record<string, unknown>)[field] = parsed;
    }

    for (const field of FLOAT_FIELDS) {
        const rawValue = read(field);
        if (!rawValue) continue;
        const parsed = parseOptionalFloat(rawValue);
        if (parsed == null) {
            issues.push({
                row: rowNumber,
                level: "warning",
                field,
                message: `${field} sayi degil ('${rawValue}'), alan atlandi.`,
            });
            continue;
        }
        (data as Record<string, unknown>)[field] = parsed;
    }

    const recording = coerceJsonField("recordingFormats", read("recordingFormats"));
    if (recording.value) data.recordingFormats = recording.value;
    if (recording.warning) {
        issues.push({ row: rowNumber, level: "warning", field: "recordingFormats", message: recording.warning });
    }

    const technical = coerceJsonField("technicalData", read("technicalData"));
    if (technical.value) data.technicalData = technical.value;
    if (technical.warning) {
        issues.push({ row: rowNumber, level: "warning", field: "technicalData", message: technical.warning });
    }

    const lab = coerceJsonField("labMetrics", read("labMetrics"));
    if (lab.value) data.labMetrics = lab.value;
    if (lab.warning) {
        issues.push({ row: rowNumber, level: "warning", field: "labMetrics", message: lab.warning });
    }

    const statusRaw = read("status");
    if (statusRaw) {
        const status = parseStatus(statusRaw);
        if (!status) {
            issues.push({
                row: rowNumber,
                level: "warning",
                field: "status",
                message: `status gecersiz ('${statusRaw}'), APPROVED varsayildi.`,
            });
        } else {
            data.status = status;
        }
    }

    const aiRaw = read("isAiResearched");
    if (aiRaw) {
        const value = parseOptionalBoolean(aiRaw);
        if (value == null) {
            issues.push({
                row: rowNumber,
                level: "warning",
                field: "isAiResearched",
                message: `isAiResearched gecersiz ('${aiRaw}'), alan atlandi.`,
            });
        } else {
            data.isAiResearched = value;
        }
    }

    const verifiedRaw = read("isVerified");
    if (verifiedRaw) {
        const value = parseOptionalBoolean(verifiedRaw);
        if (value == null) {
            issues.push({
                row: rowNumber,
                level: "warning",
                field: "isVerified",
                message: `isVerified gecersiz ('${verifiedRaw}'), alan atlandi.`,
            });
        } else {
            data.isVerified = value;
        }
    }

    const privateRaw = read("isPrivate");
    if (privateRaw) {
        const value = parseOptionalBoolean(privateRaw);
        if (value == null) {
            issues.push({
                row: rowNumber,
                level: "warning",
                field: "isPrivate",
                message: `isPrivate gecersiz ('${privateRaw}'), alan atlandi.`,
            });
        } else {
            data.isPrivate = value;
        }
    }

    return {
        item: {
            rowNumber,
            key: { brand, model, name },
            category: categoryInfo.category,
            data,
        },
        issues,
    };
}
