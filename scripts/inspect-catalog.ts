import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
    try {
        const cameras = await prisma.equipmentItem.findMany({
            where: { category: 'CAM' },
            take: 20
        });

        console.log("Cameras in catalog:");
        cameras.forEach(c => {
            console.log(`- [${c.id}] ${c.brand} ${c.model} (${c.name}) | Cat: ${c.category} | Sub: ${c.subcategory}`);
        });

        const accessories = await prisma.equipmentItem.findMany({
            where: {
                category: { in: ['SUP', 'FLT', 'GRP', 'DIT', 'COM'] }
            },
            take: 20
        });

        console.log("\nSample accessories for filtering check:");
        accessories.forEach(a => {
            console.log(`- ${a.name} | Cat: ${a.category} | Sub: ${a.subcategory}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
