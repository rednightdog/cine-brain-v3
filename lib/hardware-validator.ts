export interface HardwareSpecs {
    // Camera fields
    power?: { min_voltage?: number; max_voltage?: number; mount_type?: string };
    media_slots?: string[];
    compatible_codecs?: string[];

    // Media fields
    media_type?: string;
    write_speed?: string;
    certified_for?: string[];

    // Power fields (Batteries/Plates)
    voltage?: number;
    mount_type?: string;

    // Accessory Logic (New)
    compatible_with?: string; // e.g. "sony-venice-2" (slug or ID)
    needs?: string[];        // e.g. ["Extension Cable", "90 Degree SDI"]
    weight_kg?: number;      // For lenses

    // Wireless Video fields (New)
    inputs?: string[];        // e.g. ["SDI", "HDMI"]
    latency?: string;         // e.g. "0ms"
    range?: string;           // e.g. "750ft"
    power_input?: string;     // e.g. "D-Tap / Lemo"
}

export interface CompatibilityWarning {
    type: 'MEDIA' | 'POWER' | 'MOUNT' | 'SENSOR' | 'WEIGHT' | 'GENERAL' | 'DEPENDENCY';
    severity: 'ERROR' | 'WARNING';
    message: string;
    solution?: string; // Actionable advice
    itemId?: string;
}

/**
 * Validates hardware compatibility between a primary item (usually a Camera) 
 * and a peripheral item (Lens, Media, Battery, etc.)
 */
export function validateHardwareCompatibility(
    primary: { brand: string, model: string, category: string, specs?: HardwareSpecs },
    peripheral: { brand: string, model: string, category: string, specs?: HardwareSpecs }
): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];

    // --- 1. MEDIA VALIDATION ---
    if (primary.category === 'CAM' && peripheral.category === 'SUP' && (peripheral.specs?.media_type)) {
        const slots = primary.specs?.media_slots || [];
        const type = peripheral.specs?.media_type;

        if (slots.length > 0 && !slots.includes(type)) {
            warnings.push({
                type: 'MEDIA',
                severity: 'ERROR',
                message: `${peripheral.brand} ${peripheral.model} (${type}) is not compatible with ${primary.model} slots (${slots.join(', ')}).`
            });
        }

        // Codec Certification Check
        const cameraCodecs = primary.specs?.compatible_codecs || [];
        const certifiedCodecs = peripheral.specs?.certified_for || [];

        if (cameraCodecs.length > 0 && certifiedCodecs.length > 0) {
            const missing = cameraCodecs.filter(c => !certifiedCodecs.includes(c));
            if (missing.length === cameraCodecs.length) {
                warnings.push({
                    type: 'MEDIA',
                    severity: 'WARNING',
                    message: `${peripheral.model} is not officially certified for ${primary.model}'s primary codecs (${cameraCodecs.join(', ')}).`
                });
            }
        }
    }

    // --- 2. POWER VALIDATION ---
    if (primary.category === 'CAM' && (peripheral.category === 'SUP' || peripheral.category === 'BAT') && (peripheral.specs?.mount_type || peripheral.specs?.voltage)) {
        // Advanced Power Logic (User Provided Rules)
        const powerWarnings = evaluatePowerCompatibility(primary, peripheral);
        warnings.push(...powerWarnings);
    }

    // --- 3. INDUSTRY SPECIFIC RULES (High-Fidelity overrides) ---
    if (primary.brand.toLowerCase() === 'sony' && primary.model.includes('Venice 2') && peripheral.specs?.media_type === 'SD') {
        warnings.push({
            type: 'MEDIA',
            severity: 'ERROR',
            message: "🚨 Hata: Venice 2 ana kayıt için SD kart kullanamaz! Lütfen AXS kart seçin."
        });
    }

    // --- 4. ACCESSORY COMPATIBILITY (New) ---
    if (peripheral.specs?.compatible_with) {
        const targetHost = peripheral.specs.compatible_with.toLowerCase();
        const actualHost = (primary.brand + ' ' + primary.model).toLowerCase();

        if (!actualHost.includes(targetHost)) {
            warnings.push({
                type: 'GENERAL',
                severity: 'ERROR',
                message: `${peripheral.model} is only compatible with ${peripheral.specs.compatible_with}.`
            });
        }
    }

    // --- 5. VENICE RIALTO VERSION CHECK ---
    if (primary.model.includes('Venice 2') && peripheral.model.includes('Rialto') && !peripheral.model.includes('Rialto 2')) {
        warnings.push({
            type: 'GENERAL',
            severity: 'ERROR',
            message: "🚨 RIALTO ERROR: Venice 2 requires Rialto 2 for 8K/High-speed support. Rialto 1 is not compatible.",
            solution: "💡 Çözüm: Lütfen Rialto 1 yerine Rialto 2 extension system seçin."
        });
    }

    // --- 6. LENS SUPPORT ADVICE ---
    if (peripheral.category === 'LNS' && peripheral.specs?.weight_kg && peripheral.specs.weight_kg > 2 && primary.specs?.power?.mount_type === 'PL') {
        // Note: Using power.mount_type as a proxy for camera mount if mount field is missing in specs
        warnings.push({
            type: 'WEIGHT',
            severity: 'WARNING',
            message: `⚠️ HEAVY LENS: ${peripheral.model} exceeds 2kg (${peripheral.specs.weight_kg}kg).`,
            solution: "💡 Tavsiye: Ağır lens tespit edildi. Lütfen 'Rod Based Lens Support' (Lens Desteği) eklediğinizden emin olun."
        });
    }
    // Specific case if we have proper mount field
    else if (peripheral.category === 'LNS' && peripheral.specs?.weight_kg && peripheral.specs.weight_kg > 2) {
        warnings.push({
            type: 'WEIGHT',
            severity: 'WARNING',
            message: `⚠️ HEAVY LENS: ${peripheral.model} exceeds 2kg (${peripheral.specs.weight_kg}kg).`,
            solution: "💡 Tavsiye: Ağır lens tespit edildi. Lütfen 'Rod Based Lens Support' (Lens Desteği) eklediğinizden emin olun."
        });
    }

    return warnings;
}

