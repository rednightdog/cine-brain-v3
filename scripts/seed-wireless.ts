import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding wireless video systems...');

    const wirelessItems = [
        {
            brand: 'Teradek',
            model: 'Bolt 4K 750',
            name: 'Teradek Bolt 4K 750 TX/RX Set',
            category: 'SUP',
            subcategory: 'Wireless Video',
            description: 'Zero-delay 4K wireless video transmission system.',
            daily_rate_est: 250,
            specs_json: JSON.stringify({
                inputs: ['SDI', 'HDMI'],
                latency: '0ms',
                range: '750ft',
                power_input: 'D-Tap / Lemo'
            })
        },
        {
            brand: 'DJI',
            model: 'Transmission',
            name: 'DJI Transmission System',
            category: 'SUP',
            subcategory: 'Wireless Video',
            description: 'Long-range wireless video with integrated monitor support.',
            daily_rate_est: 200,
            specs_json: JSON.stringify({
                inputs: ['SDI', 'HDMI'],
                latency: 'High (approx 60-100ms)',
                range: '20,000ft',
                power_input: 'WB37 / WB37 Battery'
            })
        }
    ];

    for (const item of wirelessItems) {
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
                description: item.description,
                daily_rate_est: item.daily_rate_est,
                status: 'APPROVED'
            } as any,
            create: {
                brand: item.brand,
                model: item.model,
                name: item.name,
                category: item.category,
                subcategory: item.subcategory,
                specs_json: item.specs_json,
                description: item.description,
                daily_rate_est: item.daily_rate_est,
                status: 'APPROVED'
            } as any
        });
    }

    console.log('Seeded wireless video systems successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
