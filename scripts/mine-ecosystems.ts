import dotenv from "dotenv";
dotenv.config();

import { searchTechnicalSpecs } from "../lib/serp-api";
import { researchEquipment } from "../lib/catalog-research";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ECOSYSTEMS = [
    {
        host: "ARRI Alexa 35",
        queries: [
            "essential accessories for ARRI Alexa 35 cinema camera",
            "ARRI Alexa 35 cage system and support components",
            "ARRI Alexa 35 media and power solutions",
            "ARRI Alexa 35 cable and viewfinder accessories"
        ]
    },
    {
        host: "ARRI Alexa Mini LF",
        queries: [
            "ARRI Alexa Mini LF essential kit list",
            "Alexa Mini LF support and cage accessories",
            "Alexa Mini LF power and media options"
        ]
    },
    {
        host: "Sony Venice 2",
        queries: [
            "Sony Venice 2 essential accessories and cables",
            "Sony Venice 2 Rialto system and extension accessories",
            "Sony Venice 2 media and battery plates",
            "Sony Venice 2 top handle and cage systems"
        ]
    },
    {
        host: "Sony Burano",
        queries: [
            "Sony Burano essential accessories and support gear",
            "Sony Burano cage and handle systems",
            "Sony Burano media and battery solutions"
        ]
    },
    {
        host: "RED V-Raptor XL",
        queries: [
            "RED V-Raptor XL essential accessories and modules",
            "RED V-Raptor support and media components"
        ]
    },
    {
        host: "RED Komodo-X",
        queries: [
            "RED Komodo-X essential accessories and handle",
            "RED Komodo-X media and expander modules",
            "RED Komodo-X battery solutions and cage"
        ]
    },
    {
        host: "Sony FX6",
        queries: [
            "Sony FX6 essential accessories and cage systems",
            "Sony FX6 media and battery solutions",
            "Sony FX6 audio and handle accessories"
        ]
    },
    {
        host: "Sony FX3",
        queries: [
            "Sony FX3 professional cinematic accessories",
            "Sony FX3 cage and handle systems",
            "Sony FX3 media and power rigs"
        ]
    },
    {
        host: "Canon C300 Mark III",
        queries: [
            "Canon C300 Mk III essential accessories and gear",
            "C300 Mark III expansion units and power"
        ]
    },
    {
        host: "Canon C70",
        queries: [
            "Canon C70 professional cinema accessories",
            "Canon C70 rig and support systems"
        ]
    },
    {
        host: "Blackmagic URSA Mini Pro 12K",
        queries: [
            "Blackmagic URSA 12K essential accessories",
            "URSA Mini Pro media and battery plates"
        ]
    },
    {
        host: "Blackmagic Cinema Camera 6K",
        queries: [
            "Blackmagic Cinema Camera 6K Full Frame accessories",
            "BMCC 6K rigging and power solutions"
        ]
    },
    {
        host: "Panasonic Lumix S1H",
        queries: [
            "Panasonic S1H professional cinematic rig accessories",
            "Lumix S1H media and power cages"
        ]
    }
];

