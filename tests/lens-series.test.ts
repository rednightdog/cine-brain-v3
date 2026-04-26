import { describe, expect, it } from "vitest";

import {
    formatLensGroupTitle,
    getLensSeriesName,
    inferLensAperture,
} from "../lib/lens-series";

describe("lens series helpers", () => {
    it("groups generic lens variants by series instead of focal length", () => {
        expect(getLensSeriesName({
            brand: "Thypoch",
            model: "Simera-C 21mm T1.5",
            name: "Thypoch Simera-C 21mm T1.5",
        })).toBe("Simera-C T1.5");

        expect(getLensSeriesName({
            brand: "Thypoch",
            model: "Simera-C 75mm T1.5",
            name: "Thypoch Simera-C 75mm T1.5",
        })).toBe("Simera-C T1.5");
    });

    it("does not duplicate aperture when the series already includes it", () => {
        expect(formatLensGroupTitle("Thypoch", "Simera-C T1.5", "T1.5")).toBe("Thypoch Simera-C T1.5");
    });

    it("adds aperture when the series does not include it", () => {
        expect(formatLensGroupTitle("ARRI", "Signature Prime", "T1.8")).toBe("ARRI Signature Prime T1.8");
    });

    it("infers aperture from the lens name", () => {
        expect(inferLensAperture({ name: "Thypoch Simera-C 35mm T1.5" })).toBe("T1.5");
    });
});
