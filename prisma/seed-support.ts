import { EquipmentItem } from '../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define a type that matches our manual construction, relaxing strict EquipmentItem check for seed
type SeedItem = Omit<EquipmentItem, 'specs'> & {
    specs: EquipmentItem['specs'] & { payload_capacity?: string }; // Temporary handle for old data shape if any
};

export const supportItems: SeedItem[] = [
    // --- FILTERS ---
    {
        id: 'filt-tiffen-nd-set',
        name: 'Tiffen 4x5.65" ND Filter Set',
        brand: 'Tiffen',
        model: 'Full Spectrum IRND Set',
        category: 'Filter',
        subcategory: 'Neutral Density',
        description: 'Standard cinema ND set (0.3, 0.6, 0.9, 1.2). Water White Glass with ColorCore technology.',
        specs: {
            weight_kg: 0.5,
            front_diameter_mm: 0 // Not applicable really, but fits 4x5.65 matteboxes
        },
        daily_rate_est: 100,
        image_url: 'https://www.tiffen.com/cdn/shop/products/4x5.65_IRND_Combo_1024x1024.jpg?v=1571714856'
    },
    {
        id: 'filt-schneider-hbm-18',
        name: 'Schneider Hollywood Black Magic 1/8',
        brand: 'Schneider',
        model: 'Hollywood Black Magic',
        category: 'Filter',
        subcategory: 'Diffusion',
        description: 'Subtle halation and skin smoothing. Removes digital edge.',
        specs: {
            weight_kg: 0.2
        },
        daily_rate_est: 35
    },
    {
        id: 'filt-schneider-hbm-14',
        name: 'Schneider Hollywood Black Magic 1/4',
        brand: 'Schneider',
        model: 'Hollywood Black Magic',
        category: 'Filter',
        subcategory: 'Diffusion',
        description: 'Moderate halation and skin smoothing. Classic filmic look.',
        specs: {
            weight_kg: 0.2
        },
        daily_rate_est: 35
    },
    {
        id: 'filt-schneider-polarizer',
        name: 'Schneider 4x5.65" True-Pol Linear',
        brand: 'Schneider',
        model: 'True-Pol',
        category: 'Filter',
        subcategory: 'Polarizer',
        description: 'Reduces glare and reflections. Increases color saturation.',
        specs: {
            weight_kg: 0.3
        },
        daily_rate_est: 40
    },

    // --- CAMERA SUPPORT (Heads, Legs, Easyrig, Rods) ---
    {
        id: 'sup-oconnor-2575d',
        name: 'OConnor 2575D Fluid Head',
        brand: 'OConnor',
        model: '2575D',
        category: 'Support',
        subcategory: 'Head',
        description: 'The industry standard fluid head. Supports up to 40.8kg (90lbs).',
        specs: {
            weight_kg: 10.4,
            payload_kg: 40.8 // Corrected from payload_capacity string to number if possible, or keep string in JSON
        },
        daily_rate_est: 200,
        image_url: 'https://res.cloudinary.com/oconnor/image/upload/v1628178877/oconnor/products/2575D/2575D_hero.png'
    },
    {
        id: 'sup-ronford-baker-moose',
        name: 'Ronford Baker Moose Bars',
        brand: 'Ronford Baker',
        model: 'Moose Bars',
        category: 'Support',
        subcategory: 'Handheld',
        description: 'Robust handheld handle system (Moose Bars) with rosette connections.',
        specs: {
            weight_kg: 1.5
        },
        daily_rate_est: 50
    },
    {
        id: 'sup-easyrig-vario5',
        name: 'Easyrig Vario 5 (Gimbal Rig)',
        brand: 'Easyrig',
        model: 'Vario 5',
        category: 'Support',
        subcategory: 'Vest',
        description: 'Adjustable tension (5-17kg). Includes Gimbal Rig vest for longer shoots.',
        specs: {
            weight_kg: 5.2,
            payload_kg: 17 // Max payload
        },
        daily_rate_est: 180,
        image_url: 'https://easyrig.se/wp-content/uploads/2018/05/Vario5_GimbalRig_Standard_Back.jpg'
    },
    {
        id: 'sup-19mm-rods',
        name: '19mm Carbon Fiber Rod Set (18")',
        brand: 'Bright Tangerine',
        model: 'Drumstix 19mm',
        category: 'Support',
        subcategory: 'Rods',
        description: 'Ultra lightweight 19mm support rods for bridge plates.',
        specs: {
            weight_kg: 0.15
        },
        daily_rate_est: 25
    },

    // --- CAMERA ACCESSORIES (Mattebox, Follow Focus, Wireless) grouped under SUPPORT as requested ---
    {
        id: 'acc-arri-lmb-4x5',
        name: 'ARRI LMB 4x5 Pro Set',
        brand: 'ARRI',
        model: 'LMB 4x5',
        category: 'Support', // User requested grouping
        subcategory: 'Mattebox',
        description: 'Clip-on mattebox. 3-stage. Includes flags and masks.',
        specs: {
            weight_kg: 1.5,
            front_diameter_mm: 143 // Max standard
        },
        daily_rate_est: 120
    },
    {
        id: 'acc-arri-wcu4',
        name: 'ARRI WCU-4 Wireless Unit',
        brand: 'ARRI',
        model: 'WCU-4',
        category: 'Support', // User requested grouping
        subcategory: 'Focus',
        description: '3-axis wireless lens control. Compatible with Alexa Mini/Mini LF directly.',
        specs: {
            weight_kg: 0.7
        },
        daily_rate_est: 350
    },
    {
        id: 'acc-teradek-bolt-4k',
        name: 'Teradek Bolt 4K LT 750',
        brand: 'Teradek',
        model: 'Bolt 4K LT 750',
        category: 'Support', // User requested grouping
        subcategory: 'Wireless Video',
        description: 'Zero delay 4K wireless video. 750ft range.',
        specs: {
            weight_kg: 0.4
        },
        daily_rate_est: 250
    },
    {
        id: 'acc-arri-cforce-mini',
        name: 'ARRI cforce mini Motor',
        brand: 'ARRI',
        model: 'cforce mini',
        category: 'Support', // User requested grouping
        subcategory: 'Focus',
        description: 'Lightweight lens motor for WCU-4 / SXU-1.',
        specs: {
            weight_kg: 0.2
        },
        daily_rate_est: 80
    },

    // --- MEDIA & POWER (Grouped under Support) ---
    {
        id: 'med-codex-1tb',
        name: 'Arri Codex Compact Drive 1TB',
        brand: 'Codex',
        model: 'Compact Drive 1TB',
        category: 'Support',
        subcategory: 'Media',
        description: 'Recording media for Alexa 35 and Mini LF.',
        specs: { weight_kg: 0.1 },
        daily_rate_est: 150
    },
    {
        id: 'med-sandisk-cfe-512',
        name: 'SanDisk CFexpress Type B 512GB',
        brand: 'SanDisk',
        model: 'Extreme PRO',
        category: 'Support',
        subcategory: 'Media',
        description: 'High-speed CFexpress for RED/Canon/Nikon.',
        specs: { weight_kg: 0.05 },
        daily_rate_est: 40
    },
    {
        id: 'med-sony-cfea-160',
        name: 'Sony CFexpress Type A 160GB TOUGH',
        brand: 'Sony',
        model: 'TOUGH Type A',
        category: 'Support',
        subcategory: 'Media',
        description: 'Fast and durable media for Sony FX3/FX6/A7SIII.',
        specs: { weight_kg: 0.03 },
        daily_rate_est: 25
    },
    {
        id: 'pow-bebob-150',
        name: 'Bebob V-Mount Battery 150Wh',
        brand: 'Bebob',
        model: 'V150 Micro',
        category: 'Support',
        subcategory: 'Batteries',
        description: 'Compact high-load V-Mount battery.',
        specs: { weight_kg: 0.8 },
        daily_rate_est: 40
    },
    {
        id: 'pow-ab-dionic-150',
        name: 'Anton Bauer Dionic XT 150 (Gold Mount)',
        brand: 'Anton Bauer',
        model: 'Dionic XT 150',
        category: 'Support',
        subcategory: 'Batteries',
        description: 'Reliable Gold Mount battery for professional cameras.',
        specs: { weight_kg: 1.1 },
        daily_rate_est: 45
    },
    {
        id: 'pow-idx-duoc198',
        name: 'IDX Duo-C198 V-Mount Battery',
        brand: 'IDX',
        model: 'Duo-C198',
        category: 'Support',
        subcategory: 'Batteries',
        description: 'Large capacity 191Wh V-Mount battery.',
        specs: { weight_kg: 1.1 },
        daily_rate_est: 50
    }
];

