import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
    try {
        const items = await prisma.equipmentItem.findMany({
            where: {
                specs_json: { not: null }
            }
        });

        console.log(`Total items with specs_json: ${items.length}`);

        const withComp = items.filter(i => {
            try {
                const specs = JSON.parse(i.specs_json || "{}");
                return specs.compatibility && Array.isArray(specs.compatibility);
            } catch (e) { return false; }
        });

        console.log(`Items with compatibility tags: ${withComp.length}`);

        withComp.forEach(i => {
            const specs = JSON.parse(i.specs_json!);
            console.log(`- ${i.name} [${i.category}]: ${specs.compatibility.join(', ')}`);
        });

    } catch (e) {
        // console.error(e);
        // Fallback to queryRaw if column error persists
        const rawItems: any[] = await prisma.$queryRaw`SELECT name, category, specs_json FROM "EquipmentItem" WHERE specs_json IS NOT NULL`;
        console.log(`[RAW] Total items with specs_json: ${rawItems.length}`);
        const withComp = rawItems.filter(i => {
            try {
                const specs = JSON.parse(i.specs_json || "{}");
                return specs.compatibility && Array.isArray(specs.compatibility);
            } catch (e) { return false; }
        });
        console.log(`[RAW] Items with compatibility tags: ${withComp.length}`);
    } finally {
        await prisma.$disconnect();
    }
}

run();
