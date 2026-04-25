import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const UPDATE_BATCH_SIZE = 50;

// Manual overrides for models that do not expose watt values in current specs_json payloads.
// Sources used while preparing this mapping:
// - Aputure/Infinibar and MT Pro technical/power docs
// - amaran T2c/T4c manual/spec pages
// - Nanlite PavoTube II manual technical data
// - Kino Flo FreeStyle T44/T24 system controller specification
const POWER_OVERRIDES_BY_MODEL: Record<string, number> = {
    "Amaran T2c": 25,
    "Amaran T4c": 50,
    "MT Pro": 9,
    "Infinibar PB3": 9,
    "Infinibar PB6": 18,
    "Infinibar PB12": 37,
    "PavoTube II 15X": 35,
    "PavoTube II 30C": 30,
    "PavoTube II 30X": 70,
    "PavoTube II 60X": 106,
    "FreeStyle T24": 150,
    "FreeStyle T44": 150,
};

const CAMERA_RECORDING_OVERRIDES_BY_MODEL: Record<
    string,
    Array<{ resolution: string; codec: string; max_fps: string; data_rate?: string }>
> = {
    "Ronin 4D": [
        {
            resolution: "6K (Full Frame)",
            codec: "Apple ProRes RAW HQ / Apple ProRes RAW",
            max_fps: "up to 60 fps (DJI PROSSD 1TB)",
        },
        {
            resolution: "6K",
            codec: "Apple ProRes 422 HQ / Apple ProRes 422 LT",
            max_fps: "23.976/24/25/29.97/30 fps (CFexpress 2.0 Type B)",
        },
        {
            resolution: "C4K / 2K",
            codec: "Apple ProRes 422 HQ / Apple ProRes 422 LT / H.264 (4:2:0 10-bit)",
            max_fps: "up to 120 fps (media dependent)",
        },
    ],
};

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

function parseJsonObject(raw: string | null): Record<string, unknown> | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return parsed as Record<string, unknown>;
        }
        return null;
    } catch {
        return null;
    }
}

function parseRecordingFormats(raw: string | null): Array<Record<string, unknown>> {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
            return parsed.filter((x) => x && typeof x === "object") as Array<Record<string, unknown>>;
        }
        return [];
    } catch {
        return [];
    }
}

function inferLensType(subcategory: string | null, description: string, squeeze: string | null): string {
    const text = `${subcategory || ""} ${description}`.toLowerCase();
    if (squeeze && squeeze.trim().length > 0) return "Anamorphic";
    if (text.includes("anamorphic") || text.includes("anamorf")) return "Anamorphic";
    return "Spherical";
}

async function executeInBatches(ops: Prisma.PrismaPromise<unknown>[]) {
    for (let i = 0; i < ops.length; i += UPDATE_BATCH_SIZE) {
        await prisma.$transaction(ops.slice(i, i + UPDATE_BATCH_SIZE));
    }
}

async function fillLensType() {
    const scanned = await prisma.equipmentItem.count({
        where: {
            category: "LNS",
            lens_type: null,
            status: "APPROVED",
            isPrivate: false,
        },
    });

    const anamorphic = await prisma.equipmentItem.updateMany({
        where: {
            category: "LNS",
            lens_type: null,
            status: "APPROVED",
            isPrivate: false,
            OR: [
                { squeeze: { not: null } },
                { subcategory: { contains: "anamorphic", mode: "insensitive" } },
                { name: { contains: "anamorphic", mode: "insensitive" } },
                { description: { contains: "anamorphic", mode: "insensitive" } },
                { description: { contains: "anamorf", mode: "insensitive" } },
            ],
        },
        data: { lens_type: "Anamorphic" },
    });

    const spherical = await prisma.equipmentItem.updateMany({
        where: {
            category: "LNS",
            lens_type: null,
            status: "APPROVED",
            isPrivate: false,
        },
        data: { lens_type: "Spherical" },
    });

    return { scanned, updated: anamorphic.count + spherical.count };
}

async function fillCameraTechnicalData() {
    const cameras = await prisma.equipmentItem.findMany({
        where: {
            category: "CAM",
            technicalData: null,
            status: "APPROVED",
            isPrivate: false,
        },
        select: {
            id: true,
            mount: true,
            sensor_size: true,
            resolution: true,
            dynamic_range: true,
            native_iso: true,
            weight_kg: true,
            power_draw_w: true,
            recordingFormats: true,
            specs_json: true,
        },
    });

    const ops: Prisma.PrismaPromise<unknown>[] = [];
    for (const item of cameras) {
        const payload: Record<string, unknown> = {};
        if (item.mount) payload["Mount"] = item.mount;
        if (item.sensor_size) payload["Sensor Size"] = item.sensor_size;
        if (item.resolution) payload["Max Resolution"] = item.resolution;
        if (item.dynamic_range) payload["Dynamic Range"] = item.dynamic_range;
        if (item.native_iso) payload["Native ISO"] = item.native_iso;
        if (item.weight_kg != null) payload["Weight (kg)"] = item.weight_kg;
        if (item.power_draw_w != null) payload["Power Draw (W)"] = item.power_draw_w;

        const recording = parseRecordingFormats(item.recordingFormats);
        if (recording.length > 0) {
            payload["Recording Modes"] = recording.length;
            const first = recording[0];
            if (typeof first.codec === "string") payload["Primary Codec"] = first.codec;
            if (typeof first.resolution === "string") payload["Primary Recording Resolution"] = first.resolution;
        }

        const specsObj = parseJsonObject(item.specs_json);
        if (specsObj) {
            if (!("Power Draw (W)" in payload)) {
                const watts = extractPowerDrawWatts(JSON.stringify(specsObj));
                if (watts != null) payload["Power Draw (W)"] = watts;
            }
        }

        if (Object.keys(payload).length === 0) continue;
        ops.push(prisma.equipmentItem.update({
            where: { id: item.id },
            data: { technicalData: JSON.stringify(payload) },
        }));
    }

    await executeInBatches(ops);

    return { scanned: cameras.length, updated: ops.length };
}