export async function seedSupportItems() {
    console.log('Seeding Support & Filter items...');

    for (const item of supportItems) {
        // Extract specs and image_url to flatten/map them
        const { specs, image_url, ...baseItem } = item;

        // Prepare specs_json for any extra fields not covered by columns
        const specsJson = JSON.stringify(specs);

        await prisma.equipmentItem.upsert({
            where: { id: item.id },
            update: {
                ...baseItem,
                category: item.category === 'Filter' ? 'SUP' : item.category === 'Monitor' ? 'SUP' : 'SUP',
                subcategory: item.category === 'Filter' ? 'Filters' : item.category === 'Monitor' ? 'Monitors' : item.subcategory,
                imageUrl: image_url,
                // Flatten mapped specs
                weight_kg: specs.weight_kg,
                mount: specs.mount,
                payload_kg: specs.payload_kg,
                front_diameter_mm: specs.front_diameter_mm,

                // Store full specs object as JSON for catch-all
                specs_json: specsJson,

                technicalData: item.technical_data ? JSON.stringify(item.technical_data) : undefined,
                labMetrics: item.lab_metrics ? JSON.stringify(item.lab_metrics) : undefined
            },
            create: {
                ...baseItem,
                category: item.category === 'Filter' ? 'SUP' : item.category === 'Monitor' ? 'SUP' : 'SUP',
                subcategory: item.category === 'Filter' ? 'Filters' : item.category === 'Monitor' ? 'Monitors' : item.subcategory,
                imageUrl: image_url,
                // Flatten mapped specs
                weight_kg: specs.weight_kg,
                mount: specs.mount,
                payload_kg: specs.payload_kg,
                front_diameter_mm: specs.front_diameter_mm,

                // Store full specs object as JSON for catch-all
                specs_json: specsJson,

                technicalData: item.technical_data ? JSON.stringify(item.technical_data) : undefined,
                labMetrics: item.lab_metrics ? JSON.stringify(item.lab_metrics) : undefined
            }
        });
    }
    console.log(`✅ Seeded ${supportItems.length} support/filter items.`);
}
