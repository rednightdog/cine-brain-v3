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

export const isCameraBody = (item: InventoryItem | undefined) => {
    if (!item || item.category !== "CAM") return false;
    if (item.subcategory === "Bodies") return true;
    if (item.id && item.id.toLowerCase().includes("body")) return true;
    const name = item.name.toLowerCase();
    const bodyKeywords = [
        "sony", "venice", "arri", "alexa", "red", "komodo", "raptor", "camera", "body",
        "blackmagic", "ursa", "fx3", "fx6", "fx9", "c70", "c300", "c500", "a7s", "a7r", "lumix", "gh5", "s1h"
    ];
    return bodyKeywords.some(k => name.includes(k));
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
