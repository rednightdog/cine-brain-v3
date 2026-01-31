
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const query = process.argv[2] || "Aras";
    console.log(`Searching for item with name containing: "${query}"...`);

    const items = await prisma.equipmentItem.findMany({
        where: {
            name: { contains: query, mode: 'insensitive' }
        }
    });

    console.log(`Found ${items.length} items:`);
    items.forEach(item => {
        console.log("------------------------------------------------");
        console.log(`ID: ${item.id}`);
        console.log(`Name: ${item.name}`);
        console.log(`Category: ${item.category}`);
        console.log(`Subcategory: "${item.subcategory}"`); // Quote to see whitespace
        console.log(`IsPrivate: ${item.isPrivate}`);
        console.log(`OwnerID: ${item.ownerId}`);
        console.log("------------------------------------------------");
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
