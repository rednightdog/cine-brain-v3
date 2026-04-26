import { parseCameraConfig, type CameraRecordingConfig } from "./camera-format";

type RecordingDurationInput = {
    cameraConfigJson?: string | null;
    cameraRecordingFormats?: string | null;
    mediaName: string;
    mediaModel?: string | null;
    mediaSpecsJson?: string | null;
    mediaQuantity?: number | null;
};

export type RecordingDurationEstimate = {
    capacityGb: number;
    dataRateMbps: number;
    minutes: number;
    source: "catalog" | "custom" | "estimate";
    setupLabel: string;
};

export function estimateRecordingDuration(input: RecordingDurationInput): RecordingDurationEstimate | null {
    const capacityGb = parseMediaCapacityGb(input.mediaName, input.mediaModel, input.mediaSpecsJson);
    if (!capacityGb) return null;

    const config = parseCameraConfig(input.cameraConfigJson);
    const customDataRate = parseCustomDataRateMbps(config.dataRateMbps);
    const catalogDataRate = findCatalogDataRateMbps(input.cameraRecordingFormats, config);
    const dataRate = customDataRate || catalogDataRate || estimateDataRateMbps(config);
    if (!dataRate) return null;

    const quantity = Math.max(1, input.mediaQuantity || 1);
    const totalCapacityGb = capacityGb * quantity;
    const minutes = (totalCapacityGb * 8000) / dataRate / 60;

    return {
        capacityGb: totalCapacityGb,
        dataRateMbps: dataRate,
        minutes,
        source: customDataRate ? "custom" : catalogDataRate ? "catalog" : "estimate",
        setupLabel: buildSetupLabel(config),
    };
}

export function formatRecordingDurationEstimate(estimate: RecordingDurationEstimate): string {
    const roundedMinutes = Math.max(1, Math.round(estimate.minutes));
    const duration = roundedMinutes >= 90
        ? `${Math.floor(roundedMinutes / 60)}h ${roundedMinutes % 60}m`
        : `${roundedMinutes} min`;
    const sourceLabel = estimate.source === "estimate" ? "approx" : estimate.source;
    return `${formatCapacityGb(estimate.capacityGb)} -> ${duration} ${sourceLabel} @ ${estimate.setupLabel} (${Math.round(estimate.dataRateMbps)} Mbps)`;
}

export function parseMediaCapacityGb(name: string, model?: string | null, specsJson?: string | null): number | null {
    const specsCapacity = parseCapacityFromSpecs(specsJson);
    if (specsCapacity) return specsCapacity;

    const text = `${name} ${model || ""}`;
    const tbMatch = text.match(/(\d+(?:[.,]\d+)?)\s*TB/i);
    if (tbMatch) return parseFloat(tbMatch[1].replace(",", ".")) * 1000;

    const gbMatch = text.match(/(\d+(?:[.,]\d+)?)\s*GB/i);
    if (gbMatch) return parseFloat(gbMatch[1].replace(",", "."));

    return null;
}

function parseCapacityFromSpecs(specsJson?: string | null): number | null {
    if (!specsJson) return null;
    try {
        const specs = JSON.parse(specsJson) as Record<string, unknown>;
        const rawTb = specs.capacity_tb || specs.capacityTb || specs.size_tb || specs.sizeTb;
        if (typeof rawTb === "number") return rawTb * 1000;
        if (typeof rawTb === "string") return parseMediaCapacityGb(rawTb);

        const raw = specs.capacity_gb || specs.capacityGb || specs.capacity || specs.size;
        if (typeof raw === "number") return raw;
        if (typeof raw === "string") return parseMediaCapacityGb(raw);
    } catch { }
    return null;
}

function formatCapacityGb(capacityGb: number): string {
    if (capacityGb >= 1000 && capacityGb % 1000 === 0) return `${capacityGb / 1000}TB`;
    if (capacityGb >= 1000) return `${Number((capacityGb / 1000).toFixed(1))}TB`;
    return `${Math.round(capacityGb)}GB`;
}

