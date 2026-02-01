
import { searchTechnicalSpecs } from "../lib/serp-api";
import { researchEquipment } from "../lib/catalog-research";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BRANDS_BY_CATEGORY: Record<string, string[]> = {
    "Head": ["OConnor", "Sachtler", "Cartoni", "Miller"],
    "Tripod": ["Sachtler", "Ronford Baker", "Cartoni"],
    "Mattebox": ["ARRI", "Bright Tangerine", "Chrosziel", "Tilta", "Wooden Camera"],
    "Follow Focus": ["ARRI", "Teradek", "Tilta", "Preston Cinema", "Cmotion"],
    "Wireless Video": ["Teradek", "Vaxis", "Hollyland"],
    "Batteries": ["Anton Bauer", "Core SWX", "Bebob", "IDX", "Hawk-Woods"],
    "Monitors": ["SmallHD", "Atomos", "TVLogic", "Flanders Scientific"],
    "Rigging": ["Wooden Camera", "Shape", "Vocas", "Bright Tangerine", "8Sinn"]
};

async function mineSupportGear() {
    console.log("🚀 Starting Deep Support Gear Mining...");

    for (const [category, brands] of Object.entries(BRANDS_BY_CATEGORY)) {
        console.log(`\n📂 Category: ${category}`);

        for (const brand of brands) {
            console.log(`   🏗️  Investigating Brand: ${brand}`);

            // Step 1: Discover specific products for this brand and category
            const discoveryQuery = `professional cinema ${brand} ${category} current products models list`;
            const discoveryResults = await searchTechnicalSpecs(discoveryQuery);

            const productsToResearch: string[] = [];

            // Targeted extraction from knowledge graph and organic results
            if (discoveryResults.knowledge_graph?.title && discoveryResults.knowledge_graph.title.toLowerCase().includes(brand.toLowerCase())) {
                productsToResearch.push(discoveryResults.knowledge_graph.title);
            }

            if (discoveryResults.organic_results) {
                discoveryResults.organic_results.slice(0, 5).forEach(res => {
                    const title = res.title.split('|')[0].split('-')[0].split(':').shift()?.trim();
                    if (title && title.length > 5 && title.toLowerCase().includes(brand.toLowerCase())) {
                        productsToResearch.push(title);
                    }
                });
            }

            // Step 2: Research each unique product
            const uniqueProducts = [...new Set(productsToResearch)];
            console.log(`      Found ${uniqueProducts.length} potential products for ${brand}`);

            for (const productName of uniqueProducts) {
                console.log(`      🔎 Researching: ${productName}...`);
                try {
                    const specs = await researchEquipment(productName);

                    if (specs && specs.length > 0) {
                        const item = specs[0];
                        // Ensure the category is correctly mapped to SUP
                        item.category = "SUP";
                        item.subcategory = category;

                        console.log(`      ✨ Found: ${item.brand} ${item.model}`);

                        // Step 3: Upsert into database
                        const itemBrand = item.brand || brand;
                        const itemModel = item.model || productName;
                        const safeId = `auto-${itemBrand.toLowerCase()}-${itemModel.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

                        await prisma.equipmentItem.upsert({
                            where: { id: safeId },
                            update: {
                                name: `${itemBrand} ${itemModel}`,
                                brand: itemBrand,
                                model: itemModel,
                                category: "SUP",
                                subcategory: category,
                                description: item.description || "",
                                weight_kg: item.weight_kg,
                                mount: item.mount,
                                specs_json: JSON.stringify(item),
                                daily_rate_est: 50 // Default
                            },
                            create: {
                                id: safeId,
                                name: `${itemBrand} ${itemModel}`,
                                brand: itemBrand,
                                model: itemModel,
                                category: "SUP",
                                subcategory: category,
                                description: item.description || "",
                                weight_kg: item.weight_kg,
                                mount: item.mount,
                                specs_json: JSON.stringify(item),
                                daily_rate_est: 50
                            }
                        });
                        console.log(`      ✅ Saved: ${itemBrand} ${itemModel}`);
                    }
                } catch (e: any) {
                    console.error(`      ❌ Error processing ${productName}:`, e.message);
                }
            }
        }
    }

    console.log("\n🏁 Deep Mining Operation Complete!");
}

mineSupportGear().catch(console.error).finally(() => prisma.$disconnect());
