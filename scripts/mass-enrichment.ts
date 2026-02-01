
import { researchEquipment } from "../lib/catalog-research";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function massEnrichment() {
    console.log("🌊 Starting MASS ENRICHMENT (1000 Search Mode)...");

    // Find ALL items that are NOT AI researched yet
    const items = await prisma.equipmentItem.findMany({
        where: { isAiResearched: false },
        orderBy: { category: 'asc' }
    });

    console.log(`💎 Found ${items.length} items to enrich. This might take a while...`);

    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
        try {
            console.log(`[${successCount + errorCount + 1}/${items.length}] 🔍 Researching: ${item.name}...`);

            // Add a small delay to prevent rate limits
            await new Promise(resolve => setTimeout(resolve, 500));

            const specs = await researchEquipment(`${item.name} official technical specifications datasheet`, true);

            if (specs && specs.length > 0) {
                const refreshed = specs[0];

                try {
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
                    successCount++;
                } catch (dbErr: any) {
                    if (dbErr.message.includes("Unique constraint")) {
                        console.log(`   ⏭️ SKIPPING (Unique Constraint): ${refreshed.brand} ${refreshed.model}`);
                        // Mark as researched anyway so we don't keep trying
                        await prisma.equipmentItem.update({ where: { id: item.id }, data: { isAiResearched: true } });
                    } else {
                        throw dbErr;
                    }
                }
            } else {
                console.log(`   ⚠️ No data found for: ${item.name}`);
                errorCount++;
            }
        } catch (e: any) {
            console.error(`   ❌ ERROR enriching ${item.name}:`, e.message);
            errorCount++;
            if (e.message.includes("out of searches") || e.message.includes("429")) {
                console.log("🛑 Quota limit reached. Stopping and cleaning up.");
                break;
            }
        }

        // Mark the script's progress
        if (successCount % 10 === 0) {
            console.log(`[PROGRESS] Success: ${successCount}, Errors: ${errorCount}`);
        }
    }

    console.log("🌊 Final cleanup will be handled by cleanup-names.ts script.");

    console.log(`✅ Mass Enrichment Finished! Success: ${successCount}, Errors/Empty: ${errorCount}`);
}

massEnrichment().catch(console.error).finally(() => prisma.$disconnect());
