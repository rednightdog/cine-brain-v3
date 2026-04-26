import type { InventoryEntry, InventoryItem } from "@/components/CineBrainInterface";

export type CameraSensorCoverage = "S16" | "S35" | "FF" | "LF";

export type CameraRecordingConfig = {
    profileId?: string;
    profileLabel?: string;
    source?: "verified" | "custom";
    sensorMode?: string;
    gateMode?: string;
    resolutionK?: string;
    aspectRatio?: string;
    codec?: string;
    dataRateMbps?: number | string;
    recordingFormat?: string;
    maxFps?: string;
};

export type CameraRecordingProfile = {
    sensorCoverage: CameraSensorCoverage | "";
    gateMode?: string;
    resolutionK?: string;
    aspectRatio?: string;
    codec?: string;
    requiredImageCircleMm?: number;
    summary: string;
};

export type CameraRecordingOption = {
    id: string;
    label: string;
    sensorMode?: string;
    gateMode?: string;
    resolutionK?: string;
    aspectRatio?: string;
    codec?: string;
    dataRateMbps?: number;
    dataRateLabel?: string;
    maxFps?: string;
    sourceText: string;
};

export function parseCameraConfig(configJson: string | null | undefined): CameraRecordingConfig {
    if (!configJson) return {};
    try {
        const parsed: unknown = JSON.parse(configJson);
        return typeof parsed === "object" && parsed !== null ? parsed as CameraRecordingConfig : {};
    } catch {
        return {};
    }
}

