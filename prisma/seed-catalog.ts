import { PrismaClient } from "@prisma/client";
import { equipmentData } from "../lib/seed-data";
import { seedLenses } from "./seed-lenses";
import { seedVantageLenses } from "./seed-vantage";
import { seedSupportItems } from "./seed-support";
import { seedLighting } from "./seed-lighting";
import { seedVintageLenses } from "./seed-vintage";

const prisma = new PrismaClient();

function mapCategory(category: string): string {
    const c = category.toLowerCase();
    if (c.startsWith("cam")) return "CAM";
    if (c.startsWith("lens")) return "LNS";
    if (c.startsWith("light")) return "LIT";
    return "SUP";
}

function mapSubcategory(category: string, subcategory?: string): string | undefined {
    const c = category.toLowerCase();
    if (c === "filter") return "Filters";
    if (c === "monitor") return "Monitors";
    return subcategory || undefined;
}

async function upsertBaseCatalog() {
    let processed = 0;

    for (const item of equipmentData) {
        const specs = item.specs;
        const data = {
            id: item.id,
            name: item.name,
            brand: item.brand,
            model: item.model,
            category: mapCategory(item.category as string),
            subcategory: mapSubcategory(item.category as string, item.subcategory),
            description: item.description,
            daily_rate_est: item.daily_rate_est,
            imageUrl: item.image_url,
            mount: specs.mount as string | undefined,
            weight_kg: specs.weight_kg,
            resolution: specs.resolution,
            sensor_size: specs.sensor_coverage || specs.sensor_size,
            sensor_type: specs.sensor_type,
            image_circle_mm: specs.image_circle_mm,
            focal_length: specs.focal_length,
            aperture: specs.aperture,
            power_draw_w: specs.power_draw_w,
            close_focus_m: specs.close_focus_m,
            front_diameter_mm: specs.front_diameter_mm,
            length_mm: specs.length_mm,
            squeeze: specs.squeeze,
            coverage: specs.sensor_coverage,
            sensor_coverage: specs.sensor_coverage,
            recordingFormats: specs.recording_formats ? JSON.stringify(specs.recording_formats) : null,
            technicalData: item.technical_data ? JSON.stringify(item.technical_data) : null,
            labMetrics: item.lab_metrics ? JSON.stringify(item.lab_metrics) : null,
        };

        await prisma.equipmentItem.upsert({
            where: { id: item.id },
            update: data,
            create: data,
        });

        processed += 1;
        if (processed % 200 === 0) {
            console.log(`Base catalog progress: ${processed}/${equipmentData.length}`);
        }
    }

    console.log(`Base catalog upsert complete: ${processed} items`);
}

async function main() {
    console.log("Start safe catalog upsert...");
    console.log("This mode does NOT delete kit/projects/users.");

    await upsertBaseCatalog();
    await seedLighting();
    await seedLenses();
    await seedVantageLenses();
    await seedVintageLenses();
    await seedSupportItems();

    console.log("Safe catalog upsert finished.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Safe catalog upsert failed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
