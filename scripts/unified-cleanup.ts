
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function unifiedCleanupFinal() {
    console.log("🚀 Starting Unified Master Cleanup & Grouping (V7.8 - Schema Correct)...");

    // 1. Reset Grouping
    console.log("♻️  Resetting groupings...");
    await prisma.equipmentItem.updateMany({ data: { parentId: null } });
    await prisma.equipmentItem.deleteMany({ where: { name: { contains: 'Set' }, isAiResearched: true } });
    console.log("✅ Grouping reset complete.");

    // 2. Deep Clean All Items
    console.log("🧹 Cleaning all items...");
    const items = await prisma.equipmentItem.findMany();

    const MAKERS = ["ARRI", "Sony", "RED", "Canon", "Blackmagic", "Panasonic", "Z Cam", "DJI", "GoPro", "Insta360", "Phantom"];
    const HOSTS = ["Alexa 35", "Alexa Mini LF", "Venice 2", "Burano", "FX6", "FX9", "V-Raptor", "Komodo", "C70", "C300", "URSA 12K", "Pyxis 6K", "Mark III", "Mark II", "Mark IV", "Alpha 7S", "LUMIX", "Pocket 6K", "Pocket 4K", "BURANO", "FX3", "FX30"];

    let fixedCount = 0;

    for (const item of items) {
        let newBrand = item.brand || "";
        let newName = item.name || "";
        let newModel = item.model || item.name || "";

        // Filter Logic
        if (item.category === 'FLT' || /Filter|Diopter|Black Mist|Pro Mist/i.test(newName)) {
            if (MAKERS.some(m => m.toLowerCase() === newBrand.toLowerCase() || newName.toLowerCase().includes(m.toLowerCase()))) {
                newBrand = /Hollywood/i.test(newName) ? "Schneider" : "Tiffen";
            }
        }

        const cleanStr = (s: string) => {
            if (!s) return "";
            let res = s.replace(/official technical.*|datasheet.*|technical specs.*|product info.*|undefined/gi, "")
                .replace(/\b(for|fits)\b/gi, "")
                .replace(/\s+/g, " ").trim();

            // Strip Hosts/Makers from Accessories
            if (item.category !== 'CAM') {
                [...MAKERS, ...HOSTS].forEach(k => {
                    const re = new RegExp(`\\b${k}\\b`, "gi");
                    res = res.replace(re, "");
                });
            }
            return res.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "").trim();
        }

        newName = cleanStr(newName);
        newModel = cleanStr(newModel);

        const destutterAndPrefix = (s: string, b: string) => {
            if (!s) return "";
            // Destutter
            const words = s.split(/\s+/);
            const unique = [];
            words.forEach(w => { if (unique.length === 0 || w.toLowerCase() !== unique[unique.length - 1].toLowerCase()) unique.push(w); });
            let res = unique.join(" ");

            if (b) {
                const bRe = new RegExp(`^${b}\\b`, 'i');
                while (bRe.test(res)) { res = res.replace(bRe, "").trim(); }
                res = `${b} ${res}`.trim();
            }
            return res;
        }

        newName = destutterAndPrefix(newName, newBrand);
        newModel = destutterAndPrefix(newModel, newBrand);

        if (newName !== item.name || newModel !== item.model || newBrand !== item.brand) {
            try {
                await prisma.equipmentItem.update({
                    where: { id: item.id },
                    data: { name: newName, model: newModel, brand: newBrand }
                });
                fixedCount++;
            } catch (e: any) {
                if (e.code === 'P2002') await prisma.equipmentItem.delete({ where: { id: item.id } }).catch(() => { });
            }
        }
    }
    console.log(`✅ Cleaned ${fixedCount} items.`);

    // 3. Regroup Lenses
    console.log("📦 Regrouping lenses...");
    const lenses = await prisma.equipmentItem.findMany({ where: { category: "LNS", parentId: null } });
    const groups = new Map<string, typeof lenses>();

    lenses.forEach(lens => {
        let modelSeries = lens.model
            .replace(/\b\d+mm\b/gi, '')
            .replace(/\s*T\d+(\.\d+)?\s*/gi, '')
            .replace(/\s*f\/\d+(\.\d+)?\s*/gi, '')
            .replace(/\s+/g, ' ').trim();

        const bRe = new RegExp(`^${lens.brand}\\b`, 'i');
        while (bRe.test(modelSeries)) { modelSeries = modelSeries.replace(bRe, "").trim(); }

        const key = `${lens.brand} ${modelSeries}`.trim();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(lens);
    });

    let sets = 0;
    for (const [key, items] of groups.entries()) {
        if (items.length > 1) {
            const parent = await prisma.equipmentItem.create({
                data: {
                    name: `${key} Set`,
                    brand: items[0].brand,
                    model: `${key.replace(items[0].brand, '').trim()} Set`,
                    category: "LNS",
                    subcategory: items[0].subcategory === 'Anamorphic' ? 'Anamorphic Set' : 'Prime Set',
                    description: `Professional lens set containing ${items.length} units.`,
                    daily_rate_est: Math.round(items.reduce((acc, i) => acc + (i.daily_rate_est || 0), 0) * 0.8),
                    isAiResearched: true,
                    status: "APPROVED"
                }
            });
            for (const item of items) {
                await prisma.equipmentItem.update({ where: { id: item.id }, data: { parentId: parent.id } });
            }
            sets++;
        }
    }
    console.log(`🏁 Unified Process Complete. Created ${sets} sets.`);
}

unifiedCleanupFinal().catch(console.error).finally(() => prisma.$disconnect());
