import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const lensData = [
    // Arri Signature Primes moved to seed-data.ts
    // Cooke S7/i Full Frame Plus (PL)
    {
        id: 'cooke-s7-25',
        name: 'Cooke S7/i 25mm T2.0',
        brand: 'Cooke',
        model: 'S7/i 25mm',
        category: 'LNS',
        subcategory: 'Spherical',
        description: 'The "Cooke Look" in full frame. Warm, high contrast, smooth focus fall-off.',
        daily_rate_est: 300,
        imageUrl: 'https://www.cookeoptics.com/wp-content/uploads/2021/04/S7i-25mm.png',
        mount: 'PL',
        weight_kg: 2.3,
        focal_length: '25mm',
        aperture: 'T2.0',
        image_circle_mm: 46,
        sensor_coverage: 'FF',
        close_focus_m: 0.25,
        front_diameter_mm: 110,
        length_mm: 167,
        technicalData: {
            "Iris Blades": "9",
            "Gear Mod": "0.8",
            "Technology": "/i Technology"
        }
    },
    // Atlas Orion Anamorphic (PL) - Moved to seed-data.ts
    // {
    //     id: 'atlas-orion-40',
    //     name: 'Atlas Orion The 40mm T2.0 2x Anamorphic',
    //     brand: 'Atlas Lens Co.',
    //     model: 'Orion 40mm',
    //     category: 'Lens',
    //     subcategory: 'Anamorphic',
    //     description: 'Classic anamorphic characteristics with modern mechanics. 2x squeeze.',
    //     daily_rate_est: 180,
    //     imageUrl: 'https://atlaslensco.com/wp-content/uploads/2020/09/40mm_A_Series_Side_Web.png',
    //     mount: 'PL',
    //     weight_kg: 2.2,
    //     focal_length: '40mm',
    //     aperture: 'T2.0',
    //     squeeze: '2x',
    //     image_circle_mm: 31, // Super 35 mostly, covers more vertically
    //     close_focus_m: 0.84,
    //     front_diameter_mm: 114,
    //     length_mm: 175,
    //     technicalData: {
    //         "Focus Rotation": "270 degrees",
    //         "Gear Position": "Standard"
    //     }
    // }
];

export async function seedLenses() {
    console.log('Seeding detailed lens data...');

    for (const lens of lensData) {
        const { technicalData, ...baseData } = lens;

        await prisma.equipmentItem.upsert({
            where: { id: lens.id },
            update: {
                ...baseData,
                category: 'LNS',
                technicalData: technicalData ? JSON.stringify(technicalData) : null
            },
            create: {
                ...baseData,
                category: 'LNS',
                technicalData: technicalData ? JSON.stringify(technicalData) : null
            }
        });
    }
    console.log(`Lenses seeded: ${lensData.length} items`);
}
