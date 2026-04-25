import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const prisma = new PrismaClient();

type CliOptions = {
    filePath: string;
    onlyCamLens: boolean;
    includePending: boolean;
    includePrivate: boolean;
    editable: boolean;
};

function parseCliOptions(): CliOptions {
    const args = process.argv.slice(2);
    let filePath = "./imports/my-inventory.csv";
    let onlyCamLens = false;
    let includePending = false;
    let includePrivate = false;
    let editable = false;

    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (arg === "--only-cam-lens") {
            onlyCamLens = true;
            continue;
        }
        if (arg === "--include-pending") {
            includePending = true;
            continue;
        }
        if (arg === "--include-private") {
            includePrivate = true;
            continue;
        }
        if (arg === "--editable") {
            editable = true;
            continue;
        }
        if (arg.startsWith("--file=")) {
            filePath = arg.slice("--file=".length).trim() || filePath;
            continue;
        }
        if (arg === "--file") {
            filePath = (args[i + 1] || "").trim() || filePath;
            i += 1;
            continue;
        }
    }

    return {
        filePath: resolve(process.cwd(), filePath),
        onlyCamLens,
        includePending,
        includePrivate,
        editable,
    };
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

function formatRecordingFormatsForEditable(raw: string | null): string {
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
            .filter((value) => value.length > 0);

        return values.join(" | ");
    } catch {
        return raw;
    }
}

async function run() {
    const options = parseCliOptions();

    const items = await prisma.equipmentItem.findMany({
        where: {
            isPrivate: options.includePrivate ? undefined : false,
            status: options.includePending ? undefined : "APPROVED",
            category: options.onlyCamLens ? { in: ["CAM", "LNS"] } : undefined,
        },
        select: {
            brand: true,
            model: true,
            name: true,
            category: true,
            subcategory: true,
            description: true,
            mount: true,
            sensor_size: true,
            resolution: true,
            recordingFormats: true,
            coverage: true,
            focal_length: true,
            aperture: true,
            lens_type: true,
            power_draw_w: true,
            weight_kg: true,
            daily_rate_est: true,
            status: true,
            technicalData: true,
            labMetrics: true,
            imageUrl: true,
            sourceUrl: true,
        },
        orderBy: [{ category: "asc" }, { brand: "asc" }, { model: "asc" }, { name: "asc" }],
    });

    const headers = options.editable
        ? [
              "brand",
              "model",
              "name",
              "category",
              "subcategory",
              "description",
              "mount",
              "sensor_size",
              "resolution",
              "recordingFormats",
              "coverage",
              "focal_length",
              "aperture",
              "lens_type",
              "power_draw_w",
              "weight_kg",
              "daily_rate_est",
              "status",
              "sourceUrl",
          ]
        : [
              "brand",
              "model",
              "name",
              "category",
              "subcategory",
              "description",
              "mount",
              "sensor_size",
              "resolution",
              "recordingFormats",
              "coverage",
              "focal_length",
              "aperture",
              "lens_type",
              "power_draw_w",
              "weight_kg",
              "daily_rate_est",
              "status",
              "technicalData",
              "labMetrics",
              "imageUrl",
              "sourceUrl",
          ];

    const rows = options.editable
        ? items.map((item) => ({
              brand: item.brand,
              model: item.model,
              name: item.name,
              category: item.category,
              subcategory: item.subcategory,
              description: item.description,
              mount: item.mount,
              sensor_size: item.sensor_size,
              resolution: item.resolution,
              recordingFormats: formatRecordingFormatsForEditable(item.recordingFormats),
              coverage: item.coverage,
              focal_length: item.focal_length,
              aperture: item.aperture,
              lens_type: item.lens_type,
              power_draw_w: item.power_draw_w,
              weight_kg: item.weight_kg,
              daily_rate_est: item.daily_rate_est,
              status: item.status,
              sourceUrl: item.sourceUrl,
          }))
        : items.map((item) => ({
              ...item,
              recordingFormats: item.recordingFormats || "",
              technicalData: item.technicalData || "",
              labMetrics: item.labMetrics || "",
          }));

    mkdirSync(dirname(options.filePath), { recursive: true });
    writeFileSync(options.filePath, stringifyCsv(headers, rows), "utf8");

    console.log("Inventory export completed.");
    console.log(`Rows exported: ${rows.length}`);
    console.log(`Output file: ${options.filePath}`);
    console.log(`Mode: ${options.editable ? "EDITABLE" : "FULL (JSON included)"}`);
    console.log(`Scope: ${options.onlyCamLens ? "CAM+LNS" : "ALL CATEGORIES"}`);
    console.log(`Status filter: ${options.includePending ? "ALL" : "APPROVED only"}`);
    console.log(`Privacy filter: ${options.includePrivate ? "ALL" : "PUBLIC only"}`);
}

run()
    .catch((error) => {
        console.error("Inventory export failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
