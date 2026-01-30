
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.kit.count();
    const items = await prisma.kitItem.count();
    const equipment = await prisma.equipmentItem.count();

    console.log(`Projects (Kits): ${projects}`);
    console.log(`Project Items (KitItems): ${items}`);
    console.log(`Catalog Equipment: ${equipment}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
