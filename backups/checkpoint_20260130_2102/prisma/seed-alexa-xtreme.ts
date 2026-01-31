import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const xtremeData = [
    {
        id: 'arri-alexa-35-xtreme',
        name: 'ARRI ALEXA 35 Xtreme',
        brand: 'ARRI',
        model: 'ALEXA 35 Xtreme',
        category: 'Camera',
        subcategory: 'High Speed Cinema',
        description: 'The ALEXA 35 Xtreme introduces 660 fps high-speed recording and the efficient ARRICORE codec. Features Sensor Overdrive and enhanced pre-recording buffer.',
        daily_rate_est: 1800,
        imageUrl: '/equipment/alexa_35_xtreme.png',
        mount: 'LPL',
        weight_kg: 3.0,
        resolution: '4.6K',
        sensor_size: '27.99 x 19.22', // Super 35
        sensor_type: 'ALEV 4 CMOS (Xtreme)',
        recordingFormats: [
            { resolution: '4.6K', codec: 'ARRICORE', max_fps: 330, data_rate: 'Optimized' },
            { resolution: '4.6K', codec: 'ARRIRAW', max_fps: 120 },
            { resolution: '4K', codec: 'ARRICORE (Overdrive)', max_fps: 660 }
        ],
        labMetrics: {
            dynamic_range_stops: { snr_2: 17, snr_1: 18.5 },
            rolling_shutter_ms: 8.0,
            base_iso: 800,
            latitude_stops: 11
        },
        technicalData: {
            "Dynamic Range": "17 stops (Std) / 11 stops (Overdrive)",
            "High Speed": "330 fps (Std) / 660 fps (Overdrive)",
            "Codec": "ARRICORE & ARRIRAW",
            "Pre-Record": "Up to 5 minutes",
            "Power": "10% more efficient"
        }
    }
];

export async function seedAlexaXtreme() {
    console.log('Seeding ALEXA 35 Xtreme...');

    for (const item of xtremeData) {
        // Flatten structure for Prisma (handling JSON fields manually if type doesn't match directly)
        const { recordingFormats, labMetrics, technicalData, ...baseData } = item;

        await prisma.equipmentItem.upsert({
            where: { id: item.id },
            update: {
                ...baseData,
                recordingFormats: JSON.stringify(recordingFormats),
                labMetrics: JSON.stringify(labMetrics),
                technicalData: JSON.stringify(technicalData),
            },
            create: {
                ...baseData,
                recordingFormats: JSON.stringify(recordingFormats),
                labMetrics: JSON.stringify(labMetrics),
                technicalData: JSON.stringify(technicalData),
            },
        });
    }
    console.log('ALEXA 35 Xtreme seeded.');
}
