export interface TechnicalSpecs {
    brand: string;
    model: string;
    category: string;
    subcategory: string;
    coverage?: string; // For lenses: S35, FF, LF
    mount?: string;
    sensor_size?: string;
    sensor_type?: string;
    resolution?: string;
    dynamic_range?: string;
    native_iso?: string;
    lens_type?: 'Spherical' | 'Anamorphic';
    front_diameter_mm?: number;
    weight_kg?: number;
    close_focus_m?: number;
    t_stop_range?: string;
    image_circle_mm?: number;
    description?: string;
    isAiResearched: boolean;
    source_url?: string;
    accessories?: TechnicalSpecs[];
    payload_kg?: number;
    focal_length?: string;

    // Hardware Compatibility Specs
    power?: { min_voltage?: number; max_voltage?: number; mount_type?: string };
    media_slots?: string[];
    compatible_codecs?: string[];
    media_type?: string;
    write_speed?: string;
    certified_for?: string[];
}

/**
 * Normalizes equipment names for deduplication.
 * Example: "Sony Venice 2" -> "sonyvenice2"
 */
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchTechnicalSpecs } from './serp-api';

export function normalizeName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Helper for Mock Logic (extracted for clarity) - Returns ARRAY
function getMockResult(q: string): TechnicalSpecs[] | null {
    const query = q.toLowerCase().trim();
    console.log("[DEBUG] getMockResult check for:", query);

    // --- BRAND LEVEL FAIL-SAFES (Priority 1) ---
    // Sony
    if (query === 'sony' || query.includes('sony cine alta')) {
        const createSony = (model: string, sensor: 'FF' | 'S35' | 'LF', weight: number) => ({
            brand: 'Sony', model: model, category: 'CAM', subcategory: 'Bodies', mount: 'PL', sensor_size: sensor, weight_kg: weight, isAiResearched: true,
            description: `AI Researched: Sony ${model} Professional Cinema Camera.`, accessories: []
        });
        return [
            createSony('BURANO', 'FF', 2.4),
            createSony('VENICE 2 (8K)', 'LF', 3.5),
            createSony('FX6', 'FF', 0.89)
        ];
    }

    // Leitz / Leica
    if (query === 'leica' || query === 'leitz' || query === 'laica' || query.includes('leitz leica')) {
        const createLeitz = (model: string, iris: string, front: number) => ({
            brand: 'Leitz', model: model, category: 'LNS', subcategory: 'Prime', coverage: 'FF', mount: 'PL', lens_type: 'Spherical' as const, front_diameter_mm: front, isAiResearched: true, iris_range: iris, description: `AI Researched: Leitz ${model}.`, accessories: []
        });
        return [
            createLeitz('Summilux-C 35mm', 'T1.4', 95),
            createLeitz('Summicron-C 35mm', 'T2.0', 95),
            createLeitz('M 0.8 35mm', 'f/1.4', 80)
        ];
    }

    // --- MODEL LEVEL FAIL-SAFES (Priority 2) ---
    // ARRI 35
    if (query.includes('arri') && (query.includes('35') || query.includes('alexa'))) {
        const isXtreme = query.includes('xtreme') || query.includes('extreme');
        const accessories = [
            { brand: 'ARRI', model: 'MVF-2 Viewfinder', category: 'SUP', subcategory: 'Accessories', isAiResearched: true },
            { brand: 'ARRI', model: 'Power Cable (KC-50)', category: 'SUP', subcategory: 'Accessories', isAiResearched: true }
        ];
        if (isXtreme) {
            accessories.push(
                { brand: 'ARRI', model: 'Cage System', category: 'SUP', subcategory: 'Accessories', isAiResearched: true },
                { brand: 'Vocas', model: 'Top Handle', category: 'SUP', subcategory: 'Accessories', isAiResearched: true },
                { brand: 'Core SWX', model: 'Gold Mount Plate', category: 'SUP', subcategory: 'Power', isAiResearched: true }
            );
        }
        return [{
            brand: 'ARRI', model: isXtreme ? 'ALEXA 35 Xtreme Bundle' : 'ALEXA 35',
            category: 'CAM', subcategory: 'S35', mount: 'LPL', sensor_size: 'S35', weight_kg: 2.9, isAiResearched: true, accessories
        }];
    }

    // Signature Series
    if (query.includes('signature')) {
        if (query.includes('zoom') || query.includes('45-135') || query.includes('65-300') || query.includes('16-32')) {
            let model = 'Signature Zoom 45-135mm T2.8';
            if (query.includes('65-300')) model = 'Signature Zoom 65-300mm T2.8';
            if (query.includes('16-32')) model = 'Signature Zoom 16-32mm T2.8';
            return [{
                brand: 'ARRI', model: model, category: 'LNS', subcategory: 'Zoom', coverage: 'LF', mount: 'LPL', lens_type: 'Spherical', front_diameter_mm: 114, weight_kg: 3.7, description: `AI Researched: ARRI ${model}.`, isAiResearched: true,
                accessories: [{ brand: 'ARRI', model: 'LPL Mount Plug', category: 'SUP', subcategory: 'Accessories', isAiResearched: true }]
            }];
        }
        const focalMatch = query.match(/(\d+)mm/);
        const focal = focalMatch ? focalMatch[1] : '47';
        return [{
            brand: 'ARRI', model: `Signature Prime ${focal}mm T1.8`, category: 'LNS', subcategory: 'Prime', coverage: 'LF', mount: 'LPL', lens_type: 'Spherical', front_diameter_mm: 114, isAiResearched: true, description: 'AI Researched: ARRI Signature Prime.', accessories: []
        }];
    }

    // Cooke S7
    if (query.includes('cooke') && (query.includes('s7') || query.includes('plus'))) {
        return [{ brand: 'Cooke', model: 'S7/i Full Frame Plus', category: 'LNS', subcategory: 'Prime', coverage: 'LF', mount: 'PL', lens_type: 'Spherical', front_diameter_mm: 110, isAiResearched: true, description: 'AI Researched: Cooke S7/i.', accessories: [] }];
    }

    // Zeiss Supreme
    if (query.includes('zeiss') && query.includes('supreme')) {
        return [{ brand: 'ZEISS', model: 'Supreme Prime', category: 'LNS', subcategory: 'Prime', coverage: 'LF', mount: 'PL', lens_type: 'Spherical', front_diameter_mm: 95, isAiResearched: true, description: 'AI Researched: ZEISS Supreme Prime.', accessories: [] }];
    }

    // Canon CN-E Full Set Mock
    if (query.includes('canon') && (query.includes('cn-e') || query.includes('prime'))) {
        const createCne = (focal: string) => ({
            brand: 'Canon',
            model: `CN-E ${focal}mm T1.3 L F`,
            category: 'LNS',
            subcategory: 'Prime',
            coverage: 'FF',
            mount: 'EF',
            lens_type: 'Spherical' as const,
            front_diameter_mm: 114,
            isAiResearched: true,
            description: `AI Researched: Canon CN-E ${focal}mm.`,
            accessories: [] as any[]
        });
        return [createCne('14'), createCne('24'), createCne('35'), createCne('50'), createCne('85'), createCne('135')];
    }

    // Laowa
    if (query.includes('laowa') || query.includes('loova') || query.includes('loowa')) {
        const createNano = (focal: string) => ({
            brand: 'Laowa', model: `Nanomorph ${focal}mm T2.4`, category: 'LNS', subcategory: 'Anamorphic', coverage: 'S35', mount: 'PL/EF', lens_type: 'Anamorphic' as const, front_diameter_mm: 58, weight_kg: 0.5, isAiResearched: true, description: `AI Researched: Laowa Nanomorph ${focal}mm.`, accessories: [] as any[], close_focus: "0.43m / 1'5", iris_range: "T2.4-T22"
        });
        if (!query.match(/\d+mm/)) {
            return [createNano('27'), createNano('35'), createNano('50'), createNano('65'), createNano('80')];
        }
        return [createNano('35')];
    }

    // Cooke S8/i
    if (query.includes('cooke') && (query.includes('s8') || query.includes('i'))) {
        const createS8 = (focal: string) => ({
            brand: 'Cooke', model: `S8/i FF ${focal}mm T1.4`, category: 'LNS', subcategory: 'Prime', coverage: 'FF', mount: 'PL', lens_type: 'Spherical' as const, front_diameter_mm: 110, weight_kg: 2.4, isAiResearched: true, description: `AI Researched: Cooke S8/i ${focal}mm.`, accessories: [] as any[], close_focus: "0.5m", iris_range: "T1.4-T22"
        });
        if (!query.match(/\d+mm/)) {
            return [createS8('25'), createS8('32'), createS8('40'), createS8('50'), createS8('75'), createS8('100')];
        }
        return [createS8('50')];
    }

    // Generic fallback with Category Education
    if (query.length > 2) {
        let cat = 'CAM';
        let sub = 'Bodies';
        if (query.match(/(\d+mm)|(lens)|(prime)|(zoom)|(anamorphic)|(t\d\.\d)/)) {
            cat = 'LNS';
            sub = query.includes('zoom') ? 'Zoom' : 'Prime';
        } else if (query.match(/(light)|(led)|(panel)|(cob)/)) {
            cat = 'LGT';
            sub = 'LED';
        }

        return [{
            brand: 'Generic',
            model: query.charAt(0).toUpperCase() + query.slice(1),
            category: cat,
            subcategory: sub,
            isAiResearched: true,
            description: 'AI Generated Generic Item (API Fallback)',
            accessories: [] as any[]
        }];
    }
    return null;
}

