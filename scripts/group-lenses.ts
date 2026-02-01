
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function groupLenses() {
    console.log("📦 Starting Intelligent Lens Grouping...");
    console.log("ℹ️  Threshold: > 1 Lens = Set");

    const lenses = await prisma.equipmentItem.findMany({
        where: {
            category: "LNS",
            parentId: null // Only look at loose lenses
        }
    });

    console.log(`Found ${lenses.length} loose lenses.`);

    // Group items by Brand + Series
    // Logic: "Cooke S4/i 25mm" -> key "Cooke S4/i"
    // Regex matches common patterns removing "100mm", "T2.0", etc.
    const groups = new Map<string, typeof lenses>();

    lenses.forEach(lens => {
        // Extract Series Name
        // 1. Remove obvious focal lengths (e.g. "25mm")
        // 2. Remove aperture (e.g. "T2.0", "f/1.4")
        // 3. Trim
        let seriesName = lens.model
            .replace(/\b\d+mm\b/gi, '')
            .replace(/\s*T\d+(\.\d+)?\s*/gi, '')
            .replace(/\s*f\/\d+(\.\d+)?\s*/gi, '')
            .replace(/official technical spec.*/gi, '') // Remove researched suffix
            .replace(/\s+/g, ' ')
            .trim();

        // Fallback if model is empty or name is better
        if (seriesName.length < 5) {
            seriesName = lens.name
                .replace(/\b\d+mm\b/gi, '')
                .replace(/\s*T\d+(\.\d+)?\s*/gi, '')
                .replace(/official technical spec.*/gi, '')
                .trim();
        }

        // Ensure seriesName doesn't already start with the brand to avoid "Cooke Cooke"
        const brandPrefixRegex = new RegExp(`^${lens.brand}\\b`, 'i');
        const cleanSeries = seriesName.replace(brandPrefixRegex, '').trim();

        const key = `${lens.brand} ${cleanSeries}`.trim();

        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key)!.push(lens);
    });

    let setsCreated = 0;

    for (const [key, items] of groups.entries()) {
        if (items.length > 1) { // User Rule: > 1 is a Set
            console.log(`   🧩 Found Group: "${key}" (${items.length} lenses)`);

            // Create Parent Item
            const parent = await prisma.equipmentItem.create({
                data: {
                    name: `${key} Set`, // e.g. "Cooke S4/i Set"
                    brand: items[0].brand,
                    model: `${key.replace(items[0].brand, '').trim()} Set`,
                    category: "LNS",
                    subcategory: items[0].subcategory === 'Anamorphic' ? 'Anamorphic Set' : 'Prime Set',
                    description: `Automated Set containing ${items.length} lenses: ${items.map(i => i.name.match(/\d+mm/)?.[0] || i.name).join(', ')}.`,
                    daily_rate_est: items.reduce((acc, i) => acc + i.daily_rate_est, 0) * 0.8, // 20% discount for set?
                    isAiResearched: true,
                    status: "APPROVED"
                }
            });

            // Link Children
            for (const item of items) {
                await prisma.equipmentItem.update({
                    where: { id: item.id },
                    data: { parentId: parent.id }
                });
            }

            console.log(`     ✅ Created Set: ${parent.name}`);
            setsCreated++;
        }
    }

    console.log(`🏁 Grouping Complete. Created ${setsCreated} sets.`);
}

groupLenses().catch(console.error).finally(() => prisma.$disconnect());
