import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { evaluateItemByContract } from "../lib/catalog-contract";

const prisma = new PrismaClient();

type CliOptions = {
    limit: number;
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
    payload_kg: number | null;
};

function parseCliOptions(): CliOptions {
    const args = process.argv.slice(2);
    let limit = 20;
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
    }

    return { limit, camLensOnly };
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
            payload_kg: true,
        },
        orderBy: [{ category: "asc" }, { brand: "asc" }, { model: "asc" }, { name: "asc" }],
    })) as CatalogRow[];

    const evaluated = rows.map((row) => {
        const quality = evaluateItemByContract(row);
        return {
            ...row,
            score: quality.score,
            missingCritical: quality.missingCritical,
            missingRecommended: quality.missingRecommended,
        };
    });

    const withGaps = evaluated.filter((row) => row.missingCritical.length > 0 || row.missingRecommended.length > 0);
    withGaps.sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        if (a.missingCritical.length !== b.missingCritical.length) return b.missingCritical.length - a.missingCritical.length;
        if (a.missingRecommended.length !== b.missingRecommended.length) return b.missingRecommended.length - a.missingRecommended.length;
        return a.name.localeCompare(b.name);
    });

    const top = withGaps.slice(0, options.limit);

    const headers = [
        "rank",
        "id",
        "category",
        "brand",
        "model",
        "name",
        "score",
        "missingCriticalCount",
        "missingRecommendedCount",
        "missingCritical",
        "missingRecommended",
    ];

    const csvRows = top.map((item, index) => ({
        rank: index + 1,
        id: item.id,
        category: item.category,
        brand: item.brand,
        model: item.model,
        name: item.name,
        score: item.score,
        missingCriticalCount: item.missingCritical.length,
        missingRecommendedCount: item.missingRecommended.length,
        missingCritical: item.missingCritical.join(" | "),
        missingRecommended: item.missingRecommended.join(" | "),
    }));

    const reportsDir = join(process.cwd(), "reports");
    mkdirSync(reportsDir, { recursive: true });
    const outputPath = join(reportsDir, "cam-lens-priority-updates.csv");
    writeFileSync(outputPath, stringifyCsv(headers, csvRows), "utf8");

    console.log("Priority updates export completed.");
    console.log(`Evaluated rows: ${rows.length}`);
    console.log(`Rows with gaps: ${withGaps.length}`);
    console.log(`Top exported: ${top.length}`);
    console.log(`Output path: ${outputPath}`);
}

run()
    .catch((error) => {
        console.error("Priority updates export failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
