import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const prisma = new PrismaClient();

type CliOptions = {
    filePath: string;
    onlyCamLens: boolean;
    includePending: boolean;
    includePrivate: boolean;
};

function parseCliOptions(): CliOptions {
    const args = process.argv.slice(2);
    let filePath = "./imports/my-inventory.csv";
    let onlyCamLens = false;
    let includePending = false;
    let includePrivate = false;

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

    const headers = [
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

    const rows = items.map((item) => ({
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
