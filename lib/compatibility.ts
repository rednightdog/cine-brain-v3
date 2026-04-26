import type { InventoryEntry, InventoryItem } from "@/components/CineBrainInterface";
import { validateHardwareCompatibility, validateDependencies } from "./hardware-validator";
import { findCompatibleAdapters, Adapter } from "./adapters";
import { getCameraRecordingProfile, normalizeSensorCoverage } from "./camera-format";
import { getEntryInventoryItem } from "./project-custom-specs";

export interface CompatibilityWarning {
    itemId?: string;
    message: string;
    solution?: string; // Actionable advice/solution
    type: 'MOUNT' | 'SENSOR' | 'WEIGHT' | 'MEDIA' | 'POWER' | 'GENERAL' | 'DEPENDENCY' | 'TRIPOD' | 'ROD';
    severity?: 'ERROR' | 'WARNING';
    suggestedAdapters?: Adapter[];
}

function safeParseSpecs(specsJson: string | null | undefined): Record<string, unknown> {
    if (!specsJson) return {};
    try {
        const parsed: unknown = JSON.parse(specsJson);
        return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
    } catch {
        return {};
    }
}

/**
 * Validates a kit for technical conflicts.
 */
export function validateCompatibility(inventory: InventoryEntry[], catalog: InventoryItem[]): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];

    // Find all cameras
    const cameras = inventory.filter(e => {
        const item = getEntryInventoryItem(e, catalog);
        return item?.category === 'CAM';
    });

    inventory.forEach(entry => {
        const item = getEntryInventoryItem(entry, catalog);
        if (!item) return;

        // Find assigned camera body
        const hostCam = cameras.find(c => c.assignedCam === entry.assignedCam);
        const hostItem = hostCam ? getEntryInventoryItem(hostCam, catalog) : null;

        // 1. Lens Compatibility (Mount & Sensor)
        if (hostItem && item.category === 'LNS') {
            const hMount = hostItem.mount || '';
            const iMount = item.mount || '';
            const cameraMounts = parseMountTokens(hMount);
            const lensMounts = parseMountTokens(iMount);

            if (cameraMounts.length > 0 && lensMounts.length > 0 && !mountsOverlap(lensMounts, cameraMounts)) {
                const adapters = lensMounts.flatMap(lensMount =>
                    cameraMounts.flatMap(cameraMount => findCompatibleAdapters(lensMount, cameraMount))
                );
                const impossible = lensMounts.some(lensMount =>
                    cameraMounts.some(cameraMount => isPhysicallyImpossibleMount(lensMount, cameraMount))
                );

                if (impossible) {
                    warnings.push({
                        itemId: entry.id,
                        message: `🚨 İMKANSIZ: Bu eşleşme fiziksel olarak mümkün değil!`,
                        solution: `🚫 Vazgeç: ${item.mount} lens ${hostItem.mount} kameraya basit adaptörle takılamaz. Flange mesafesi uygun değil; kameranın mount yapısına uygun başka lens/mount seçin.`,
                        type: 'MOUNT',
                        severity: 'ERROR'
                    });
                    return;
                }

                let solution: string | undefined = undefined;

                if (lensMounts.includes('PL') && cameraMounts.includes('E-MOUNT')) {
                    solution = "💡 Çözüm: Envanterden bir 'PL to E-Mount Adapter' (electronic) ekleyin.";
                } else if (lensMounts.includes('PL') && cameraMounts.includes('RF')) {
                    solution = "💡 Çözüm: Envanterden bir 'PL to RF Adapter' (electronic) ekleyin.";
                } else if (lensMounts.includes('EF') && cameraMounts.includes('E-MOUNT')) {
                    solution = "💡 Çözüm: Envanterden bir 'Sigma MC-11 or Metabones' (electronic) ekleyin.";
                } else if (lensMounts.includes('M-MOUNT')) {
                    solution = "💡 Çözüm: Leica M lens için kameranın mountuna uygun mekanik M adaptör ekleyin.";
                }

                if (adapters.length > 0 || solution) {
                    warnings.push({
                        itemId: entry.id,
                        message: `⚠️ ADAPTÖR LAZIM: ${item.name} bu kameraya doğrudan takılamaz.`,
                        solution,
                        type: 'MOUNT',
                        severity: 'WARNING',
                        suggestedAdapters: adapters
                    });
                } else {
                    warnings.push({
                        itemId: entry.id,
                        message: `Mount Mismatch: Camera is ${hostItem.mount}, Item is ${item.mount}\n(No known adapter found)`,
                        type: 'MOUNT',
                        severity: 'ERROR'
                    });
                }
            }

            const cameraProfile = getCameraRecordingProfile(hostItem, hostCam);
            const cameraSensor = cameraProfile.sensorCoverage;
            const lensCoverage = normalizeSensorCoverage(item.coverage);
            const lensImageCircle = getLensImageCircleMm(item, safeParseSpecs(item.specs_json));

            if (cameraSensor && lensCoverage) {
                const sensorHierarchy = { 'S16': 0, 'S35': 1, 'FF': 2, 'LF': 3 };
                const cameraLevel = sensorHierarchy[cameraSensor as keyof typeof sensorHierarchy] || 0;
                const lensLevel = sensorHierarchy[lensCoverage as keyof typeof sensorHierarchy] || 0;
                const setupSuffix = cameraProfile.summary ? ` (${cameraProfile.summary})` : "";
                let hasCoverageWarning = false;

                if (
                    lensImageCircle &&
                    cameraProfile.requiredImageCircleMm &&
                    lensImageCircle + 0.2 < cameraProfile.requiredImageCircleMm
                ) {
                    hasCoverageWarning = true;
                    warnings.push({
                        itemId: entry.id,
                        message: `Coverage Warning: ${item.name} image circle (${lensImageCircle}mm) is below ${hostItem.name}${setupSuffix} requirement (~${cameraProfile.requiredImageCircleMm.toFixed(1)}mm).`,
                        type: 'SENSOR'
                    });
                }

                if (!hasCoverageWarning && lensLevel < cameraLevel) {
                    warnings.push({
                        itemId: entry.id,
                        message: `Coverage Warning: ${item.name} (${lensCoverage}) may vignette on ${hostItem.name}${setupSuffix} (${cameraSensor} sensor)`,
                        type: 'SENSOR'
                    });
                }
            }
        }

        // 2. Hardware Validation (Power, Media, Codecs)
        if (hostItem && hostItem.id !== item.id) {
            const cameraProfile = getCameraRecordingProfile(hostItem, hostCam);
            const hostSpecs = safeParseSpecs(hostItem.specs_json);
            if (cameraProfile.codec) {
                hostSpecs.compatible_codecs = [cameraProfile.codec];
            }

            const hwWarnings = validateHardwareCompatibility(
                {
                    brand: hostItem.brand || '',
                    model: hostItem.model || '',
                    category: hostItem.category,
                    specs: hostSpecs
                },
                {
                    brand: item.brand || '',
                    model: item.model || '',
                    category: item.category,
                    specs: safeParseSpecs(item.specs_json)
                }
            );

            hwWarnings.forEach(hw => {
                warnings.push({
                    itemId: entry.id,
                    message: hw.message,
                    type: hw.type,
                    severity: hw.severity,
                    solution: hw.solution
                });
            });
        }
    });

    // 3. Dependency Validation (Accessory missing cables, etc.)
    const depWarnings = validateDependencies(inventory, catalog);
    depWarnings.forEach(w => {
        warnings.push({
            itemId: w.itemId,
            message: w.message,
            type: w.type,
            severity: w.severity,
            solution: w.solution
        });
    });

    return warnings;
}

