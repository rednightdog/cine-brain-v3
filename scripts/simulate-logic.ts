import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const isCameraBody = (item: any) => {
    if (!item || item.category !== "CAM") return false;
    if (item.subcategory === "Bodies") return true;
    const name = (item.name || "").toLowerCase();
    const bodyKeywords = [
        "sony", "venice", "arri", "alexa", "red", "komodo", "raptor", "camera", "body",
        "blackmagic", "ursa", "fx3", "fx6", "fx9", "c70", "c300", "c500", "a7s", "a7r", "lumix", "gh5", "s1h"
    ];
    return bodyKeywords.some(k => name.includes(k));
};

async function run() {
    try {
        const catalog: any[] = await prisma.$queryRaw`SELECT * FROM "EquipmentItem" WHERE status = 'APPROVED'`;

        const testCameras = catalog.filter(isCameraBody).slice(0, 5);

        for (const hostItem of testCameras) {
            console.log(`\nTesting: ${hostItem.brand} ${hostItem.model} (${hostItem.name})`);

            const hostBrand = (hostItem.brand || "").toLowerCase();
            const hostModel = (hostItem.model || "").toLowerCase();
            const hostName = `${hostItem.brand} ${hostItem.model}`.toLowerCase();
            const hostSlug = (hostItem.model || hostItem.name).toLowerCase();

            const suggestions = catalog.filter(c => {
                if (c.id === hostItem.id) return false;
                if (!['SUP', 'DIT', 'COM', 'FLT', 'GRP'].includes(c.category)) return false;

                if (c.category === 'FLT') {
                    const lowName = (c.name || "").toLowerCase();
                    const isEssential = lowName.includes('nd') || lowName.includes('pola') || lowName.includes('polariz') || lowName.includes('linear');
                    if (!isEssential) return false;
                }

                try {
                    const specs = c.specs_json ? JSON.parse(c.specs_json) : {};

                    if (specs.compatibility && Array.isArray(specs.compatibility)) {
                        const hasMatch = specs.compatibility.some((tag: string) => {
                            const lowTag = tag.toLowerCase();
                            return hostName.includes(lowTag) || hostSlug.includes(lowTag) || lowTag === 'universal' || (hostBrand && lowTag.includes(hostBrand) && lowTag.length > 4);
                        });
                        if (hasMatch) return true;
                    }

                    if (hostBrand && c.brand && c.brand.toLowerCase() === hostBrand) {
                        const sub = (c.subcategory || "").toLowerCase();
                        if (sub.includes('media') || sub.includes('batter') || sub.includes('accessory')) return true;
                    }

                    const lowName = (c.name || "").toLowerCase();
                    const isSupport = ['SUP', 'GRP'].includes(c.category);
                    const essentialKeywords = [
                        'baseplate', 'bridge plate', 'quick release', 'dovetail',
                        'vct-14', 'top handle', 'cage', 'rod clamp', 'matte box', 'follow focus',
                        'power cable', 'd-tap', 'battery plate', 'media reader', 'viewfinder cable'
                    ];
                    if (isSupport && essentialKeywords.some(key => lowName.includes(key))) return true;

                } catch (e) { return false; }
                return false;
            });

            console.log(`- Found ${suggestions.length} suggestions.`);
            if (suggestions.length > 0) {
                console.log(`- Sample: ${suggestions[0].name}`);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
