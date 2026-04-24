import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeCoverage(value: string): string {
    const text = value.trim().toUpperCase();
    if (text.includes("SUPER") || text.includes("S35")) return "S35";
    if (text.includes("FULL") || text === "FF") return "FF";
    if (text.includes("LARGE") || text.includes("LF")) return "LF";
    return value.trim();
}

function parseWattsFromString(text: string): number[] {
    const out: number[] = [];
    const regex = /(\d+(?:[.,]\d+)?)\s*(k)?\s*w\b/gi;
    let match: RegExpExecArray | null = regex.exec(text);
    while (match) {
        const raw = (match[1] || "").replace(/,/g, "");
        const base = Number.parseFloat(raw);
        if (Number.isFinite(base)) {
            const watts = match[2] ? base * 1000 : base;
            if (watts > 0 && watts <= 100000) {
                out.push(Math.round(watts));
            }
        }
        match = regex.exec(text);
    }
    return out;
}

function extractPowerCandidates(value: unknown, keyHint = ""): number[] {
    if (value == null) return [];

    const key = keyHint.toLowerCase();
    if (typeof value === "number") {
        if (key.includes("power") || key.includes("watt")) {
            return [Math.round(value)];
        }
        return [];
    }

    if (typeof value === "string") {
        const hasPowerKey = key.includes("power") || key.includes("watt");
        const hasWattToken = /\bw\b/i.test(value);
        if (hasPowerKey || hasWattToken) {
            return parseWattsFromString(value);
        }
        return [];
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => extractPowerCandidates(item, keyHint));
    }

    if (typeof value === "object") {
        return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
            extractPowerCandidates(v, k)
        );
    }

    return [];
}

function extractPowerDrawWatts(specsJson: string | null): number | null {
    if (!specsJson) return null;
    try {
        const parsed = JSON.parse(specsJson) as unknown;
        const candidates = extractPowerCandidates(parsed);
        if (candidates.length === 0) return null;
        return Math.max(...candidates);
    } catch {
        return null;
    }
}

async function fillLensCoverage() {
    const lenses = await prisma.equipmentItem.findMany({
        where: {
            category: "LNS",
            coverage: null,
            sensor_coverage: { not: null },
            status: "APPROVED",
            isPrivate: false,
        },
        select: {
            id: true,
            sensor_coverage: true,
        },
    });

    let updated = 0;
    for (const item of lenses) {
        const source = item.sensor_coverage;
        if (!source) continue;
        const normalized = normalizeCoverage(source);
        await prisma.equipmentItem.update({
            where: { id: item.id },
            data: { coverage: normalized },
        });
        updated += 1;
    }

    return { scanned: lenses.length, updated };
}

async function fillLightingPower() {
    const lighting = await prisma.equipmentItem.findMany({
        where: {
            category: "LIT",
            power_draw_w: null,
            status: "APPROVED",
            isPrivate: false,
            specs_json: { not: null },
        },
        select: {
            id: true,
            specs_json: true,
        },
    });

    let updated = 0;
    for (const item of lighting) {
        const watts = extractPowerDrawWatts(item.specs_json);
        if (watts == null) continue;
        await prisma.equipmentItem.update({
            where: { id: item.id },
            data: { power_draw_w: watts },
        });
        updated += 1;
    }

    return { scanned: lighting.length, updated };
}

async function main() {
    const lensResult = await fillLensCoverage();
    const lightResult = await fillLightingPower();

    console.log("Catalog gap fill complete.");
    console.log(
        `LNS coverage: updated ${lensResult.updated}/${lensResult.scanned} records from sensor_coverage`
    );
    console.log(
        `LIT power_draw_w: updated ${lightResult.updated}/${lightResult.scanned} records from specs_json`
    );
}

main()
    .catch((e) => {
        console.error("Catalog gap fill failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

