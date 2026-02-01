import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
    try {
        const categories = ['SUP', 'FLT', 'GRP', 'DIT', 'COM'];
        for (const cat of categories) {
            const sample = await prisma.$queryRawUnsafe(`SELECT name FROM "EquipmentItem" WHERE category = '${cat}' LIMIT 5`);
            console.log(`${cat} samples:`, (sample as any[]).map(s => s.name));
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
