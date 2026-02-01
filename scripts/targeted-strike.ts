
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function definitiveCleanup() {
    console.log("💎 Starting Definitive Cleanup (V7.13)...");

    const targets = await prisma.equipmentItem.findMany({
        where: {
            OR: [
                { name: { contains: "official" } },
                { name: { contains: "Cooke Cooke" } },
                { name: { contains: "Sony Sony" } },
                { name: { contains: "Tiffen Tiffen" } },
                { name: { contains: "ARRI ARRI" } }
            ]
        }
    });

    console.log(`Found ${targets.length} stubborn targets.`);

    const MAKERS = ["ARRI", "Sony", "RED", "Canon", "Blackmagic", "Panasonic", "Z Cam", "DJI", "GoPro", "Insta360", "Phantom"];
    const HOSTS = ["Alexa 35", "Alexa Mini LF", "Venice 2", "Burano", "FX6", "FX9", "V-Raptor", "Komodo", "C70", "C300", "URSA 12K", "Pyxis 6K", "Mark III", "Mark II", "Mark IV", "Alpha 7S", "LUMIX", "Pocket 6K", "Pocket 4K", "BURANO", "FX3", "FX30", "Mini LF", "Alexa", "Venice", "Raptor", "Komodo-X", "URSA", "Pocket"];
    const JUNK = ["official technical specifications", "official technical", "technical specifications", "technical specs", "official", "datasheet", "product info", "undefined"];

    for (const item of targets) {
        let n = item.name;
        let b = item.brand;
        let m = item.model || item.name;

        // Force Tiffen for Filters
        if (/Diopter|Filter|Black Mist|Pro Mist/i.test(n) || item.category === 'FLT') {
            b = "Tiffen";
        }

        const stripJunk = (s: string) => {
            let res = s;
            JUNK.forEach(j => { res = res.replace(new RegExp(j, "gi"), ""); });
            return res.trim();
        };

        const stripHosts = (s: string) => {
            if (item.category === 'CAM' && !JUNK.some(j => s.toLowerCase().includes(j))) return s;
            let res = s;
            [...HOSTS, ...MAKERS].forEach(h => {
                if (h.toLowerCase() !== b.toLowerCase()) {
                    res = res.replace(new RegExp(`\\b${h}\\b`, "gi"), "");
                }
            });
            return res.trim();
        };

        n = stripJunk(n);
        n = stripHosts(n);
        m = stripJunk(m);
        m = stripHosts(m);

        const destutter = (s: string, brand: string) => {
            let res = s.replace(/[^a-zA-Z0-9.\-\/ +]/g, " ").replace(/\s+/g, " ").trim();
            const words = res.split(/\s+/);
            const unique = [];
            words.forEach(w => { if (unique.length === 0 || w.toLowerCase() !== unique[unique.length - 1].toLowerCase()) unique.push(w); });
            res = unique.join(" ");

            if (brand) {
                const bRe = new RegExp(`^${brand}\\b`, 'i');
                while (bRe.test(res)) { res = res.replace(bRe, "").trim(); }
                res = `${brand} ${res}`.trim();
            }
            return res;
        };

        const finalN = destutter(n, b);
        const finalM = destutter(m, b);

        if (finalN !== item.name || finalM !== item.model || b !== item.brand) {
            console.log(`✅ [FIX] "${item.name}" -> "${finalN}"`);
            try {
                await prisma.equipmentItem.update({
                    where: { id: item.id },
                    data: { name: finalN, model: finalM, brand: b }
                });
            } catch (e: any) {
                if (e.code === 'P2002') {
                    console.log(`🗑️ [DEL] Duplicate: ${finalN}`);
                    await prisma.equipmentItem.delete({ where: { id: item.id } }).catch(() => { });
                }
            }
        }
    }
    console.log("🏁 Definitive Cleanup Complete.");
}

definitiveCleanup().catch(console.error).finally(() => prisma.$disconnect());
