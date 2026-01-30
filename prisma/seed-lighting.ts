import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const lightingData = [
    // ==========================================
    // LED FIXTURES
    // ==========================================

    // --- SkyPanel Series ---
    {
        id: 'light-arri-skypanel-s30c',
        name: 'ARRI SkyPanel S30-C',
        brand: 'ARRI',
        model: 'SkyPanel S30-C',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Compact Soft Light. Fully tuneable 2,800 K - 10,000 K. Plus/Minus Green.',
        daily_rate_est: 250,
        image_url: 'https://www.arri.com/resource/blob/45274/3e098495632731174988771746618585/arri-skypanel-s30-c-data.jpg',
        specs: { power_consumption: '200 W', color_temperature: '2,800 K - 10,000 K', cri: '> 95', weight_kg: 7.4, dimensions: '426 x 300 mm panel' }
    },
    {
        id: 'light-arri-skypanel-s60c',
        name: 'ARRI SkyPanel S60-C',
        brand: 'ARRI',
        model: 'SkyPanel S60-C',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Mid-Range Soft Light. The industry standard soft light.',
        daily_rate_est: 350,
        image_url: 'https://www.arri.com/resource/blob/45284/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-skypanel-s60-c-data.jpg',
        specs: { power_consumption: '420 W', color_temperature: '2,800 K - 10,000 K', cri: '> 95', weight_kg: 11.7, dimensions: '645 x 300 mm panel' }
    },
    {
        id: 'light-arri-skypanel-s120c',
        name: 'ARRI SkyPanel S120-C',
        brand: 'ARRI',
        model: 'SkyPanel S120-C',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Wide Aperture Soft Light. Double the length of S60. Great for vertical lighting.',
        daily_rate_est: 450,
        image_url: 'https://www.arri.com/resource/blob/45294/f9c878953187c7117866768395561570/arri-skypanel-s120-c-data.jpg',
        specs: { power_consumption: '400 W', color_temperature: '2,800 K - 10,000 K', cri: '> 95', weight_kg: 16, dimensions: '1290 x 300 mm panel' }
    },
    {
        id: 'light-arri-skypanel-s360c',
        name: 'ARRI SkyPanel S360-C',
        brand: 'ARRI',
        model: 'SkyPanel S360-C',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Extreme Output Soft Light. Four times the output of the S60. Over 120,000 lumens.',
        daily_rate_est: 1200,
        image_url: 'https://www.arri.com/resource/blob/45304/c2646c07886c99066668740526017260/arri-skypanel-s360-c-data.jpg',
        specs: { power_consumption: '1500 W', color_temperature: '2,800 K - 10,000 K', cri: '> 95', weight_kg: 41, dimensions: '1280 x 870 mm panel' }
    },

    // --- Orbiter Series ---
    {
        id: 'light-arri-orbiter',
        name: 'ARRI Orbiter',
        brand: 'ARRI',
        model: 'Orbiter',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Ultra-bright, tunable, and directional LED fixture. QLM mount.',
        daily_rate_est: 400,
        image_url: 'https://www.arri.com/resource/blob/194604/7c0c1605333168868170887161725565/arri-orbiter-blue-silver-data.jpg',
        specs: { power_consumption: '400 W', color_temperature: '2,000 K - 20,000 K', cri: '> 98', weight_kg: 10, mount: 'QLM' }
    },

    // --- L-Series (Fresnel LED) ---
    {
        id: 'light-arri-l5c',
        name: 'ARRI L5-C',
        brand: 'ARRI',
        model: 'L5-C',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Compact LED Fresnel. Equivalent to 500W Tungsten.',
        daily_rate_est: 150,
        image_url: 'https://www.arri.com/resource/blob/45348/46d9c6c4068576404285871846618585/arri-l5-c-data.jpg',
        specs: { power_consumption: '115 W', lens_diameter: '137 mm / 5"', color_temperature: '2,800 K - 10,000 K', weight_kg: 5.1 }
    },
    {
        id: 'light-arri-l7c',
        name: 'ARRI L7-C LE2',
        brand: 'ARRI',
        model: 'L7-C',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Mid-range LED Fresnel. Equivalent to 1000W Tungsten.',
        daily_rate_est: 200,
        image_url: 'https://www.arri.com/resource/blob/45360/46d9c6c4068576404285871846618585/arri-l7-c-data.jpg',
        specs: { power_consumption: '160 W', lens_diameter: '175 mm / 7"', color_temperature: '2,800 K - 10,000 K', weight_kg: 8.2 }
    },
    {
        id: 'light-arri-l10c',
        name: 'ARRI L10-C',
        brand: 'ARRI',
        model: 'L10-C',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Large LED Fresnel. Equivalent to 2000W Tungsten.',
        daily_rate_est: 300,
        image_url: 'https://www.arri.com/resource/blob/45374/46d9c6c4068576404285871846618585/arri-l10-c-data.jpg',
        specs: { power_consumption: '400 W', lens_diameter: '274 mm / 10"', color_temperature: '2,800 K - 10,000 K', weight_kg: 19.7 }
    },

    // ==========================================
    // DAYLIGHT (HMI) FIXTURES
    // ==========================================

    // --- ARRIMAX ---
    {
        id: 'light-arri-arrimax-18-12',
        name: 'ARRIMAX 18/12',
        brand: 'ARRI',
        model: 'ARRIMAX 18/12',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: 'The Oscar-winning HMI. 18,000W PAR with variable focus. The brightest HMI on the market.',
        daily_rate_est: 1500,
        image_url: 'https://www.arri.com/resource/blob/45398/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-arrimax-18-12-data.jpg',
        specs: { lamp_type: 'HMI 18000 W / 12000 W', lens_diameter: 'N/A (Open Face)', weight_kg: 65, mount: 'Junior (28mm)' } // Usually huge spigot
    },

    // --- M-Series (MAX Technology) ---
    {
        id: 'light-arri-m8',
        name: 'ARRI M8',
        brand: 'ARRI',
        model: 'M8',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '800W HMI. Can be plugged into domestic sockets. Extremely bright for its size.',
        daily_rate_est: 200,
        image_url: 'https://www.arri.com/resource/blob/45404/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-m8-data.jpg',
        specs: { lamp_type: 'HMI 800 W', weight_kg: 8 }
    },
    {
        id: 'light-arri-m18',
        name: 'ARRI M18',
        brand: 'ARRI',
        model: 'M18',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '1800W HMI. 20A household plug capable (US). Brighter than 1.2K PAR.',
        daily_rate_est: 350,
        image_url: 'https://www.arri.com/resource/blob/45410/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-m18-data.jpg',
        specs: { lamp_type: 'HMI 1800 W', weight_kg: 10.5 }
    },
    {
        id: 'light-arri-m40',
        name: 'ARRI M40',
        brand: 'ARRI',
        model: 'M40',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '4000W HMI. Lens-less MAX Technology. 30% brighter than 4K PAR.',
        daily_rate_est: 600,
        image_url: 'https://www.arri.com/resource/blob/45416/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-m40-data.jpg',
        specs: { lamp_type: 'HMI 4000 W', weight_kg: 19 }
    },
    {
        id: 'light-arri-m90',
        name: 'ARRI M90',
        brand: 'ARRI',
        model: 'M90',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '9000W HMI. Packs the punch of a 12K in a 6K body size.',
        daily_rate_est: 950,
        image_url: 'https://www.arri.com/resource/blob/45422/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-m90-data.jpg',
        specs: { lamp_type: 'HMI 9000 W', weight_kg: 39.5 }
    },

    // --- True Blue Daylight (Fresnel) ---
    {
        id: 'light-arri-d5',
        name: 'ARRI True Blue D5',
        brand: 'ARRI',
        model: 'True Blue D5',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '575W HMI Fresnel.',
        daily_rate_est: 150,
        image_url: 'https://www.arri.com/resource/blob/45432/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-true-blue-d5-data.jpg',
        specs: { lamp_type: 'HMI 575 W', lens_diameter: '150 mm', weight_kg: 5.8 }
    },
    {
        id: 'light-arri-d12',
        name: 'ARRI True Blue D12',
        brand: 'ARRI',
        model: 'True Blue D12',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '1200W HMI Fresnel.',
        daily_rate_est: 220,
        image_url: 'https://www.arri.com/resource/blob/45438/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-true-blue-d12-data.jpg',
        specs: { lamp_type: 'HMI 1200 W', lens_diameter: '175 mm', weight_kg: 10 }
    },
    {
        id: 'light-arri-d25',
        name: 'ARRI True Blue D25',
        brand: 'ARRI',
        model: 'True Blue D25',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '2500W HMI Fresnel.',
        daily_rate_est: 350,
        image_url: 'https://www.arri.com/resource/blob/45444/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-true-blue-d25-data.jpg',
        specs: { lamp_type: 'HMI 2500 W', lens_diameter: '250 mm', weight_kg: 16 }
    },
    {
        id: 'light-arri-d40',
        name: 'ARRI True Blue D40',
        brand: 'ARRI',
        model: 'True Blue D40',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '4000W HMI Fresnel.',
        daily_rate_est: 550,
        image_url: 'https://www.arri.com/resource/blob/45450/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-true-blue-d40-data.jpg',
        specs: { lamp_type: 'HMI 4000 W', lens_diameter: '300 mm', weight_kg: 20 }
    },

    // ==========================================
    // TUNGSTEN FIXTURES
    // ==========================================

    // --- True Blue T-Series (Studio/Location) ---
    {
        id: 'light-arri-t1',
        name: 'ARRI True Blue T1',
        brand: 'ARRI',
        model: 'True Blue T1',
        category: 'Lighting',
        subcategory: 'Tungsten',
        description: '1000W Fresnel. Efficient cooling.',
        daily_rate_est: 50,
        image_url: 'https://www.arri.com/resource/blob/45464/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-true-blue-t1-data.jpg',
        specs: { lamp_type: '1000 W', lens_diameter: '150 mm', weight_kg: 4.6 }
    },
    {
        id: 'light-arri-t2',
        name: 'ARRI True Blue T2',
        brand: 'ARRI',
        model: 'True Blue T2',
        category: 'Lighting',
        subcategory: 'Tungsten',
        description: '2000W Fresnel. The workhorse 2K.',
        daily_rate_est: 75,
        image_url: 'https://www.arri.com/resource/blob/45470/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-true-blue-t2-data.jpg',
        specs: { lamp_type: '2000 W', lens_diameter: '175 mm', weight_kg: 7.3 }
    },
    {
        id: 'light-arri-t5',
        name: 'ARRI True Blue T5',
        brand: 'ARRI',
        model: 'True Blue T5',
        category: 'Lighting',
        subcategory: 'Tungsten',
        description: '5000W Fresnel. "Senior".',
        daily_rate_est: 150,
        image_url: 'https://www.arri.com/resource/blob/45476/d3345d8b8a0f0a4a8d0a8a8a8a8a8a8a/arri-true-blue-t5-data.jpg',
        specs: { lamp_type: '5000 W', lens_diameter: '250 mm', weight_kg: 11.5 }
    },

    // --- True Blue ST-Series (Studio/Theatre) ---
    {
        id: 'light-arri-st1',
        name: 'ARRI True Blue ST1',
        brand: 'ARRI',
        model: 'True Blue ST1',
        category: 'Lighting',
        subcategory: 'Tungsten',
        description: '1000W Studio Fresnel.',
        daily_rate_est: 50,
        specs: { lamp_type: '1000 W', weight_kg: 7 }
    },
    {
        id: 'light-arri-st2-3',
        name: 'ARRI True Blue ST2/3',
        brand: 'ARRI',
        model: 'True Blue ST2/3',
        category: 'Lighting',
        subcategory: 'Tungsten',
        description: '2000W/3000W Studio Fresnel.',
        daily_rate_est: 80,
        specs: { lamp_type: '2000/3000 W', weight_kg: 10 }
    },
    {
        id: 'light-arri-st5',
        name: 'ARRI True Blue ST5',
        brand: 'ARRI',
        model: 'True Blue ST5',
        category: 'Lighting',
        subcategory: 'Tungsten',
        description: '5000W Studio Fresnel.',
        daily_rate_est: 160,
        specs: { lamp_type: '5000 W', weight_kg: 14 }
    },

    // ==========================================
    // BALLASTS
    // ==========================================
    {
        id: 'light-arri-eb-575-800',
        name: 'ARRI EB 575/800',
        brand: 'ARRI',
        model: 'EB 575/800',
        category: 'Lighting',
        subcategory: 'Ballast',
        description: 'Electronic Ballast for 575/800W Daylight fixtures.',
        daily_rate_est: 50,
        specs: { input_voltage: '90-250 V', weight_kg: 4 }
    },
    {
        id: 'light-arri-eb-12-18',
        name: 'ARRI EB 12/18 MAX',
        brand: 'ARRI',
        model: 'EB 12/18 MAX',
        category: 'Lighting',
        subcategory: 'Ballast',
        description: 'Electronic Ballast for 1200/1800W Daylight fixtures. ALF, DMX.',
        daily_rate_est: 80,
        specs: { input_voltage: '90-250 V', weight_kg: 8 }
    },
    {
        id: 'light-arri-eb-25-4',
        name: 'ARRI EB 2.5/4 MAX',
        brand: 'ARRI',
        model: 'EB 2.5/4 MAX',
        category: 'Lighting',
        subcategory: 'Ballast',
        description: 'AutoScan Ballast for 2500/4000W fixtures.',
        daily_rate_est: 120,
        specs: { input_voltage: '90-250 V', weight_kg: 15 }
    },
    {
        id: 'light-arri-eb-6-9',
        name: 'ARRI EB 6/9 MAX',
        brand: 'ARRI',
        model: 'EB 6/9 MAX',
        category: 'Lighting',
        subcategory: 'Ballast',
        description: 'High Speed Ballast for 6000/9000W fixtures. 1000Hz.',
        daily_rate_est: 250,
        specs: { input_voltage: '180-250 V', weight_kg: 26 }
    },
    {
        id: 'light-arri-eb-12-18-hs',
        name: 'ARRI EB 12/18 HS',
        brand: 'ARRI',
        model: 'EB 12/18 HS',
        category: 'Lighting',
        subcategory: 'Ballast',
        description: 'High Speed Ballast for ARRIMAX 18/12. AutoScan, 1000Hz.',
        daily_rate_est: 400,
        specs: { input_voltage: '180-250 V', weight_kg: 48 }
    },

    // ==========================================
    // MODIFIERS & OPTICS
    // ==========================================
    {
        id: 'light-acc-orbiter-optic-15',
        name: 'Orbiter Projection Optic 15°',
        brand: 'ARRI',
        model: 'Projection Optic 15°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Tight beam angle optic for Orbiter.',
        daily_rate_est: 50,
        specs: { beam_angle: '15 degrees', mount: 'QLM' }
    },
    {
        id: 'light-acc-orbiter-optic-30',
        name: 'Orbiter Projection Optic 30°',
        brand: 'ARRI',
        model: 'Projection Optic 30°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Medium beam angle optic for Orbiter.',
        daily_rate_est: 50,
        specs: { beam_angle: '30 degrees', mount: 'QLM' }
    },
    {
        id: 'light-acc-orbiter-dome-m',
        name: 'Orbiter Dome M',
        brand: 'ARRI',
        model: 'Dome M',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Spherical soft light diffuser for Orbiter.',
        daily_rate_est: 40,
        specs: { diameter: '50 cm', mount: 'QLM' }
    },
    {
        id: 'light-acc-chimera-s60',
        name: 'Chimera Lightbank for S60',
        brand: 'Chimera',
        model: 'S60 Lightbank',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Softbox for SkyPanel S60.',
        daily_rate_est: 40,
        specs: { type: 'Softbox' }
    },
    {
        id: 'light-acc-snapgrid-s60',
        name: 'DoPchoice SnapGrid 40° for S60',
        brand: 'DoPchoice',
        model: 'SnapGrid 40°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Directional grid for S60 softbox or panel.',
        daily_rate_est: 30,
        specs: { angle: '40 degrees' }
    },
    {
        id: 'light-acc-barndoors-m18',
        name: '4-Leaf Barndoor for M18',
        brand: 'ARRI',
        model: 'M18 Barndoor',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Barndoors for M18 fixture.',
        daily_rate_est: 20,
        specs: { diameter: '344 mm' }
    },
    {
        id: 'light-acc-barndoors-m40',
        name: '4-Leaf Barndoor for M40',
        brand: 'ARRI',
        model: 'M40 Barndoor',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Barndoors for M40/D40 fixture.',
        daily_rate_est: 25,
        specs: { diameter: '400 mm' }
    },

    // ==========================================
    // ACCESSORIES (Cables, etc.)
    // ==========================================
    {
        id: 'light-cable-head-ballast-50',
        name: 'Head-to-Ballast Cable 50\'',
        brand: 'ARRI',
        model: 'Cable 50ft',
        category: 'Lighting',
        subcategory: 'Accessory',
        description: 'Extension cable for HMI fixtures.',
        daily_rate_est: 15,
        specs: { length: '50 ft' }
    },

    // ==========================================
    // APUTURE LIGHT STORM (LS) SERIES
    // ==========================================
    {
        id: 'light-aputure-ls-1200d-pro',
        name: 'Aputure LS 1200d Pro',
        brand: 'Aputure',
        model: 'LS 1200d Pro',
        category: 'Lighting',
        subcategory: 'LED',
        description: '1200W Daylight COB. Comparable to 1600W HMI. Weather resistant.',
        daily_rate_est: 500,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/LS1200dPro_1024x1024.jpg',
        specs: { power_consumption: '1440 W', color_temperature: '5600K', cri: '> 96', mount: 'Bowens', weight_kg: 8.9 }
    },
    {
        id: 'light-aputure-ls-600d-pro',
        name: 'Aputure LS 600d Pro',
        brand: 'Aputure',
        model: 'LS 600d Pro',
        category: 'Lighting',
        subcategory: 'LED',
        description: '600W Daylight COB. Brightest flagship before 1200d.',
        daily_rate_est: 300,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/600dPro_1024x1024.jpg',
        specs: { power_consumption: '720 W', color_temperature: '5600K', cri: '> 96', mount: 'Bowens', weight_kg: 4.6 }
    },
    {
        id: 'light-aputure-ls-600x-pro',
        name: 'Aputure LS 600x Pro',
        brand: 'Aputure',
        model: 'LS 600x Pro',
        category: 'Lighting',
        subcategory: 'LED',
        description: '600W Bi-Color COB. Tunable 2700K-6500K.',
        daily_rate_est: 350,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/600xPro_1024x1024.jpg',
        specs: { power_consumption: '720 W', color_temperature: '2700K-6500K', cri: '> 96', mount: 'Bowens', weight_kg: 4.6 }
    },
    {
        id: 'light-aputure-ls-600c-pro',
        name: 'Aputure LS 600c Pro',
        brand: 'Aputure',
        model: 'LS 600c Pro',
        category: 'Lighting',
        subcategory: 'LED',
        description: '600W RGBWW Full Color COB.',
        daily_rate_est: 400,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/600cPro_1024x1024.jpg',
        specs: { power_consumption: '720 W', color_temperature: '2300K-10000K', cri: '> 95', mount: 'Bowens', weight_kg: 5.8 }
    },
    {
        id: 'light-aputure-ls-300d-ii',
        name: 'Aputure LS 300d II',
        brand: 'Aputure',
        model: 'LS 300d II',
        category: 'Lighting',
        subcategory: 'LED',
        description: '300W Daylight COB. The classic indie workhorse.',
        daily_rate_est: 150,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/300dII_1024x1024.jpg',
        specs: { power_consumption: '350 W', color_temperature: '5500K', cri: '> 96', mount: 'Bowens', weight_kg: 3 }
    },
    {
        id: 'light-aputure-ls-300x',
        name: 'Aputure LS 300x',
        brand: 'Aputure',
        model: 'LS 300x',
        category: 'Lighting',
        subcategory: 'LED',
        description: '300W Bi-Color COB. 2700K-6500K.',
        daily_rate_est: 180,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/300x_1024x1024.jpg',
        specs: { power_consumption: '350 W', color_temperature: '2700K-6500K', cri: '> 96', mount: 'Bowens', weight_kg: 3 }
    },
    {
        id: 'light-aputure-ls-60d',
        name: 'Aputure LS 60d',
        brand: 'Aputure',
        model: 'LS 60d',
        category: 'Lighting',
        subcategory: 'LED',
        description: '60W Daylight Focusing LED. Adjustable beam angle.',
        daily_rate_est: 80,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/LS60d_1024x1024.jpg',
        specs: { power_consumption: '60 W', color_temperature: '5600K', beam_angle: '15-45 deg', mount: 'Mini Bowens' }
    },
    {
        id: 'light-aputure-ls-60x',
        name: 'Aputure LS 60x',
        brand: 'Aputure',
        model: 'LS 60x',
        category: 'Lighting',
        subcategory: 'LED',
        description: '60W Bi-Color Focusing LED.',
        daily_rate_est: 90,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/LS60x_1024x1024.jpg',
        specs: { power_consumption: '60 W', color_temperature: '2700K-6500K', beam_angle: '15-45 deg', mount: 'Mini Bowens' }
    },

    // ==========================================
    // APUTURE NOVA (PANEL) SERIES
    // ==========================================
    {
        id: 'light-aputure-nova-p600c',
        name: 'Aputure Nova P600c',
        brand: 'Aputure',
        model: 'Nova P600c',
        category: 'Lighting',
        subcategory: 'LED',
        description: '600W RGBWW Soft Panel. Extremely bright 2x1 panel.',
        daily_rate_est: 450,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/NovaP600c_1024x1024.jpg',
        specs: { power_consumption: '600 W', color_temperature: '2000K-10000K', cri: '> 95', weight_kg: 13.7 }
    },
    {
        id: 'light-aputure-nova-p300c',
        name: 'Aputure Nova P300c',
        brand: 'Aputure',
        model: 'Nova P300c',
        category: 'Lighting',
        subcategory: 'LED',
        description: '300W RGBWW Soft Panel. 1x1.5 form factor.',
        daily_rate_est: 250,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/NovaP300c_1024x1024.jpg',
        specs: { power_consumption: '360 W', color_temperature: '2000K-10000K', cri: '> 95', weight_kg: 10.3 }
    },

    // ==========================================
    // AMARAN SERIES (COB & Panels)
    // ==========================================
    {
        id: 'light-amaran-200d',
        name: 'Amaran 200d S',
        brand: 'Aputure',
        model: 'Amaran 200d S',
        category: 'Lighting',
        subcategory: 'LED',
        description: '200W Daylight COB. Budget friendly high output.',
        daily_rate_est: 80,
        specs: { power_consumption: '200 W', color_temperature: '5600K', mount: 'Bowens' }
    },
    {
        id: 'light-amaran-200x',
        name: 'Amaran 200x S',
        brand: 'Aputure',
        model: 'Amaran 200x S',
        category: 'Lighting',
        subcategory: 'LED',
        description: '200W Bi-Color COB.',
        daily_rate_est: 90,
        specs: { power_consumption: '200 W', color_temperature: '2700K-6500K', mount: 'Bowens' }
    },
    {
        id: 'light-amaran-100d',
        name: 'Amaran 100d S',
        brand: 'Aputure',
        model: 'Amaran 100d S',
        category: 'Lighting',
        subcategory: 'LED',
        description: '100W Daylight COB.',
        daily_rate_est: 50,
        specs: { power_consumption: '100 W', color_temperature: '5600K', mount: 'Bowens' }
    },
    {
        id: 'light-amaran-100x',
        name: 'Amaran 100x S',
        brand: 'Aputure',
        model: 'Amaran 100x S',
        category: 'Lighting',
        subcategory: 'LED',
        description: '100W Bi-Color COB.',
        daily_rate_est: 60,
        specs: { power_consumption: '100 W', color_temperature: '2700K-6500K', mount: 'Bowens' }
    },
    {
        id: 'light-amaran-60d',
        name: 'Amaran COB 60d S',
        brand: 'Aputure',
        model: 'Amaran 60d S',
        category: 'Lighting',
        subcategory: 'LED',
        description: '65W Daylight COB. Tiny form factor.',
        daily_rate_est: 40,
        specs: { power_consumption: '65 W', color_temperature: '5600K', mount: 'Bowens' }
    },
    {
        id: 'light-amaran-60x',
        name: 'Amaran COB 60x S',
        brand: 'Aputure',
        model: 'Amaran 60x S',
        category: 'Lighting',
        subcategory: 'LED',
        description: '65W Bi-Color COB.',
        daily_rate_est: 45,
        specs: { power_consumption: '65 W', color_temperature: '2700K-6500K', mount: 'Bowens' }
    },
    {
        id: 'light-amaran-150c',
        name: 'Amaran 150c',
        brand: 'Aputure',
        model: 'Amaran 150c',
        category: 'Lighting',
        subcategory: 'LED',
        description: '150W RGBWW Full Color COB.',
        daily_rate_est: 100,
        specs: { power_consumption: '150 W', color_temperature: '2500K-7500K', mount: 'Bowens' }
    },
    {
        id: 'light-amaran-300c',
        name: 'Amaran 300c',
        brand: 'Aputure',
        model: 'Amaran 300c',
        category: 'Lighting',
        subcategory: 'LED',
        description: '300W RGBWW Full Color COB.',
        daily_rate_est: 150,
        specs: { power_consumption: '300 W', color_temperature: '2500K-7500K', mount: 'Bowens' }
    },
    {
        id: 'light-amaran-f21c',
        name: 'Amaran F21c',
        brand: 'Aputure',
        model: 'Amaran F21c',
        category: 'Lighting',
        subcategory: 'LED',
        description: '100W RGBWW Flexible Mat (2x1).',
        daily_rate_est: 100,
        specs: { power_consumption: '100 W', type: 'Flex Mat', dimensions: '2x1 ft' }
    },
    {
        id: 'light-amaran-f22c',
        name: 'Amaran F22c',
        brand: 'Aputure',
        model: 'Amaran F22c',
        category: 'Lighting',
        subcategory: 'LED',
        description: '200W RGBWW Flexible Mat (2x2).',
        daily_rate_est: 150,
        specs: { power_consumption: '200 W', type: 'Flex Mat', dimensions: '2x2 ft' }
    },

    // ==========================================
    // APUTURE INFINIBAR & TUBES
    // ==========================================
    {
        id: 'light-aputure-infinibar-pb3',
        name: 'Aputure Infinibar PB3',
        brand: 'Aputure',
        model: 'Infinibar PB3',
        category: 'Lighting',
        subcategory: 'LED',
        description: '1-foot RGBWW Pixel Bar. Connectable shapes.',
        daily_rate_est: 40,
        specs: { length: '1 ft', pixels: '24' }
    },
    {
        id: 'light-aputure-infinibar-pb6',
        name: 'Aputure Infinibar PB6',
        brand: 'Aputure',
        model: 'Infinibar PB6',
        category: 'Lighting',
        subcategory: 'LED',
        description: '2-foot RGBWW Pixel Bar.',
        daily_rate_est: 60,
        specs: { length: '2 ft', pixels: '48' }
    },
    {
        id: 'light-aputure-infinibar-pb12',
        name: 'Aputure Infinibar PB12',
        brand: 'Aputure',
        model: 'Infinibar PB12',
        category: 'Lighting',
        subcategory: 'LED',
        description: '4-foot RGBWW Pixel Bar.',
        daily_rate_est: 80,
        specs: { length: '4 ft', pixels: '96' }
    },
    {
        id: 'light-aputure-mt-pro',
        name: 'Aputure MT Pro',
        brand: 'Aputure',
        model: 'MT Pro',
        category: 'Lighting',
        subcategory: 'LED',
        description: '1-foot Mini Tube LED. Magnetic.',
        daily_rate_est: 35,
        specs: { length: '1 ft', pixels: '36' }
    },
    {
        id: 'light-amaran-t2c',
        name: 'Amaran T2c',
        brand: 'Aputure',
        model: 'Amaran T2c',
        category: 'Lighting',
        subcategory: 'LED',
        description: '2-foot RGBWW Tube Light.',
        daily_rate_est: 30,
        specs: { length: '2 ft' }
    },
    {
        id: 'light-amaran-t4c',
        name: 'Amaran T4c',
        brand: 'Aputure',
        model: 'Amaran T4c',
        category: 'Lighting',
        subcategory: 'LED',
        description: '4-foot RGBWW Tube Light.',
        daily_rate_est: 50,
        specs: { length: '4 ft' }
    },

    // ==========================================
    // APUTURE MINI LEDS
    // ==========================================
    {
        id: 'light-aputure-mc',
        name: 'Aputure MC',
        brand: 'Aputure',
        model: 'MC',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Mini RGBWW LED. Credit card size.',
        daily_rate_est: 15,
        specs: { power_consumption: '5 W' }
    },
    {
        id: 'light-aputure-mc-pro',
        name: 'Aputure MC Pro',
        brand: 'Aputure',
        model: 'MC Pro',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Professional Mini RGBWW LED. Waterproof, magnetic, brighter.',
        daily_rate_est: 25,
        specs: { power_consumption: '5 W', ip_rating: 'IP65' }
    },
    {
        id: 'light-aputure-b7c',
        name: 'Aputure B7c',
        brand: 'Aputure',
        model: 'Accent B7c',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'RGBWW Smart Bulb. E26/E27 Socket.',
        daily_rate_est: 10,
        specs: { power_consumption: '7 W' }
    },

    // ==========================================
    // APUTURE MODIFIERS
    // ==========================================
    {
        id: 'light-mod-lightdome-ii',
        name: 'Aputure Light Dome II',
        brand: 'Aputure',
        model: 'Light Dome II',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '35" Deep Parabolic Softbox (89cm). Quick setup.',
        daily_rate_est: 30,
        specs: { mount: 'Bowens', diameter: '89 cm' }
    },
    {
        id: 'light-mod-lightdome-iii',
        name: 'Aputure Light Dome III',
        brand: 'Aputure',
        model: 'Light Dome III',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '35" Quick-folding Parabolic Softbox.',
        daily_rate_est: 35,
        specs: { mount: 'Bowens', diameter: '89 cm' }
    },
    {
        id: 'light-mod-lightdome-150',
        name: 'Aputure Light Dome 150',
        brand: 'Aputure',
        model: 'Light Dome 150',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Large 5ft Softbox (150cm).',
        daily_rate_est: 50,
        specs: { mount: 'Bowens', diameter: '150 cm' }
    },
    {
        id: 'light-mod-lightdome-mini-ii',
        name: 'Aputure Light Dome Mini II',
        brand: 'Aputure',
        model: 'Light Dome Mini II',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '21.5" Compact Softbox.',
        daily_rate_est: 20,
        specs: { mount: 'Bowens', diameter: '55 cm' }
    },
    {
        id: 'light-mod-lantern-90',
        name: 'Aputure Lantern 90',
        brand: 'Aputure',
        model: 'Lantern 90',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '3ft Spherical Softbox (90cm). Omni-directional.',
        daily_rate_est: 40,
        specs: { mount: 'Bowens', diameter: '90 cm' }
    },
    {
        id: 'light-mod-lantern',
        name: 'Aputure Lantern',
        brand: 'Aputure',
        model: 'Lantern',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '2.2ft Spherical Softbox (66cm).',
        daily_rate_est: 25,
        specs: { mount: 'Bowens', diameter: '66 cm' }
    },
    {
        id: 'light-mod-spotlight-mount-26',
        name: 'Aputure Spotlight Mount 26°',
        brand: 'Aputure',
        model: 'Spotlight Mount 26°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Precision Projection Lens for Bowens mount.',
        daily_rate_est: 60,
        specs: { mount: 'Bowens', angle: '26 degrees' }
    },
    {
        id: 'light-mod-spotlight-mount-19',
        name: 'Aputure Spotlight Mount 19°',
        brand: 'Aputure',
        model: 'Spotlight Mount 19°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '19-degree Projection Lens.',
        daily_rate_est: 60,
        specs: { mount: 'Bowens', angle: '19 degrees' }
    },
    {
        id: 'light-mod-spotlight-mount-36',
        name: 'Aputure Spotlight Mount 36°',
        brand: 'Aputure',
        model: 'Spotlight Mount 36°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '36-degree Projection Lens.',
        daily_rate_est: 60,
        specs: { mount: 'Bowens', angle: '36 degrees' }
    },
    {
        id: 'light-mod-fresnel-2x',
        name: 'Aputure Fresnel 2X',
        brand: 'Aputure',
        model: 'Fresnel 2X',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Glass Fresnel lens attachment for Bowens chips.',
        daily_rate_est: 30,
        specs: { mount: 'Bowens' }
    },
    {
        id: 'light-mod-f10-fresnel',
        name: 'Aputure F10 Fresnel',
        brand: 'Aputure',
        model: 'F10 Fresnel',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '10-inch Glass Fresnel for LS 600d.',
        daily_rate_est: 50,
        specs: { mount: 'Bowens', diameter: '10 inch' }
    },
    {
        id: 'light-mod-f10-barndoors',
        name: 'Aputure F10 Barndoors',
        brand: 'Aputure',
        model: 'F10 Barndoors',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Large Barndoors for F10 Fresnel.',
        daily_rate_est: 25,
        specs: { mount: 'F10' }
    },
    {
        id: 'light-mod-space-light',
        name: 'Aputure Space Light',
        brand: 'Aputure',
        model: 'Space Light',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Cylindrical diffuser for 300d/120d.',
        daily_rate_est: 20,
        specs: { mount: 'Bowens' }
    },

    // ==========================================
    // APUTURE ELECTRO STORM SERIES (NEW FLAGSHIPS)
    // ==========================================
    {
        id: 'light-aputure-es-cs15',
        name: 'Aputure Electro Storm CS15',
        brand: 'Aputure',
        model: 'Electro Storm CS15',
        category: 'Lighting',
        subcategory: 'LED',
        description: '1500W RGBWW High Output COB. IP65. Dual Acc Mount.',
        daily_rate_est: 600,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/CS15_1024x1024.jpg',
        specs: { power_consumption: '1500 W', color_temperature: '2000K-10000K', cri: '> 96', mount: 'Electronic A-Mount / Bowens' }
    },
    {
        id: 'light-aputure-es-xt26',
        name: 'Aputure Electro Storm XT26',
        brand: 'Aputure',
        model: 'Electro Storm XT26',
        category: 'Lighting',
        subcategory: 'LED',
        description: '2600W Bi-Color Powerhouse. Replaces 4K HMI/12K Tungsten.',
        daily_rate_est: 900,
        image_url: 'https://cdn.shopify.com/s/files/1/1526/6382/products/XT26_1024x1024.jpg',
        specs: { power_consumption: '2600 W', color_temperature: '2700K-6500K', cri: '> 96', mount: 'Electronic A-Mount / Bowens' }
    },
    {
        id: 'light-mod-f14-fresnel',
        name: 'Aputure F14 Fresnel',
        brand: 'Aputure',
        model: 'F14 Fresnel',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '14-inch Electronic Fresnel for CS15/XT26.',
        daily_rate_est: 100,
        specs: { mount: 'A-Mount', diameter: '14 inch' }
    },

    // ==========================================
    // AMARAN PANELS & MATS (MISSING)
    // ==========================================
    {
        id: 'light-amaran-p60c',
        name: 'Amaran P60c',
        brand: 'Aputure',
        model: 'Amaran P60c',
        category: 'Lighting',
        subcategory: 'LED',
        description: '60W RGBWW Panel. Compact and powerful.',
        daily_rate_est: 35,
        specs: { power_consumption: '60 W', color_temperature: '2500K-7500K', cri: '> 95', type: 'Panel' }
    },
    {
        id: 'light-amaran-p60x',
        name: 'Amaran P60x',
        brand: 'Aputure',
        model: 'Amaran P60x',
        category: 'Lighting',
        subcategory: 'LED',
        description: '60W Bi-Color Panel.',
        daily_rate_est: 30,
        specs: { power_consumption: '60 W', color_temperature: '3200K-6500K', cri: '> 95', type: 'Panel' }
    },
    {
        id: 'light-amaran-f21x',
        name: 'Amaran F21x',
        brand: 'Aputure',
        model: 'Amaran F21x',
        category: 'Lighting',
        subcategory: 'LED',
        description: '100W Bi-Color Flexible Mat (2x1).',
        daily_rate_est: 90,
        specs: { power_consumption: '100 W', type: 'Flex Mat', dimensions: '2x1 ft' }
    },
    {
        id: 'light-amaran-f22x',
        name: 'Amaran F22x',
        brand: 'Aputure',
        model: 'Amaran F22x',
        category: 'Lighting',
        subcategory: 'LED',
        description: '200W Bi-Color Flexible Mat (2x2).',
        daily_rate_est: 130,
        specs: { power_consumption: '200 W', type: 'Flex Mat', dimensions: '2x2 ft' }
    },

    // ==========================================
    // ADDITIONAL APUTURE MODIFIERS
    // ==========================================
    {
        id: 'light-mod-spotlight-se-19',
        name: 'Amaran Spotlight SE 19°',
        brand: 'Aputure',
        model: 'Spotlight SE 19°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Compact Projection Lens for Amaran COBs.',
        daily_rate_est: 40,
        specs: { mount: 'Bowens', angle: '19 degrees' }
    },
    {
        id: 'light-mod-spotlight-se-36',
        name: 'Amaran Spotlight SE 36°',
        brand: 'Aputure',
        model: 'Spotlight SE 36°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Compact Projection Lens for Amaran COBs.',
        daily_rate_est: 40,
        specs: { mount: 'Bowens', angle: '36 degrees' }
    },
    {
        id: 'light-mod-lightdome-se',
        name: 'Aputure Light Dome SE',
        brand: 'Aputure',
        model: 'Light Dome SE',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Lightweight octagonal softbox.',
        daily_rate_est: 20,
        specs: { mount: 'Bowens', diameter: '85 cm' }
    },
    {
        id: 'light-mod-spotlight-mini-zoom',
        name: 'Aputure Spotlight Mini Zoom',
        brand: 'Aputure',
        model: 'Spotlight Mini Zoom',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Adjustable Beam Angle Projection for LS 60d/x.',
        daily_rate_est: 40,
        specs: { mount: 'Mini Bowens', angle: '15-30 degrees' }
    },
    {
        id: 'light-acc-2bay-station',
        name: 'Aputure 2-Bay Battery Power Station',
        brand: 'Aputure',
        model: '2-Bay Power Station',
        category: 'Lighting',
        subcategory: 'Accessory',
        description: 'Converts 2x V-Mount/Gold Mount batteries to 48V DC.',
        daily_rate_est: 35,
        specs: { output: '48V DC' }
    },

    // ==========================================
    // KINO FLO CELEB SERIES (LED PANEL)
    // ==========================================
    {
        id: 'light-kino-celeb-250',
        name: 'Kino Flo Celeb 250 LED',
        brand: 'Kino Flo',
        model: 'Celeb 250',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Soft white & RGBWW LED panel. Industry fav for soft light.',
        daily_rate_est: 200,
        image_url: 'https://www.kinoflo.com/wp-content/uploads/2021/03/CEL-250-CF-center-1024x1024.jpg',
        specs: { power_consumption: '150 W', color_temperature: '2500K-9900K', cri: '> 95', type: 'Panel' }
    },
    {
        id: 'light-kino-celeb-450',
        name: 'Kino Flo Celeb 450 LED',
        brand: 'Kino Flo',
        model: 'Celeb 450',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Large soft LED panel for studio use.',
        daily_rate_est: 300,
        image_url: 'https://www.kinoflo.com/wp-content/uploads/2021/03/CEL-450-CF-center-1024x1024.jpg',
        specs: { power_consumption: '255 W', color_temperature: '2500K-9900K', cri: '> 95', type: 'Panel' }
    },
    {
        id: 'light-kino-celeb-850',
        name: 'Kino Flo Celeb 850 LED',
        brand: 'Kino Flo',
        model: 'Celeb 850',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Massive soft LED source. Replaces large softboxes.',
        daily_rate_est: 500,
        image_url: 'https://www.kinoflo.com/wp-content/uploads/2021/03/CEL-850-CF-center-1024x1024.jpg',
        specs: { power_consumption: '570 W', color_temperature: '2500K-9900K', cri: '> 95', type: 'Panel' }
    },
    {
        id: 'light-kino-celeb-250-retro',
        name: 'Kino Flo Celeb 250 Legacy',
        brand: 'Kino Flo',
        model: 'Celeb 250 Legacy',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Older generation Celeb 250.',
        daily_rate_est: 150,
        specs: { power_consumption: '100 W', type: 'Panel' }
    },

    // ==========================================
    // KINO FLO DIVA-LITE MIMA/LED SERIES
    // ==========================================
    {
        id: 'light-kino-diva-20',
        name: 'Kino Flo Diva-Lite 20 LED',
        brand: 'Kino Flo',
        model: 'Diva-Lite 20',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Portable, versatile soft LED panel.',
        daily_rate_est: 150,
        image_url: 'https://www.kinoflo.com/wp-content/uploads/2021/03/DIV-20-CF-center-1024x1024.jpg',
        specs: { power_consumption: '150 W', color_temperature: '2500K-9900K', type: 'Panel' }
    },
    {
        id: 'light-kino-diva-30',
        name: 'Kino Flo Diva-Lite 30 LED',
        brand: 'Kino Flo',
        model: 'Diva-Lite 30',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Slightly larger, more powerful Diva LED.',
        daily_rate_est: 180,
        image_url: 'https://www.kinoflo.com/wp-content/uploads/2021/03/DIV-30-CF-center-1024x1024.jpg',
        specs: { power_consumption: '150 W', color_temperature: '2500K-9900K', type: 'Panel' }
    },
    {
        id: 'light-kino-diva-41',
        name: 'Kino Flo Diva-Lite 41 LED',
        brand: 'Kino Flo',
        model: 'Diva-Lite 41',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Long throw Diva LED.',
        daily_rate_est: 220,
        specs: { power_consumption: '170 W', color_temperature: '2500K-9900K', type: 'Panel' }
    },

    // ==========================================
    // KINO FLO FREESTYLE SERIES (PANELS & TUBES)
    // ==========================================
    {
        id: 'light-kino-freestyle-31',
        name: 'Kino Flo FreeStyle 31',
        brand: 'Kino Flo',
        model: 'FreeStyle 31',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Removable LED panel from housing. Very lightweight.',
        daily_rate_est: 200,
        image_url: 'https://www.kinoflo.com/wp-content/uploads/2021/03/FS-31-CF-center-1024x1024.jpg',
        specs: { power_consumption: '150 W', color_temperature: '2500K-9900K', type: 'Panel' }
    },
    {
        id: 'light-kino-freestyle-21',
        name: 'Kino Flo FreeStyle 21',
        brand: 'Kino Flo',
        model: 'FreeStyle 21',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Compact 2ft FreeStyle panel.',
        daily_rate_est: 180,
        specs: { power_consumption: '110 W', color_temperature: '2500K-9900K', type: 'Panel' }
    },
    {
        id: 'light-kino-freestyle-mini',
        name: 'Kino Flo FreeStyle Mini',
        brand: 'Kino Flo',
        model: 'FreeStyle Mini',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Small portable LED kit.',
        daily_rate_est: 150,
        specs: { power_consumption: '85 W', type: 'Panel' }
    },
    {
        id: 'light-kino-freestyle-t44',
        name: 'Kino Flo FreeStyle T44 Tube System',
        brand: 'Kino Flo',
        model: 'FreeStyle T44',
        category: 'Lighting',
        subcategory: 'LED',
        description: '4ft LED Tube System with controller. Replaces 4Bank.',
        daily_rate_est: 150,
        specs: { length: '4 ft', type: 'Tube', quantity: '4-Tube System' }
    },
    {
        id: 'light-kino-freestyle-t24',
        name: 'Kino Flo FreeStyle T24 Tube System',
        brand: 'Kino Flo',
        model: 'FreeStyle T24',
        category: 'Lighting',
        subcategory: 'LED',
        description: '2ft LED Tube System.',
        daily_rate_est: 120,
        specs: { length: '2 ft', type: 'Tube', quantity: '4-Tube System' }
    },

    // ==========================================
    // KINO FLO IMAGE SERIES (STUDIO LED)
    // ==========================================
    {
        id: 'light-kino-image-l80',
        name: 'Kino Flo Image L80 LED',
        brand: 'Kino Flo',
        model: 'Image L80',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Large studio soft light. DMX control. Replaces Image 87.',
        daily_rate_est: 250,
        specs: { power_consumption: '340 W', type: 'Panel (Studio)' }
    },
    {
        id: 'light-kino-image-l40',
        name: 'Kino Flo Image L40 LED',
        brand: 'Kino Flo',
        model: 'Image L40',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Medium studio soft light. Replaces Image 47.',
        daily_rate_est: 200,
        specs: { power_consumption: '170 W', type: 'Panel (Studio)' }
    },

    // ==========================================
    // KINO FLO MIMIK (IMAGE BASED)
    // ==========================================
    {
        id: 'light-kino-mimik-120',
        name: 'Kino Flo MImik 120',
        brand: 'Kino Flo',
        model: 'MImik 120',
        category: 'Lighting',
        subcategory: 'LED',
        description: 'Image Based Lighting tile. 7200 pixels. For virtual production.',
        daily_rate_est: 500,
        specs: { power_consumption: '400 W', type: 'IBL Tile', dimensions: '120x60 cm' }
    },

    // ==========================================
    // KINO FLO LEGACY (FLOURESCENT)
    // ==========================================
    {
        id: 'light-kino-4bank-4ft',
        name: 'Kino Flo 4Bank 4ft System',
        brand: 'Kino Flo',
        model: '4Bank 4ft',
        category: 'Lighting',
        subcategory: 'Daylight', // Defaults to Daylight usually
        description: 'Classic 4-tube fluorescent system. Tungsten or Daylight tubes.',
        daily_rate_est: 80,
        specs: { lamp_type: 'F75 Tube', length: '4 ft', type: 'Fluorescent' }
    },
    {
        id: 'light-kino-4bank-2ft',
        name: 'Kino Flo 4Bank 2ft System',
        brand: 'Kino Flo',
        model: '4Bank 2ft',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: 'Classic 2ft 4-tube fluorescent system.',
        daily_rate_est: 60,
        specs: { lamp_type: 'F40 Tube', length: '2 ft', type: 'Fluorescent' }
    },
    {
        id: 'light-kino-single-4ft',
        name: 'Kino Flo Single 4ft System',
        brand: 'Kino Flo',
        model: 'Single 4ft',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: 'Single tube fluorescent system.',
        daily_rate_est: 30,
        specs: { type: 'Fluorescent' }
    },
    {
        id: 'light-kino-image-87',
        name: 'Kino Flo Image 87',
        brand: 'Kino Flo',
        model: 'Image 87',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: 'Large fluorescent studio fixture. 8 Tubes.',
        daily_rate_est: 100,
        specs: { lamp_type: 'F75 Tube', quantity: '8 Tubes' }
    },

    // ==========================================
    // KINO FLO ACCESSORIES (LOUVERS, CABLES, SNAP)
    // ==========================================
    {
        id: 'light-kino-louver-celeb-250-90',
        name: 'Honeycomb Louver 90° for Celeb 250',
        brand: 'Kino Flo',
        model: 'Louver 90° Celeb 250',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Control grid for Celeb 250.',
        daily_rate_est: 25,
        specs: { angle: '90 degrees' }
    },
    {
        id: 'light-kino-louver-freestyle-31-60',
        name: 'Honeycomb Louver 60° for FreeStyle 31',
        brand: 'Kino Flo',
        model: 'Louver 60° FreeStyle 31',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Control grid for FreeStyle 31 panel.',
        daily_rate_est: 25,
        specs: { angle: '60 degrees' }
    },
    {
        id: 'light-kino-snapbag-celeb-250',
        name: 'SnapBag for Celeb 250',
        brand: 'DoPchoice',
        model: 'SnapBag Celeb 250',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Softbox for Celeb 250 LED.',
        daily_rate_est: 40,
        specs: { type: 'Softbox' }
    },
    {
        id: 'light-kino-snapgrid-snapbag',
        name: 'SnapGrid 40° for SnapBag',
        brand: 'DoPchoice',
        model: 'SnapGrid 40°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Grid for SnapBag softbox.',
        daily_rate_est: 25,
        specs: { angle: '40 degrees' }
    },
    {
        id: 'light-kino-mount-center',
        name: 'Kino Flo Center Mount',
        brand: 'Kino Flo',
        model: 'Center Mount',
        category: 'Lighting',
        subcategory: 'Accessory',
        description: 'Mounting plate with baby receiver.',
        daily_rate_est: 10,
        specs: { mount: 'Baby Receiver' }
    },
    {
        id: 'light-kino-cable-25',
        name: 'Kino Flo Head Cable 25ft',
        brand: 'Kino Flo',
        model: 'Head Cable 25ft',
        category: 'Lighting',
        subcategory: 'Accessory',
        description: 'Extension cable for FreeStyle/4Bank controllers.',
        daily_rate_est: 10,
        specs: { length: '25 ft' }
    },

    // ==========================================
    // MISSING APUTURE NOVA MODIFIERS
    // ==========================================
    {
        id: 'light-aputure-nova-p300c-softbox',
        name: 'Aputure Nova P300c Softbox',
        brand: 'Aputure',
        model: 'Nova P300c Softbox',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Rectangular softbox for P300c.',
        daily_rate_est: 35,
        specs: { mount: 'Nova Frame' }
    },
    {
        id: 'light-aputure-nova-p300c-barndoors',
        name: 'Aputure Nova P300c Barndoors',
        brand: 'Aputure',
        model: 'Nova P300c Barndoors',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '4-Leaf Barndoors for light control.',
        daily_rate_est: 20,
        specs: { mount: 'Nova Frame' }
    },
    {
        id: 'light-aputure-lantern-skirt',
        name: 'Aputure Lantern Skirt',
        brand: 'Aputure',
        model: 'Lantern Skirt',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Control skirt for Aputure Lantern.',
        daily_rate_est: 10,
        specs: { compatibility: 'Lantern' }
    },

    // ==========================================
    // NANLUX EVOKE SERIES (HIGH OUTPUT COB)
    // ==========================================
    {
        id: 'light-nanlux-evoke-2400b',
        name: 'Nanlux Evoke 2400B',
        brand: 'Nanlux',
        model: 'Evoke 2400B',
        category: 'Lighting',
        subcategory: 'LED',
        description: '2400W Bi-Color COB. 10K/4K HMI Equivalent. IP55.',
        daily_rate_est: 800,
        image_url: 'https://www.nanlux.com/en/uploads/20231102/33ebc5e9f8f4a0a54e95655747656363.jpg',
        specs: { power_consumption: '2400 W', color_temperature: '2700K-6500K', cri: '96', mount: 'NL Mount', ip_rating: 'IP55' }
    },
    {
        id: 'light-nanlux-evoke-1200b',
        name: 'Nanlux Evoke 1200B',
        brand: 'Nanlux',
        model: 'Evoke 1200B',
        category: 'Lighting',
        subcategory: 'LED',
        description: '1200W Bi-Color COB. The 1.2K HMI Killer.',
        daily_rate_est: 450,
        image_url: 'https://www.nanlux.com/en/uploads/20220610/b846e4c2578505555555555555555555.jpg',
        specs: { power_consumption: '1200 W', color_temperature: '2700K-6500K', cri: '96', mount: 'NL Mount', ip_rating: 'IP54' }
    },
    {
        id: 'light-nanlux-evoke-1200d',
        name: 'Nanlux Evoke 1200D',
        brand: 'Nanlux',
        model: 'Evoke 1200',
        category: 'Lighting',
        subcategory: 'LED',
        description: '1200W Daylight COB. Intense output.',
        daily_rate_est: 400,
        image_url: 'https://www.nanlux.com/en/uploads/20210714/22222222222222222222222222222222.jpg',
        specs: { power_consumption: '1200 W', color_temperature: '5600K', cri: '96', mount: 'NL Mount', ip_rating: 'IP54' }
    },
    {
        id: 'light-nanlux-evoke-900c',
        name: 'Nanlux Evoke 900C',
        brand: 'Nanlux',
        model: 'Evoke 900C',
        category: 'Lighting',
        subcategory: 'LED',
        description: '940W RGBWW Color COB. High output color.',
        daily_rate_est: 500,
        image_url: 'https://www.nanlux.com/en/uploads/20230501/7a4d5a4d5a4d5a4d5a4d5a4d5a4d5a4d.jpg',
        specs: { power_consumption: '940 W', color_temperature: '1800K-20000K', cri: '96', mount: 'NL Mount', ip_rating: 'IP55' }
    },

    // ==========================================
    // NANLUX DYNO SERIES (SOFT PANEL)
    // ==========================================
    {
        id: 'light-nanlux-dyno-1200c',
        name: 'Nanlux Dyno 1200C',
        brand: 'Nanlux',
        model: 'Dyno 1200C',
        category: 'Lighting',
        subcategory: 'LED',
        description: '1200W RGBWW Panel. Soft, powerful, tunable. SkyPanel S360 Competitor.',
        daily_rate_est: 700,
        image_url: 'https://www.nanlux.com/en/uploads/20201020/dyno1200c.jpg',
        specs: { power_consumption: '1200 W', color_temperature: '2700K-20000K', cri: '95', type: 'Panel', weight_kg: 26 }
    },
    {
        id: 'light-nanlux-dyno-650c',
        name: 'Nanlux Dyno 650C',
        brand: 'Nanlux',
        model: 'Dyno 650C',
        category: 'Lighting',
        subcategory: 'LED',
        description: '650W RGBWW Panel. Compact powerhouse.',
        daily_rate_est: 400,
        image_url: 'https://www.nanlux.com/en/uploads/20201020/dyno650c.jpg',
        specs: { power_consumption: '650 W', color_temperature: '2700K-20000K', cri: '95', type: 'Panel', weight_kg: 16 }
    },

    // ==========================================
    // NANLUX TK SERIES (SOFT PANEL)
    // ==========================================
    {
        id: 'light-nanlux-tk-140b',
        name: 'Nanlux TK-140B',
        brand: 'Nanlux',
        model: 'TK-140B',
        category: 'Lighting',
        subcategory: 'LED',
        description: '160W Bi-Color Soft Panel. Thin and silent.',
        daily_rate_est: 100,
        specs: { power_consumption: '160 W', color_temperature: '2700K-7500K', type: 'Panel' }
    },
    {
        id: 'light-nanlux-tk-280b',
        name: 'Nanlux TK-280B',
        brand: 'Nanlux',
        model: 'TK-280B',
        category: 'Lighting',
        subcategory: 'LED',
        description: '280W Bi-Color Soft Panel. Large surface area.',
        daily_rate_est: 180,
        specs: { power_consumption: '280 W', color_temperature: '2700K-7500K', type: 'Panel' }
    },

    // ==========================================
    // NANLUX ACCESSORIES (NL MOUNT)
    // ==========================================
    {
        id: 'light-nanlux-fl-35',
        name: 'Nanlux FL-35 Fresnel',
        brand: 'Nanlux',
        model: 'FL-35',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Motorized Fresnel Lens for Evoke 1200/2400.',
        daily_rate_est: 150,
        specs: { mount: 'NL Mount', diameter: '35 cm' }
    },
    {
        id: 'light-nanlux-fl-35-yz',
        name: 'Nanlux FL-35 Yoke',
        brand: 'Nanlux',
        model: 'FL-35 Yoke',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Yoke for FL-35 Fresnel support.',
        daily_rate_est: 20,
        specs: { compatibility: 'FL-35' }
    },
    {
        id: 'light-nanlux-para-150',
        name: 'Nanlux Parabolic 150 Softbox',
        brand: 'Nanlux',
        model: 'Para 150',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '150cm Deep Parabolic Softbox for NL Mount.',
        daily_rate_est: 60,
        specs: { mount: 'NL Mount', diameter: '150 cm' }
    },
    {
        id: 'light-nanlux-para-100',
        name: 'Nanlux Parabolic 100 Softbox',
        brand: 'Nanlux',
        model: 'Para 100',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '100cm Parabolic Softbox for NL Mount.',
        daily_rate_est: 50,
        specs: { mount: 'NL Mount', diameter: '100 cm' }
    },
    {
        id: 'light-nanlux-lantern-120',
        name: 'Nanlux Lantern 120',
        brand: 'Nanlux',
        model: 'Lantern 120',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '120cm Lantern Softbox for Evoke.',
        daily_rate_est: 50,
        specs: { mount: 'NL Mount', diameter: '120 cm' }
    },
    {
        id: 'light-nanlux-reflector-45',
        name: 'Nanlux 45° Reflector',
        brand: 'Nanlux',
        model: 'Reflector 45°',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Standard 45 degree reflector for Evoke.',
        daily_rate_est: 20,
        specs: { mount: 'NL Mount', angle: '45 degrees' }
    },
    {
        id: 'light-nanlux-case-evoke',
        name: 'Nanlux Evoke Flight Case',
        brand: 'Nanlux',
        model: 'Evoke Case',
        category: 'Lighting',
        subcategory: 'Accessory',
        description: 'Hard case for Evoke fixture.',
        daily_rate_est: 25,
        specs: { type: 'Case' }
    },

    // ==========================================
    // NANLITE FORZA SERIES (COB MONOLIGHTS)
    // ==========================================
    {
        id: 'light-nanlite-forza-720b',
        name: 'Nanlite Forza 720B',
        brand: 'Nanlite',
        model: 'Forza 720B',
        category: 'Lighting',
        subcategory: 'LED',
        description: '800W Bi-Color LED. Nanlite\'s brightest spot.',
        daily_rate_est: 350,
        image_url: 'https://cdn.nanliteus.com/products/Forza-720B-Angle.jpg',
        specs: { power_consumption: '800 W', color_temperature: '2700K-6500K', cri: '96', mount: 'Bowens' }
    },
    {
        id: 'light-nanlite-forza-720',
        name: 'Nanlite Forza 720',
        brand: 'Nanlite',
        model: 'Forza 720',
        category: 'Lighting',
        subcategory: 'LED',
        description: '800W Daylight LED. Extreme output.',
        daily_rate_est: 300,
        image_url: 'https://cdn.nanliteus.com/products/Forza-720-Angle.jpg',
        specs: { power_consumption: '800 W', color_temperature: '5600K', cri: '95', mount: 'Bowens' }
    },
    {
        id: 'light-nanlite-forza-500b-ii',
        name: 'Nanlite Forza 500B II',
        brand: 'Nanlite',
        model: 'Forza 500B II',
        category: 'Lighting',
        subcategory: 'LED',
        description: '500W Bi-Color LED. Second Gen with G/M shift.',
        daily_rate_est: 250,
        specs: { power_consumption: '500 W', color_temperature: '2700K-6500K', cri: '96', mount: 'Bowens' }
    },
    {
        id: 'light-nanlite-forza-300b-ii',
        name: 'Nanlite Forza 300B II',
        brand: 'Nanlite',
        model: 'Forza 300B II',
        category: 'Lighting',
        subcategory: 'LED',
        description: '300W Bi-Color LED. Compact powerhouse.',
        daily_rate_est: 150,
        specs: { power_consumption: '300 W', color_temperature: '2700K-6500K', cri: '96', mount: 'Bowens' }
    },
    {
        id: 'light-nanlite-forza-150b',
        name: 'Nanlite Forza 150B',
        brand: 'Nanlite',
        model: 'Forza 150B',
        category: 'Lighting',
        subcategory: 'LED',
        description: '170W Bi-Color. Ultra compact with FM mount (Bowens adapter included).',
        daily_rate_est: 80,
        specs: { power_consumption: '170 W', color_temperature: '2700K-6500K', mount: 'FM Mount / Bowens' }
    },
    {
        id: 'light-nanlite-forza-60b-ii',
        name: 'Nanlite Forza 60B II',
        brand: 'Nanlite',
        model: 'Forza 60B II',
        category: 'Lighting',
        subcategory: 'LED',
        description: '60W Bi-Color. Palm-sized.',
        daily_rate_est: 50,
        specs: { power_consumption: '60 W', color_temperature: '2700K-6500K', mount: 'FM Mount' }
    },

    // ==========================================
    // NANLITE PAVOTUBE SERIES (TUBES)
    // ==========================================
    {
        id: 'light-nanlite-pavotube-ii-30x-4kit',
        name: 'Nanlite PavoTube II 30X 4-Kit',
        brand: 'Nanlite',
        model: 'PavoTube II 30X',
        category: 'Lighting',
        subcategory: 'LED',
        description: '4ft RGBWW Pixel Tubes. Metal housing. 4-Light Kit.',
        daily_rate_est: 200,
        image_url: 'https://cdn.nanliteus.com/products/PavoTube-II-30X-4Kit.jpg',
        specs: { length: '4 ft', type: 'Tube', pixels: '16', quantity: '4 Tubes' }
    },
    {
        id: 'light-nanlite-pavotube-ii-15x-4kit',
        name: 'Nanlite PavoTube II 15X 4-Kit',
        brand: 'Nanlite',
        model: 'PavoTube II 15X',
        category: 'Lighting',
        subcategory: 'LED',
        description: '2ft RGBWW Pixel Tubes. 4-Light Kit.',
        daily_rate_est: 150,
        specs: { length: '2 ft', type: 'Tube', pixels: '8', quantity: '4 Tubes' }
    },
    {
        id: 'light-nanlite-pavotube-ii-60x',
        name: 'Nanlite PavoTube II 60X',
        brand: 'Nanlite',
        model: 'PavoTube II 60X',
        category: 'Lighting',
        subcategory: 'LED',
        description: '8ft RGBWW Pixel Tube. Single unit.',
        daily_rate_est: 80,
        specs: { length: '8 ft', type: 'Tube', pixels: '32' }
    },
    {
        id: 'light-nanlite-pavotube-ii-30c-4kit',
        name: 'Nanlite PavoTube II 30C 4-Kit',
        brand: 'Nanlite',
        model: 'PavoTube II 30C',
        category: 'Lighting',
        subcategory: 'LED',
        description: '4ft RGBWW Tubes. Classic budget friendly. 4-Light Kit.',
        daily_rate_est: 120,
        specs: { length: '4 ft', type: 'Tube', quantity: '4 Tubes' }
    },

    // ==========================================
    // NANLITE PANELS (PAVOSLIM & MIXPANEL)
    // ==========================================
    {
        id: 'light-nanlite-pavoslim-120c',
        name: 'Nanlite PavoSlim 120C',
        brand: 'Nanlite',
        model: 'PavoSlim 120C',
        category: 'Lighting',
        subcategory: 'LED',
        description: '150W RGBWW Thin Panel. 2x1 form factor. Very bright.',
        daily_rate_est: 150,
        image_url: 'https://cdn.nanliteus.com/products/PavoSlim-120C.jpg',
        specs: { power_consumption: '150 W', color_temperature: '2700K-7500K', type: 'Panel', dimensions: '2x1 ft' }
    },
    {
        id: 'light-nanlite-pavoslim-60c',
        name: 'Nanlite PavoSlim 60C',
        brand: 'Nanlite',
        model: 'PavoSlim 60C',
        category: 'Lighting',
        subcategory: 'LED',
        description: '72W RGBWW Thin Panel. 1x1 form factor.',
        daily_rate_est: 100,
        specs: { power_consumption: '72 W', color_temperature: '2700K-7500K', type: 'Panel', dimensions: '1x1 ft' }
    },
    {
        id: 'light-nanlite-mixpanel-150',
        name: 'Nanlite MixPanel 150',
        brand: 'Nanlite',
        model: 'MixPanel 150',
        category: 'Lighting',
        subcategory: 'LED',
        description: '150W RGBWW Hard/Soft Panel. Switchable diffusion.',
        daily_rate_est: 120,
        specs: { power_consumption: '150 W', type: 'Panel', feature: 'Hard/Soft Switch' }
    },

    // ==========================================
    // NANLITE ACCESSORIES
    // ==========================================
    {
        id: 'light-nanlite-pj-bm-19',
        name: 'Nanlite Projection Attach. 19° (Bowens)',
        brand: 'Nanlite',
        model: 'PJ-BM-19',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Projection mount for Forza 200/300/500/720.',
        daily_rate_est: 60,
        specs: { mount: 'Bowens', angle: '19 degrees' }
    },
    {
        id: 'light-nanlite-pj-bm-36',
        name: 'Nanlite Projection Attach. 36° (Bowens)',
        brand: 'Nanlite',
        model: 'PJ-BM-36',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Projection mount for Forza.',
        daily_rate_est: 60,
        specs: { mount: 'Bowens', angle: '36 degrees' }
    },
    {
        id: 'light-nanlite-fl-20g',
        name: 'Nanlite FL-20G Fresnel',
        brand: 'Nanlite',
        model: 'FL-20G',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Glass Fresnel for Bowens mount fixtures.',
        daily_rate_est: 35,
        specs: { mount: 'Bowens', angle: '10-45 degrees' }
    },
    {
        id: 'light-nanlite-para-120',
        name: 'Nanlite Para 120 Softbox',
        brand: 'Nanlite',
        model: 'Para 120',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '120cm Quick-Open Softbox.',
        daily_rate_est: 40,
        specs: { mount: 'Bowens', diameter: '120 cm' }
    },
    {
        id: 'light-nanlite-para-90',
        name: 'Nanlite Para 90 Softbox',
        brand: 'Nanlite',
        model: 'Para 90',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: '90cm Quick-Open Softbox.',
        daily_rate_est: 30,
        specs: { mount: 'Bowens', diameter: '90 cm' }
    },
    {
        id: 'light-nanlite-pj-fm',
        name: 'Nanlite FM Mount Projection 19°',
        brand: 'Nanlite',
        model: 'PJ-FMM-19',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Mini projection mount for Forza 60/150.',
        daily_rate_est: 40,
        specs: { mount: 'FM Mount', angle: '19 degrees' }
    },

    // ==========================================
    // DEDOLIGHT CLASSIC TUNGSTEN
    // ==========================================
    {
        id: 'light-dedo-dlh4',
        name: 'Dedolight DLH4',
        brand: 'Dedolight',
        model: 'DLH4',
        category: 'Lighting',
        subcategory: 'Tungsten',
        description: 'The Classic 150W Tungsten Head. Precision output. Aspheric lens.',
        daily_rate_est: 50,
        image_url: 'https://www.dedolight.com/generated/images/products/DLH4.jpg',
        specs: { power_consumption: '150 W', lens_diameter: 'Aspheric', dimmable: 'Yes (with DT24)', weight_kg: 0.6 }
    },
    {
        id: 'light-dedo-dlh650',
        name: 'Dedolight DLH650',
        brand: 'Dedolight',
        model: 'DLH650',
        category: 'Lighting',
        subcategory: 'Tungsten',
        description: '650W Tungsten Head. Larger output than DLH4.',
        daily_rate_est: 80,
        image_url: 'https://www.dedolight.com/generated/images/products/DLH650.jpg',
        specs: { power_consumption: '650 W', weight_kg: 3.4 }
    },

    // ==========================================
    // DEDOLIGHT DLED SERIES (FOCUSING LED)
    // ==========================================
    {
        id: 'light-dedo-dled7-turbo',
        name: 'Dedolight DLED7 Turbo Bi-Color',
        brand: 'Dedolight',
        model: 'DLED7-BI',
        category: 'Lighting',
        subcategory: 'LED',
        description: '90W Bi-Color Focusing LED. Silent. DLH4 equivalent.',
        daily_rate_est: 120,
        image_url: 'https://www.dedolight.com/generated/images/products/DLED7.jpg',
        specs: { power_consumption: '90 W', color_temperature: '2700K-6500K', cri: '96', focus_range: '60-4 degrees' }
    },
    {
        id: 'light-dedo-dled10-bi',
        name: 'Dedolight DLED10 Bi-Color',
        brand: 'Dedolight',
        model: 'DLED10-BI',
        category: 'Lighting',
        subcategory: 'LED',
        description: '220W Bi-Color Focusing LED. Studio workhorse.',
        daily_rate_est: 200,
        image_url: 'https://www.dedolight.com/generated/images/products/DLED10.jpg',
        specs: { power_consumption: '220 W', color_temperature: '2700K-6500K', cri: '95' }
    },
    {
        id: 'light-dedo-dled3-bi',
        name: 'Dedolight DLED3 Micro',
        brand: 'Dedolight',
        model: 'DLED3-BI',
        category: 'Lighting',
        subcategory: 'LED',
        description: '40W Micro Focusing LED. Bi-Color.',
        daily_rate_est: 80,
        specs: { power_consumption: '40 W', color_temperature: '2700K-6500K' }
    },

    // ==========================================
    // DEDOLIGHT HMI SERIES
    // ==========================================
    {
        id: 'light-dedo-dlh400dt',
        name: 'Dedolight DLH400DT',
        brand: 'Dedolight',
        model: 'DLH400DT',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '400W HMI Focusing Light. Extremely bright for size.',
        daily_rate_est: 250,
        image_url: 'https://www.dedolight.com/generated/images/products/DLH400DT.jpg',
        specs: { lamp_type: 'HMI 400 W', focus_range: '50-4.5 degrees' }
    },
    {
        id: 'light-dedo-dlh200dt',
        name: 'Dedolight DLH200DT',
        brand: 'Dedolight',
        model: 'DLH200DT',
        category: 'Lighting',
        subcategory: 'Daylight',
        description: '200W HMI Focusing Light.',
        daily_rate_est: 180,
        specs: { lamp_type: 'HMI 200 W' }
    },

    // ==========================================
    // DEDOLIGHT PRECISION OPTICS (ACCESSORIES)
    // ==========================================
    {
        id: 'light-dedo-dp1-imager',
        name: 'Dedolight DP1.1 Imager',
        brand: 'Dedolight',
        model: 'DP1.1',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Universal Projection Attachment. Cleanest beam in industry.',
        daily_rate_est: 60,
        specs: { compatibility: 'DLH4 / DLED7 / DLH200', type: 'Projector' }
    },
    {
        id: 'light-dedo-dp2-imager',
        name: 'Dedolight DP2.1 Imager (Shutter)',
        brand: 'Dedolight',
        model: 'DP2.1',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Projection Attachment with 4 framing shutters.',
        daily_rate_est: 70,
        specs: { compatibility: 'DLH4 / DLED7 / DLH200', type: 'Projector with Shutters' }
    },
    {
        id: 'light-dedo-dpba-7',
        name: 'Dedolight DPBA-7 Parallel Beam',
        brand: 'Dedolight',
        model: 'DPBA-7',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Parallel Beam Intensifier for DLED7/DLH4. For Lightstream.',
        daily_rate_est: 50,
        specs: { output_gain: 'up to 500%', beam: 'Parallel' }
    },
    {
        id: 'light-dedo-dpba-14',
        name: 'Dedolight DPBA-14 Parallel Beam',
        brand: 'Dedolight',
        model: 'DPBA-14',
        category: 'Lighting',
        subcategory: 'Modifier',
        description: 'Parallel Beam Intensifier for larger heads.',
        daily_rate_est: 80,
        specs: { output_gain: 'up to 300%' }
    },
    {
        id: 'light-dedo-gobo-holder',
        name: 'Dedolight Gobo Holder (M Size)',
        brand: 'Dedolight',
        model: 'DGH',
        category: 'Lighting',
        subcategory: 'Accessory',
        description: 'Gobo holder for DP1/DP2.',
        daily_rate_est: 10,
        specs: { size: 'M Size' }
    },
    {
        id: 'light-dedo-iris',
        name: 'Dedolight Iris (18-leaf)',
        brand: 'Dedolight',
        model: 'DP18',
        category: 'Lighting',
        subcategory: 'Accessory',
        description: '18-leaf iris for DP1 projection attachment.',
        daily_rate_est: 20,
        specs: { leaves: '18' }
    }
];

export async function seedLighting() {
    console.log('Seeding Comprehensive ARRI Lighting data...');

    for (const item of lightingData) {
        // manually map fields and cast to any to allow flexible spec injection
        const { specs, image_url, ...rest } = item as any;

        const dataToSave = {
            ...rest,
            imageUrl: image_url, // MAP to camelCase column
            category: 'LIT',
            specs_json: JSON.stringify(specs)
        };

        await prisma.equipmentItem.upsert({
            where: { id: item.id },
            update: dataToSave,
            create: dataToSave
        });
    }
    console.log(`Lighting seeded: ${lightingData.length} items`);
}
