
import { researchEquipment } from "../lib/catalog-research";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GAP_TARGETS = [
    // --- FILTERS (4x5.65) ---
    "Tiffen 4x5.65 Full Spectrum IRND 0.3",
    "Tiffen 4x5.65 Full Spectrum IRND 0.6",
    "Tiffen 4x5.65 Full Spectrum IRND 0.9",
    "Tiffen 4x5.65 Full Spectrum IRND 1.2",
    "Tiffen 4x5.65 Full Spectrum IRND 1.5",
    "Tiffen 4x5.65 Full Spectrum IRND 1.8",
    "Tiffen 4x5.65 Full Spectrum IRND 2.1",
    "Schneider 4x5.65 Hollywood Black Magic 1/8",
    "Schneider 4x5.65 Hollywood Black Magic 1/4",
    "Schneider 4x5.65 Hollywood Black Magic 1/2",
    "Schneider 4x5.65 Hollywood Black Magic 1",
    "Arri Rotatable Polarizer 4x5.65",
    "Revar Cine Rota-Tray 4x5.65 Circular Polarizer",
    "Lindsey Optics 4x5.65 Brilliant² Rota-Pol",

    // --- DIT & MEDIA ---
    "Sony AXS-AR3 Thunderbolt 3 Memory Card Reader",
    "Codex Compact Drive Dock (Thunderbolt 3)",
    "SanDisk Professional PRO-READER CFexpress",
    "Sony SBAC-US30 SxS Memory Card USB 3.0 Reader",
    "RED MINI-MAG Station USB 3.1",
    "Samsung T7 Shield 4TB Portable SSD",
    "SanDisk Extreme Pro 512GB CFexpress Type B",
    "Sony 512GB AXS-A512S48 Memory Card",
    "Arri Codex Compact Drive 1TB",
    "Inovativ Voyager 36 EVO Equipment Cart",
    "Ecoflow Delta Pro Portable Power Station",

    // --- COMMS & AUDIO ---
    "Riedel Bolero Wireless Beltpack",
    "Hollyland Solidcom C1 Pro-6S System",
    "Clear-Com FreeSpeak II Beltpack",
    "EarTec UL5S UltraLITE 5-Person System",
    "Tentacle Sync E mkII Timecode Generator",
    "Denecke TS-C Compact Digital Slate",
    "Ambient Recording ACN-CL Lockit Timecode",
    "Motorola XT460 Two-Way Radio",
    "Sennheiser G4 Wireless Lavalier Set",
    "Zoom F8n Pro Field Recorder",

    // --- GRIP & SUPPORT ---
    "Dana Dolly Universal Rental Kit",
    "Easyrig Vario 5 with STABIL G2",
    "Easyrig Minimax with Quick Release",
    "Ready Rig GS VEGA Support System",
    "Ronford-Baker Atlas 7 Fluid Head",
    "OConnor 2575D Fluid Head",
    "Sachtler Video 20 S1 Fluid Head",
    "Miller ArrowX 7 Fluid Head",
    "Manfrotto 504X Fluid Video Head",
    "Matthews 40 inch C-Stand with Turtle Base",
    "American Grip 3-Riser Combo Stand",
    "Kupo Master C-Stand with Turtle Base",
    "Apple Box Full",
    "Apple Box Half"
];

async function mineGaps() {
    console.log(`⛏️ Starting GAP MINING for ${GAP_TARGETS.length} specific items...`);

    let success = 0;
    let errors = 0;

    for (const itemName of GAP_TARGETS) {
        try {
            console.log(`[${success + errors + 1}/${GAP_TARGETS.length}] 🔭 Mining Gap: ${itemName}...`);
            await new Promise(r => setTimeout(r, 1000)); // Politeness delay

            const specs = await researchEquipment(`${itemName} official technical specifications datasheet`, true);

            if (specs && specs.length > 0) {
                const data = specs[0];

                // Determine category mapping if not clear
                let category = 'SUP'; // Default to Support
                let subcategory = 'Grip';

                if (itemName.includes("ND") || itemName.includes("Polarizer") || itemName.includes("Black Magic")) {
                    category = 'FLT';
                    subcategory = 'Filters';
                } else if (itemName.includes("Reader") || itemName.includes("Drive") || itemName.includes("Card") || itemName.includes("SSD") || itemName.includes("Cart")) {
                    category = 'DIT';
                    subcategory = 'Media & DIT';
                } else if (itemName.includes("Intercom") || itemName.includes("Radio") || itemName.includes("Beltpack") || itemName.includes("Slate") || itemName.includes("Sync")) {
                    category = 'COM';
                    subcategory = 'Comms';
                } else if (itemName.includes("Head") || itemName.includes("Stand") || itemName.includes("Dolly") || itemName.includes("Easyrig")) {
                    category = 'GRP';
                    subcategory = 'Grip';
                }

                // Check if item exists to avoid Unique Constraint errors with upsert
                const existing = await prisma.equipmentItem.findFirst({
                    where: {
                        name: `${data.brand} ${data.model}`.trim()
                    }
                });

                if (existing) {
                    await prisma.equipmentItem.update({
                        where: { id: existing.id },
                        data: {
                            specs_json: JSON.stringify(data),
                            isAiResearched: true
                        }
                    });
                    console.log(`   🔄 UPDATED: ${data.brand} ${data.model} [${category}]`);
                } else {
                    await prisma.equipmentItem.create({
                        data: {
                            name: `${data.brand} ${data.model}`.trim(),
                            brand: data.brand || "Generic",
                            model: data.model || itemName,
                            category: category,
                            subcategory: subcategory,
                            description: data.description || "High-end cinema equipment.",
                            specs_json: JSON.stringify(data),
                            isAiResearched: true,
                            isVerified: true,
                            status: "APPROVED",
                            daily_rate_est: 0 // Default value
                        }
                    });
                    console.log(`   ✅ CREATED: ${data.brand} ${data.model} [${category}]`);
                }
                success++;
            } else {
                console.log(`   ⚠️ No data found for gap item: ${itemName}`);
                errors++;
            }

        } catch (e: any) {
            console.error(`   ❌ Failed on ${itemName}:`, e.message);
            errors++;
        }
    }

    console.log(`🏁 Gap Mining Complete. Success: ${success}, Errors: ${errors}`);
}

mineGaps().catch(console.error).finally(() => prisma.$disconnect());
