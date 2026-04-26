import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { evaluateItemByContract } from "../lib/catalog-contract";

const prisma = new PrismaClient();

type CliOptions = {
    limit: number;
    outputPath: string;
    camLensOnly: boolean;
};

type CatalogRow = {
    id: string;
    name: string;
    brand: string;
    model: string;
    category: string;
    subcategory: string | null;
    description: string;
    daily_rate_est: number;
    mount: string | null;
    sensor_size: string | null;
    resolution: string | null;
    recordingFormats: string | null;
    technicalData: string | null;
    labMetrics: string | null;
    dynamic_range: string | null;
    native_iso: string | null;
    power_draw_w: number | null;
    coverage: string | null;
    focal_length: string | null;
    aperture: string | null;
    lens_type: string | null;
    image_circle_mm: number | null;
    close_focus_m: number | null;
    front_diameter_mm: number | null;
    squeeze: string | null;
};

function parseCliOptions(): CliOptions {
    const args = process.argv.slice(2);
    let limit = 20;
    let outputPath = "./imports/my-inventory-priority-20.csv";
    let camLensOnly = true;

    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (arg === "--all-domains") {
            camLensOnly = false;
            continue;
        }
        if (arg.startsWith("--limit=")) {
            const value = Number(arg.slice("--limit=".length).trim());
            if (Number.isFinite(value) && value > 0) limit = Math.round(value);
            continue;
        }
        if (arg === "--limit") {
            const value = Number((args[i + 1] || "").trim());
            if (Number.isFinite(value) && value > 0) limit = Math.round(value);
            i += 1;
            continue;
        }
        if (arg.startsWith("--out=")) {
            outputPath = arg.slice("--out=".length).trim() || outputPath;
            continue;
        }
        if (arg === "--out") {
            outputPath = (args[i + 1] || "").trim() || outputPath;
            i += 1;
            continue;
        }
    }

    return { limit, outputPath: resolve(process.cwd(), outputPath), camLensOnly };
}

function toCsvCell(value: unknown): string {
    if (value == null) return "";
    const text = String(value).replace(/\r?\n/g, " ").trim();
    const escaped = text.replace(/"/g, "\"\"");
    return `"${escaped}"`;
}

function stringifyCsv(headers: string[], rows: Record<string, unknown>[]): string {
    const lines = [headers.map((h) => toCsvCell(h)).join(",")];
    for (const row of rows) {
        lines.push(headers.map((h) => toCsvCell(row[h])).join(","));
    }
    return lines.join("\n") + "\n";
}

function asString(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

function formatRecordingFormats(raw: string | null): string {
    if (!raw || !raw.trim()) return "";
    try {
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return raw;
        const values = parsed
            .map((entry) => {
                if (typeof entry === "string") return entry.trim();
                if (!entry || typeof entry !== "object") return "";
                const row = entry as Record<string, unknown>;
                const direct = asString(row.format);
                if (direct) return direct;
                const resolution = asString(row.resolution);
                const codec = asString(row.codec);
                if (resolution && codec) return `${resolution} ${codec}`;
                return resolution || codec;
            })
            .filter((x) => x.length > 0);
        return values.join(" | ");
    } catch {
        return raw;
    }
}

async function run() {
    const options = parseCliOptions();

    const rows = (await prisma.equipmentItem.findMany({
        where: {
            status: "APPROVED",
            isPrivate: false,
            category: options.camLensOnly ? { in: ["CAM", "LNS"] } : undefined,
        },
        select: {
            id: true,
            name: true,
            brand: true,
            model: true,
            category: true,
            subcategory: true,
            description: true,
            daily_rate_est: true,
            mount: true,
            sensor_size: true,
            resolution: true,
            recordingFormats: true,
            technicalData: true,
            labMetrics: true,
            dynamic_range: true,
            native_iso: true,
            power_draw_w: true,
            coverage: true,
            focal_length: true,
            aperture: true,
            lens_type: true,
            image_circle_mm: true,
            close_focus_m: true,
            front_diameter_mm: true,
            squeeze: true,
        },
        orderBy: [{ category: "asc" }, { brand: "asc" }, { model: "asc" }, { name: "asc" }],
    })) as CatalogRow[];

    const ranked = rows
        .map((row) => {
            const quality = evaluateItemByContract(row);
            return {
                ...row,
                score: quality.score,
                missingCritical: quality.missingCritical,
                missingRecommended: quality.missingRecommended,
            };
        })
        .filter((row) => row.missingCritical.length > 0 || row.missingRecommended.length > 0)
        .sort((a, b) => {
            if (a.score !== b.score) return a.score - b.score;
            if (a.missingCritical.length !== b.missingCritical.length) return b.missingCritical.length - a.missingCritical.length;
            if (a.missingRecommended.length !== b.missingRecommended.length) return b.missingRecommended.length - a.missingRecommended.length;
            return a.name.localeCompare(b.name);
        })
        .slice(0, options.limit);

    const headers = [
        "brand",
        "model",
        "name",
        "category",
        "subcategory",
        "description",
        "daily_rate_est",
        "mount",
        "sensor_size",
        "resolution",
        "recordingFormats",
        "coverage",
        "focal_length",
        "aperture",
        "lens_type",
        "dynamic_range",
        "native_iso",
        "power_draw_w",
        "image_circle_mm",
        "close_focus_m",
        "front_diameter_mm",
        "squeeze",
        "technicalData",
        "labMetrics",
        "score",
        "missingCritical",
        "missingRecommended",
    ];

    const outRows = ranked.map((item) => ({
        brand: item.brand,
        model: item.model,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory || "",
        description: item.description,
        daily_rate_est: item.daily_rate_est,
        mount: item.mount || "",
        sensor_size: item.sensor_size || "",
        resolution: item.resolution || "",
        recordingFormats: formatRecordingFormats(item.recordingFormats),
        coverage: item.coverage || "",
        focal_length: item.focal_length || "",
        aperture: item.aperture || "",
        lens_type: item.lens_type || "",
        dynamic_range: item.dynamic_range || "",
        native_iso: item.native_iso || "",
        power_draw_w: item.power_draw_w ?? "",
        image_circle_mm: item.image_circle_mm ?? "",
        close_focus_m: item.close_focus_m ?? "",
        front_diameter_mm: item.front_diameter_mm ?? "",
        squeeze: item.squeeze || "",
        // Technical fields intentionally left blank to encourage clean manual fill when missing.
        technicalData: item.technicalData || "",
        labMetrics: item.labMetrics || "",
        score: item.score,
        missingCritical: item.missingCritical.join(" | "),
        missingRecommended: item.missingRecommended.join(" | "),
    }));

    mkdirSync(dirname(options.outputPath), { recursive: true });
    writeFileSync(options.outputPath, stringifyCsv(headers, outRows), "utf8");

    console.log("Priority editable CSV export completed.");
    console.log(`Evaluated rows: ${rows.length}`);
    console.log(`Priority rows exported: ${outRows.length}`);
    console.log(`Output path: ${options.outputPath}`);
}

run()
    .catch((error) => {
        console.error("Priority editable CSV export failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
