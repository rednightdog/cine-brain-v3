
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupCategories() {
    console.log("🧹 Starting Categorization Cleanup...");

    const items = await prisma.equipmentItem.findMany({
        where: { isAiResearched: true }
    });

    let updated = 0;

    for (const item of items) {
        let newCat = item.category;
        let newSub = item.subcategory;
        let changed = false;

        const name = item.name.toLowerCase();
        const model = item.model.toLowerCase();
        const combined = `${name} ${model}`;

        // 1. FILTERS (FLT)
        if (combined.includes("filter") || combined.includes("polarizer") || combined.includes("diopter") || combined.includes("mist") || combined.includes("nd 0")) {
            if (newCat !== "FLT") {
                newCat = "FLT";
                newSub = "Filters";
                changed = true;
            }
        }

        // 2. MEDIA & DIT (DIT)
        else if (combined.includes("reader") || combined.includes("cfexpress") || combined.includes("sd card") || combined.includes("ssd") || combined.includes("drive") || combined.includes("cfast")) {
            if (newCat !== "DIT") {
                newCat = "DIT";
                newSub = "Media";
                changed = true;
            }
        }

        // 3. COMMS & WIRELESS (COM)
        else if (combined.includes("teradek") || combined.includes("wireless") || combined.includes("transmitter") || combined.includes("receiver") || combined.includes("antenna") || combined.includes("intercom")) {
            if (newCat !== "COM") {
                newCat = "COM";
                newSub = "Wireless";
                changed = true;
            }
        }

        // 4. POWER (SUP)
        else if (combined.includes("battery") || combined.includes("charger") || combined.includes("power") || combined.includes("cable") || combined.includes("splitter") || combined.includes("distribution")) {
            if (newCat !== "SUP" || newSub !== "Power") {
                newCat = "SUP";
                newSub = "Power";
                changed = true;
            }
        }

        // 5. GRIP & RIGGING (GRP)
        else if (combined.includes("rod") || combined.includes("plate") || combined.includes("cage") || combined.includes("handle") || combined.includes("bracket") || combined.includes("clamp") || combined.includes("mount")) {
            // Exclude "Lens Mount" if it's a camera part? No, usually ecosystem accessories are plates.
            if (newCat !== "GRP") {
                newCat = "GRP";
                newSub = "Rigging";
                changed = true;
            }
        }

        // 6. SUPPORT & TRIPODS (GRP)
        else if (combined.includes("tripod") || combined.includes("fluid head") || combined.includes("dolly") || combined.includes("easyrig") || combined.includes("ready rig") || combined.includes("sachtler") || combined.includes("oconnor")) {
            if (newCat !== "GRP" || newSub !== "Support") {
                newCat = "GRP";
                newSub = "Support";
                changed = true;
            }
        }

        if (changed) {
            await prisma.equipmentItem.update({
                where: { id: item.id },
                data: { category: newCat, subcategory: newSub }
            });
            console.log(`   ✨ MOVED: ${item.name} -> [${newCat} / ${newSub}]`);
            updated++;
        }
    }

    console.log(`✅ Cleanup Complete. Updated ${updated} items.`);
}

cleanupCategories().catch(console.error).finally(() => prisma.$disconnect());
