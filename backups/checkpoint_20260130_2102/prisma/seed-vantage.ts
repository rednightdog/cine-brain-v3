import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vantageLensData = [
    // --- Hawk V-Lite Anamorphic (1.3x) ---
    // Compact, 1.3x squeeze for 16:9 full sensor usage.
    {
        id: 'hawk-vlite-13x-14',
        name: 'Hawk V-Lite 1.3x 14mm T1.5-16',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Ultra-wide anamorphic lens with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 2.3,
        focal_length: '14mm',
        aperture: 'T1.5', // Approximate min T-stop
        close_focus_m: 0.8,
        front_diameter_mm: 120,
        length_mm: 140,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-18',
        name: 'Hawk V-Lite 1.3x 18mm T1.5-16',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Wide anamorphic lens with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 2.9,
        focal_length: '18mm',
        aperture: 'T1.5',
        close_focus_m: 0.8,
        front_diameter_mm: 120,
        length_mm: 173,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-20',
        name: 'Hawk V-Lite 1.3x 20mm T2.2',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Compact anamorphic with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 2.5,
        focal_length: '20mm',
        aperture: 'T2.2',
        close_focus_m: 0.6,
        front_diameter_mm: 120,
        length_mm: 145,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-24',
        name: 'Hawk V-Lite 1.3x 24mm T2.2',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Compact anamorphic with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 2.5,
        focal_length: '24mm',
        aperture: 'T2.2',
        close_focus_m: 0.6,
        front_diameter_mm: 120,
        length_mm: 145,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-28',
        name: 'Hawk V-Lite 1.3x 28mm T2.2',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Standard wide anamorphic with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 2.3,
        focal_length: '28mm',
        aperture: 'T2.2',
        close_focus_m: 0.8,
        front_diameter_mm: 120,
        length_mm: 137,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-35',
        name: 'Hawk V-Lite 1.3x 35mm T2.2',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Standard anamorphic with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 2.0,
        focal_length: '35mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 104,
        length_mm: 159,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-45',
        name: 'Hawk V-Lite 1.3x 45mm T2.2',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Standard anamorphic with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 1.9,
        focal_length: '45mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 104,
        length_mm: 154,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-55',
        name: 'Hawk V-Lite 1.3x 55mm T2.2',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Standard anamorphic with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 2.0,
        focal_length: '55mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 104,
        length_mm: 156,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-65',
        name: 'Hawk V-Lite 1.3x 65mm T2.2',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Portrait anamorphic with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 2.0,
        focal_length: '65mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 104,
        length_mm: 160,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-80',
        name: 'Hawk V-Lite 1.3x 80mm T2.2',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Portrait anamorphic with 1.3x squeeze.',
        daily_rate_est: 420,

        mount: 'PL',
        weight_kg: 2.3,
        focal_length: '80mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 104,
        length_mm: 185,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-110',
        name: 'Hawk V-Lite 1.3x 110mm T3.0',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Telephoto anamorphic with 1.3x squeeze.',
        daily_rate_est: 450,

        mount: 'PL',
        weight_kg: 2.6,
        focal_length: '110mm',
        aperture: 'T3.0',
        close_focus_m: 1.0,
        front_diameter_mm: 104,
        length_mm: 200,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },
    {
        id: 'hawk-vlite-13x-140',
        name: 'Hawk V-Lite 1.3x 140mm T3.5',
        brand: 'Hawk',
        model: 'V-Lite 1.3x',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Telephoto anamorphic with 1.3x squeeze.',
        daily_rate_est: 450,

        mount: 'PL',
        weight_kg: 2.7,
        focal_length: '140mm',
        aperture: 'T3.5',
        close_focus_m: 1.0,
        front_diameter_mm: 104,
        length_mm: 220,
        sensor_coverage: 'S35', squeeze: '1.3x',
        technicalData: { "Series": "V-Lite 1.3x" }
    },

    // --- Hawk V-Plus Anamorphic (2x) ---
    // High contrast, 2x squeeze.
    {
        id: 'hawk-vplus-30',
        name: 'Hawk V-Plus 30mm T2.2',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus Anamorphic 30mm. 2x squeeze.',
        daily_rate_est: 450,
        imageUrl: 'https://vantagefilm.com/sites/default/files/styles/product_detail/public/products/hawk-v-plus-anamorphic-30mm.jpg',
        mount: 'PL',
        weight_kg: 2.8,
        focal_length: '30mm',
        aperture: 'T2.2',
        close_focus_m: 0.75,
        front_diameter_mm: 125,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus" }
    },
    {
        id: 'hawk-vplus-35',
        name: 'Hawk V-Plus 35mm T2.2',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus Anamorphic 35mm. 2x squeeze.',
        daily_rate_est: 450,
        imageUrl: 'https://vantagefilm.com/sites/default/files/styles/product_detail/public/products/hawk-v-plus-anamorphic-35mm.jpg',
        mount: 'PL',
        weight_kg: 3.1,
        focal_length: '35mm',
        aperture: 'T2.2',
        close_focus_m: 0.75, // Updated
        front_diameter_mm: 156, // Updated
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus" }
    },
    {
        id: 'hawk-vplus-40',
        name: 'Hawk V-Plus 40mm T2.2',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus Anamorphic 40mm. 2x squeeze.',
        daily_rate_est: 450,
        imageUrl: 'https://vantagefilm.com/sites/default/files/styles/product_detail/public/products/hawk-v-plus-anamorphic-40mm.jpg',
        mount: 'PL',
        weight_kg: 3.2,
        focal_length: '40mm',
        aperture: 'T2.2',
        close_focus_m: 0.73,
        front_diameter_mm: 125,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus" }
    },
    {
        id: 'hawk-vplus-50',
        name: 'Hawk V-Plus 50mm T2.2',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus Anamorphic 50mm. 2x squeeze.',
        daily_rate_est: 450,
        imageUrl: 'https://vantagefilm.com/sites/default/files/styles/product_detail/public/products/hawk-v-plus-anamorphic-50mm.jpg',
        mount: 'PL',
        weight_kg: 3.4,
        focal_length: '50mm',
        aperture: 'T2.2',
        close_focus_m: 0.58,
        front_diameter_mm: 125,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus" }
    },
    {
        id: 'hawk-vplus-65',
        name: 'Hawk V-Plus 65mm T3.0 (Super Close)',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus 65mm with Super Close Focus capability.',
        daily_rate_est: 480,
        imageUrl: 'https://vantagefilm.com/sites/default/files/styles/product_detail/public/products/hawk-v-plus-anamorphic-65mm.jpg',
        mount: 'PL',
        weight_kg: 4.8,
        focal_length: '65mm',
        aperture: 'T3.0',
        close_focus_m: 0.35,
        front_diameter_mm: 125,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus", "Feature": "Super Close Focus" }
    },
    {
        id: 'hawk-vplus-75',
        name: 'Hawk V-Plus 75mm T2.2',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus Anamorphic 75mm.',
        daily_rate_est: 450,

        mount: 'PL',
        weight_kg: 3.6,
        focal_length: '75mm',
        aperture: 'T2.2',
        close_focus_m: 0.60,
        front_diameter_mm: 125,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus" }
    },
    {
        id: 'hawk-vplus-85',
        name: 'Hawk V-Plus 85mm T2.2',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus 85mm. 2x squeeze.',
        daily_rate_est: 450,
        imageUrl: 'https://vantagefilm.com/sites/default/files/styles/product_detail/public/products/hawk-v-plus-anamorphic-85mm.jpg',
        mount: 'PL',
        weight_kg: 3.9,
        focal_length: '85mm',
        aperture: 'T2.2',
        close_focus_m: 0.60,
        front_diameter_mm: 125,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus" }
    },
    {
        id: 'hawk-vplus-100',
        name: 'Hawk V-Plus 100mm T2.2',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus Anamorphic 100mm.',
        daily_rate_est: 450,

        mount: 'PL',
        weight_kg: 4.4,
        focal_length: '100mm',
        aperture: 'T2.2',
        close_focus_m: 0.98,
        front_diameter_mm: 125,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus" }
    },
    {
        id: 'hawk-vplus-120',
        name: 'Hawk V-Plus 120mm T3.5 (Super Close)',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus 120mm with Super Close Focus capability.',
        daily_rate_est: 480,

        mount: 'PL',
        weight_kg: 5.6,
        focal_length: '120mm',
        aperture: 'T3.5',
        close_focus_m: 0.42,
        front_diameter_mm: 125,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus", "Feature": "Super Close Focus" }
    },
    {
        id: 'hawk-vplus-135',
        name: 'Hawk V-Plus 135mm T3.0',
        brand: 'Hawk',
        model: 'V-Plus Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Hawk V-Plus 135mm.',
        daily_rate_est: 450,

        mount: 'PL',
        weight_kg: 4.8,
        focal_length: '135mm',
        aperture: 'T3.0',
        close_focus_m: 0.98,
        front_diameter_mm: 135, // Larger front likely
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "V-Plus" }
    },
    // --- Hawk C-Series (Vintage feel) ---
    {
        id: 'hawk-c-40',
        name: 'Hawk C-Series 40mm T2.2',
        brand: 'Hawk',
        model: 'C-Series Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Compact, vintage feel anamorphic lens.',
        daily_rate_est: 400,

        mount: 'PL',
        weight_kg: 2.1,
        focal_length: '40mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "C-Series" }
    },
    {
        id: 'hawk-c-50',
        name: 'Hawk C-Series 50mm T2.2',
        brand: 'Hawk',
        model: 'C-Series Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Compact, vintage feel anamorphic lens.',
        daily_rate_est: 400,

        mount: 'PL',
        weight_kg: 2.2, // Est
        focal_length: '50mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "C-Series" }
    },
    {
        id: 'hawk-c-60',
        name: 'Hawk C-Series 60mm T2.2',
        brand: 'Hawk',
        model: 'C-Series Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Compact, vintage feel anamorphic lens. Unique focal length.',
        daily_rate_est: 400,

        mount: 'PL',
        weight_kg: 2.4,
        focal_length: '60mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "C-Series" }
    },
    {
        id: 'hawk-c-75',
        name: 'Hawk C-Series 75mm T2.2',
        brand: 'Hawk',
        model: 'C-Series Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Compact, vintage feel anamorphic lens.',
        daily_rate_est: 400,

        mount: 'PL',
        weight_kg: 2.5, // Est
        focal_length: '75mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "C-Series" }
    },
    {
        id: 'hawk-c-100',
        name: 'Hawk C-Series 100mm T2.2',
        brand: 'Hawk',
        model: 'C-Series Anamorphic',
        category: 'Lenses',
        subcategory: 'Anamorphic',
        description: 'Compact, vintage feel anamorphic lens.',
        daily_rate_est: 400,

        mount: 'PL',
        weight_kg: 2.8, // Est
        focal_length: '100mm',
        aperture: 'T2.2',
        close_focus_m: 1.0,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', squeeze: '2x',
        technicalData: { "Series": "C-Series" }
    },

    // --- Hawk One T1 Spherical (formerly Vantage One) ---
    {
        id: 'hawk-one-17',
        name: 'Hawk One T1 17.5mm',
        brand: 'Hawk',
        model: 'One T1',
        category: 'Lens',
        subcategory: 'Prime',
        description: 'Ultra fast T1 spherical prime. Creamy bokeh.',
        daily_rate_est: 500,

        mount: 'PL',
        weight_kg: 2.4,
        focal_length: '17.5mm',
        aperture: 'T1.0',
        close_focus_m: 0.25, // Est
        front_diameter_mm: 110,
        sensor_coverage: 'S35', technicalData: { "Series": "Hawk One" }
    },
    {
        id: 'hawk-one-21',
        name: 'Hawk One T1 21mm',
        brand: 'Hawk',
        model: 'One T1',
        category: 'Lens',
        subcategory: 'Prime',
        description: 'Ultra fast T1 spherical prime.',
        daily_rate_est: 500,

        mount: 'PL',
        weight_kg: 2.4,
        focal_length: '21mm',
        aperture: 'T1.0',
        close_focus_m: 0.25,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', technicalData: { "Series": "Hawk One" }
    },
    {
        id: 'hawk-one-25',
        name: 'Hawk One T1 25mm',
        brand: 'Hawk',
        model: 'One T1',
        category: 'Lens',
        subcategory: 'Prime',
        description: 'Ultra fast T1 spherical prime.',
        daily_rate_est: 500,

        mount: 'PL',
        weight_kg: 2.4,
        focal_length: '25mm',
        aperture: 'T1.0',
        close_focus_m: 0.25,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', technicalData: { "Series": "Hawk One" }
    },
    {
        id: 'hawk-one-32',
        name: 'Hawk One T1 32mm',
        brand: 'Hawk',
        model: 'One T1',
        category: 'Lens',
        subcategory: 'Prime',
        description: 'Ultra fast T1 spherical prime.',
        daily_rate_est: 500,

        mount: 'PL',
        weight_kg: 2.4,
        focal_length: '32mm',
        aperture: 'T1.0',
        close_focus_m: 0.30,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', technicalData: { "Series": "Hawk One" }
    },
    {
        id: 'hawk-one-40',
        name: 'Hawk One T1 40mm',
        brand: 'Hawk',
        model: 'One T1',
        category: 'Lens',
        subcategory: 'Prime',
        description: 'Ultra fast T1 spherical prime.',
        daily_rate_est: 500,

        mount: 'PL',
        weight_kg: 2.4,
        focal_length: '40mm',
        aperture: 'T1.0',
        close_focus_m: 0.35,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', technicalData: { "Series": "Hawk One" }
    },
    {
        id: 'hawk-one-50',
        name: 'Hawk One T1 50mm',
        brand: 'Hawk',
        model: 'One T1',
        category: 'Lens',
        subcategory: 'Prime',
        description: 'Ultra fast T1 spherical prime.',
        daily_rate_est: 500,

        mount: 'PL',
        weight_kg: 2.4,
        focal_length: '50mm',
        aperture: 'T1.0',
        close_focus_m: 0.45,
        front_diameter_mm: 110,
        sensor_coverage: 'S35', technicalData: { "Series": "Hawk One" }
    },
    {
        id: 'hawk-one-65',
        name: 'Hawk One T1 65mm',
        brand: 'Hawk',
        model: 'One T1',
        category: 'Lens',
        subcategory: 'Prime',
        description: 'Ultra fast T1 spherical prime.',
        daily_rate_est: 500,

        mount: 'PL',
        weight_kg: 2.6,
        focal_length: '65mm',
        aperture: 'T1.0',
        close_focus_m: 0.6, // Est
        front_diameter_mm: 110,
        sensor_coverage: 'S35', technicalData: { "Series": "Hawk One" }
    },
    {
        id: 'hawk-one-90',
        name: 'Hawk One T1 90mm',
        brand: 'Hawk',
        model: 'One T1',
        category: 'Lens',
        subcategory: 'Prime',
        description: 'Ultra fast T1 spherical prime.',
        daily_rate_est: 500,

        mount: 'PL',
        weight_kg: 3.2,
        focal_length: '90mm',
        aperture: 'T1.0',
        close_focus_m: 0.7, // Est
        front_diameter_mm: 128,
        sensor_coverage: 'S35', technicalData: { "Series": "Hawk One" }
    },
    {
        id: 'hawk-one-120',
        name: 'Hawk One T1 120mm',
        brand: 'Hawk',
        model: 'One T1',
        category: 'Lens',
        subcategory: 'Prime',
        description: 'Ultra fast T1 spherical prime. Telephoto.',
        daily_rate_est: 550,

        mount: 'PL',
        weight_kg: 4.5,
        focal_length: '120mm',
        aperture: 'T1.0',
        close_focus_m: 0.9, // Est
        front_diameter_mm: 156,
        sensor_coverage: 'S35', technicalData: { "Series": "Hawk One" }
    }
];

export async function seedVantageLenses() {
    console.log('Seeding Vantage (Hawk) lenses...');

    for (const lens of vantageLensData) {
        const { technicalData, ...baseData } = lens;

        try {
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
            console.log(`Upserted: ${lens.name}`);
        } catch (e) {
            console.error(`Failed to upsert ${lens.name}`, e);
        }
    }
    console.log(`Vantage lenses seeded: ${vantageLensData.length} items`);
}
