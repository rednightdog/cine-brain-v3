
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Spec Standardization...");

    // 1. CAMERAS: Standardize Sensor Size
    const SIZE_MAP = [
        { from: 'Full Frame', to: 'FF' },
        { from: 'Super 35', to: 'S35' },
        { from: 'S35mm', to: 'S35' },
        { from: 'Large Format', to: 'LF' },
    ];

    for (const m of SIZE_MAP) {
        // Fix sensor_size
        await prisma.equipmentItem.updateMany({
            where: { category: 'CAM', sensor_size: { contains: m.from } },
            data: { sensor_size: m.to }
        });
    }

    // 2. LENSES: Populate Coverage based on Series/Name
    const LENS_RULES = [
        { keyword: 'S7/i', coverage: 'LF' },
        { keyword: 'Supreme Prime', coverage: 'FF' },
        { keyword: 'Signature Prime', coverage: 'LF' },
        { keyword: 'Signature Zoom', coverage: 'LF' },
        { keyword: 'Master Prime', coverage: 'S35' },
        { keyword: 'Ultra Prime', coverage: 'S35' },
        { keyword: 'Cooke S4', coverage: 'S35' },
        { keyword: 'Cooke S5', coverage: 'S35' },
        { keyword: 'Mini S4', coverage: 'S35' },
        { keyword: 'Panchro', coverage: 'S35' },
        { keyword: 'Super Speed', coverage: 'S35' },
        { keyword: 'Standard Speed', coverage: 'S35' },
        { keyword: 'Hawk', coverage: 'S35' }, // Most Hawks are S35 anamorphic
        { keyword: 'Atlas', coverage: 'S35' },
        { keyword: 'Laowa', coverage: 'S35' }, // Defaulting Nanomorph to S35 (common)
        { keyword: 'Sony', coverage: 'FF' }, // Sony lenses usually FF
        { keyword: 'Canon CN-E', coverage: 'FF' },
    ];

    for (const rule of LENS_RULES) {
        const res = await prisma.equipmentItem.updateMany({
            where: {
                category: 'LNS',
                name: { contains: rule.keyword },
                coverage: null // Only update if missing
            },
            data: { coverage: rule.coverage }
        });
        if (res.count > 0) console.log(`Set coverage ${rule.coverage} for ${res.count} items matching "${rule.keyword}"`);
    }

    // 3. LENSES: Standardize Subcategory (Type)
    // Ensure "Anamorphic" key is present
    await prisma.equipmentItem.updateMany({
        where: { category: 'LNS', name: { contains: 'Anamorphic' }, subcategory: { not: 'Anamorphic' } },
        data: { subcategory: 'Anamorphic' }
    });
    // Default others to Spherical if not Anamorphic
    await prisma.equipmentItem.updateMany({
        where: { category: 'LNS', subcategory: { not: 'Anamorphic' }, lens_type: null },
        data: { lens_type: 'Spherical' }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
