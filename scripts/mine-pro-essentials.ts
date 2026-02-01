
import { researchEquipment } from "../lib/catalog-research";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRO_ESSENTIALS = [
    // Heads
    "OConnor 2575D Fluid Head",
    "Sachtler Cine 30 Fluid Head",
    "OConnor 120EX Fluid Head",
    "Miller Skyline 90",
    "Cartoni Maxima 50",

    // Matteboxes
    "ARRI LMB 4x5 Mattebox",
    "Bright Tangerine Strummer DNA",
    "ARRI MB-14 Studio Mattebox",
    "Tilta Mirage Mattebox",

    // Follow Focus
    "ARRI WCU-4 Wireless Lens Control",
    "ARRI Hi-5 Hand Unit",
    "Preston FI+Z HU4",
    "Teradek RT FIZ Kit",

    // Wireless Video
    "Teradek Bolt 6 XT 750",
    "Teradek Bolt 4K LT 1500",
    "SmallHD Cine 7 with Bolt 6",

    // Power
    "Anton Bauer Titon 150 V-Mount",
    "Core SWX Hypercore Neo 150",
    "Bebob V290 Micro V-Mount",

    // Support
    "Easyrig Vario 5 with STABIL G3",
    "Ronford Baker Heavy Duty Tripod",
    "Sachtler Flowtech 100 MS"
];

async function mineProEssentials() {
    console.log("🚀 Starting Targeted Pro Essentials Mining...");

    for (const productName of PRO_ESSENTIALS) {
        console.log(`\n🔎 Researching Industry Standard: ${productName}...`);
        try {
            const specs = await researchEquipment(productName);

            if (specs && specs.length > 0) {
                const item = specs[0];
                item.category = "SUP";

                // Determine subcategory based on name if AI didn't provide a good one
                const nameLower = productName.toLowerCase();
                if (nameLower.includes("head")) item.subcategory = "Head";
                else if (nameLower.includes("mattebox")) item.subcategory = "Mattebox";
                else if (nameLower.includes("focus") || nameLower.includes("fiz")) item.subcategory = "Follow Focus";
                else if (nameLower.includes("bolt") || nameLower.includes("wireless")) item.subcategory = "Wireless Video";
                else if (nameLower.includes("mount") || nameLower.includes("battery")) item.subcategory = "Power";
                else if (nameLower.includes("tripod") || nameLower.includes("legs")) item.subcategory = "Tripod";
                else if (nameLower.includes("easyrig") || nameLower.includes("vest")) item.subcategory = "Vest";
                else item.subcategory = item.subcategory || "Other";

                console.log(`   ✨ Found: ${item.brand} ${item.model} (${item.subcategory})`);

                const safeId = `pro-${item.brand.toLowerCase()}-${item.model.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

                await prisma.equipmentItem.upsert({
                    where: { id: safeId },
                    update: {
                        name: `${item.brand} ${item.model}`,
                        brand: item.brand,
                        model: item.model,
                        category: "SUP",
                        subcategory: item.subcategory,
                        description: item.description || "",
                        weight_kg: item.weight_kg,
                        mount: item.mount,
                        specs_json: JSON.stringify(item),
                        daily_rate_est: 75 // Pro gear higher default
                    },
                    create: {
                        id: safeId,
                        name: `${item.brand} ${item.model}`,
                        brand: item.brand,
                        model: item.model,
                        category: "SUP",
                        subcategory: item.subcategory,
                        description: item.description || "",
                        weight_kg: item.weight_kg,
                        mount: item.mount,
                        specs_json: JSON.stringify(item),
                        daily_rate_est: 75
                    }
                });
                console.log(`   ✅ Saved: ${item.brand} ${item.model}`);
            }
        } catch (e: any) {
            console.error(`   ❌ Error processing ${productName}:`, e.message);
        }
    }

    console.log("\n🏁 Pro Essentials Mining Complete!");
}

mineProEssentials().catch(console.error).finally(() => prisma.$disconnect());