function findCatalogDataRateMbps(recordingFormats: string | null | undefined, config: CameraRecordingConfig): number | null {
    const formats = parseRecordingFormats(recordingFormats);
    if (formats.length === 0) return null;

    const ranked = formats
        .map(format => ({ format, score: scoreFormatMatch(format.text, config) }))
        .sort((a, b) => b.score - a.score);

    const best = ranked.find(row => row.score > 0 && row.format.dataRateMbps);
    return best?.format.dataRateMbps || null;
}

function parseRecordingFormats(recordingFormats: string | null | undefined): Array<{ text: string; dataRateMbps?: number }> {
    if (!recordingFormats) return [];

    try {
        const parsed: unknown = JSON.parse(recordingFormats);
        if (Array.isArray(parsed)) {
            return parsed.map(row => {
                if (typeof row === "string") return { text: row, dataRateMbps: parseDataRateMbps(row) || undefined };
                if (typeof row === "object" && row !== null) {
                    const record = row as Record<string, unknown>;
                    const text = Object.values(record).filter(value => typeof value === "string").join(" ");
                    return {
                        text,
                        dataRateMbps: parseDataRateMbps(String(record.data_rate || record.dataRate || text)) || undefined,
                    };
                }
                return { text: String(row) };
            });
        }
    } catch { }

    return recordingFormats
        .split(/[|;\n]/)
        .map(text => text.trim())
        .filter(Boolean)
        .map(text => ({ text, dataRateMbps: parseDataRateMbps(text) || undefined }));
}

function parseDataRateMbps(text: string): number | null {
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

function parseCustomDataRateMbps(value: number | string | undefined): number | null {
    if (typeof value === "number") {
        return Number.isFinite(value) && value > 0 ? value : null;
    }
    if (typeof value !== "string" || value.trim().length === 0) return null;

    const withUnit = parseDataRateMbps(value);
    if (withUnit) return withUnit;

    const numeric = Number(value.trim().replace(",", "."));
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function scoreFormatMatch(text: string, config: CameraRecordingConfig): number {
    const haystack = text.toLowerCase();
    let score = 0;
    if (config.codec && haystack.includes(config.codec.toLowerCase())) score += 4;
    if (config.resolutionK && haystack.includes(config.resolutionK.toLowerCase())) score += 3;
    if (config.gateMode && haystack.includes(config.gateMode.toLowerCase())) score += 1;
    if (config.aspectRatio && haystack.includes(config.aspectRatio.toLowerCase())) score += 1;
    return score;
}

function estimateDataRateMbps(config: CameraRecordingConfig): number | null {
    const codec = (config.codec || "").toLowerCase();
    const resolution = parseResolutionK(config.resolutionK);

    if (!codec) return null;
    if (codec.includes("arriraw")) return resolution >= 6 ? 2800 : resolution >= 4 ? 2600 : 1200;
    if (codec.includes("arricore")) return resolution >= 4 ? 2600 : 1200;
    if (codec.includes("prores 4444 xq")) return resolution >= 4 ? 1800 : 900;
    if (codec.includes("prores 422 hq")) return resolution >= 4 ? 800 : 250;
    if (codec.includes("x-ocn xt")) return resolution >= 8 ? 2400 : resolution >= 6 ? 2000 : 1400;
    if (codec.includes("x-ocn st")) return resolution >= 8 ? 1800 : 1000;
    if (codec.includes("x-ocn lt")) return resolution >= 6 ? 1200 : 900;
    if (codec.includes("redcode")) return codec.includes("hq") ? 2500 : codec.includes("mq") ? 1500 : 1200;
    if (codec.includes("braw")) return resolution >= 12 ? 1500 : resolution >= 8 ? 900 : 480;
    if (codec.includes("xavc-i")) return resolution >= 4 ? 600 : 150;
    if (codec.includes("cinema raw")) return resolution >= 5 ? 2100 : 1000;

    return null;
}

function parseResolutionK(resolutionK?: string): number {
    if (!resolutionK) return 4;
    const match = resolutionK.match(/(\d+(?:[.,]\d+)?)/);
    return match ? parseFloat(match[1].replace(",", ".")) : 4;
}

function buildSetupLabel(config: CameraRecordingConfig): string {
    return [
        config.resolutionK,
        config.gateMode,
        config.aspectRatio ? `${config.aspectRatio} frame` : undefined,
        config.codec,
    ].filter(Boolean).join(" / ") || "selected camera setup";
}
