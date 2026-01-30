
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Standardize 'Lenses' -> 'Lens'
    const result = await prisma.equipmentItem.updateMany({
        where: { category: 'Lenses' as any },
        data: { category: 'Lens' as any }
    });
    console.log(`Standardized ${result.count} items from 'Lenses' to 'Lens'.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
