
import { GoogleSearch } from "google-search-results-nodejs";

const API_KEY = process.env.SERPAPI_KEY || "41f7c77f655c9b4149a5c00d5c44b9693055c7c7be26d3b05bac42315c34ff53";
const search = new GoogleSearch(API_KEY);

export interface SerpApiResult {
    knowledge_graph?: any;
    organic_results?: any[];
    error?: string;
}

export async function searchTechnicalSpecs(query: string): Promise<SerpApiResult> {
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
            search.json(params, (data: any) => {
                if (data.error) resolve({ error: data.error });
                else resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}
