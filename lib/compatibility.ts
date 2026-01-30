import { InventoryEntry, InventoryItem } from "@/components/CineBrainInterface";
import { findCompatibleAdapters, Adapter } from "./adapters";

export interface CompatibilityWarning {
    itemId: string;
    message: string;
    type: 'MOUNT' | 'SENSOR' | 'WEIGHT';
    suggestedAdapters?: Adapter[];
}

/**
 * Validates a kit for technical conflicts.
 */
export function validateCompatibility(inventory: InventoryEntry[], catalog: any[]): CompatibilityWarning[] {
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

        if (hostItem && item.category === 'LNS') {
            // 1. Mount Validation
            const hMount = (hostItem.mount || '').toUpperCase();
            const iMount = (item.mount || '').toUpperCase();

            if (hMount && iMount && hMount !== iMount) {
                // Special case: LPL cameras (Alexa 35) often have PL adapters
                // But we should STILL warn unless an adapter is explicitly present in the chain (future improvement)
                // For now, let's treat LPL->PL as a mismatch that requires an adapter suggestion.

                // Previously: const isLPLtoPL = hMount === 'LPL' && iMount === 'PL';
                // The previous logic skipped warning if isLPLtoPL was true. 
                // We WANT to warn so the user knows to use an adapter.

                // Find compatible adapters
                const adapters = findCompatibleAdapters(iMount, hMount);

                let message = `Mount Mismatch: Camera is ${hMount}, Item is ${iMount}`;
                if (adapters.length > 0) {
                    const adapterNames = adapters.map(a => a.name).join(' or ');
                    // Explicitly suggest the adapter
                    // warning will have suggestedAdapters populated which UI uses to show "Solution: Use ..."
                } else {
                    message += `\n(No known adapter found)`;
                }

                warnings.push({
                    itemId: entry.id,
                    message,
                    type: 'MOUNT',
                    suggestedAdapters: adapters
                });
            }

            // 2. Sensor Coverage Validation (using coverage field for lenses)
            const cameraSensor = normalizeSensor(hostItem.sensor_size || hostItem.subcategory);
            const lensCoverage = normalizeSensor(item.coverage || item.sensor_coverage);

            // Check if lens coverage is insufficient for camera sensor
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
    });

    return warnings;
}
