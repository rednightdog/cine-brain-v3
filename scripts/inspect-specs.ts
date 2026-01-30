
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- CAMERA SAMPLES ---");
    const cams = await prisma.equipmentItem.findMany({
        where: { category: 'CAM' },
        take: 5,
        select: { name: true, subcategory: true, sensor_size: true }
    });
    console.table(cams);

    console.log("\n--- LENS SAMPLES ---");
    const lns = await prisma.equipmentItem.findMany({
        where: { category: 'LNS' },
        take: 5,
        select: { name: true, subcategory: true, coverage: true, lens_type: true }
    });
    console.table(lns);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
