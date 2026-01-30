import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateEquipment() {
    console.log('🔄 Starting equipment migration...\n');

    // 1. Update Cameras with sensor size subcategories
    console.log('📹 Updating cameras...');

    // Sony Venice 2 8K - Full Frame
    await prisma.equipmentItem.updateMany({
        where: { name: 'Sony Venice 2 8K' },
        data: {
            subcategory: 'FF',
            sensor_size: 'Full Frame',
            mount: 'E-Mount'
        }
    });
    console.log('  ✓ Sony Venice 2 8K → FF');

    // Arri Alexa 35 - S35
    await prisma.equipmentItem.updateMany({
        where: { name: 'Arri Alexa 35' },
        data: {
            subcategory: 'S35',
            sensor_size: 'S35',
            mount: 'LPL'
        }
    });
    console.log('  ✓ Arri Alexa 35 → S35');

    // Sony FX6 - Full Frame
    await prisma.equipmentItem.updateMany({
        where: { name: 'Sony FX6' },
        data: {
            subcategory: 'FF',
            sensor_size: 'Full Frame',
            mount: 'E-Mount'
        }
    });
    console.log('  ✓ Sony FX6 → FF');

    // 2. Update Lenses with type and coverage
    console.log('\n🔍 Updating lenses...');

    const masterPrimes = [
        'Arri Master Prime 18mm',
        'Arri Master Prime 25mm',
        'Arri Master Prime 35mm',
        'Arri Master Prime 50mm',
        'Arri Master Prime 75mm'
    ];

    for (const name of masterPrimes) {
        await prisma.equipmentItem.updateMany({
            where: { name },
            data: {
                category: 'LNS',
                subcategory: 'Spherical',
                coverage: 'S35',
                lens_type: 'Spherical',
                mount: 'PL',
                front_diameter_mm: 110
            }
        });
        console.log(`  ✓ ${name} → Spherical / S35 coverage`);
    }

    // 3. Update Support Equipment
    console.log('\n🛠️  Updating support equipment...');

    await prisma.equipmentItem.updateMany({
        where: { name: 'Arri WCU-4 Set' },
        data: {
            subcategory: 'Wireless Control'
        }
    });
    console.log('  ✓ Arri WCU-4 Set → Wireless Control');

    await prisma.equipmentItem.updateMany({
        where: { name: 'SmallHD 703 Bolt' },
        data: {
            subcategory: 'Monitors'
        }
    });
    console.log('  ✓ SmallHD 703 Bolt → Monitors');

    await prisma.equipmentItem.updateMany({
        where: { name: 'OConnor 2575D' },
        data: {
            subcategory: 'Accessories'
        }
    });
    console.log('  ✓ OConnor 2575D → Accessories');

    // 4. Update Rialto accessories to SUP category
    console.log('\n📦 Updating accessories...');

    await prisma.equipmentItem.updateMany({
        where: { name: 'Sony Venice Rialto 2' },
        data: {
            category: 'SUP',
            subcategory: 'Accessories'
        }
    });
    console.log('  ✓ Sony Venice Rialto 2 → SUP/Accessories');

    const rialtoCables = [
        'Rialto Cable 3m (Standard)',
        'Rialto Cable 12m (Long)'
    ];

    for (const name of rialtoCables) {
        await prisma.equipmentItem.updateMany({
            where: { name },
            data: {
                category: 'SUP',
                subcategory: 'Accessories'
            }
        });
        console.log(`  ✓ ${name} → SUP/Accessories`);
    }

    console.log('\n✅ Migration complete!');

    // Verify
    console.log('\n📊 Verification:');
    const cameras = await prisma.equipmentItem.findMany({
        where: { category: 'CAM' },
        select: { name: true, subcategory: true, sensor_size: true }
    });
    console.log('\nCameras:', cameras);

    const lenses = await prisma.equipmentItem.findMany({
        where: { category: 'LNS' },
        select: { name: true, subcategory: true, coverage: true, lens_type: true }
    });
    console.log('\nLenses:', lenses);

    const support = await prisma.equipmentItem.findMany({
        where: { category: 'SUP' },
        select: { name: true, subcategory: true }
    });
    console.log('\nSupport:', support);
}

migrateEquipment()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
