
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function cleanV7_6() {
    console.log("🧹 Starting Cleanup V7.6 (The Final Polisher)...");

    const items = await prisma.equipmentItem.findMany();
    console.log(`Evaluating ${items.length} items.`);

    const CAMERA_MAKERS = ["ARRI", "Sony", "RED", "Canon", "Blackmagic", "Panasonic", "Z Cam", "DJI", "GoPro", "Insta360", "Phantom"];
    const HOST_KEYWORDS = [
        "Alexa 35", "Alexa Mini LF", "Venice 2", "Burano", "FX6", "FX9", "V-Raptor", "Komodo", "C70", "C300",
        "URSA 12K", "Pyxis 6K", "Mark III", "Mark II", "Mark IV", "Alpha 7S", "LUMIX", "Pocket 6K", "Pocket 4K",
        "Mini LF", "Alexa", "Venice", "Raptor", "Komodo-X", "BURANO", "FX3", "FX30", "A7SIII", "A7S III", "URSA", "Pocket"
    ];

    const BRANDS = [...CAMERA_MAKERS, "Tiffen", "Schneider", "Teradek", "SmallHD", "Wooden Camera", "Bright Tangerine", "Aputure", "Amaran", "Nanlite", "Cooke", "Zeiss", "Leitz", "Angenieux", "Fujinon", "Sigma", "Tokina", "Hawk", "Laowa", "Codex"];

    let fixedCount = 0;
    let deletedCount = 0;

    for (const item of items) {
        let newName = item.name || "";
        let newModel = item.model || item.name || "";
        let newSeries = item.series || "";
        let newBrand = item.brand || "";

        // 1. Force Brand Fix for Filters
        if (item.category === 'FLT' || /Filter|Diopter|Black Mist|Pro Mist|Glimmerglass|Hollywood/i.test(newName)) {
            if (CAMERA_MAKERS.some(b => b.toLowerCase() === newBrand.toLowerCase() || newName.toLowerCase().includes(b.toLowerCase()))) {
                newBrand = /Hollywood/i.test(newName) ? "Schneider" : "Tiffen";
            }
        }

        const stripHostInfo = (s: string) => {
            if (!s) return "";
            let res = s.replace(/official technical.*|datasheet.*|technical specs.*|product info.*|undefined/gi, "")
                .replace(/\b(for|fits)\b/gi, "")
                .replace(/\s+/g, " ").trim();

            // Strip brands and hosts if not a camera
            if (item.category !== 'CAM') {
                [...CAMERA_MAKERS, ...HOST_KEYWORDS].forEach(k => {
                    const re = new RegExp(`\\b${k}\\b`, "gi");
                    res = res.replace(re, "");
                });
            }
            return res.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "").trim();
        }

        newName = stripHostInfo(newName);
        newModel = stripHostInfo(newModel);
        newSeries = stripHostInfo(newSeries);

        // 2. De-Stutter & Single Brand Prefix
        const cleanAndPrefix = (s: string, b: string) => {
            if (!s) return "";
            // Destutter words
            const words = s.split(/\s+/);
            const uniqueWords: string[] = [];
            words.forEach(w => {
                if (uniqueWords.length === 0 || w.toLowerCase() !== uniqueWords[uniqueWords.length - 1].toLowerCase()) {
                    uniqueWords.push(w);
                }
            });
            let res = uniqueWords.join(" ");

            if (b) {
                // Remove existing brand prefix to avoid redundancy
                const brandPrefixRegex = new RegExp(`^${b}\\b`, 'i');
                while (brandPrefixRegex.test(res)) {
                    res = res.replace(brandPrefixRegex, "").trim();
                }
                res = `${b} ${res}`.trim();
            }
            return res;
        }

        newName = cleanAndPrefix(newName, newBrand);
        newModel = cleanAndPrefix(newModel, newBrand);
        newSeries = cleanAndPrefix(newSeries, newBrand);

        // 3. Final Polish
        const polish = (s: string) => s.replace(/\s+/g, " ").trim();
        newName = polish(newName);
        newModel = polish(newModel);
        newSeries = polish(newSeries);

        // Sync accessory model to name if it's too disparate/noisy
        if (item.category !== 'CAM' && newModel.length > newName.length + 15) {
            newModel = newName;
        }

        if (newName !== item.name || newModel !== item.model || newBrand !== item.brand || newSeries !== item.series) {
            try {
                await prisma.equipmentItem.update({
                    where: { id: item.id },
                    data: {
                        name: newName,
                        model: newModel,
                        brand: newBrand,
                        series: newSeries
                    }
                });
                fixedCount++;
            } catch (e: any) {
                if (e.code === 'P2002') {
                    // Duplicate clean item exists
                    await prisma.equipmentItem.delete({ where: { id: item.id } }).catch(() => { });
                    deletedCount++;
                }
            }
        }
    }

    console.log(`✅ Cleanup Complete.`);
    console.log(`✨ Items Fixed: ${fixedCount}`);
    console.log(`🗑️ Duplicates Removed: ${deletedCount}`);
}

cleanV7_6().catch(console.error).finally(() => prisma.$disconnect());
