import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
    try {
        const counts: any[] = await prisma.$queryRaw`SELECT status, count(*) as count FROM "EquipmentItem" GROUP BY status`;
        console.log("Status counts:", counts);

        const categories: any[] = await prisma.$queryRaw`SELECT category, count(*) as count FROM "EquipmentItem" group by category`;
        console.log("Category counts:", categories);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
