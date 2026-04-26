import type { InventoryItem } from "@/components/CineBrainInterface";

export const CATEGORIES = [
    { id: "CAM", name: "CAMERA" },
    { id: "LNS", name: "LENS" },
    { id: "FLT", name: "FILTER" },
    { id: "MON", name: "MONITOR" },
    { id: "SUP", name: "SUPPORT" },
    { id: "GRP", name: "GRIP" },
    { id: "LIT", name: "LIGHT" },
    { id: "POW", name: "POWER" },
    { id: "DIT", name: "DIT & MEDIA" },
    { id: "COM", name: "COMMS" },
];

export const SUBCATEGORY_OPTIONS: Record<string, string[]> = {
    CAM: ["Bodies", "Drone", "Action", "Specialty", "Monitor", "Media", "Power", "Support", "Generic"],
    LNS: ["Prime", "Zoom", "Anamorphic", "Vintage", "Macro", "Filter", "Adapter", "Generic"],
    FLT: ["ND", "IRND", "Polarizer", "Diffusion", "UV", "Clear", "Generic"],
    MON: ["Production Monitor", "On-Camera Monitor", "EVF", "Recorder", "Stand", "Wireless", "Generic"],
    SUP: ["Tripod Legs", "Fluid Head", "Stabilizer", "Grip (Support)", "Matte Box", "Follow Focus", "Wireless Video", "Audio", "Rigging", "Generic"],
    GRP: ["Rigging", "Clamp", "Arm", "Stand", "Accessory", "Generic"],
    LIT: ["LED", "Daylight", "Tungsten", "HMI", "Tube", "Panel", "Modifier", "Stand", "Grip", "Control", "Generic"],
    POW: ["Block Battery", "On-Board Battery", "Power Cables", "Charger", "Distribution", "Generic"],
    DIT: ["Card", "Reader", "Drive", "Ingest", "Monitoring", "Generic"],
    COM: ["Wireless", "Wired", "Intercom", "Accessory", "Generic"],
};

export const isCameraBody = (item: InventoryItem | undefined): item is InventoryItem => {
    if (!item) return false;

    const category = item.category.toLowerCase();
    if (category !== "cam" && category !== "camera") return false;

    const subcategory = (item.subcategory || "").toLowerCase();
    const accessorySubcategoryKeywords = [
        "accessory", "adapter", "battery", "batteries", "cable", "card",
        "drive", "media", "monitor", "power", "reader", "support"
    ];
    if (accessorySubcategoryKeywords.some(keyword => subcategory.includes(keyword))) return false;

    if (subcategory === "bodies" || subcategory.includes("body")) return true;
    if (item.id && item.id.toLowerCase().includes("body")) return true;

    const cameraSubcategoryKeywords = [
        "action", "cinema", "drone", "full frame", "gimbal camera", "large format",
        "specialty", "super 35", "s16", "s35", "ff", "lf"
    ];
    if (cameraSubcategoryKeywords.some(keyword => subcategory.includes(keyword))) return true;

    if (item.sensor_size || item.sensor_type || item.resolution || item.recordingFormats) return true;

    const name = item.name.toLowerCase();
    const bodyKeywords = [
        "sony", "venice", "arri", "alexa", "red", "komodo", "raptor", "camera", "body",
        "blackmagic", "ursa", "fx3", "fx6", "fx9", "c70", "c300", "c500", "a7s", "a7r",
        "dji", "ronin 4d", "zenmuse x9", "lumix", "gh5", "s1h"
    ];
    return bodyKeywords.some(k => name.includes(k));
};

export const getNextCameraLetter = (assignedCams: Array<string | null | undefined>) => {
    const used = new Set(
        assignedCams
            .map(cam => cam?.trim().toUpperCase())
            .filter((cam): cam is string => !!cam && /^[A-Z]$/.test(cam))
    );

    for (let code = 65; code <= 90; code += 1) {
        const candidate = String.fromCharCode(code);
        if (!used.has(candidate)) return candidate;
    }

    return "Z";
};

export const getCameraColor = (cam: string) => {
    switch (cam) {
        case 'A': return 'bg-[#FF3B30] text-white';
        case 'B': return 'bg-[#007AFF] text-white';
        case 'C': return 'bg-[#FFCC00] text-white';
        default: return 'bg-[#8E8E93] text-white';
    }
};

export const getCompatibleOptions = (hostItem: InventoryItem, catalog: InventoryItem[]): InventoryItem[] => {
    const hostName = hostItem.name.toLowerCase();

    // 1. Sony Venice -> Rialto & Extensions
    if (hostName.includes("venice")) {
        return catalog.filter(i =>
            i.name.includes("Rialto") ||
            (i.subcategory === "Extension" || i.subcategory === "Extension Cable")
        );
    }

    // 2. Arri Alexa -> ??? (Future: maybe viewfinders, antennas?)
    // For now, only specific Rialto request was made.

    return [];
};

export const getCropFactor = (sensorType: string | undefined): number => {
    if (!sensorType) return 1.0;
    const s = sensorType.toLowerCase();
    if (s.includes('super 35') || s.includes('s35') || s.includes('aps-c')) return 1.5;
    if (s.includes('micro four thirds') || s.includes('mft')) return 2.0;
    if (s.includes('large format') || s.includes('lf')) return 0.9; // Approx for Alexa 65 but generally treated as 1.0 for LF
    return 1.0; // FF default
};
