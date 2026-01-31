import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding advanced Venice and Lens support items...');

    const items = [
        {
            brand: 'Sony',
            model: 'Rialto 1',
            name: 'Sony Rialto 1 (Version 1)',
            category: 'SUP',
            subcategory: 'Extension System',
            description: 'First generation extension system for Venice 1.',
            daily_rate_est: 300,
            specs_json: JSON.stringify({
                compatible_with: "sony-venice"
            })
        },
        {
            brand: 'Sony',
            model: 'Rialto Extension Cable',
            name: 'Rialto Extension Cable (3m/12m)',
            category: 'SUP',
            subcategory: 'Cable',
            description: 'Required main cable for Rialto extension systems.',
            daily_rate_est: 80,
            specs_json: JSON.stringify({})
        },
        {
            brand: 'Teradek',
            model: 'Array Antenna',
            name: 'High-gain Array Panel Antenna',
            category: 'SUP',
            subcategory: 'Wireless Video',
            description: 'High-gain antenna for Teradek Bolt 4K systems.',
            daily_rate_est: 100,
            specs_json: JSON.stringify({})
        },
        {
            brand: 'Angenieux',
            model: 'Optimo 24-290',
            name: 'Angenieux Optimo 24-290mm T2.8',
            category: 'LNS',
            subcategory: 'Spherical',
            description: 'Industry standard heavy zoom lens.',
            daily_rate_est: 800,
            weight_kg: 11,
            mount: 'PL',
            specs_json: JSON.stringify({
                weight_kg: 11
            })
        }
    ];

    // Also update Rialto 2 to have the dependency
    const rialto2Update = {
        brand: 'Sony',
        model: 'Rialto 2',
        name: 'Venice Rialto 2',
        category: 'SUP',
        subcategory: 'Support',
        description: 'Extension system for Sony Venice 1 and 2.',
        daily_rate_est: 600,
        specs_json: JSON.stringify({
            compatible_with: "sony-venice-2",
            needs: ["Extension Cable", "90 Degree SDI", "Rialto Extension Cable (3m/12m)"]
        })
    };

    for (const item of [...items, rialto2Update]) {
        await prisma.equipmentItem.upsert({
            where: {
                brand_model_name: {
                    brand: item.brand,
                    model: item.model,
                    name: item.name
                }
            } as any,
            update: {
                category: item.category,
                subcategory: item.subcategory,
                specs_json: item.specs_json,
                description: (item as any).description,
                daily_rate_est: (item as any).daily_rate_est,
                weight_kg: (item as any).weight_kg,
                mount: (item as any).mount,
                status: 'APPROVED'
            } as any,
            create: {
                brand: item.brand,
                model: item.model,
                name: item.name,
                category: item.category,
                subcategory: item.subcategory,
                specs_json: item.specs_json,
                description: (item as any).description,
                daily_rate_est: (item as any).daily_rate_est,
                weight_kg: (item as any).weight_kg,
                mount: (item as any).mount,
                status: 'APPROVED'
            } as any
        });
    }

    console.log('Seeded advanced Venice items successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
