import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

type CatalogRow = {
    id: string;
    name: string;
    brand: string;
    model: string;
    category: string;
    subcategory: string | null;
    mount: string | null;
    sensor_size: string | null;
    coverage: string | null;
    focal_length: string | null;
    aperture: string | null;
    resolution: string | null;
    power_draw_w: number | null;
    imageUrl: string | null;
    technicalData: string | null;
    labMetrics: string | null;
    recordingFormats: string | null;
};

type FieldName =
    | "mount"
    | "sensor_size"
    | "coverage"
    | "focal_length"
    | "aperture"
    | "resolution"
    | "power_draw_w"
    | "imageUrl"
    | "subcategory"
    | "technicalData"
    | "labMetrics"
    | "recordingFormats";

const TRACKED_FIELDS: FieldName[] = [
    "mount",
    "sensor_size",
    "coverage",
    "focal_length",
    "aperture",
    "resolution",
    "power_draw_w",
    "imageUrl",
    "subcategory",
    "technicalData",
    "labMetrics",
    "recordingFormats",
];

const LIT_POWER_REQUIRED_SUBCATEGORIES = new Set([
    "led",
    "hmi",
    "tungsten",
    "fluorescent",
    "tube",
    "panel",
    "fresnel",
    "open face",
    "soft light",
]);

function hasValue(item: CatalogRow, field: FieldName): boolean {
    const value = item[field];
    if (typeof value === "number") {
        return Number.isFinite(value);
    }
    if (typeof value === "string") {
        return value.trim().length > 0;
    }
    return false;
}

function isValidJson(raw: string | null): boolean {
    if (!raw || raw.trim().length === 0) return false;
    try {
        JSON.parse(raw);
        return true;
    } catch {
        return false;
    }
}

function getCriticalFields(item: CatalogRow): FieldName[] {
    if (item.category === "CAM") {
        return ["mount", "sensor_size", "resolution"];
    }

    if (item.category === "LNS") {
        return ["mount", "coverage", "focal_length", "aperture"];
    }

    if (item.category === "LIT") {
        const sub = (item.subcategory || "").toLowerCase().trim();
        if (LIT_POWER_REQUIRED_SUBCATEGORIES.has(sub)) {
            return ["subcategory", "power_draw_w"];
        }
        return ["subcategory"];
    }

    if (item.category === "SUP") {
        return ["subcategory"];
    }

    return [];
}

async function run() {
    const rows = await prisma.equipmentItem.findMany({
        where: {
            status: "APPROVED",
            isPrivate: false,
        },
        select: {
            id: true,
            name: true,
            brand: true,
            model: true,
            category: true,
            subcategory: true,
            mount: true,
            sensor_size: true,
            coverage: true,
            focal_length: true,
            aperture: true,
            resolution: true,
            power_draw_w: true,
            imageUrl: true,
            technicalData: true,
            labMetrics: true,
            recordingFormats: true,
        },
        orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    const total = rows.length;
    const byCategory = new Map<string, CatalogRow[]>();

    for (const row of rows) {
        const current = byCategory.get(row.category) || [];
        current.push(row);
        byCategory.set(row.category, current);
    }

    const globalMissing: Record<FieldName, { missing: number; rate: number }> = {} as Record<
        FieldName,
        { missing: number; rate: number }
    >;

    for (const field of TRACKED_FIELDS) {
        const missing = rows.filter((r) => !hasValue(r, field)).length;
        globalMissing[field] = {
            missing,
            rate: total === 0 ? 0 : Number(((missing / total) * 100).toFixed(2)),
        };
    }

    const categoryHealth = Array.from(byCategory.entries()).map(([category, items]) => {
        const fieldMissing: Record<FieldName, { missing: number; rate: number }> = {} as Record<
            FieldName,
            { missing: number; rate: number }
        >;
        for (const field of TRACKED_FIELDS) {
            const missing = items.filter((r) => !hasValue(r, field)).length;
            fieldMissing[field] = {
                missing,
                rate: items.length === 0 ? 0 : Number(((missing / items.length) * 100).toFixed(2)),
            };
        }
        return {
            category,
            count: items.length,
            missing: fieldMissing,
        };
    });

    const criticalMissing = rows
        .map((item) => {
            const rules = getCriticalFields(item);
            const missingFields = rules.filter((field) => !hasValue(item, field));
            return {
                id: item.id,
                name: item.name,
                brand: item.brand,
                model: item.model,
                category: item.category,
                missingFields,
            };
        })
        .filter((x) => x.missingFields.length > 0);

    const criticalMissingByCategory = criticalMissing.reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {});

    const invalidJsonRows = rows
        .map((item) => {
            const invalid: string[] = [];
            if (item.technicalData && !isValidJson(item.technicalData)) invalid.push("technicalData");
            if (item.labMetrics && !isValidJson(item.labMetrics)) invalid.push("labMetrics");
            if (item.recordingFormats && !isValidJson(item.recordingFormats)) invalid.push("recordingFormats");
            return {
                id: item.id,
                name: item.name,
                category: item.category,
                invalid,
            };
        })
        .filter((x) => x.invalid.length > 0);

    const report = {
        generatedAt: new Date().toISOString(),
        totalApprovedPublicItems: total,
        globalMissing,
        categoryHealth,
        criticalMissingCount: criticalMissing.length,
        criticalMissingByCategory,
        criticalMissingSample: criticalMissing.slice(0, 50),
        invalidJsonCount: invalidJsonRows.length,
        invalidJsonSample: invalidJsonRows.slice(0, 50),
    };

    const reportsDir = join(process.cwd(), "reports");
    mkdirSync(reportsDir, { recursive: true });
    const reportPath = join(reportsDir, "catalog-health-report.json");
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("Catalog health report generated.");
    console.log(`Total approved/public items: ${total}`);
    console.log(`Critical missing items: ${report.criticalMissingCount}`);
    console.log(`Invalid JSON rows: ${report.invalidJsonCount}`);
    console.log(`Report path: ${reportPath}`);
}

run()
    .catch((e) => {
        console.error("Catalog health report failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
