import type { InventoryEntry, InventoryItem } from "@/components/CineBrainInterface";
import { validateHardwareCompatibility, validateDependencies } from "./hardware-validator";
import { findCompatibleAdapters, Adapter } from "./adapters";

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
        const item = catalog.find(c => c.id === e.equipmentId);
        return item?.category === 'CAM';
    });

    const normalizeSensor = (s: string | null | undefined) => {
        if (!s) return '';
        const lower = s.toLowerCase();
        if (lower.includes('lf') || lower.includes('large format')) return 'LF';
        if (lower.includes('full') || lower.includes('ff')) return 'FF';
        if (lower.includes('s35') || lower.includes('super 35')) return 'S35';
        return s;
    };

    inventory.forEach(entry => {
        const item = catalog.find(c => c.id === entry.equipmentId);
        if (!item) return;

        // Find assigned camera body
        const hostCam = cameras.find(c => c.assignedCam === entry.assignedCam);
        const hostItem = hostCam ? catalog.find(c => c.id === hostCam.equipmentId) : null;

        // 1. Lens Compatibility (Mount & Sensor)
        if (hostItem && item.category === 'LNS') {
            const hMount = (hostItem.mount || '').toUpperCase();
            const iMount = (item.mount || '').toUpperCase();

            if (hMount && iMount && hMount !== iMount) {
                // 1. İmkansız durum kontrolü (Sony E lens on PL camera)
                if (iMount === 'E-MOUNT' && hMount === 'PL') {
                    warnings.push({
                        itemId: entry.id,
                        message: `🚨 İMKANSIZ: Bu eşleşme fiziksel olarak mümkün değil!`,
                        solution: "🚫 Vazgeç: Flange mesafesi çok kısa. Fiziksel adaptör imkansız. Lütfen kameranın mount yapısına uygun başka bir lens seçin.",
                        type: 'MOUNT',
                        severity: 'ERROR'
                    });
                    return;
                }

                // 2. Adaptör kontrolü ve önerisi
                const adapters = findCompatibleAdapters(iMount, hMount);
                let solution: string | undefined = undefined;

                if (iMount === 'PL' && hMount === 'E-MOUNT') {
                    solution = "💡 Çözüm: Envanterden bir 'PL to E-Mount Adapter' (electronic) ekleyin.";
                } else if (iMount === 'PL' && hMount === 'RF') {
                    solution = "💡 Çözüm: Envanterden bir 'PL to RF Adapter' (electronic) ekleyin.";
                } else if (iMount === 'EF' && hMount === 'E-MOUNT') {
                    solution = "💡 Çözüm: Envanterden bir 'Sigma MC-11 or Metabones' (electronic) ekleyin.";
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
                        message: `Mount Mismatch: Camera is ${hMount}, Item is ${iMount}\n(No known adapter found)`,
                        type: 'MOUNT',
                        severity: 'ERROR'
                    });
                }
            }

            const cameraSensor = normalizeSensor(hostItem.sensor_size || hostItem.subcategory);
            const lensCoverage = normalizeSensor(item.coverage);

            if (cameraSensor && lensCoverage) {
                const sensorHierarchy = { 'S35': 1, 'FF': 2, 'LF': 3 };
                const cameraLevel = sensorHierarchy[cameraSensor as keyof typeof sensorHierarchy] || 0;
                const lensLevel = sensorHierarchy[lensCoverage as keyof typeof sensorHierarchy] || 0;

                if (lensLevel < cameraLevel) {
                    warnings.push({
                        itemId: entry.id,
                        message: `Coverage Warning: ${item.name} (${lensCoverage}) may vignette on ${hostItem.name} (${cameraSensor} sensor)`,
                        type: 'SENSOR'
                    });
                }
            }
        }

        // 2. Hardware Validation (Power, Media, Codecs)
        if (hostItem && hostItem.id !== item.id) {
            const hwWarnings = validateHardwareCompatibility(
                {
                    brand: hostItem.brand || '',
                    model: hostItem.model || '',
                    category: hostItem.category,
                    specs: safeParseSpecs(hostItem.specs_json)
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
