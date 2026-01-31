import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding industry-standard hardware profiles (Final Exhaustive Corrected)...');

    const cameras = [
        {
            brand: 'ARRI',
            model: 'Alexa 35',
            name: 'ARRI Alexa 35',
            category: 'CAM',
            subcategory: 'S35',
            mount: 'PL (LPL)',
            sensor_size: 'S35',
            description: 'The new gold standard for Super 35 cinematography.',
            daily_rate_est: 2500,
            specs_json: JSON.stringify({
                power: { min_voltage: 20, max_voltage: 34, mount_type: "B-Mount" },
                media_slots: ["Codex Compact Drive"],
                compatible_codecs: ["ARRIRAW", "ProRes 4444 XQ"]
            })
        },
        {
            brand: 'RED',
            model: 'V-Raptor',
            name: 'RED V-Raptor',
            category: 'CAM',
            subcategory: 'VV',
            mount: 'RF Mount',
            sensor_size: 'VV',
            description: 'High-speed 8K VV global shutter cinema camera.',
            daily_rate_est: 1200,
            specs_json: JSON.stringify({
                power: { min_voltage: 11, max_voltage: 17, mount_type: "V-Mount (Micro)" },
                media_slots: ["CFexpress Type B"],
                compatible_codecs: ["REDCODE RAW", "ProRes"]
            })
        },
        {
            brand: 'Sony',
            model: 'Venice 2',
            name: 'Sony Venice 2 8K',
            category: 'CAM',
            subcategory: 'FF',
            mount: 'PL',
            sensor_size: 'FF',
            description: 'Cinema camera with internal X-OCN recording.',
            daily_rate_est: 1500,
            specs_json: JSON.stringify({
                power: { min_voltage: 11, max_voltage: 26, mount_type: "V-Mount" },
                media_slots: ["AXS", "SD"],
                compatible_codecs: ["X-OCN", "4K-ProRes"]
            })
        }
    ];

    const accessories = [
        {
            brand: 'Sony',
            model: 'Rialto 2',
            name: 'Venice Rialto 2',
            category: 'SUP',
            subcategory: 'Support',
            description: 'Extension system for Sony Venice 1 and 2.',
            daily_rate_est: 600,
            specs_json: JSON.stringify({
                compatible_with: "sony-venice-2",
                needs: ["Extension Cable", "90 Degree SDI"]
            })
        },
        {
            brand: 'Sony',
            model: 'Extension Cable',
            name: 'Extension Cable for Rialto 2',
            category: 'SUP',
            subcategory: 'Cable',
            description: '12m extension cable for Rialto.',
            daily_rate_est: 100,
            specs_json: JSON.stringify({})
        },
        {
            brand: 'Generic',
            model: 'SDI-90',
            name: '90 Degree SDI',
            category: 'SUP',
            subcategory: 'Cable',
            description: 'High-quality 90 degree SDI cable.',
            daily_rate_est: 20,
            specs_json: JSON.stringify({})
        }
    ];

    const media = [
        {
            brand: 'Codex',
            model: 'Compact Drive 2TB',
            name: 'Codex Compact Drive 2TB',
            category: 'SUP',
            subcategory: 'Media',
            description: 'Proprietary recording media for ARRI Alexa 35.',
            daily_rate_est: 150,
            specs_json: JSON.stringify({
                media_type: "Codex",
                write_speed: "13Gbps",
                certified_for: ["ARRIRAW"]
            })
        },
        {
            brand: 'Angelbird',
            model: 'CFexpress B 660GB',
            name: 'CFexpress Type B 660GB',
            category: 'SUP',
            subcategory: 'Media',
            description: 'High-performance CFexpress Type B card.',
            daily_rate_est: 80,
            specs_json: JSON.stringify({
                media_type: "CFexpress",
                write_speed: "1500MB/s",
                certified_for: ["REDCODE RAW"]
            })
        }
    ];

    for (const item of [...cameras, ...accessories, ...media]) {
        await prisma.equipmentItem.upsert({
            where: {
                brand_model_name: {
                    brand: item.brand,
                    model: item.model,
                    name: item.name
                }
            } as any,
            update: {
                specs_json: item.specs_json,
                daily_rate_est: item.daily_rate_est,
                description: item.description,
                status: 'APPROVED',
                isVerified: true
            } as any,
            create: {
                ...item,
                status: 'APPROVED',
                isVerified: true
            } as any
        });
    }

    console.log('Seeding complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
