
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cameraAccessories = [
    // Sony Rialto Systems
    {
        id: 'acc-rialto-venice',
        name: 'Sony Rialto Extension',
        brand: 'Sony',
        model: 'CBK-3610XS',
        category: 'SUP',
        subcategory: 'Camera Accessory',
        description: 'Extension system for Venice. Separates sensor block from camera body.',
        weight_kg: 0.8,
    },
    {
        id: 'acc-rialto-cable-2m',
        name: 'Rialto Cable 2m',
        brand: 'Sony',
        model: 'Extension Cable',
        category: 'SUP',
        subcategory: 'Camera Accessory',
        description: '2 meter extension cable for Rialto system.',
    },
    {
        id: 'acc-rialto-cable-5m',
        name: 'Rialto Cable 5m',
        brand: 'Sony',
        model: 'Extension Cable',
        category: 'SUP',
        subcategory: 'Camera Accessory',
        description: '5 meter extension cable for Rialto system.',
    },

    // ARRI Recording Media
    {
        id: 'acc-codex-drive-1tb',
        name: 'Codex Drive 1TB',
        brand: 'Codex',
        model: 'Compact Drive',
        category: 'SUP',
        subcategory: 'Media',
        description: 'Recording media for ARRI cameras.',
        weight_kg: 0.3,
    },
    {
        id: 'acc-codex-drive-2tb',
        name: 'Codex Drive 2TB',
        brand: 'Codex',
        model: 'Compact Drive',
        category: 'SUP',
        subcategory: 'Media',
        description: 'Recording media for ARRI cameras.',
        weight_kg: 0.3,
    },

    // RED Recording Media
    {
        id: 'acc-red-cfexpress-1tb',
        name: 'RED CFexpress 1TB',
        brand: 'RED',
        model: 'PRO CFexpress',
        category: 'SUP',
        subcategory: 'Media',
        description: 'High-speed recording media for RED cameras.',
        weight_kg: 0.1,
    },
    {
        id: 'acc-red-cfexpress-512gb',
        name: 'RED CFexpress 512GB',
        brand: 'RED',
        model: 'PRO CFexpress',
        category: 'SUP',
        subcategory: 'Media',
        description: 'High-speed recording media for RED cameras.',
        weight_kg: 0.1,
    },

    // Sony Recording Media
    {
        id: 'acc-sony-axs-1tb',
        name: 'Sony AXS-A1TS66 1TB',
        brand: 'Sony',
        model: 'AXS Memory',
        category: 'SUP',
        subcategory: 'Media',
        description: 'High-speed AXS memory card for Venice 2.',
        weight_kg: 0.2,
    },

    // Universal Batteries
    {
        id: 'acc-vmount-150wh',
        name: 'V-Mount 150Wh',
        brand: 'Anton Bauer',
        model: 'Titon 150',
        category: 'SUP',
        subcategory: 'Batteries',
        description: 'High capacity V-mount battery.',
        weight_kg: 0.9,
    },
    {
        id: 'acc-vmount-90wh',
        name: 'V-Mount 90Wh',
        brand: 'Anton Bauer',
        model: 'Titon 90',
        category: 'SUP',
        subcategory: 'Batteries',
        description: 'Compact V-mount battery.',
        weight_kg: 0.6,
    }
];

async function main() {
    console.log('Start seeding accessories...');
    for (const acc of cameraAccessories) {
        const item = await prisma.equipmentItem.upsert({
            where: { id: acc.id },
            update: {
                name: acc.name,
                brand: acc.brand,
                model: acc.model,
                category: acc.category,
                subcategory: acc.subcategory,
                description: acc.description,
                weight_kg: acc.weight_kg,
            },
            create: {
                id: acc.id,
                name: acc.name,
                brand: acc.brand,
                model: acc.model,
                category: acc.category,
                subcategory: acc.subcategory,
                description: acc.description,
                weight_kg: acc.weight_kg,
                daily_rate_est: 0,
                isAIGenerated: false,
                isVerified: true
            },
        });
        console.log(`Upserted item: ${item.name} (${item.id})`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