function parseMountTokens(raw: string): string[] {
    if (!raw) return [];
    const normalized = raw
        .replace(/E-Mount/gi, "E")
        .replace(/M-Mount/gi, "M")
        .replace(/L-Mount/gi, "L")
        .replace(/Mount/gi, "")
        .split(/[\/,+|]/)
        .map(token => normalizeMountToken(token))
        .filter(Boolean);

    return Array.from(new Set(normalized));
}

function normalizeMountToken(raw: string): string {
    const token = raw.trim().toUpperCase().replace(/\s+/g, " ");
    if (!token) return "";
    if (token === "E" || token === "SONY E") return "E-MOUNT";
    if (token === "M" || token === "LEICA M") return "M-MOUNT";
    if (token === "L" || token === "LEICA L") return "L-MOUNT";
    if (token === "RF" || token === "CANON RF") return "RF";
    if (token === "EF" || token === "CANON EF") return "EF";
    if (token === "PL") return "PL";
    if (token === "LPL") return "LPL";
    if (token === "DL" || token === "DJI DL") return "DL";
    return token;
}

function mountsOverlap(lensMounts: string[], cameraMounts: string[]): boolean {
    return lensMounts.some(lensMount => cameraMounts.includes(lensMount));
}

function isPhysicallyImpossibleMount(lensMount: string, cameraMount: string): boolean {
    const flangeMm: Record<string, number> = {
        "E-MOUNT": 18,
        "L-MOUNT": 20,
        "RF": 20,
        "M-MOUNT": 27.8,
        "DL": 16.84,
        "LPL": 44,
        "PL": 52,
        "EF": 44,
    };

    const lensFlange = flangeMm[lensMount];
    const cameraFlange = flangeMm[cameraMount];
    if (!lensFlange || !cameraFlange) return false;
    return lensFlange < cameraFlange;
}

function getLensImageCircleMm(item: InventoryItem, specs: Record<string, unknown>): number | undefined {
    const raw = specs.image_circle_mm || specs.imageCircle || specs.image_circle;
    if (typeof raw === "number") return raw;
    if (typeof raw === "string") {
        const parsed = parseFloat(raw.replace(",", "."));
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    if (typeof item.image_circle_mm === "number") return item.image_circle_mm;

    return undefined;
}
