import { PrismaClient } from '@prisma/client';
import { equipmentData } from '../lib/seed-data';
import { seedLenses } from './seed-lenses';
import { seedVantageLenses } from './seed-vantage';
import { seedSupportItems } from './seed-support';
import { seedLighting } from './seed-lighting';
import { seedAlexaXtreme } from './seed-alexa-xtreme';
import { seedVintageLenses } from './seed-vintage';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing items in correct order to match FK constraints
    console.log('Cleaning up old data...');
    // Items depend on Kits and Equipment
    await prisma.kitItem.deleteMany();
    // Kits depend on nothing (except Users, but we are not deleting users yet)
    await prisma.kit.deleteMany();

    // Equipment is referenced by KitItems (now deleted)
    await prisma.equipmentItem.deleteMany();

    console.log('Inserting new equipment data...');

    for (const item of equipmentData) {
        // Flatten the structure for Prisma
        const { specs, ...baseData } = item;

        await prisma.equipmentItem.create({
            data: {
                id: item.id, // Keep the custom IDs
                name: item.name,
                brand: item.brand,
                model: item.model,
                category: (() => {
                    const c = (item.category as string).toLowerCase();
                    if (c.startsWith('cam')) return 'CAM';
                    if (c.startsWith('lens')) return 'LNS';
                    if (c.startsWith('light')) return 'LIT';
                    return 'SUP';
                })(),
                subcategory: (() => {
                    const c = (item.category as string).toLowerCase();
                    if (c === 'filter') return 'Filters';
                    if (c === 'monitor') return 'Monitors';
                    return item.subcategory;
                })(),
                description: item.description,
                daily_rate_est: item.daily_rate_est,
                // MAP HERE: Type has image_url, DB has imageUrl
                imageUrl: item.image_url,

                // Flatten specs into columns
                mount: specs.mount as any,
                weight_kg: specs.weight_kg,
                resolution: specs.resolution,
                sensor_size: specs.sensor_coverage || specs.sensor_size, // Favor standard labels for CAM filters
                sensor_type: specs.sensor_type,
                image_circle_mm: specs.image_circle_mm,
                focal_length: specs.focal_length,
                aperture: specs.aperture,
                power_draw_w: specs.power_draw_w,
                close_focus_m: specs.close_focus_m,
                front_diameter_mm: specs.front_diameter_mm,
                length_mm: specs.length_mm,
                squeeze: specs.squeeze,
                coverage: specs.sensor_coverage, // New field mapping
                sensor_coverage: specs.sensor_coverage,

                // JSON Fields
                recordingFormats: specs.recording_formats ? JSON.stringify(specs.recording_formats) : null,
                technicalData: item.technical_data ? JSON.stringify(item.technical_data) : null,
                labMetrics: item.lab_metrics ? JSON.stringify(item.lab_metrics) : null,
            },
        });
    }

    console.log(`Seeding finished.Added ${equipmentData.length} items.`);

    // Seed new lenses
    await seedLighting();
    await seedLenses();
    await seedVantageLenses();
    await seedVintageLenses();
    await seedSupportItems();

    // Seed ALEXA 35 Xtreme
    // await seedAlexaXtreme();
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