async function mineEcosystems() {
    console.log("🚀 Starting Camera Ecosystem Accessory Mining...");

    for (const ecosystem of ECOSYSTEMS) {
        console.log(`\n📸 TARGET: ${ecosystem.host}`);
        const foundProducts = new Set<string>();

        for (const query of ecosystem.queries) {
            console.log(`   🔍 Searching: ${query}`);
            try {
                const results = await searchTechnicalSpecs(query);

                // 1. Knowledge graph
                if (results.knowledge_graph?.title) {
                    foundProducts.add(results.knowledge_graph.title);
                }

                // 2. Organic results - be more aggressive in finding accessories
                if (results.organic_results) {
                    results.organic_results.forEach(res => {
                        const lowTitle = res.title.toLowerCase();
                        const junkKeywords = ['amazon', 'ebay', 'bhphotovideo', 'reddit', 'forum', 'youtube', 'facebook', 'instagram', 'twitter', 'linkedin'];

                        if (junkKeywords.some(j => lowTitle.includes(j))) return;

                        // Look for accessory-specific brands or keywords
                        const brands = [
                            'wooden camera', 'tilta', 'smallrig', 'arri', 'sony', 'teradek', 'smallhd',
                            'core swx', 'anton bauer', 'bebob', 'vaxis', 'hollyland', 'vocas', 'shape',
                            'hawk-woods', 'idx', 'blueshape', 'flanders scientific', 'tvlogic', 'atomos',
                            'bright tangerine', 'chrosziel', 'preston cinema', 'cmotion'
                        ];
                        if (brands.some(b => lowTitle.includes(b))) {
                            const title = res.title.split('|')[0].split('-')[0].split(':').shift()?.trim();
                            if (title && title.length > 8 && title.length < 50) {
                                foundProducts.add(title);
                            }
                        }
                    });
                }
            } catch (e) {
                console.error(`      ❌ Search error for "${query}":`, e);
            }
        }

        console.log(`   ✨ Found ${foundProducts.size} unique potential products for ${ecosystem.host}`);

        for (const productName of foundProducts) {
            // Avoid adding the camera itself as an accessory
            if (productName.toLowerCase().includes(ecosystem.host.toLowerCase())) {
                const isOnlyCamera = productName.toLowerCase() === ecosystem.host.toLowerCase();
                if (isOnlyCamera) continue;
            }

            console.log(`      🔎 Researching & Saving: ${productName}...`);
            try {
                const research = await researchEquipment(productName);
                if (research && research.length > 0) {
                    const item = research[0];

                    // Force accessory categories
                    const fullItemName = `${item.brand} ${item.model}`.toLowerCase();
                    if (item.category === 'CAM' && !fullItemName.includes('camera')) {
                        item.category = 'SUP'; // Most accessories are support
                    }
                    if (!['SUP', 'DIT', 'COM', 'FLT', 'GRP'].includes(item.category)) {
                        item.category = 'SUP';
                    }

                    // ADD COMPATIBILITY TAG
                    const specs = JSON.parse(JSON.stringify(item));
                    if (!specs.compatibility) specs.compatibility = [];
                    if (!specs.compatibility.includes(ecosystem.host)) {
                        specs.compatibility.push(ecosystem.host);
                    }
                    // Also generic tag for some
                    if (fullItemName.includes('baseplate') || fullItemName.includes('matte box')) {
                        if (!specs.compatibility.includes('Universal')) specs.compatibility.push('Universal');
                    }

                    const safeId = `acc-${item.brand.toLowerCase()}-${item.model.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

                    await prisma.equipmentItem.upsert({
                        where: { id: safeId },
                        update: {
                            name: `${item.brand} ${item.model}`,
                            brand: item.brand,
                            model: item.model,
                            category: item.category,
                            subcategory: item.subcategory || 'Accessory',
                            description: item.description || "",
                            specs_json: JSON.stringify(specs),
                            status: 'APPROVED',
                            isAiResearched: true
                        },
                        create: {
                            id: safeId,
                            name: `${item.brand} ${item.model}`,
                            brand: item.brand,
                            model: item.model,
                            category: item.category,
                            subcategory: item.subcategory || 'Accessory',
                            description: item.description || "",
                            specs_json: JSON.stringify(specs),
                            status: 'APPROVED',
                            isAiResearched: true,
                            daily_rate_est: 25
                        }
                    });
                    console.log(`         ✅ Saved: ${item.brand} ${item.model}`);
                }
            } catch (e) {
                console.error(`         ❌ Error processing ${productName}:`, e);
            }
        }
    }

    console.log("\n🏁 Ecosystem Mining Operation Complete!");
}

mineEcosystems().catch(console.error).finally(() => prisma.$disconnect());
