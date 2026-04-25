import { describe, expect, it } from "vitest";

import { parseCsvTable, parseImportRow } from "../lib/inventory-import";

describe("parseCsvTable", () => {
    it("parses quoted commas and multiline values", () => {
        const csv = [
            "brand,model,name,description",
            "\"ARRI\",\"ALEXA 35\",\"ARRI Alexa 35\",\"Body, with comma\"",
            "\"Cooke\",\"S4/i\",\"Cooke 50\",\"Line 1",
            "Line 2\"",
        ].join("\n");

        const result = parseCsvTable(csv);
        expect(result.issues.filter((x) => x.level === "error")).toHaveLength(0);
        expect(result.rows).toHaveLength(2);
        expect(result.rows[0].description).toBe("Body, with comma");
        expect(result.rows[1].description).toContain("Line 1\nLine 2");
    });
});

describe("parseImportRow", () => {
    it("maps camera rows and auto-converts plain text JSON fields", () => {
        const row = {
            brand: "ARRI",
            model: "ALEXA 35",
            name: "ARRI Alexa 35",
            category: "Camera",
            recordingFormats: "4.6K ARRIRAW | 4K ProRes",
            technicalData: "17 stops dynamic range",
            labMetrics: "base iso 800",
        };

        const parsed = parseImportRow(row, 2);
        expect(parsed.item).not.toBeNull();
        expect(parsed.item?.data.category).toBe("CAM");
        expect(parsed.item?.data.daily_rate_est).toBe(500);
        expect(parsed.item?.data.recordingFormats).toBeTruthy();
        expect(parsed.item?.data.technicalData).toBeTruthy();
        expect(parsed.item?.data.labMetrics).toBeTruthy();
        expect(parsed.issues.some((x) => x.field === "recordingFormats" && x.level === "warning")).toBe(true);
    });

    it("returns error when required fields are missing", () => {
        const parsed = parseImportRow(
            {
                category: "Lens",
                name: "Cooke S4/i 50mm",
            },
            5
        );

        expect(parsed.item).toBeNull();
        expect(parsed.issues.some((x) => x.level === "error" && x.field === "brand")).toBe(true);
        expect(parsed.issues.some((x) => x.level === "error" && x.field === "model")).toBe(true);
    });

    it("falls back to SUP when category is unknown", () => {
        const parsed = parseImportRow(
            {
                brand: "Generic",
                model: "X1",
                name: "Mystery Item",
                category: "UnknownCategory",
            },
            7
        );

        expect(parsed.item).not.toBeNull();
        expect(parsed.item?.category).toBe("SUP");
        expect(parsed.issues.some((x) => x.level === "warning" && x.field === "category")).toBe(true);
    });
});
