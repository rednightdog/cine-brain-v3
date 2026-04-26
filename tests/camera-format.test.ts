import { describe, expect, it } from "vitest";

import {
    getCameraRecordingProfile,
    parseCameraRecordingOptions,
} from "../lib/camera-format";
import type { InventoryItem } from "../components/CineBrainInterface";

describe("camera recording format helpers", () => {
    it("parses verified JSON recording profiles with data rates", () => {
        const options = parseCameraRecordingOptions(JSON.stringify([
            {
                resolution: "4.6K Open Gate (4608 x 3164)",
                codec: "ARRIRAW",
                max_fps: "75 fps",
                data_rate: "2.6 Gbps",
            },
            {
                resolution: "4K 16:9",
                codec: "ProRes 422 HQ",
                max_fps: "120 fps",
                data_rate: "800 Mbps",
            },
        ]));

        expect(options).toHaveLength(2);
        expect(options[0]).toMatchObject({
            resolutionK: "4.6K",
            gateMode: "Open Gate",
            codec: "ARRIRAW",
            dataRateMbps: 2600,
            maxFps: "75 fps",
        });
        expect(options[1]).toMatchObject({
            resolutionK: "4K",
            gateMode: "16:9",
            aspectRatio: "16:9",
            codec: "ProRes 422 HQ",
            dataRateMbps: 800,
        });
    });

    it("keeps format-only camera profiles selectable", () => {
        const options = parseCameraRecordingOptions(JSON.stringify([
            { format: "8K (8192x4320) ProRes RAW HQ" },
            { format: "4K (4096x2160) ProRes 422 HQ" },
        ]));

        expect(options).toHaveLength(2);
        expect(options[0]).toMatchObject({
            resolutionK: "8K",
            codec: "ProRes RAW HQ",
            dataRateMbps: undefined,
        });
        expect(options[0].label).toContain("8K");
        expect(options[0].label).toContain("ProRes RAW HQ");
    });

    it("uses verified profile labels in camera coverage summaries", () => {
        const camera: InventoryItem = {
            id: "cam-1",
            name: "ARRI Alexa 35",
            brand: "ARRI",
            model: "Alexa 35",
            category: "CAM",
            subcategory: "Bodies",
            sensor_size: "Super 35",
        };

        const profile = getCameraRecordingProfile(camera, {
            configJson: JSON.stringify({
                source: "verified",
                profileLabel: "4.6K Open Gate ARRIRAW - 2.6 Gbps",
                sensorMode: "S35",
                gateMode: "Open Gate",
                resolutionK: "4.6K",
                codec: "ARRIRAW",
            }),
        });

        expect(profile.summary).toBe("4.6K Open Gate ARRIRAW - 2.6 Gbps / S35 mode");
    });
});
