export interface TechnicalSpecs {
    brand: string;
    model: string;
    category: string;
    subcategory: string;
    coverage?: string; // For lenses: S35, FF, LF
    mount?: string;
    sensor_size?: 'FF' | 'S35' | 'LF' | 'APS-C';
    lens_type?: 'Spherical' | 'Anamorphic';
    front_diameter_mm?: number;
    weight_kg?: number;
    description?: string;
    isAIGenerated: boolean;
    accessories?: TechnicalSpecs[];
}

/**
 * Normalizes equipment names for deduplication.
 * Example: "Sony Venice 2" -> "sonyvenice2"
 */
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
            brand: 'Sony', model: model, category: 'CAM', subcategory: 'Bodies', mount: 'PL', sensor_size: sensor, weight_kg: weight, isAIGenerated: true,
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
            brand: 'Leitz', model: model, category: 'LNS', subcategory: 'Prime', coverage: 'FF', mount: 'PL', lens_type: 'Spherical' as const, front_diameter_mm: front, isAIGenerated: true, iris_range: iris, description: `AI Researched: Leitz ${model}.`, accessories: []
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
            { brand: 'ARRI', model: 'MVF-2 Viewfinder', category: 'SUP', subcategory: 'Accessories', isAIGenerated: true },
            { brand: 'ARRI', model: 'Power Cable (KC-50)', category: 'SUP', subcategory: 'Accessories', isAIGenerated: true }
        ];
        if (isXtreme) {
            accessories.push(
                { brand: 'ARRI', model: 'Cage System', category: 'SUP', subcategory: 'Accessories', isAIGenerated: true },
                { brand: 'Vocas', model: 'Top Handle', category: 'SUP', subcategory: 'Accessories', isAIGenerated: true },
                { brand: 'Core SWX', model: 'Gold Mount Plate', category: 'SUP', subcategory: 'Power', isAIGenerated: true }
            );
        }
        return [{
            brand: 'ARRI', model: isXtreme ? 'ALEXA 35 Xtreme Bundle' : 'ALEXA 35',
            category: 'CAM', subcategory: 'S35', mount: 'LPL', sensor_size: 'S35', weight_kg: 2.9, isAIGenerated: true, accessories
        }];
    }

    // Signature Series
    if (query.includes('signature')) {
        if (query.includes('zoom') || query.includes('45-135') || query.includes('65-300') || query.includes('16-32')) {
            let model = 'Signature Zoom 45-135mm T2.8';
            if (query.includes('65-300')) model = 'Signature Zoom 65-300mm T2.8';
            if (query.includes('16-32')) model = 'Signature Zoom 16-32mm T2.8';
            return [{
                brand: 'ARRI', model: model, category: 'LNS', subcategory: 'Zoom', coverage: 'LF', mount: 'LPL', lens_type: 'Spherical', front_diameter_mm: 114, weight_kg: 3.7, description: `AI Researched: ARRI ${model}.`, isAIGenerated: true,
                accessories: [{ brand: 'ARRI', model: 'LPL Mount Plug', category: 'SUP', subcategory: 'Accessories', isAIGenerated: true }]
            }];
        }
        const focalMatch = query.match(/(\d+)mm/);
        const focal = focalMatch ? focalMatch[1] : '47';
        return [{
            brand: 'ARRI', model: `Signature Prime ${focal}mm T1.8`, category: 'LNS', subcategory: 'Prime', coverage: 'LF', mount: 'LPL', lens_type: 'Spherical', front_diameter_mm: 114, isAIGenerated: true, description: 'AI Researched: ARRI Signature Prime.', accessories: []
        }];
    }

    // Cooke S7
    if (query.includes('cooke') && (query.includes('s7') || query.includes('plus'))) {
        return [{ brand: 'Cooke', model: 'S7/i Full Frame Plus', category: 'LNS', subcategory: 'Prime', coverage: 'LF', mount: 'PL', lens_type: 'Spherical', front_diameter_mm: 110, isAIGenerated: true, description: 'AI Researched: Cooke S7/i.', accessories: [] }];
    }

    // Zeiss Supreme
    if (query.includes('zeiss') && query.includes('supreme')) {
        return [{ brand: 'ZEISS', model: 'Supreme Prime', category: 'LNS', subcategory: 'Prime', coverage: 'LF', mount: 'PL', lens_type: 'Spherical', front_diameter_mm: 95, isAIGenerated: true, description: 'AI Researched: ZEISS Supreme Prime.', accessories: [] }];
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
            isAIGenerated: true,
            description: `AI Researched: Canon CN-E ${focal}mm.`,
            accessories: [] as any[]
        });
        return [createCne('14'), createCne('24'), createCne('35'), createCne('50'), createCne('85'), createCne('135')];
    }

    // Laowa
    if (query.includes('laowa') || query.includes('loova') || query.includes('loowa')) {
        const createNano = (focal: string) => ({
            brand: 'Laowa', model: `Nanomorph ${focal}mm T2.4`, category: 'LNS', subcategory: 'Anamorphic', coverage: 'S35', mount: 'PL/EF', lens_type: 'Anamorphic' as const, front_diameter_mm: 58, weight_kg: 0.5, isAIGenerated: true, description: `AI Researched: Laowa Nanomorph ${focal}mm.`, accessories: [] as any[], close_focus: "0.43m / 1'5", iris_range: "T2.4-T22"
        });
        if (!query.match(/\d+mm/)) {
            return [createNano('27'), createNano('35'), createNano('50'), createNano('65'), createNano('80')];
        }
        return [createNano('35')];
    }

    // Cooke S8/i
    if (query.includes('cooke') && (query.includes('s8') || query.includes('i'))) {
        const createS8 = (focal: string) => ({
            brand: 'Cooke', model: `S8/i FF ${focal}mm T1.4`, category: 'LNS', subcategory: 'Prime', coverage: 'FF', mount: 'PL', lens_type: 'Spherical' as const, front_diameter_mm: 110, weight_kg: 2.4, isAIGenerated: true, description: `AI Researched: Cooke S8/i ${focal}mm.`, accessories: [] as any[], close_focus: "0.5m", iris_range: "T1.4-T22"
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
            isAIGenerated: true,
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
export async function researchEquipment(query: string): Promise<TechnicalSpecs[] | null> {
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
        if (lowerQ === typo || (lowerQ.includes(typo) && !lowerQ.includes(fix.toLowerCase()))) {
            console.log(`[DEBUG] Normalizing: "${q}" -> "${fix}"`);
            q = fix; // Simplify to ONLY the fix if the brand is mentioned alone
            break;
        }
    }

    console.log("[DEBUG] Research Phase Start. Final Query:", q);

    // 0. CHECK LOCAL KNOWLEDGE BASE FIRST (High Priority Sets)
    const localHit = getMockResult(q.toLowerCase());
    if (localHit && localHit.length > 0) {
        const isGeneric = localHit[0].brand === 'Generic';
        if (!isGeneric) {
            console.log("Local Knowledge Hit!", localHit[0].model);
            return localHit;
        }
    }

    // 1. PERFORM WEB SEARCH (Deep Search)
    const webContext = await searchWeb(q);
    console.log("Web Search Context (Snippet):", webContext.substring(0, 500) + "...");

    const SYSTEM_PROMPT = `You are an elite cinema equipment researcher and data curator. 
    Your mission is to find and structure DEEP TECHNICAL SPECS for: "${q}".
    
    ### LIVE WEB SEARCH CONTEXT:
    ${webContext ? webContext : "No results found. Rely on your internal elite knowledge."}

    ### INTERNAL REFERENCE (Use these EXACT values for these series):
    - **Leitz/Leica Summilux-C**: Front: 95mm, Iris: T1.4, Image Circle: 35mm.
    - **Leitz/Leica Summicron-C**: Front: 95mm, Iris: T2.0, Image Circle: 35mm.
    - **Tribe7 Blackwing7**: Front: 114mm, Iris: T1.9 (Binary/Transient/Expressive).
    - **Cooke SP3**: Front: 64mm (screw-in 58mm), Iris: T2.4.
    
    ### MANDATORY RULES:
    1. **Brand Expansion**: If the query is just a BRAND name (e.g., "Sony", "ARRI", "Leica"), DO NOT return a single generic result. Instead, return a list of their 3-5 most famous CURRENT professional cinema products (Cameras and Lenses).
    2. **No Empty Specs**: Never return "-" or empty values for professional equipment. If search results are missing data, use your internal expertise to provide the exact industry-standard technical specs for that specific model.
    3. **Focal Lengths**: If the search is for a series, return the full list of focal lengths.
    4. **Categorization**: Lenses MUST be "LNS". Pro cameras MUST be "CAM".
    5. **Image Circle**: Be precise (S35, FF, LF).
    6. **Description**: Mention key features and CITE sources.
    
    Return ONLY a JSON array. If unsure, provide your BEST ACCURATE ESTIMATE.
    [{
        "brand": "string",
        "model": "string",
        "category": "CAM" | "LNS" | "LGT" | "FLT" | "SUP" | "MON",
        "subcategory": "string",
        "coverage": "string (example: 'LF', 'FF', 'S35')",
        "mount": "string (PL, LPL, E, EF)",
        "lens_type": "string (Spherical, Anamorphic)",
        "front_diameter_mm": "number",
        "weight_kg": "number",
        "close_focus": "string (e.g., '0.45m')",
        "iris_range": "string (e.g., 'T1.4-T22')",
        "image_circle_mm": "number",
        "description": "string",
        "accessories": []
    }]
    DO NOT wrap in markdown. No explanation outside JSON.`;

    // 2. Try OpenAI
    if (openaiKey && openaiKey.length > 5) {
        try {
            const openai = new OpenAI({ apiKey: openaiKey });
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: q }],
                model: "gpt-4o",
            });
            const content = completion.choices[0].message.content;
            if (content) {
                const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
                console.log("OpenAI raw result length:", cleanJson.length);
                const result = JSON.parse(cleanJson);
                return Array.isArray(result) ? result.map((i: any) => ({ ...i, isAIGenerated: true })) : [{ ...result, isAIGenerated: true }];
            }
        } catch (e) {
            console.error("OpenAI failed, falling back to Gemini...");
        }
    }

    // 3. Try Gemini
    if (geminiKey && geminiKey.length > 5) {
        try {
            console.log("Calling Google Gemini (Pro 1.5)...");
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await model.generateContent(SYSTEM_PROMPT);
            const text = result.response.text();

            console.log("Gemini Raw Response Snippet:", text.substring(0, 300));

            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanJson);
            return Array.isArray(data) ? data.map((i: any) => ({ ...i, isAIGenerated: true })) : [{ ...data, isAIGenerated: true }];
        } catch (e) {
            console.error("Gemini failed:", e);
        }
    }

    return getMockResult(q.toLowerCase());
}
