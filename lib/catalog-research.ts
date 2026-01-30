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
    // ARRI 35
    if (q.includes('arri') && (q.includes('35') || q.includes('alexa'))) {
        const isXtreme = q.includes('xtreme') || q.includes('extreme');
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
    if (q.includes('signature')) {
        if (q.includes('zoom') || q.includes('45-135') || q.includes('65-300') || q.includes('16-32')) {
            let model = 'Signature Zoom 45-135mm T2.8';
            if (q.includes('65-300')) model = 'Signature Zoom 65-300mm T2.8';
            if (q.includes('16-32')) model = 'Signature Zoom 16-32mm T2.8';
            return [{
                brand: 'ARRI', model: model, category: 'LNS', subcategory: 'Zoom', coverage: 'LF', mount: 'LPL', lens_type: 'Spherical', front_diameter_mm: 114, weight_kg: 3.7, description: `AI Researched: ARRI ${model}.`, isAIGenerated: true,
                accessories: [{ brand: 'ARRI', model: 'LPL Mount Plug', category: 'SUP', subcategory: 'Accessories', isAIGenerated: true }]
            }];
        }
        const focalMatch = q.match(/(\d+)mm/);
        const focal = focalMatch ? focalMatch[1] : '47';
        return [{
            brand: 'ARRI', model: `Signature Prime ${focal}mm T1.8`, category: 'LNS', subcategory: 'Prime', coverage: 'LF', mount: 'LPL', lens_type: 'Spherical', front_diameter_mm: 114, isAIGenerated: true, description: 'AI Researched: ARRI Signature Prime.', accessories: []
        }];
    }
    // Cooke S7
    if (q.includes('cooke') && (q.includes('s7') || q.includes('plus'))) {
        return [{ brand: 'Cooke', model: 'S7/i Full Frame Plus', category: 'LNS', subcategory: 'Prime', coverage: 'LF', mount: 'PL', lens_type: 'Spherical', front_diameter_mm: 110, isAIGenerated: true, description: 'AI Researched: Cooke S7/i.', accessories: [] }];
    }
    // Zeiss Supreme
    if (q.includes('zeiss') && q.includes('supreme')) {
        return [{ brand: 'ZEISS', model: 'Supreme Prime', category: 'LNS', subcategory: 'Prime', coverage: 'LF', mount: 'PL', lens_type: 'Spherical', front_diameter_mm: 95, isAIGenerated: true, description: 'AI Researched: ZEISS Supreme Prime.', accessories: [] }];
    }
    // Canon CN-E Full Set Mock
    if (q.includes('canon') && (q.includes('cn-e') || q.includes('prime'))) {
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

        // If specific focal asked, prefer it first, but return whole set
        return [
            createCne('14'),
            createCne('24'),
            createCne('35'),
            createCne('50'),
            createCne('85'),
            createCne('135')
        ];
    }

    // Laowa (Handle "loova" typo implicitly via includes or explicit check)
    if (q.includes('laowa') || q.includes('loova') || q.includes('loowa')) {
        const createNano = (focal: string) => ({
            brand: 'Laowa', model: `Nanomorph ${focal}mm T2.4`, category: 'LNS', subcategory: 'Anamorphic', coverage: 'S35', mount: 'PL/EF', lens_type: 'Anamorphic' as const, front_diameter_mm: 58, weight_kg: 0.5, isAIGenerated: true, description: `AI Researched: Laowa Nanomorph ${focal}mm.`, accessories: [] as any[], close_focus: "0.43m / 1'5", iris_range: "T2.4-T22"
        });
        // Return Nanomorph Set by default for broad query
        if (!q.match(/\d+mm/)) {
            return [createNano('27'), createNano('35'), createNano('50'), createNano('65'), createNano('80')];
        }
        return [createNano('35')]; // Default single
    }

    // Cooke S8/i
    if (q.includes('cooke') && (q.includes('s8') || q.includes('i'))) {
        const createS8 = (focal: string) => ({
            brand: 'Cooke', model: `S8/i FF ${focal}mm T1.4`, category: 'LNS', subcategory: 'Prime', coverage: 'FF', mount: 'PL', lens_type: 'Spherical' as const, front_diameter_mm: 110, weight_kg: 2.4, isAIGenerated: true, description: `AI Researched: Cooke S8/i ${focal}mm.`, accessories: [] as any[], close_focus: "0.5m", iris_range: "T1.4-T22"
        });
        if (!q.match(/\d+mm/)) {
            return [createS8('25'), createS8('32'), createS8('40'), createS8('50'), createS8('75'), createS8('100')];
        }
        return [createS8('50')];
    }

    // Generic fallback with Category Education
    if (q.length > 2) {
        // Guess Category
        let cat = 'CAM';
        let sub = 'Bodies';
        if (q.match(/(\d+mm)|(lens)|(prime)|(zoom)|(anamorphic)|(t\d\.\d)/)) {
            cat = 'LNS';
            sub = q.includes('zoom') ? 'Zoom' : 'Prime';
        } else if (q.match(/(light)|(led)|(panel)|(cob)/)) {
            cat = 'LGT';
            sub = 'LED';
        }

        return [{
            brand: 'Generic',
            model: q.charAt(0).toUpperCase() + q.slice(1),
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
 * AI Research Simulator (Architecture for real API)
 */
export async function researchEquipment(query: string): Promise<TechnicalSpecs[] | null> {
    const q = query.toLowerCase();
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    console.log("AI Research Triggered.", "OpenAI Key:", !!openaiKey, "Gemini Key:", !!geminiKey, "Query:", q);

    // 0. CHECK LOCAL KNOWLEDGE BASE FIRST (High Priority Sets)
    // This allows us to return perfect, curated data for popular items without relying on AI laziness.
    const localHit = getMockResult(q);
    if (localHit && localHit.length > 0) {
        // If it's a generic fallback (generated only when query > 2), we might still want AI if we have keys.
        // But our getMockResult returns specific sets for Arri/Cooke/Laowa/Tribe7.
        // Let's filter out the "Generic" fallback if we have API keys.
        const isGeneric = localHit[0].brand === 'Generic';

        if (!isGeneric) {
            console.log("Local Knowledge Hit!", localHit[0].model);
            return localHit;
        }
    }

    const SYSTEM_PROMPT = `You are a cinema equipment expert. Research technical specs for: "${query}".
    
    ### CONTEXT & KNOWLEDGE BASE (Use this data for precision):
    - **Tribe7 Blackwing7**: 
      - **Tunings**: Binary (B), Transient (T), Expressive (X). Default to T-tuned if unspecified.
      - **Focal Lengths**: 20.7mm, 27mm, 37mm, 47mm, 57mm, 77mm, 107mm, 137mm.
      - **Aperture**: Mostly T1.9 (77mm/107mm are T1.8, 137mm is T2.0).
      - **Front Diameter**: 114mm (Standard).
      - **Weight**: Approx 1.4kg - 1.7kg depending on focal.
    - **Cooke SP3**: Mirrorless primes (Sony E, RF, L, M). Focals: 25, 32, 50, 75, 100mm. T2.4. User interchangeable mounts.
    
    ### RULES:
    1. **Typo Correction**: Infer the correct brand if misspelled (e.g. "loova" -> "Laowa", "ari" -> "ARRI").
    2. **Broad Search**: If the user searches for a Brand ONLY, return their Top 3-5 Product Lines.
    3. **Lens Sets**: Always return the full set of focal lengths for lens series.
    4. **Precision**: Use the CONTEXT above for exact values. If an item is not in context and you are unsure, provide your Best Educated Estimate but ensure it is realistic for cinema gear.
    5. **Categorization**: 
       - Lenses with "mm" and "T/F" stop MUST be category "LNS". 
       - Do NOT put lenses in "CAM".
    
    Return ONLY a JSON array matching this schema:
    [{
        "brand": "string",
        "model": "string",
        "category": "CAM" | "LNS" | "LGT" | "FLT" | "SUP" | "MON",
        "subcategory": "string",
        "coverage": "string (optional)",
        "mount": "string (optional)",
        "lens_type": "string (optional)",
        "front_diameter_mm": "number (optional)",
        "weight_kg": "number (optional)",
        "close_focus": "string (optional, ex: \"0.43m / 1'5\"\")",
        "iris_range": "string (optional, ex: \"T1.9-T22\")",
        "image_circle_mm": "number (optional)",
        "description": "string",
        "accessories": [ { "brand": "string", "model": "string", "category": "string", "subcategory": "string" } ]
    }]
    DO NOT wrap in markdown.`;

    // 1. Try OpenAI if Key Exists
    if (openaiKey) {
        try {
            const openai = new OpenAI({ apiKey: openaiKey });
            console.log("Calling OpenAI...");
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: query }
                ],
                model: "gpt-4o",
            });

            const content = completion.choices[0].message.content;
            console.log("OpenAI Response:", content?.substring(0, 100)); // Log first 100 chars
            if (content) {
                // Strip markdown if present
                const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
                const result = JSON.parse(cleanJson);
                // Ensure array
                return Array.isArray(result) ? result.map((i: TechnicalSpecs) => ({ ...i, isAIGenerated: true })) : [{ ...(result as TechnicalSpecs), isAIGenerated: true }];
            }
        } catch (error: any) {
            console.error("OpenAI Failed:", error);
            if (error?.status === 429) {
                console.log("Quota Exceeded. Falling back...");
            }
        }
    }

    // 2. Try Gemini if OpenAI missing or failed
    if (geminiKey) {
        try {
            console.log("Calling Google Gemini (Pro 1.5)...");
            const genAI = new GoogleGenerativeAI(geminiKey);
            // Upgrade to Pro 1.5 for better reasoning on niche items
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            const result = await model.generateContent(SYSTEM_PROMPT);
            const response = await result.response;
            const text = response.text();

            console.log("Gemini Response:", text.substring(0, 100));
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanJson);
            return Array.isArray(data) ? data.map((i: TechnicalSpecs) => ({ ...i, isAIGenerated: true })) : [{ ...(data as TechnicalSpecs), isAIGenerated: true }];

        } catch (error: any) {
            console.error("Gemini Failed:", error);
        }
    }

    // 3. Fallback to Mock (if API failed and we filtered out generic before)
    console.log("No working API Key or API Failed. Using Mock.");
    return getMockResult(q);
}
