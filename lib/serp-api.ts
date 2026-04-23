
import { GoogleSearch } from "google-search-results-nodejs";

export interface SerpApiResult {
    knowledge_graph?: Record<string, unknown>;
    organic_results?: Record<string, unknown>[];
    error?: string;
}

export async function searchTechnicalSpecs(query: string): Promise<SerpApiResult> {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
        return { error: "SERPAPI_KEY is not configured" };
    }

    const search = new GoogleSearch(apiKey);
    const params = {
        engine: "google",
        q: query,
        location: "United States",
        google_domain: "google.com",
        gl: "us",
        hl: "en",
        device: "desktop"
    };

    return new Promise((resolve, reject) => {
        try {
            search.json(params, (data: SerpApiResult) => {
                if (data.error) resolve({ error: data.error });
                else resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}
