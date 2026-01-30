
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Category Standardization...");

    // Map of DB Value -> UI Value
    const MAPPINGS = [
        { from: 'Camera', to: 'CAM' },
        { from: 'Cameras', to: 'CAM' },
        { from: 'Lens', to: 'LNS' },
        { from: 'Lenses', to: 'LNS' },
        { from: 'Lighting', to: 'LGT' },
        { from: 'Light', to: 'LGT' },
        { from: 'Support', to: 'SUP' },
        { from: 'Filter', to: 'FLT' },
        { from: 'Filters', to: 'FLT' },
        { from: 'Monitor', to: 'MON' },
        { from: 'Audio', to: 'AUD' },
        { from: 'Power', to: 'PWR' },
        { from: 'Media', to: 'MED' },
    ];

    for (const m of MAPPINGS) {
        const res = await prisma.equipmentItem.updateMany({
            where: { category: m.from as any },
            data: { category: m.to as any }
        });
        if (res.count > 0) {
            console.log(`Updated ${res.count} items from '${m.from}' to '${m.to}'`);
        }
    }

    // Final verify
    const categories = await prisma.equipmentItem.groupBy({
        by: ['category'],
        _count: { category: true }
    });
    console.log("Final Categories:");
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
