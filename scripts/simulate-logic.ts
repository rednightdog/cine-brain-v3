import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function simulate() {
    console.log("🚀 Simulating Smart Suggestion Logic with LIVE DATA...");

    try {
        // 1. Fetch some approved cameras
        const cameras = await prisma.equipmentItem.findMany({
            where: {
                category: 'CAM',
                status: 'APPROVED'
            },
            take: 5
        });

        if (cameras.length === 0) {
            console.log("❌ No approved cameras found in DB!");
            // Fallback to any cameras if none are approved
            const anyCameras = await prisma.equipmentItem.findMany({
                where: { category: 'CAM' },
                take: 5
            });
            if (anyCameras.length > 0) {
                console.log("⚠️ Found non-approved cameras, testing with those...");
                cameras.push(...anyCameras);
            } else {
                return;
            }
        }

        // 2. Fetch all approved items from catalog
        const catalog = await prisma.equipmentItem.findMany({
            where: { status: 'APPROVED' }
        });

        console.log(`📊 Catalog Size: ${catalog.length} items.`);

        for (const hostItem of cameras) {
            console.log(`\n--- Testing for: ${hostItem.brand} ${hostItem.name} (ID: ${hostItem.id}) ---`);

            const hostLowBrand = (hostItem.brand || "").toLowerCase();
            const hostLowModel = (hostItem.model || hostItem.name).toLowerCase();
            const hostFullName = `${hostItem.brand} ${hostItem.model || hostItem.name}`.toLowerCase();

            const suggestions = catalog.filter(item => {
                // Avoid suggesting the host itself
                if (item.id === hostItem.id) return false;

                // We only suggest non-camera items (mostly SUP, COM, LNS etc)
                if (item.category === 'CAM') return false;

                const lowName = item.name.toLowerCase();
                const lowBrand = (item.brand || "").toLowerCase();

                // --- CATEGORY FILTERING ---
                // ND/Pola Filter Rule
                if (item.category === 'LIT') {
                    const isND = (item.subcategory === 'Filters' || lowName.includes('filter')) && (lowName.includes('nd') || lowName.includes('neutral density'));
                    const isPola = (item.subcategory === 'Filters' || lowName.includes('filter')) && (lowName.includes('pola') || lowName.includes('polar'));
                    if (!(isND || isPola)) return false;
                }

                // --- MATCHING LOGIC ---

                // 1. Explicit Compatibility Tags
                let hasExplicitTag = false;
                if (item.specs_json) {
                    try {
                        const specs = typeof item.specs_json === 'string' ? JSON.parse(item.specs_json) : item.specs_json;
                        const compatibility = specs.compatibility;
                        if (Array.isArray(compatibility)) {
                            hasExplicitTag = compatibility.some((tag: string) => {
                                const lowTag = tag.toLowerCase();
                                return hostFullName.includes(lowTag) || hostLowModel.includes(lowTag) || lowTag === 'universal';
                            });
                        } else if (typeof compatibility === 'string') {
                            const lowTag = compatibility.toLowerCase();
                            hasExplicitTag = hostFullName.includes(lowTag) || hostLowModel.includes(lowTag) || lowTag === 'universal';
                        }
                    } catch (e) {
                        // ignore parse errors
                    }
                }

                // 2. Brand Matching & Essential Keywords
                const isSameBrandAccessory = (item.category === 'SUP' || item.category === 'COM') &&
                    lowBrand === hostLowBrand && hostLowBrand.length > 2;

                const essentialKeywords = [
                    'cage', 'handle', 'plate', 'battery', 'media', 'card', 'reader',
                    'cable', 'power', 'mount', 'rod', 'follow focus', 'matte box',
                    'viewfinder', 'monitor', 'bracket', 'rig'
                ];
                const isEssential = essentialKeywords.some(rev => lowName.includes(rev));

                return hasExplicitTag || (isSameBrandAccessory && isEssential);
            });

            console.log(`✨ Found ${suggestions.length} suggestions.`);
            if (suggestions.length > 0) {
                suggestions.slice(0, 5).forEach(s => console.log(`   - [${s.category}] ${s.brand} ${s.name}`));
            } else {
                console.log("   ❌ No suggestions found for this item.");
            }
        }
    } catch (err) {
        console.error("Critical error in simulation:", err);
    } finally {
        await prisma.$disconnect();
    }
}

simulate();
