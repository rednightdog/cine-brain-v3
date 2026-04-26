import { describe, expect, it } from "vitest";

import {
    estimateRecordingDuration,
    formatRecordingDurationEstimate,
    parseMediaCapacityGb
} from "../lib/recording-duration";

describe("recording duration estimates", () => {
    it("reads media capacity from names and specs", () => {
        expect(parseMediaCapacityGb("Codex Drive 1TB")).toBe(1000);
        expect(parseMediaCapacityGb("CFexpress Type B 512GB")).toBe(512);
        expect(parseMediaCapacityGb("Codex Drive", "Compact Drive", JSON.stringify({ capacity_tb: 2 }))).toBe(2000);
    });

    it("estimates minutes from selected camera setup when catalog bitrate is missing", () => {
        const estimate = estimateRecordingDuration({
            cameraConfigJson: JSON.stringify({
                resolutionK: "4.6K",
                gateMode: "Open Gate",
                aspectRatio: "16:9",
                codec: "ARRIRAW"
            }),
            mediaName: "Codex Drive 1TB"
        });

        expect(estimate).not.toBeNull();
        expect(estimate?.source).toBe("estimate");
        expect(estimate?.dataRateMbps).toBe(2600);
        expect(Math.round(estimate?.minutes || 0)).toBe(51);
        expect(formatRecordingDurationEstimate(estimate!)).toContain("1TB -> 51 min approx");
    });

    it("prefers matching catalog data rates when the camera has recording format data", () => {
        const estimate = estimateRecordingDuration({
            cameraConfigJson: JSON.stringify({
                resolutionK: "4K",
                gateMode: "16:9",
                aspectRatio: "16:9",
                codec: "ProRes 422 HQ"
            }),
            cameraRecordingFormats: JSON.stringify([
                { resolution: "4.6K Open Gate", codec: "ARRIRAW", data_rate: "2.6 Gbps" },
                { resolution: "4K 16:9", codec: "ProRes 422 HQ", data_rate: "800 Mbps" }
            ]),
            mediaName: "Codex Drive 1TB"
        });

        expect(estimate).not.toBeNull();
        expect(estimate?.source).toBe("catalog");
        expect(estimate?.dataRateMbps).toBe(800);
        expect(Math.round(estimate?.minutes || 0)).toBe(167);
        expect(formatRecordingDurationEstimate(estimate!)).toContain("1TB -> 2h 47m catalog");
    });

    it("labels selected verified camera profile data rates", () => {
        const estimate = estimateRecordingDuration({
            cameraConfigJson: JSON.stringify({
                profileId: "profile-0-alexa-35-arriraw",
                profileLabel: "4.6K Open Gate ARRIRAW - 2.6 Gbps",
                source: "verified",
                resolutionK: "4.6K",
                gateMode: "Open Gate",
                codec: "ARRIRAW",
                dataRateMbps: 2600
            }),
            mediaName: "Codex Drive 1TB"
        });

        expect(estimate).not.toBeNull();
        expect(estimate?.source).toBe("verified");
        expect(estimate?.dataRateMbps).toBe(2600);
        expect(Math.round(estimate?.minutes || 0)).toBe(51);
        expect(formatRecordingDurationEstimate(estimate!)).toContain("1TB -> 51 min verified");
    });

    it("uses custom data rate for generic camera setups", () => {
        const estimate = estimateRecordingDuration({
            cameraConfigJson: JSON.stringify({
                resolutionK: "8K",
                gateMode: "Open Gate",
                aspectRatio: "16:9",
                codec: "ProRes 422 HQ",
                dataRateMbps: 1000
            }),
            mediaName: "Generic SSD 1TB"
        });

        expect(estimate).not.toBeNull();
        expect(estimate?.source).toBe("custom");
        expect(estimate?.dataRateMbps).toBe(1000);
        expect(Math.round(estimate?.minutes || 0)).toBe(133);
        expect(formatRecordingDurationEstimate(estimate!)).toContain("1TB -> 2h 13m custom");
    });
});
