import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
    try {
        const query = 'Baseplate';
        const items: any[] = await prisma.$queryRaw`SELECT name, category, specs_json FROM "EquipmentItem" WHERE specs_json LIKE '%Baseplate%'`;
        console.log(`Found ${items.length} items matching "${query}"`);
        items.forEach(i => {
            console.log(`- ${i.name} [${i.category}]`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
