
import { researchEquipment } from "../lib/catalog-research";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config'; // Explicitly load .env

const prisma = new PrismaClient();

// --- PERMUTATION DATA (EXPANDED FOR 500+) ---
const ECOSYSTEM_HOSTS = [
    "ARRI Alexa 35", "ARRI Alexa Mini LF", "Sony Venice 2", "Sony Burano",
    "Sony FX6", "Sony FX9", "RED V-Raptor", "RED Komodo", "Canon C70", "Canon C300 Mark III",
    "Blackmagic URSA 12K", "Blackmagic Pyxis 6K"
];

const UNIVERSAL_CATEGORIES = [
    {
        type: "Power",
        queries: [
            "Power Cable to 3-pin XLR", "Power Cable to 4-pin XLR", "D-Tap to 2-pin Lemo",
            "Gold Mount Battery Plate", "V-Mount Battery Plate", "B-Mount Battery Plate",
            "Shark Fin Battery Plate", "Hot Swap Plate", "Block Battery Cable",
            "P-Tap Splitter", "2-pin Lemo Splitter", "Gold Mount to V-Mount Adapter",
            "AC Power Supply", "Intelligent Battery Charger"
        ]
    },
    {
        type: "Support",
        queries: [
            "Cage System", "Top Handle", "Baseplate 15mm LWS", "Bridge Plate 19mm Studio",
            "Dovetail Plate 12 inch", "Handgrip System", "Shoulder Pad", "Side Bracket",
            "Monitor Bracket", "EVF Mount", "Quick Release Plate", "Rod Clamp 15mm",
            "Rod Clamp 19mm", "Lens Support 15mm", "Lens Support 19mm"
        ]
    },
    {
        type: "Media & Data",
        queries: [
            "Media Card Reader", "High Speed Card", "SSD Module", "Data Cable",
            "CFast 2.0 Reader", "SD Card UHS-II V90", "CFexpress Type B Reader",
            "USB-C Tether Cable"
        ]
    },
    {
        type: "Optical",
        queries: [
            "Matte Box Adapter Ring", "Clamp On Ring 95mm", "Clamp On Ring 114mm",
            "Diopter +1", "Diopter +2", "Linear Polarizer", "Clear Filter",
            "Variable ND Filter", "Black Mist 1/8", "Black Mist 1/4", "Streak Filter Blue"
        ]
    }
];

// --- GENERATOR ---
function generateTargets() {
    let targets: { host: string, query: string }[] = [];

    ECOSYSTEM_HOSTS.forEach(host => {
        UNIVERSAL_CATEGORIES.forEach(cat => {
            cat.queries.forEach(q => {
                targets.push({
                    host: host,
                    // e.g. "ARRI Alexa 35 Cage System"
                    query: `${host} ${q}`
                });
            });
        });
    });

    // Add unique/specialized items (Universal)
    const specialized = [
        "Teradek Bolt 4K LT 750", "Teradek Bolt 6 XT 1500", "SmallHD 703 UltraBright", "SmallHD Cine 7",
        "OConnor 1030D Fluid Head", "Sachtler Aktiv8", "Easyrig Vario 5", "Ready Rig GS",
        "Tilta Nucleus-M Kit", "Arri WCU-4 Hand Unit", "Arri cforce mini RF",
        "Inovativ Voyager 36 Cart", "Adicam Standard Cart", "Robocup Holster"
    ];

    specialized.forEach(s => targets.push({ host: "Universal", query: s }));

    return targets;
}

// --- MAIN MINING LOOP ---
async function mineEcosystem() {
    // LOG KEY CHECK
    console.log(`🔑 CHECKING API KEY...`);
    console.log(`   SERPER_API_KEY: ${process.env.SERPER_API_KEY ? "FOUND (Starts with " + process.env.SERPER_API_KEY.substring(0, 4) + "...)" : "MISSING"}`);

    const allTargets = generateTargets();
    console.log(`🌿 ECOSYSTEM PERMUTATION GENERATED: ${allTargets.length} TARGETS!`);
    console.log(`🚀 STARTING MASSIVE MINING (Operation 800 Redux)...`);

    let success = 0;
    let errors = 0;
    let skipped = 0;

    // Shuffle array for better variety if stopped early
    const shuffled = allTargets.sort(() => Math.random() - 0.5);

    for (const target of shuffled) {
        try {
            console.log(`[${success + errors + skipped + 1}/${shuffled.length}] 🔬 Researching: ${target.query}...`);
            await new Promise(r => setTimeout(r, 600)); // Slightly faster 600ms

            const specs = await researchEquipment(`${target.query} official technical specifications`, true);

            if (specs && specs.length > 0) {
                const data = specs[0];

                // INFERRED COMPATIBILITY LOGIC
                let compatibility: string[] = [];
                if (target.host !== "Universal") {
                    compatibility.push(target.host);
                } else {
                    // Try to guess from name
                    if (target.query.includes("Teradek")) compatibility.push("Universal Wireless");
                    if (target.query.includes("SmallHD")) compatibility.push("Universal Monitor");
                }

                const enrichedSpecs = {
                    ...data,
                    compatibility: compatibility
                };

                await (prisma.equipmentItem.create as any)({
                    data: {
                        name: `${data.brand} ${data.model}`.trim(),
                        brand: data.brand || "Generic",
                        model: data.model || target.query,
                        category: "SUP",
                        subcategory: "Accessories",
                        description: data.description || `Accessory for ${target.host}`,
                        specs_json: JSON.stringify(enrichedSpecs),
                        isAiResearched: true,
                        isVerified: true,
                        status: "APPROVED",
                        daily_rate_est: 0
                    }
                });

                console.log(`   🔗 LINKED: ${data.brand} ${data.model}`);
                success++;
            } else {
                console.log(`   ⚠️ No data: ${target.query}`);
                errors++;
            }

        } catch (e: any) {
            if (e.message && e.message.includes("Unique constraint")) {
                console.log(`   ⏭️ SKIPPING (Exists): ${target.query}`);
                skipped++;
            } else {
                console.error(`   ❌ Failed on ${target.query}:`, e.message);
                errors++;
            }
        }
    }

    console.log(`🏁 Ecosystem Mining Complete. Success: ${success}, Skipped: ${skipped}, Errors: ${errors}`);
}

mineEcosystem().catch(console.error).finally(() => prisma.$disconnect());
