
import { PrismaClient } from "@prisma/client";
import { researchEquipment } from "../lib/catalog-research";
import 'dotenv/config';

const prisma = new PrismaClient();

async function enrichLenses() {
    console.log("🔭 Starting LENS DEEP DIVE...");

    // 1. Fetch all lenses that are AI researched but might miss deep specs
    // Or just fetch ALL lenses to be sure.
    const lenses = await prisma.equipmentItem.findMany({
        where: {
            category: "LNS",
            // Optional: Filter for ones missing front_diameter or close_focus if we want to be selective
            // OR just re-run all for "Deep Dive" status
        }
    });

    console.log(`Found ${lenses.length} lenses to analyze.`);

    let tools = 0;

    // Process in batches
    for (const lens of lenses) {
        // Skip if it already has good data (simple check)
        const currentSpecs = lens.specs_json ? JSON.parse(lens.specs_json) : {};
        if (currentSpecs.front_diameter_mm && currentSpecs.close_focus_m) {
            console.log(`   ✅ Skipping (Deep Data Exists): ${lens.name}`);
            continue;
        }

        console.log(`[${tools + 1}/${lenses.length}] 🔬 Deep Research: ${lens.name}...`);

        try {
            await new Promise(r => setTimeout(r, 800)); // Politeness

            // Force "Lens Spec" focused query
            const deepQuery = `${lens.name} front diameter close focus weight technical specs`;
            const results = await researchEquipment(deepQuery, true);

            if (results && results.length > 0) {
                const deepData = results[0];

                // Merge with existing
                const mergedSpecs = {
                    ...currentSpecs,
                    ...deepData, // Overwrite with new deep data
                    // Ensure core fields are preserved if deepData misses them (unlikely for these specific fields)
                };

                // Update DB columns for quick access + JSON
                await prisma.equipmentItem.update({
                    where: { id: lens.id },
                    data: {
                        specs_json: JSON.stringify(mergedSpecs),
                        front_diameter_mm: deepData.front_diameter_mm || lens.front_diameter_mm,
                        close_focus_m: deepData.close_focus_m || lens.close_focus_m,
                        weight_kg: deepData.weight_kg || lens.weight_kg,
                        // Ensure category is correct
                        category: 'LNS',
                        subcategory: deepData.lens_type === 'Anamorphic' ? 'Anamorphic' : (lens.name.includes('Zoom') ? 'Zoom' : 'Prime')
                    }
                });
                console.log(`   ✨ ENRICHED: ${lens.name} (FD: ${deepData.front_diameter_mm}mm, CF: ${deepData.close_focus_m}m)`);
                tools++;
            }
        } catch (e) {
            console.error(`   ❌ Failed: ${lens.name}`, e);
        }
    }

    console.log(`🏁 Lens Deep Dive Complete. Upgraded ${tools} lenses.`);
}

enrichLenses().catch(console.error).finally(() => prisma.$disconnect());