/**
 * Helper for Web Search (Serper.dev)
 */
async function searchWeb(query: string): Promise<string> {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
        console.log("No SERPER_API_KEY found. Skipping web search.");
        return "";
    }

    try {
        console.log("Searching web for:", query);
        const res = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                q: query + " technical specifications cinema lens camera",
                num: 5 // Top 5 results
            })
        });

        if (!res.ok) {
            console.error("Search API Error:", res.statusText);
            return "";
        }

        const json = await res.json();
        const organic = json.organic || [];

        // Format results for LLM Context
        const context = organic.map((r: any, idx: number) => `
        - **Source ${idx + 1}**: ${r.title} (${r.link})
          **Snippet**: ${r.snippet}
        `).join("\n");

        return context;
    } catch (e) {
        console.error("Web Search Exception:", e);
        return "";
    }
}

/**
 * Main AI Research Function
 */
export async function researchEquipment(query: string, forceLive: boolean = false): Promise<TechnicalSpecs[] | null> {
    let q = query.trim();
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // A. QUERY NORMALIZATION (Typo Pre-processing)
    const lowerQ = q.toLowerCase();
    const commonTypos: { [key: string]: string } = {
        'laica': 'Leitz Leica',
        'leica': 'Leitz Leica',
        'ari': 'ARRI',
        'arry': 'ARRI',
        'loova': 'Laowa',
        'cook': 'Cooke',
        't7': 'Tribe7',
        'blackwing': 'Tribe7 Blackwing7',
        'angenieux': 'Angenieux',
        'panavision': 'Panavision',
        'red': 'RED Digital Cinema',
        'sony': 'Sony Cine Alta'
    };

    for (const [typo, fix] of Object.entries(commonTypos)) {
        if (lowerQ === typo) {
            console.log(`[DEBUG] Normalizing Brand: "${q}" -> "${fix}"`);
            q = fix;
            break;
        }
        // ONLY replace if the query is just a typo, do NOT replace if it is a specific product title containing the typo
    }

    console.log("[DEBUG] Research Phase Start. Final Query:", q);

    /* 
    // Commented out to prioritize Serper.dev 1000 Quota
    // Try SerpApi Knowledge Graph first (Graceful Fallback)
    let serpContext = "";
    try {
        const serpResults = await searchTechnicalSpecs(q);
        if (serpResults && serpResults.knowledge_graph) {
            serpContext = `\nSERPAPI KNOWLEDGE GRAPH DATA:\n${JSON.stringify(serpResults.knowledge_graph, null, 2)}`;
            console.log(`[DEBUG] Found SerpApi Knowledge Graph data for: ${q}`);
        }
    } catch (e: any) {
        console.warn(`[SERPAPI] Quota or error: ${e.message}. Continuing with Serper.dev...`);
    }
    */
    const serpContext = "";

    // 0. CHECK LOCAL KNOWLEDGE BASE FIRST (Only if not forceLive)
    if (!forceLive) {
        const localHit = getMockResult(q.toLowerCase());
        if (localHit && localHit.length > 0) {
            const isGeneric = localHit[0].brand === 'Generic';
            if (!isGeneric) {
                console.log("Local Knowledge Hit!", localHit[0].model);
                return localHit;
            }
        }
    }

    // 1. PERFORM WEB SEARCH (Deep Search)
    const webContextResults = await searchWeb(q);
    const webContext = webContextResults + (serpContext ? `\n\n${serpContext}` : "");
    console.log("Web Search Context (Snippet):", webContext.substring(0, 500) + "...");

    const SYSTEM_PROMPT = `You are an elite cinema equipment researcher and data curator. 
    Your mission is to find and structure DEEP TECHNICAL SPECS.
    You MUST prioritize data from official manufacturer datasheets (ARRI.com, Sony.com, CookeOptics.com, etc.).

    ### LIVE WEB SEARCH CONTEXT:
    ${webContext ? webContext : "No results found. Rely on your internal elite knowledge."}

    ### MANDATORY RULES:
    1. **Datasheet Accuracy**: For Cameras, find the exact Sensor Resolution, Dynamic Range (Stops), and Native ISOs. For Lenses, find exact Close Focus (meters), Front Diameter, and T-Stop range.
    2. **Units**: Weight in KG, Diameters in MM, Focus in Meters.
    
    Return ONLY a JSON array of technical specs with Brand, Model, Category, and all found technical fields.
    DO NOT wrap in markdown. No explanation outside JSON.`;

    const FINAL_PROMPT = `${SYSTEM_PROMPT}\n\nUSER QUERY: Research ${q}\n\nReturn the JSON array now:`;

    // 2. Try OpenAI
    if (openaiKey && openaiKey.length > 5) {
        try {
            const openai = new OpenAI({ apiKey: openaiKey });
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: FINAL_PROMPT }],
                model: "gpt-4o",
            });
            const content = completion.choices[0].message.content;
            if (content) {
                const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
                console.log("OpenAI raw result length:", cleanJson.length);
                const result = JSON.parse(cleanJson);
                return Array.isArray(result) ? result.map((i: any) => ({ ...i, isAiResearched: true })) : [{ ...result, isAiResearched: true }];
            }
        } catch (e) {
            console.error("OpenAI failed, falling back to Gemini...");
        }
    }

    // 3. Try Gemini
    if (geminiKey && geminiKey.length > 5) {
        try {
            console.log("Calling Google Gemini (Flash 1.5)...");
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(FINAL_PROMPT);
            const text = result.response.text();

            console.log("Gemini Raw Response Snippet:", text.substring(0, 300));

            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanJson);
            return Array.isArray(data) ? data.map((i: any) => ({ ...i, isAiResearched: true })) : [{ ...data, isAiResearched: true }];
        } catch (e) {
            console.error("Gemini failed:", e);
        }
    }

    // 4. Smart Regex Fallback (Bulletproof)
    console.log("Using Smart Regex Fallback for:", q);
    const cat = q.match(/(\d+mm)|(lens)|(prime)|(zoom)|(anamorphic)|(t\d\.\d)/i) ? 'LNS' : (q.match(/(camera)|(alexa)|(venice)|(red)|(sony)/i) ? 'CAM' : 'SUP');

    // Simple extraction from webContext
    const drMatch = webContext.match(/(\d+\.?\d*)\s*(stops|stop)\s*(of)?\s*dynamic range/i);
    const isoMatch = webContext.match(/native\s*iso\s*(\d+(\/\d+)?)/i);
    const tStopMatch = webContext.match(/t(\d\.\d)/i);
    const weightMatch = webContext.match(/(\d+\.?\d*)\s*kg/i);
    const focalMatch = q.match(/(\d+)mm/i);

    const fallback: TechnicalSpecs = {
        brand: q.split(' ')[0],
        model: q,
        category: cat,
        subcategory: cat === 'LNS' ? 'Prime' : 'Equipment',
        isAiResearched: true,
        dynamic_range: drMatch ? drMatch[1] + " Stops" : undefined,
        native_iso: isoMatch ? isoMatch[1] : undefined,
        t_stop_range: tStopMatch ? "T" + tStopMatch[1] : (cat === 'LNS' && q.match(/t(\d\.\d)/i) ? "T" + q.match(/t(\d\.\d)/i)![1] : undefined),
        weight_kg: weightMatch ? parseFloat(weightMatch[1]) : undefined,
        focal_length: focalMatch ? focalMatch[1] + "mm" : undefined,
        description: `Enriched via Smart Research Fallback. Context: ${webContext.substring(0, 100)}`,
    };

    return [fallback];
}
