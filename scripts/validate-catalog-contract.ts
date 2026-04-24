import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { detectCatalogDomain, evaluateItemByContract } from "../lib/catalog-contract";

const prisma = new PrismaClient();

type CatalogRow = {
    id: string;
    name: string;
    brand: string;
    model: string;
    category: string;
    subcategory: string | null;
    description: string;
    status: "PENDING" | "APPROVED";
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

function parseCliFlags() {
    const args = process.argv.slice(2);
    const enforce = args.includes("--enforce-pending");
    const onlyCamLens = args.includes("--cam-lens-only");
    return { enforce, onlyCamLens };
}

async function run() {
    const { enforce, onlyCamLens } = parseCliFlags();

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
            description: true,
            status: true,
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
        orderBy: [{ category: "asc" }, { name: "asc" }],
    }) as CatalogRow[];

    const evaluated = rows.map((item) => {
        const quality = evaluateItemByContract(item);
        return {
            id: item.id,
            name: item.name,
            brand: item.brand,
            model: item.model,
            category: item.category,
            domain: detectCatalogDomain(item),
            score: quality.score,
            missingCritical: quality.missingCritical,
            missingRecommended: quality.missingRecommended,
        };
    });

    const scoped = onlyCamLens
        ? evaluated.filter((x) => x.category === "CAM" || x.category === "LNS")
        : evaluated;

    const withCriticalMissing = scoped.filter((x) => x.missingCritical.length > 0);

    const byDomain = scoped.reduce<Record<string, { total: number; avgScore: number }>>((acc, row) => {
        const current = acc[row.domain] || { total: 0, avgScore: 0 };
        current.total += 1;
        current.avgScore += row.score;
        acc[row.domain] = current;
        return acc;
    }, {});
    for (const key of Object.keys(byDomain)) {
        const d = byDomain[key];
        d.avgScore = Number((d.avgScore / d.total).toFixed(2));
    }

    const missingFieldFrequency = withCriticalMissing.reduce<Record<string, number>>((acc, row) => {
        for (const field of row.missingCritical) {
            acc[field] = (acc[field] || 0) + 1;
        }
        return acc;
    }, {});

    let enforcedToPending = 0;
    if (enforce && withCriticalMissing.length > 0) {
        const targetIds = withCriticalMissing.map((x) => x.id);
        const result = await prisma.equipmentItem.updateMany({
            where: {
                id: { in: targetIds },
                status: "APPROVED",
            },
            data: {
                status: "PENDING",
            },
        });
        enforcedToPending = result.count;
    }

    const report = {
        generatedAt: new Date().toISOString(),
        mode: {
            enforcePending: enforce,
            camLensOnly: onlyCamLens,
        },
        totals: {
            approvedPublic: rows.length,
            evaluated: scoped.length,
            withCriticalMissing: withCriticalMissing.length,
            enforcedToPending,
        },
        domainSummary: byDomain,
        criticalMissingFieldFrequency: missingFieldFrequency,
        criticalMissingSample: withCriticalMissing.slice(0, 100),
    };

    const reportsDir = join(process.cwd(), "reports");
    mkdirSync(reportsDir, { recursive: true });
    const reportPath = join(reportsDir, "catalog-contract-report.json");
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("Catalog contract validation complete.");
    console.log(`Evaluated: ${report.totals.evaluated}`);
    console.log(`Critical missing: ${report.totals.withCriticalMissing}`);
    console.log(`Enforced to PENDING: ${report.totals.enforcedToPending}`);
    console.log(`Report path: ${reportPath}`);
}

run()
    .catch((e) => {
        console.error("Catalog contract validation failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

