
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Seeding Compatibility Test Scenarios ---');

    // 1. Create a Test Project
    const project = await prisma.kit.create({
        data: {
            name: '⚠️ Compatibility Test Playground',
            productionCo: 'Test Labs',
            director: 'QA Engineer',
            cinematographer: 'You',
        }
    });

    console.log(`Created Project: ${project.name} (${project.id})`);

    // --- Scenario 1: Mount Mismatch (Alexa 35 [LPL] + Cooke S4 [PL]) ---
    // Camera A matches
    const alexa35 = await prisma.equipmentItem.findFirst({ where: { name: { contains: 'Alexa 35' } } });
    const cookeS4 = await prisma.equipmentItem.findFirst({ where: { name: { contains: 'Cooke S4' }, category: 'LNS' } });

    if (alexa35 && cookeS4) {
        console.log(`DEBUG: Alexa 35 Mount: ${alexa35.mount}`);
        console.log(`DEBUG: Cooke S4 Mount: ${cookeS4.mount}`);
        console.log(`DEBUG: Alexa 35 Category: ${alexa35.category}`);
        console.log(`DEBUG: Cooke S4 Category: ${cookeS4.category}`);

        await prisma.kitItem.create({
            data: { kitId: project.id, equipmentId: alexa35.id, assignedCam: 'A', quantity: 1 }
        });
        await prisma.kitItem.create({
            data: { kitId: project.id, equipmentId: cookeS4.id, assignedCam: 'A', quantity: 1 }
        });
        console.log('✅ Scenario 1 seeded: Alexa 35 (LPL) + Cooke S4 (PL)');
    } else {
        console.error('❌ Scenario 1 FAILED: Could not find Alexa 35 or Cooke S4');
    }

    // --- Scenario 2: Coverage Mismatch (Venice 2 [FF] + Ultra Prime [S35]) ---
    // Camera B matches
    const venice2 = await prisma.equipmentItem.findFirst({ where: { name: { contains: 'Venice 2' } } });
    const ultraPrime = await prisma.equipmentItem.findFirst({ where: { name: { contains: 'Ultra Prime' }, category: 'LNS' } });

    if (venice2 && ultraPrime) {
        await prisma.kitItem.create({
            data: { kitId: project.id, equipmentId: venice2.id, assignedCam: 'B', quantity: 1 }
        });
        await prisma.kitItem.create({
            data: { kitId: project.id, equipmentId: ultraPrime.id, assignedCam: 'B', quantity: 1 }
        });
        console.log('✅ Scenario 2 seeded: Venice 2 (FF) + Ultra Prime (S35)');
    }

    // --- Scenario 3: Double Trouble (FX9 [E-Mount/FF] + Super Speed [PL/S35]) ---
    // Camera C matches
    const fx9 = await prisma.equipmentItem.findFirst({ where: { name: { contains: 'FX9' } } });
    // Using generic "PL Lens" if Super Speed not found, but seed likely has proper lenses
    // Let's rely on finding any S35 PL lens.
    const s35PlLens = await prisma.equipmentItem.findFirst({
        where: {
            category: 'LNS',
            coverage: 'S35', // Assuming coverage field is populated
            OR: [{ mount: 'PL' }]
        }
    });

    if (fx9 && s35PlLens) {
        await prisma.kitItem.create({
            data: { kitId: project.id, equipmentId: fx9.id, assignedCam: 'C', quantity: 1 }
        });
        await prisma.kitItem.create({
            data: { kitId: project.id, equipmentId: s35PlLens.id, assignedCam: 'C', quantity: 1 }
        });
        console.log(`✅ Scenario 3 seeded: FX9 (E-Mount/FF) + ${s35PlLens.name} (PL/S35)`);
    }

    console.log('--- Done! Refresh your app to see the project. ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