async function fillCameraRecordingFormats() {
    const cameras = await prisma.equipmentItem.findMany({
        where: {
            category: "CAM",
            recordingFormats: null,
            status: "APPROVED",
            isPrivate: false,
        },
        select: {
            id: true,
            model: true,
        },
    });

    const ops: Prisma.PrismaPromise<unknown>[] = [];
    for (const item of cameras) {
        const override = CAMERA_RECORDING_OVERRIDES_BY_MODEL[item.model];
        if (!override) continue;
        ops.push(
            prisma.equipmentItem.update({
                where: { id: item.id },
                data: { recordingFormats: JSON.stringify(override) },
            })
        );
    }

    await executeInBatches(ops);

    return { scanned: cameras.length, updated: ops.length };
}

async function fillLensTechnicalData() {
    const lenses = await prisma.equipmentItem.findMany({
        where: {
            category: "LNS",
            technicalData: null,
            status: "APPROVED",
            isPrivate: false,
        },
        select: {
            id: true,
            mount: true,
            coverage: true,
            focal_length: true,
            aperture: true,
            lens_type: true,
            image_circle_mm: true,
            close_focus_m: true,
            front_diameter_mm: true,
            squeeze: true,
            subcategory: true,
            description: true,
        },
    });

    const ops: Prisma.PrismaPromise<unknown>[] = [];
    for (const item of lenses) {
        const payload: Record<string, unknown> = {};
        const inferredLensType = item.lens_type || inferLensType(item.subcategory, item.description, item.squeeze);
        payload["Lens Type"] = inferredLensType;
        if (item.mount) payload["Mount"] = item.mount;
        if (item.coverage) payload["Coverage"] = item.coverage;
        if (item.focal_length) payload["Focal Length"] = item.focal_length;
        if (item.aperture) payload["Aperture"] = item.aperture;
        if (item.image_circle_mm != null) payload["Image Circle (mm)"] = item.image_circle_mm;
        if (item.close_focus_m != null) payload["Close Focus (m)"] = item.close_focus_m;
        if (item.front_diameter_mm != null) payload["Front Diameter (mm)"] = item.front_diameter_mm;
        if (item.squeeze) payload["Squeeze"] = item.squeeze;

        ops.push(prisma.equipmentItem.update({
            where: { id: item.id },
            data: { technicalData: JSON.stringify(payload) },
        }));
    }

    await executeInBatches(ops);

    return { scanned: lenses.length, updated: ops.length };
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

    const ops: Prisma.PrismaPromise<unknown>[] = [];
    for (const item of lenses) {
        const source = item.sensor_coverage;
        if (!source) continue;
        const normalized = normalizeCoverage(source);
        ops.push(prisma.equipmentItem.update({
            where: { id: item.id },
            data: { coverage: normalized },
        }));
    }

    await executeInBatches(ops);

    return { scanned: lenses.length, updated: ops.length };
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
            model: true,
            specs_json: true,
        },
    });

    let updatedFromSpecs = 0;
    let updatedFromOverrides = 0;
    const ops: Prisma.PrismaPromise<unknown>[] = [];
    for (const item of lighting) {
        const watts = extractPowerDrawWatts(item.specs_json);
        if (watts != null) {
            ops.push(prisma.equipmentItem.update({
                where: { id: item.id },
                data: { power_draw_w: watts },
            }));
            updatedFromSpecs += 1;
            continue;
        }

        const override = POWER_OVERRIDES_BY_MODEL[item.model];
        if (override == null) continue;
        ops.push(prisma.equipmentItem.update({
            where: { id: item.id },
            data: { power_draw_w: override },
        }));
        updatedFromOverrides += 1;
    }

    await executeInBatches(ops);

    return {
        scanned: lighting.length,
        updatedFromSpecs,
        updatedFromOverrides,
        updated: updatedFromSpecs + updatedFromOverrides,
    };
}

async function main() {
    const lensResult = await fillLensCoverage();
    const lensTypeResult = await fillLensType();
    const camRecordingResult = await fillCameraRecordingFormats();
    const camTechResult = await fillCameraTechnicalData();
    const lensTechResult = await fillLensTechnicalData();
    const lightResult = await fillLightingPower();

    console.log("Catalog gap fill complete.");
    console.log(
        `LNS coverage: updated ${lensResult.updated}/${lensResult.scanned} records from sensor_coverage`
    );
    console.log(
        `LNS lens_type: updated ${lensTypeResult.updated}/${lensTypeResult.scanned} records`
    );
    console.log(
        `CAM recordingFormats: updated ${camRecordingResult.updated}/${camRecordingResult.scanned} records`
    );
    console.log(
        `CAM technicalData: updated ${camTechResult.updated}/${camTechResult.scanned} records`
    );
    console.log(
        `LNS technicalData: updated ${lensTechResult.updated}/${lensTechResult.scanned} records`
    );
    console.log(
        `LIT power_draw_w: updated ${lightResult.updated}/${lightResult.scanned} records`
    );
    console.log(
        `LIT power_draw_w breakdown: specs_json=${lightResult.updatedFromSpecs}, overrides=${lightResult.updatedFromOverrides}`
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
