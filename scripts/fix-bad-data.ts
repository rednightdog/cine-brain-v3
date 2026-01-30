
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning up bad AI data...");

    // Delete items that are categorized as CAM but have lens keywords or are Generic
    const result = await prisma.equipmentItem.deleteMany({
        where: {
            isAIGenerated: true,
            category: 'CAM',
            OR: [
                { name: { contains: 'Laowa' } },
                { name: { contains: 'Cooke' } },
                { name: { contains: 'Generic' } },
                { model: { contains: 'mm' } } // Catch "35mm" etc if hidden in model
            ]
        }
    });

    console.log(`Deleted ${result.count} incorrectly categorized items.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
