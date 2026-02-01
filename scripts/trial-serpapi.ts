
const API_KEY = "41f7c77f655c9b4149a5c00d5c44b9693055c7c7be26d3b05bac42315c34ff53";

async function testSerpApi(query: string) {
    console.log(`\n🔍 Searching Technical Data for: "${query}"`);

    const url = new URL("https://serpapi.com/search");
    url.searchParams.append("api_key", API_KEY);
    url.searchParams.append("engine", "google");
    url.searchParams.append("q", query);
    url.searchParams.append("location", "United States");
    url.searchParams.append("google_domain", "google.com");
    url.searchParams.append("gl", "us");
    url.searchParams.append("hl", "en");
    // tbm remains empty for standard search

    try {
        const response = await fetch(url.toString());
        const data = await response.json() as any;

        if (data.error) {
            console.error("❌ API Error:", data.error);
            return;
        }

        // 1. Check Knowledge Graph (Technical Specs)
        if (data.knowledge_graph) {
            console.log("✅ Found Knowledge Graph!");
            console.log(`   Title: ${data.knowledge_graph.title}`);

            // Some knowledge graphs have direct specs, others have descriptions
            if (data.knowledge_graph.specs) {
                console.log("   --- Technical Specs ---");
                data.knowledge_graph.specs.forEach((s: any) => console.log(`    • ${s.label}: ${s.value}`));
            } else if (data.knowledge_graph.description) {
                console.log("   --- Info Summary ---");
                console.log(`   ${data.knowledge_graph.description.substring(0, 300)}...`);
            }
        }

        // 2. Check Organic Results for deeper links
        const organic = data.organic_results || [];
        console.log(`✅ Found ${organic.length} organic sources.`);
        organic.slice(0, 2).forEach((item: any, i: number) => {
            console.log(`   [Source ${i + 1}] ${item.title}`);
            console.log(`     Link: ${item.link}`);
        });

    } catch (error) {
        console.error("❌ Fetch failed:", error);
    }
}

async function runTrial() {
    console.log("🚀 Starting Cine-Brain Technical Data Mining Trial...");

    // Test Case 1: High-end Camera
    await testSerpApi("Sony Venice 2 camera technical specifications sensor size");

    // Test Case 2: Cinema Lens
    await testSerpApi("Cooke S8/i FF prime lenses focal lengths list");

    // Test Case 3: Support Gear
    await testSerpApi("Teradek Bolt 6 XT 750 weight and inputs");
}

runTrial();
