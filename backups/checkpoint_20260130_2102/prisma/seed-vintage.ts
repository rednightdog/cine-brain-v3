import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vintageLensData = [
    // Canon K35 (Rehoused)
    {
        id: 'canon-k35-18',
        name: 'Canon K35 18mm T1.5 (TLS)',
        brand: 'Canon',
        model: 'K35 18mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Legendary vintage glass. Fast, low contrast, beautiful flares. 18mm T1.5.',
        daily_rate_est: 350,
        mount: 'PL',
        weight_kg: 1.1,
        focal_length: '18mm',
        aperture: 'T1.5',
        sensor_coverage: 'FF',
        front_diameter_mm: 110,
        technicalData: { "Housing": "TLS", "Year": "1970s" }
    },
    {
        id: 'canon-k35-24',
        name: 'Canon K35 24mm T1.5 (TLS)',
        brand: 'Canon',
        model: 'K35 24mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Legendary vintage glass. 24mm T1.5.',
        daily_rate_est: 350,
        mount: 'PL',
        weight_kg: 1.0,
        focal_length: '24mm',
        aperture: 'T1.5',
        sensor_coverage: 'FF',
        front_diameter_mm: 110
    },
    {
        id: 'canon-k35-35',
        name: 'Canon K35 35mm T1.5 (TLS)',
        brand: 'Canon',
        model: 'K35 35mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Legendary vintage glass. 35mm T1.5.',
        daily_rate_est: 350,
        mount: 'PL',
        weight_kg: 0.9,
        focal_length: '35mm',
        aperture: 'T1.5',
        sensor_coverage: 'FF',
        front_diameter_mm: 110
    },
    {
        id: 'canon-k35-50',
        name: 'Canon K35 50mm T1.3 (TLS)',
        brand: 'Canon',
        model: 'K35 50mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Legendary vintage glass. 50mm T1.3.',
        daily_rate_est: 350,
        mount: 'PL',
        weight_kg: 0.8,
        focal_length: '50mm',
        aperture: 'T1.3',
        sensor_coverage: 'FF',
        front_diameter_mm: 110
    },
    {
        id: 'canon-k35-85',
        name: 'Canon K35 85mm T1.3 (TLS)',
        brand: 'Canon',
        model: 'K35 85mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Legendary vintage glass. 85mm T1.3.',
        daily_rate_est: 350,
        mount: 'PL',
        weight_kg: 1.0,
        focal_length: '85mm',
        aperture: 'T1.3',
        sensor_coverage: 'FF',
        front_diameter_mm: 110
    },

    // Super Baltars (Bausch & Lomb)
    {
        id: 'super-baltar-20',
        name: 'B&L Super Baltar 20mm T2.3',
        brand: 'Bausch & Lomb',
        model: 'Super Baltar 20mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Classic Hollywood look. Warm, low contrast. 20mm T2.3.',
        daily_rate_est: 250,
        mount: 'PL',
        weight_kg: 0.9,
        focal_length: '20mm',
        aperture: 'T2.3',
        sensor_coverage: 'S35',
        front_diameter_mm: 110
    },
    {
        id: 'super-baltar-25',
        name: 'B&L Super Baltar 25mm T2.3',
        brand: 'Bausch & Lomb',
        model: 'Super Baltar 25mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Classic Hollywood look. 25mm T2.3.',
        daily_rate_est: 250,
        mount: 'PL',
        weight_kg: 0.8,
        focal_length: '25mm',
        aperture: 'T2.3',
        sensor_coverage: 'S35',
        front_diameter_mm: 110
    },

    // Cooke Panchro Classic (Re-release, but vintage spirit)
    {
        id: 'cooke-panchro-classic-32',
        name: 'Cooke Panchro/i Classic 32mm T2.2',
        brand: 'Cooke',
        model: 'Panchro/i Classic 32mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Modern redesign of the vintage Speed Panchro. 32mm T2.2.',
        daily_rate_est: 280,
        mount: 'PL',
        weight_kg: 1.5,
        focal_length: '32mm',
        aperture: 'T2.2',
        sensor_coverage: 'S35',
        front_diameter_mm: 110
    },

    // Kowa Cine Prominar
    {
        id: 'kowa-cine-32',
        name: 'Kowa Cine Prominar 32mm T2.3',
        brand: 'Kowa',
        model: 'Cine Prominar 32mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Unique low contrast, golden flares. 32mm T2.3.',
        daily_rate_est: 200,
        mount: 'PL',
        weight_kg: 0.8,
        focal_length: '32mm',
        aperture: 'T2.3',
        sensor_coverage: 'S35',
        front_diameter_mm: 80
    },

    // Canon Rangefinder "Dream Lens"
    {
        id: 'canon-dream-50',
        name: 'Canon 50mm f/0.95 "Dream Lens" (TLS)',
        brand: 'Canon',
        model: 'Dream Lens 50mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Ultra-fast, dreamy bokeh, extreme glow full wide open.',
        daily_rate_est: 400,
        mount: 'PL',
        weight_kg: 0.9,
        focal_length: '50mm',
        aperture: 'f/0.95',
        sensor_coverage: 'FF',
        front_diameter_mm: 110
    },

    // Gecko-Cam (Vintage 66)
    {
        id: 'gecko-g35-35',
        name: 'Gecko-Cam G35 35mm T1.4',
        brand: 'Gecko-Cam',
        model: 'G35 35mm',
        category: 'LNS',
        subcategory: 'Vintage',
        description: 'Modern housing, vintage glass based on Canon K35/FD. 35mm T1.4.',
        daily_rate_est: 300,
        mount: 'PL',
        weight_kg: 1.2,
        focal_length: '35mm',
        aperture: 'T1.4',
        sensor_coverage: 'FF',
        front_diameter_mm: 110
    }
];

export async function seedVintageLenses() {
    console.log('Seeding Vintage Lenses...');

    for (const lens of vintageLensData) {
        const { technicalData, ...baseData } = lens;

        await prisma.equipmentItem.upsert({
            where: { id: lens.id },
            update: {
                ...baseData,
                category: 'LNS',
                // We map 'Vintage' subcategory to ensure it can be filtered
                subcategory: 'Vintage',
                technicalData: technicalData ? JSON.stringify(technicalData) : null
            },
            create: {
                ...baseData,
                category: 'LNS',
                subcategory: 'Vintage',
                technicalData: technicalData ? JSON.stringify(technicalData) : null
            }
        });
    }
    console.log(`Vintage Lenses seeded: ${vintageLensData.length} items`);
}
