import type { InventoryEntry, InventoryItem } from "@/components/CineBrainInterface";

export type CameraSensorCoverage = "S16" | "S35" | "FF" | "LF";

export type CameraRecordingConfig = {
    sensorMode?: string;
    gateMode?: string;
    resolutionK?: string;
    aspectRatio?: string;
    codec?: string;
    recordingFormat?: string;
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

    const summary = [
        config.resolutionK,
        config.gateMode,
        config.aspectRatio ? `${config.aspectRatio} frame` : undefined,
        config.codec,
        sensorCoverage ? `${sensorCoverage} mode` : undefined,
    ].filter(Boolean).join(" / ");

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