export function stringifyCameraConfig(config: CameraRecordingConfig): string {
    const clean = Object.fromEntries(
        Object.entries(config).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
    return JSON.stringify(clean);
}

export function parseCameraRecordingOptions(recordingFormats: string | null | undefined): CameraRecordingOption[] {
    const rows = parseRecordingFormatRows(recordingFormats);
    const seen = new Set<string>();

    return rows.flatMap((row, index) => {
        const option = buildRecordingOption(row, index);
        if (!option) return [];

        const key = option.label.toLowerCase();
        if (seen.has(key)) return [];
        seen.add(key);
        return [option];
    });
}

export function parseCameraDataRateMbps(text: string | null | undefined): number | null {
    if (!text) return null;
    const match = text.match(/(\d+(?:[.,]\d+)?)\s*(Gbps|Mbps|GB\/s|MB\/s)/i);
    if (!match) return null;
    const value = parseFloat(match[1].replace(",", "."));
    const unit = match[2].toLowerCase();
    if (unit === "gbps") return value * 1000;
    if (unit === "mbps") return value;
    if (unit === "gb/s") return value * 8000;
    if (unit === "mb/s") return value * 8;
    return null;
}

export function normalizeSensorCoverage(raw: string | null | undefined): CameraSensorCoverage | "" {
    if (!raw) return "";
    const lower = raw.toLowerCase();
    if (lower.includes("s16") || lower.includes("super 16")) return "S16";
    if (lower.includes("s35") || lower.includes("super 35")) return "S35";
    if (lower.includes("lf") || lower.includes("large format") || lower.includes("vista vision")) return "LF";
    if (lower.includes("full") || lower.includes("ff")) return "FF";
    if (["S16", "S35", "FF", "LF"].includes(raw.toUpperCase())) return raw.toUpperCase() as CameraSensorCoverage;
    return "";
}

export function getCameraRecordingProfile(
    camera: InventoryItem,
    entry?: Pick<InventoryEntry, "configJson">
): CameraRecordingProfile {
    const config = parseCameraConfig(entry?.configJson);
    const sensorCoverage =
        normalizeSensorCoverage(config.sensorMode) ||
        inferSensorFromText(config.recordingFormat || config.resolutionK || "") ||
        normalizeSensorCoverage(camera.sensor_size || camera.sensor_type || camera.subcategory);

    const summaryParts = config.profileLabel
        ? [config.profileLabel, sensorCoverage ? `${sensorCoverage} mode` : undefined]
        : [
            config.resolutionK,
            config.gateMode,
            config.aspectRatio ? `${config.aspectRatio} frame` : undefined,
            config.codec,
            sensorCoverage ? `${sensorCoverage} mode` : undefined,
        ];
    const summary = summaryParts.filter(Boolean).join(" / ");

    return {
        sensorCoverage,
        gateMode: config.gateMode,
        resolutionK: config.resolutionK,
        aspectRatio: config.aspectRatio,
        codec: config.codec,
        requiredImageCircleMm: getRequiredImageCircleMm(sensorCoverage, config.gateMode, config.aspectRatio),
        summary,
    };
}

export function getRequiredImageCircleMm(
    sensorCoverage: CameraSensorCoverage | "",
    gateMode?: string,
    frameAspectRatio?: string
): number | undefined {
    const gate = gateMode?.toLowerCase() || "";
    if (gate.includes("open gate") || gate.includes("full sensor")) {
        return getApproxSensorDiagonalMm(sensorCoverage);
    }

    return getApproxSensorDiagonalMm(sensorCoverage, gateMode || frameAspectRatio);
}

export function getApproxSensorDiagonalMm(
    sensorCoverage: CameraSensorCoverage | "",
    aspectRatio?: string
): number | undefined {
    const base = getBaseSensorDimensions(sensorCoverage);
    if (!base) return undefined;

    const ratio = parseAspectRatio(aspectRatio);
    if (!ratio) return diagonal(base.width, base.height);

    const heightFromFullWidth = base.width / ratio;
    if (heightFromFullWidth <= base.height) {
        return diagonal(base.width, heightFromFullWidth);
    }

    const widthFromFullHeight = base.height * ratio;
    return diagonal(Math.min(base.width, widthFromFullHeight), base.height);
}

function inferSensorFromText(text: string): CameraSensorCoverage | "" {
    const lower = text.toLowerCase();
    if (lower.includes("s16") || lower.includes("super 16")) return "S16";
    if (lower.includes("s35") || lower.includes("super 35")) return "S35";
    if (lower.includes("lf") || lower.includes("large format") || lower.includes("vv")) return "LF";
    if (lower.includes("ff") || lower.includes("full frame")) return "FF";
    return "";
}

type RecordingFormatRow = {
    text: string;
    fields?: Record<string, unknown>;
};

function parseRecordingFormatRows(recordingFormats: string | null | undefined): RecordingFormatRow[] {
    if (!recordingFormats) return [];

    try {
        const parsed: unknown = JSON.parse(recordingFormats);
        if (Array.isArray(parsed)) {
            return parsed.flatMap(row => {
                if (typeof row === "string") return [{ text: row }];
                if (typeof row === "object" && row !== null) {
                    const fields = row as Record<string, unknown>;
                    const text = Object.values(fields)
                        .filter(value => typeof value === "string" || typeof value === "number")
                        .join(" ");
                    return text.trim() ? [{ text, fields }] : [];
                }
                return [{ text: String(row) }];
            });
        }
    } catch { }

    return recordingFormats
        .split(/[|;\n]/)
        .map(text => text.trim())
        .filter(Boolean)
        .map(text => ({ text }));
}

function buildRecordingOption(row: RecordingFormatRow, index: number): CameraRecordingOption | null {
    const explicitFormat = readString(row.fields, ["format", "recording_format", "recordingFormat", "mode"]);
    const resolutionText = readString(row.fields, ["resolution", "resolutionK", "resolution_k"]);
    const codecText = readString(row.fields, ["codec", "compression", "recording_codec"]);
    const dataRateText = readString(row.fields, ["data_rate", "dataRate", "bitrate", "bit_rate"]);
    const maxFps = readString(row.fields, ["max_fps", "maxFps", "fps", "frame_rate", "frameRate"]);
    const sensorText = readString(row.fields, ["sensor", "sensor_mode", "sensorMode", "sensor_size", "sensorSize"]);
    const gateText = readString(row.fields, ["gate", "gate_mode", "gateMode", "capture_area", "captureArea"]);
    const aspectText = readString(row.fields, ["aspect", "aspect_ratio", "aspectRatio", "frame", "frame_aspect"]);
    const sourceText = (explicitFormat || row.text).trim();
    const searchableText = [
        sourceText,
        row.text,
        resolutionText,
        codecText,
        sensorText,
        gateText,
        aspectText,
    ].filter(Boolean).join(" ");

    const option: CameraRecordingOption = {
        id: `profile-${index}-${slugify(sourceText).slice(0, 48) || "recording"}`,
        label: "",
        sensorMode: normalizeSensorCoverage(sensorText) || inferSensorFromText(searchableText) || undefined,
        gateMode: inferGateMode(gateText || searchableText),
        resolutionK: inferResolutionK(resolutionText || sourceText || searchableText),
        aspectRatio: inferAspectRatio(aspectText || searchableText),
        codec: cleanCodec(codecText) || inferCodec(searchableText),
        dataRateMbps: parseCameraDataRateMbps(dataRateText || row.text || sourceText) || undefined,
        dataRateLabel: dataRateText || inferDataRateLabel(row.text || sourceText),
        maxFps,
        sourceText,
    };

    option.label = buildRecordingOptionLabel(option);
    if (!option.label) return null;
    return option;
}

function readString(record: Record<string, unknown> | undefined, keys: string[]): string | undefined {
    if (!record) return undefined;
    for (const key of keys) {
        const value = record[key];
        if (typeof value === "string" && value.trim()) return value.trim();
        if (typeof value === "number" && Number.isFinite(value)) return String(value);
    }
    return undefined;
}

function inferResolutionK(text: string | undefined): string | undefined {
    if (!text) return undefined;
    const match = text.match(/(\d+(?:[.,]\d+)?)\s*K/i);
    if (!match) return undefined;
    const value = Number(match[1].replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) return undefined;
    return `${Number.isInteger(value) ? value : Number(value.toFixed(1))}K`;
}

function inferGateMode(text: string | undefined): string | undefined {
    if (!text) return undefined;
    const lower = text.toLowerCase();
    if (lower.includes("open gate")) return "Open Gate";
    if (lower.includes("full sensor")) return "Full Sensor";
    if (lower.includes("6:5")) return "6:5 Anamorphic";

    const aspect = inferAspectRatio(text);
    if (aspect === "16:9" || aspect === "17:9" || aspect === "4:3" || aspect === "2.39:1") return aspect;
    return undefined;
}

function inferAspectRatio(text: string | undefined): string | undefined {
    if (!text) return undefined;
    const normalized = text.toLowerCase().replace(/\s+/g, "");
    if (normalized.includes("16:9")) return "16:9";
    if (normalized.includes("17:9")) return "17:9";
    if (normalized.includes("3:2")) return "3:2";
    if (normalized.includes("4:3")) return "4:3";
    if (normalized.includes("6:5")) return "6:5 Anamorphic";
    if (normalized.includes("2.39") || normalized.includes("239:100")) return "2.39:1";
    return undefined;
}

function cleanCodec(codec: string | undefined): string | undefined {
    if (!codec) return undefined;
    return codec.replace(/\s+/g, " ").trim();
}

function inferCodec(text: string | undefined): string | undefined {
    if (!text) return undefined;
    const lower = text.toLowerCase();
    const codecs = [
        "ProRes RAW HQ",
        "ProRes RAW",
        "ProRes 4444 XQ",
        "ProRes 4444",
        "ProRes 422 HQ",
        "ProRes 422",
        "Cinema RAW Light",
        "Cinema RAW",
        "ARRIRAW",
        "ARRICORE",
        "X-OCN XT",
        "X-OCN ST",
        "X-OCN LT",
        "REDCODE RAW HQ",
        "REDCODE RAW MQ",
        "REDCODE RAW",
        "Blackmagic RAW",
        "BRAW",
        "XAVC-I",
        "XAVC HS",
        "H.265",
        "H.264",
    ];

    return codecs.find(codec => lower.includes(codec.toLowerCase()));
}

function inferDataRateLabel(text: string | undefined): string | undefined {
    if (!text) return undefined;
    return text.match(/\d+(?:[.,]\d+)?\s*(?:Gbps|Mbps|GB\/s|MB\/s)/i)?.[0];
}

function buildRecordingOptionLabel(option: CameraRecordingOption): string {
    const primary = [
        option.resolutionK,
        option.gateMode && option.gateMode !== option.aspectRatio ? option.gateMode : undefined,
        option.aspectRatio ? `${option.aspectRatio} frame` : undefined,
        option.codec,
    ].filter(Boolean).join(" ");

    const details = [
        option.dataRateLabel,
        option.maxFps,
    ].filter(Boolean).join(" / ");

    const label = primary || option.sourceText;
    return details ? `${label} - ${details}` : label;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getBaseSensorDimensions(sensorCoverage: CameraSensorCoverage | "") {
    switch (sensorCoverage) {
        case "S16":
            return { width: 12.52, height: 7.41 };
        case "S35":
            return { width: 27.99, height: 19.22 };
        case "FF":
            return { width: 36.0, height: 24.0 };
        case "LF":
            return { width: 40.96, height: 21.6 };
        default:
            return null;
    }
}

function parseAspectRatio(aspectRatio: string | undefined): number | undefined {
    if (!aspectRatio) return undefined;
    const normalized = aspectRatio.toLowerCase();
    if (normalized.includes("open gate") || normalized.includes("full sensor")) return undefined;
    if (normalized.includes("16:9")) return 16 / 9;
    if (normalized.includes("17:9")) return 17 / 9;
    if (normalized.includes("3:2")) return 3 / 2;
    if (normalized.includes("4:3")) return 4 / 3;
    if (normalized.includes("6:5")) return 6 / 5;
    if (normalized.includes("2.39")) return 2.39;
    return undefined;
}

function diagonal(width: number, height: number): number {
    return Math.sqrt((width * width) + (height * height));
}
