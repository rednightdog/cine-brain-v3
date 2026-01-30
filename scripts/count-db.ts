
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.equipmentItem.count();
    const categories = await prisma.equipmentItem.groupBy({
        by: ['category'],
        _count: {
            category: true
        }
    });

    console.log(`Total Items: ${count}`);
    console.table(categories.map(c => ({ Category: c.category, Count: c._count.category })));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
