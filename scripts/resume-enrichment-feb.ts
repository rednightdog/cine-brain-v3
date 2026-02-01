
import { researchEquipment } from "../lib/catalog-research";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resumeEnrichment() {
    console.log("🚀 Starting February Enrichment Batch...");

    // Find items that are NOT AI researched yet
    const items = await prisma.equipmentItem.findMany({
        where: {
            isAiResearched: false,
            // Prioritize significant items
            OR: [
                { category: "CAM" },
                { category: "LNS" }
            ]
        },
        take: 30 // Start with a safe batch of 30 to see credits
    });

    console.log(`💎 Found ${items.length} items to enrich.`);

    for (const item of items) {
        try {
            console.log(`🔍 Enriching: ${item.name}...`);
            const specs = await researchEquipment(`${item.name} official technical specifications datasheet`, true);

            if (specs && specs.length > 0) {
                const refreshed = specs[0];

                await (prisma.equipmentItem.update as any)({
                    where: { id: item.id },
                    data: {
                        brand: refreshed.brand || item.brand,
                        model: refreshed.model || item.model,
                        name: `${refreshed.brand} ${refreshed.model}`.trim() || item.name,
                        subcategory: refreshed.subcategory || item.subcategory,
                        mount: refreshed.mount || item.mount,
                        sensor_size: refreshed.sensor_size || item.sensor_size,
                        weight_kg: refreshed.weight_kg || item.weight_kg,
                        front_diameter_mm: refreshed.front_diameter_mm || item.front_diameter_mm,
                        specs_json: JSON.stringify(refreshed),
                        isAiResearched: true,
                        isVerified: true,
                        status: "APPROVED"
                    }
                });
                console.log(`   ✨ ENRICHED: ${refreshed.brand} ${refreshed.model}`);
            }
        } catch (e: any) {
            console.error(`   ❌ ERROR enriching ${item.name}:`, e.message);
            if (e.message.includes("out of searches")) {
                console.log("🛑 Quota limit reached again. Stopping.");
                break;
            }
        }
    }

    // Cleanup names one last time for this batch
    console.log("🧹 Finalizing names...");
    await prisma.equipmentItem.updateMany({
        where: { name: { contains: "official technical" } },
        data: { name: { replace: { pattern: " official technical specifications datasheet", replacement: "" } } }
    });
}

resumeEnrichment().catch(console.error).finally(() => prisma.$disconnect());
