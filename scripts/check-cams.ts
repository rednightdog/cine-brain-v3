import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
    try {
        const cams: any[] = await prisma.$queryRaw`SELECT name, category, subcategory FROM "EquipmentItem" WHERE category = 'CAM' LIMIT 20`;
        console.log("CAM category samples:", cams);

        // Check if there are any items with category 'CAMERA' instead of 'CAM'
        const cameras: any[] = await prisma.$queryRaw`SELECT count(*) FROM "EquipmentItem" WHERE category = 'CAMERA'`;
        console.log("Items with category 'CAMERA':", cameras);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
