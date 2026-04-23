import { beforeEach, describe, expect, it, vi } from "vitest";

type SerpLikeResult = {
    knowledge_graph?: Record<string, unknown>;
    organic_results?: Record<string, unknown>[];
    error?: string;
};

const { jsonMock, googleSearchCtorMock } = vi.hoisted(() => {
    const json = vi.fn();
    const ctor = vi.fn(
        class GoogleSearchMock {
            json = json;
        }
    );
    return { jsonMock: json, googleSearchCtorMock: ctor };
});

vi.mock("google-search-results-nodejs", () => ({
    GoogleSearch: googleSearchCtorMock,
}));

import { searchTechnicalSpecs } from "../lib/serp-api";

describe("searchTechnicalSpecs", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        delete process.env.SERPAPI_KEY;
    });

    it("returns a config error when SERPAPI_KEY is missing", async () => {
        const result = await searchTechnicalSpecs("sony venice 2");

        expect(result).toEqual({ error: "SERPAPI_KEY is not configured" });
        expect(googleSearchCtorMock).not.toHaveBeenCalled();
    });

    it("calls SerpApi client when SERPAPI_KEY is set", async () => {
        process.env.SERPAPI_KEY = "test-key";

        jsonMock.mockImplementation(
            (
                _params: Record<string, string>,
                callback: (data: SerpLikeResult) => void
            ) => {
                callback({
                    organic_results: [{ title: "Sony Venice 2 specs" }],
                });
            }
        );

        const result = await searchTechnicalSpecs("sony venice 2");

        expect(googleSearchCtorMock).toHaveBeenCalledWith("test-key");
        expect(jsonMock).toHaveBeenCalledTimes(1);
        expect(result.organic_results?.length).toBe(1);
    });

    it("passes through provider error payload", async () => {
        process.env.SERPAPI_KEY = "test-key";

        jsonMock.mockImplementation(
            (
                _params: Record<string, string>,
                callback: (data: SerpLikeResult) => void
            ) => {
                callback({ error: "rate limited" });
            }
        );

        const result = await searchTechnicalSpecs("sony venice 2");

        expect(result).toEqual({ error: "rate limited" });
    });
});