/**
 * Validates that all required dependencies for selected items are present in the project.
 */
export function validateDependencies(
    inventory: any[], // List of selected items in the project
    catalog: any[]    // Full catalog to lookup item names if needed
): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];

    inventory.forEach(entry => {
        const item = catalog.find(c => c.id === entry.equipmentId);
        if (!item || !item.specs_json) return;

        try {
            const specs: HardwareSpecs = JSON.parse(item.specs_json);
            if (specs.needs && specs.needs.length > 0) {
                // Check if items satisfying these needs are in the same project/camera unit
                const missing = specs.needs.filter(need => {
                    // Search in project for an item whose name or model includes the 'need'
                    const found = inventory.some(inv => {
                        if (inv.assignedCam !== entry.assignedCam) return false;
                        const invName = (inv.name + ' ' + (inv.model || '')).toLowerCase();
                        return invName.includes(need.toLowerCase());
                    });
                    return !found;
                });

                if (missing.length > 0) {
                    warnings.push({
                        itemId: entry.id,
                        type: 'DEPENDENCY',
                        severity: 'WARNING',
                        message: `${item.name} requires: ${missing.join(', ')}`
                    });
                }
            }
        } catch (e) {
            console.error("Error parsing specs_json in validateDependencies:", e);
        }
    });

    return warnings;
}
/**
 * Direct implementation of requested Turkish-localized power rules
 */
function evaluatePowerCompatibility(
    camera: any,
    battery: any
): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];
    const camPower = camera.specs?.power;
    const batSpecs = battery.specs;

    if (!camPower || !batSpecs) return [];

    // 1. Kural: Voltaj Kontrolü
    if (batSpecs.voltage && camPower.min_voltage && batSpecs.voltage < camPower.min_voltage) {
        warnings.push({
            type: 'POWER',
            severity: 'ERROR',
            message: `🚨 KRİTİK HATA: Voltaj Yetersiz! ${camera.name} çalışmak için en az ${camPower.min_voltage}V ister.`,
            solution: "💡 Çözüm: Lütfen 24V çıkışlı bir B-Mount batarya veya uygun bir Power Station (Blok Batarya) kullanın."
        });
    }

    // 2. Kural: Fiziksel Mount Kontrolü
    if (batSpecs.mount_type && camPower.mount_type && batSpecs.mount_type !== camPower.mount_type) {
        warnings.push({
            type: 'POWER',
            severity: 'WARNING',
            message: `⚠️ UYARI: Bağlantı Tipi Farklı! Kamera ${camPower.mount_type} yapısında, batarya ise ${batSpecs.mount_type}.`,
            solution: "💡 Çözüm: Uygun bir mount dönüştürücü plaka veya doğrudan uyumlu bir batarya seçin."
        });
    }

    return warnings;
}
