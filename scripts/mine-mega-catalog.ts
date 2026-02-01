
import { researchEquipment } from "../lib/catalog-research";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MEGA_CATALOG = [
    // --- CAMERAS (CAM) ---
    "ARRI Alexa 35", "ARRI Alexa Mini LF", "ARRI Alexa LF", "ARRI Alexa 65",
    "Sony Venice 2 8K", "Sony Venice 2 6K", "Sony Burano", "Sony FX9", "Sony FX6", "Sony FX3",
    "RED V-RAPTOR XL [X] 8K VV", "RED V-RAPTOR 8K S35", "RED KOMODO-X", "RED KOMODO 6K",
    "Panavision Millennium DXL2", "Blackmagic URSA Cine 12K", "Blackmagic PYXIS 6K",
    "Canon EOS C500 Mark II", "Canon EOS C300 Mark III", "Canon EOS C70",

    // --- LENSES (LNS) ---
    "ARRI Signature Prime 47mm T1.8", "ARRI Master Prime 35mm T1.3", "ARRI Ultra Prime 50mm T1.9",
    "Cooke S8/i FF 50mm T1.4", "Cooke S7/i FF 32mm T2.0", "Cooke Anamorphic/i SF 65mm",
    "Zeiss Supreme Prime 35mm T1.5", "Zeiss Master Anamorphic 50mm T1.9", "Zeiss CP.3 85mm T2.1",
    "Leitz Summilux-C 35mm T1.4", "Leitz Summicron-C 50mm T2.0", "Leitz M 0.8 35mm f/1.4",
    "Angenieux Optimo Ultra 12x", "Angenieux EZ-1 30-90mm", "Angenieux Optimo Prime 40mm",
    "Canon CN-E 35mm T1.3 L F", "Canon Sumire Prime 50mm T1.3",
    "Fujinon Premista 28-100mm T2.9", "Fujinon Cabrio 19-90mm T2.9",
    "Sigma Cine 35mm T1.5 FF", "Tokina Vista 50mm T1.5", "Laowa Nanomorph 35mm T2.4",

    // --- SUPPORT (SUP) - HEADS & TRIPODS ---
    "OConnor 2575D Fluid Head", "OConnor 120EX Fluid Head", "OConnor 1030D",
    "Sachtler Cine 30 HD", "Sachtler Video 18 S2", "Sachtler Cine 150",
    "Cartoni Maxima 40", "Cartoni Lambda 25", "Miller Skyline 90",
    "Ronford Baker Atlas 0.4", "Ronford Baker Heavy Duty Tall Legs",
    "Sachtler Flowtech 100", "Sachtler Flowtech 75",

    // --- SUPPORT (SUP) - MATTEBOXES & FILTERS ---
    "ARRI LMB 4x5 Basic Set", "ARRI MB-20 System", "ARRI MB-14 6.6x6.6",
    "Bright Tangerine Misfit Atom", "Bright Tangerine Strummer DNA",
    "Chrosziel MB 565 Double Stage", "Tilta MB-T12", "Wooden Camera Zip Box",
    "Tiffen 4x5.65 Black Pro-Mist 1/4", "Schneider Hollywood Black Magic 1/8",

    // --- SUPPORT (SUP) - FOLLOW FOCUS & FIZ ---
    "ARRI WCU-4 Wireless Unit", "ARRI Hi-5 Hand Unit", "ARRI SXU-1",
    "Preston FI+Z HU4", "Preston MDR-4", "Teradek RT FIZ Kit",
    "Tilta Nucleus-M Kit", "Bartech Focus Device",

    // --- SUPPORT (SUP) - WIRELESS & MONITORING ---
    "Teradek Bolt 6 XT 750", "Teradek Bolt 6 LT 1500", "Teradek Serv 4K",
    "Vaxis Storm 3000 DV", "Hollyland Mars 4K",
    "SmallHD Cine 13 4K", "SmallHD 703 UltraBright", "SmallHD Indie 7",
    "TVLogic LVM-171A", "TVLogic VFM-055A", "Atomos Shogun Ultra",

    // --- SUPPORT (SUP) - POWER & MEDIA ---
    "Anton Bauer Titon 150", "Anton Bauer Dionic XT 90", "Core SWX Hypercore Neo 150",
    "Bebob V150 Micro", "IDX Duo-C198", "Hawk-Woods VL-MX90",
    "Codex Compact Drive 1TB", "Sony AXS-A1TS66", "SanDisk CFexpress 512GB",
    "RED PRO CFexpress 2TB", "Sony Tough SD 128GB",

    // --- SUPPORT (SUP) - RIGGING & VESTS ---
    "Easyrig Vario 5", "Easyrig Minimax", "Flowcine Serene",
    "Bright Tangerine Drumstix 19mm", "Wooden Camera Shoulder Rig v3",
    "Shape Sony Venice Cage", "Tilta Alexa 35 Rig", "Vocas Sony FX6 Rig"
];

