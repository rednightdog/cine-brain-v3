
import { researchEquipment } from "../lib/catalog-research";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function enrichCatalog() {
    console.log("🛠️ Starting High-Fidelity Catalog Enrichment...");

    // Find items that are "Generic" or missing key specs like weight or mount
    const itemsToEnrich = await prisma.equipmentItem.findMany({
        where: {
            OR: [
                { brand: "Generic" },
                { description: { contains: "Generic" } },
                { weight_kg: null },
                { category: "CAM", resolution: null }
            ],
            id: { startsWith: "mega-" } // Focus on the mega catalog items
        }
    });

    console.log(`🔍 Found ${itemsToEnrich.length} items requiring enrichment.`);

    for (const item of itemsToEnrich) {
        // Clean the query: remove "Generic" and "mega-" if they leaked in
        const cleanName = item.name.replace(/Generic/gi, "").replace(/mega-/gi, "").trim();
        console.log(`\n💎 Enriching: ${cleanName}...`);
        try {
            // Search query targeted at official specs
            const query = `${cleanName} official technical specifications datasheet`;
            const specs = await researchEquipment(query, true); // forceLive: true

            if (specs && specs.length > 0) {
                const refreshed = specs[0];

                await (prisma.equipmentItem.update as any)({
                    where: { id: item.id },
                    data: {
                        name: `${refreshed.brand} ${refreshed.model}`,
                        brand: refreshed.brand,
                        model: refreshed.model,
                        description: refreshed.description || item.description,
                        weight_kg: refreshed.weight_kg || item.weight_kg,
                        mount: refreshed.mount || item.mount,
                        resolution: refreshed.resolution,
                        sensor_size: refreshed.sensor_size,
                        dynamic_range: refreshed.dynamic_range,
                        native_iso: refreshed.native_iso,
                        t_stop_range: refreshed.t_stop_range,
                        close_focus_m: refreshed.close_focus_m,
                        front_diameter_mm: refreshed.front_diameter_mm,
                        payload_kg: refreshed.payload_kg,
                        specs_json: JSON.stringify(refreshed), // Full data backup
                        isAiResearched: true,
                        isVerified: true,
                        status: "APPROVED"
                    }
                });
                console.log(`   ✨ ENRICHED: ${refreshed.brand} ${refreshed.model}`);
            }
        } catch (e: any) {
            console.error(`   ❌ ERROR enriching ${item.name}:`, e.message);

            // Defensive Fallback: If DB push failed because columns are missing, retry without them
            if (e.message.includes("does not exist") || e.message.includes("Column")) {
                console.log("   🔄 Retrying with JSON storage only...");
                try {
                    const refreshed = (await researchEquipment(`${item.name} official specs`, true))[0];
                    await prisma.equipmentItem.update({
                        where: { id: item.id },
                        data: {
                            specs_json: JSON.stringify(refreshed),
                            isAiResearched: true,
                            isVerified: true
                        }
                    });
                    console.log(`   ✨ JSON ENRICHED: ${item.name}`);
                } catch (retryErr: any) {
                    console.error("   ❌ Fallback failed:", retryErr.message);
                }
            }
        }
    }

    console.log("\n🏁 Enrichment Complete!");
}

enrichCatalog().catch(console.error).finally(() => prisma.$disconnect());