async function megaMining() {
    console.log(`🚀 Starting HIGH QUALITY MEGA MINING for ${MEGA_CATALOG.length} items...`);
    let successCount = 0;

    for (const productName of MEGA_CATALOG) {
        console.log(`\n💎 [${successCount + 1}/${MEGA_CATALOG.length}] Researching: ${productName}...`);
        try {
            const specs = await researchEquipment(productName, true);

            if (specs && specs.length > 0) {
                const item = specs[0];

                // Smart Category Correction
                const nameLower = productName.toLowerCase();
                if (nameLower.includes("camera") || nameLower.includes("venice") || nameLower.includes("alexa") || nameLower.includes("red ") || nameLower.includes("ursa") || nameLower.includes("komodo") || nameLower.includes("burano")) {
                    item.category = "CAM";
                } else if (nameLower.includes("mm ") || nameLower.includes("lens") || nameLower.includes("prime") || nameLower.includes("zoom") || nameLower.includes("anamorphic")) {
                    item.category = "LNS";
                } else {
                    item.category = "SUP";
                }

                // Subcategory Logic
                if (item.category === "SUP") {
                    if (nameLower.includes("head") || nameLower.includes("atlas") || nameLower.includes("maxima")) item.subcategory = "Head";
                    else if (nameLower.includes("tripod") || nameLower.includes("legs") || nameLower.includes("flowtech")) item.subcategory = "Tripod";
                    else if (nameLower.includes("mattebox") || nameLower.includes("mb-") || nameLower.includes("lmb-") || nameLower.includes("zip box")) item.subcategory = "Mattebox";
                    else if (nameLower.includes("focus") || nameLower.includes("fiz") || nameLower.includes("nucleus") || nameLower.includes("wcu") || nameLower.includes("hi-5")) item.subcategory = "Follow Focus";
                    else if (nameLower.includes("bolt") || nameLower.includes("vaxis") || nameLower.includes("wireless") || nameLower.includes("mars")) item.subcategory = "Wireless Video";
                    else if (nameLower.includes("mount") || nameLower.includes("battery") || nameLower.includes("titon") || nameLower.includes("hypercore")) item.subcategory = "Power";
                    else if (nameLower.includes("monitor") || nameLower.includes("cine ") || nameLower.includes("tvlogic") || nameLower.includes("atomos")) item.subcategory = "Monitors";
                    else if (nameLower.includes("filter") || nameLower.includes("nd ") || nameLower.includes("pro-mist")) item.subcategory = "Filters";
                    else if (nameLower.includes("drive") || nameLower.includes("memory") || nameLower.includes("card") || nameLower.includes("axs") || nameLower.includes("cfexpress")) item.subcategory = "Media";
                    else if (nameLower.includes("rig") || nameLower.includes("cage") || nameLower.includes("rods") || nameLower.includes("shoulder")) item.subcategory = "Rigging";
                    else if (nameLower.includes("easyrig") || nameLower.includes("vest")) item.subcategory = "Vest";
                } else if (item.category === "CAM") {
                    item.subcategory = nameLower.includes("mini") || nameLower.includes("fx3") || nameLower.includes("komodo") ? "Compact" : "Bodies";
                    if (nameLower.includes(" 65") || nameLower.includes(" lf") || nameLower.includes(" vv")) item.subcategory = "Large Format";
                } else if (item.category === "LNS") {
                    item.subcategory = nameLower.includes("zoom") ? "Zoom" : "Prime";
                    if (nameLower.includes("anamorphic")) item.subcategory = "Anamorphic";
                }

                const itemBrand = item.brand || productName.split(' ')[0];
                const itemModel = item.model || productName;
                const safeId = `mega-${itemBrand.toLowerCase()}-${itemModel.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

                // --- ROBUST UPSERT ---
                const existing = await prisma.equipmentItem.findFirst({
                    where: { brand: itemBrand, model: itemModel, name: `${itemBrand} ${itemModel}` }
                });

                const targetId = existing ? existing.id : safeId;

                await prisma.equipmentItem.upsert({
                    where: { id: targetId },
                    update: {
                        name: `${itemBrand} ${itemModel}`,
                        brand: itemBrand,
                        model: itemModel,
                        category: item.category,
                        subcategory: item.subcategory || "Other",
                        description: item.description || "",
                        weight_kg: item.weight_kg,
                        mount: item.mount,
                        specs_json: JSON.stringify(item),
                        daily_rate_est: item.category === "CAM" ? 500 : item.category === "LNS" ? 150 : 75
                    },
                    create: {
                        id: targetId,
                        name: `${itemBrand} ${itemModel}`,
                        brand: itemBrand,
                        model: itemModel,
                        category: item.category,
                        subcategory: item.subcategory || "Other",
                        description: item.description || "",
                        weight_kg: item.weight_kg,
                        mount: item.mount,
                        specs_json: JSON.stringify(item),
                        daily_rate_est: item.category === "CAM" ? 500 : item.category === "LNS" ? 150 : 75
                    }
                });
                console.log(`   ✅ SUCCESS: ${itemBrand} ${itemModel} -> ${item.category}:${item.subcategory}`);
                successCount++;
            }
        } catch (e: any) {
            console.error(`   ❌ ERROR processing ${productName}:`, e.message);
        }
    }

    console.log(`\n🏁 HIGH QUALITY MEGA MINING COMPLETE! Total Saved: ${successCount}`);
}

megaMining().catch(console.error).finally(() => prisma.$disconnect());
