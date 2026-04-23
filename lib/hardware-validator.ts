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
    voltage?: number | string; // Now supports "14.4V / 28V" strings
    mount_type?: string;

    // Tripod / Grip fields
    base?: string; // Head base (e.g. "Mitchell")
    mount?: string; // Legs mount (e.g. "150mm Bowl") or Battery Mount
    head_mount?: string; // Alternative tripod legs mount naming

    // Rod / Support fields
    rod_standard?: string; // "15mm LWS", "19mm Studio"

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

type HardwareEntity = {
    brand: string;
    model: string;
    category: string;
    subcategory?: string | null;
    specs?: HardwareSpecs;
};

type DependencyInventoryEntry = {
    id: string;
    equipmentId: string | null;
    assignedCam: string;
    name: string;
    model?: string | null;
};

type DependencyCatalogItem = {
    id: string;
    name: string;
    specs_json?: string | null;
};

export interface CompatibilityWarning {
    type: 'MEDIA' | 'POWER' | 'MOUNT' | 'SENSOR' | 'WEIGHT' | 'GENERAL' | 'DEPENDENCY' | 'TRIPOD' | 'ROD';
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
    if (primary.category === 'CAM' && (peripheral.category === 'SUP' || peripheral.category === 'BAT' || peripheral.category === 'POW')) {
        const powerWarnings = evaluatePowerCompatibility(primary, peripheral);
        warnings.push(...powerWarnings);
    }

    // --- 3. TRIPOD VALIDATION (Head <-> Legs) ---
    if (primary.category === 'SUP' && peripheral.category === 'SUP') {
        const tripodWarnings = evaluateTripodCompatibility(primary, peripheral);
        warnings.push(...tripodWarnings);
    }

    // --- 4. ROD STANDARD VALIDATION ---
    // Either Camera (Baseplate) vs Lens Support OR two support items
    if ((primary.category === 'CAM' || primary.category === 'SUP') && (peripheral.category === 'SUP' || peripheral.category === 'LNS')) {
        const rodWarnings = evaluateRodCompatibility(primary, peripheral);
        warnings.push(...rodWarnings);
    }

    // --- 5. INDUSTRY SPECIFIC RULES (High-Fidelity overrides) ---
    if (primary.brand.toLowerCase() === 'sony' && primary.model.includes('Venice 2') && peripheral.specs?.media_type === 'SD') {
        warnings.push({
            type: 'MEDIA',
            severity: 'ERROR',
            message: "🚨 Hata: Venice 2 ana kayıt için SD kart kullanamaz! Lütfen AXS kart seçin."
        });
    }

    // --- 6. ACCESSORY COMPATIBILITY (New) ---
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

    // --- 7. VENICE RIALTO VERSION CHECK ---
    if (primary.model.includes('Venice 2') && peripheral.model.includes('Rialto') && !peripheral.model.includes('Rialto 2')) {
        warnings.push({
            type: 'GENERAL',
            severity: 'ERROR',
            message: "🚨 RIALTO ERROR: Venice 2 requires Rialto 2 for 8K/High-speed support. Rialto 1 is not compatible.",
            solution: "💡 Çözüm: Lütfen Rialto 1 yerine Rialto 2 extension system seçin."
        });
    }

    // --- 8. LENS SUPPORT ADVICE ---
    if (peripheral.category === 'LNS' && peripheral.specs?.weight_kg && peripheral.specs.weight_kg > 2 && primary.specs?.power?.mount_type === 'PL') {
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
 * Validates Power Compatibility (Voltage & Mount)
 */
function evaluatePowerCompatibility(
    camera: HardwareEntity,
    battery: HardwareEntity
): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];
    const camPower = camera.specs?.power;
    const batSpecs = battery.specs;

    if (!camPower || !batSpecs) return [];

    // --- Voltage Check ---
    if (camPower.min_voltage && batSpecs.voltage) {
        // Parse battery voltage (handles "14.4V", "12-17V", "14.4V / 28V")
        const batMaxVoltage = parseMaxVoltage(batSpecs.voltage);

        // Simple Logic: If battery max voltage is LESS than camera min voltage -> Error
        // Note: We avoid "Too High" warnings for now as many cameras handle range (11-34V)
        if (batMaxVoltage < camPower.min_voltage) {
            warnings.push({
                type: 'POWER',
                severity: 'ERROR',
                message: `🚨 Voltaj Yetersiz! ${camera.model} en az ${camPower.min_voltage}V ister, ama ${battery.model} sadece ~${batMaxVoltage}V verir.`,
                solution: "💡 Çözüm: 24V/26V çıkışlı bir batarya veya blok batarya kullanın."
            });
        }
    }

    // --- Mount Check ---
    // If battery has a mount type (e.g. Gold Mount) and camera requires one
    if (batSpecs.mount_type && camPower.mount_type) {
        const camMnt = normalizeMount(camPower.mount_type);
        const batMnt = normalizeMount(batSpecs.mount_type);

        // Allow Gold Mount Plus on Gold Mount? Usually not, keys mismatch.
        // Allow B-Mount on V-Mount? No.
        if (camMnt !== batMnt) {
            warnings.push({
                type: 'POWER',
                severity: 'ERROR',
                message: `⚠️ Mount Uyumsuzluğu! Kamera: ${camPower.mount_type} | Batarya: ${batSpecs.mount_type}.`,
                solution: `💡 Çözüm: ${camPower.mount_type} uyumlu batarya veya adaptör plakası kullanın.`
            });
        }
    }

    return warnings;
}

/**
 * Validates Tripod Head <-> Legs Compatibility
 */
function evaluateTripodCompatibility(
    primary: HardwareEntity, // Could be Head or Legs
    peripheral: HardwareEntity // Could be Legs or Head
): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];

    // Identify Head and Legs
    let head = null;
    let legs = null;

    const isHead = (item: HardwareEntity) => item.subcategory?.includes('Head');
    const isLegs = (item: HardwareEntity) => item.subcategory?.includes('Tripod') || item.subcategory?.includes('Legs');

    if (isHead(primary) && isLegs(peripheral)) { head = primary; legs = peripheral; }
    else if (isLegs(primary) && isHead(peripheral)) { legs = primary; head = peripheral; }

    if (!head || !legs) return []; // Not a Head-Legs pair

    const headBase = normalizeTripodMount(head.specs?.base || head.specs?.mount);
    const legsMount = normalizeTripodMount(legs.specs?.mount || legs.specs?.head_mount);

    if (headBase && legsMount && headBase !== legsMount) {
        // Exception: 150mm Head fits on Mitchell Legs with adapter? 
        // We warn unless adapter is present. Since we don't know if adapter is present here, we warn.
        // But user might ADD adapter later. 
        // Smart solution: Suggest the exact adapter.

        let solution = "💡 Çözüm: Doğru ayak veya kafa seçin.";

        if (headBase === 'MOY' && legsMount === '150MM')
            solution = "💡 Çözüm: 'Moy to 150mm Bowl Adapter' ekleyin.";
        if (headBase === '150MM' && legsMount === 'MOY')
            solution = "💡 Çözüm: '150mm Ball to Mitchell Adapter' ekleyin.";
        if (headBase === 'MOY' && legsMount === '100MM')
            solution = "💡 Çözüm: 'Moy to 100mm Bowl Adapter' ekleyin.";

        warnings.push({
            type: 'TRIPOD',
            severity: 'ERROR',
            message: `🚨 Tripod Uyumsuzluğu! Kafa: ${head.specs?.base} | Ayak: ${legs.specs?.mount || legs.specs?.head_mount}`,
            solution
        });
    }

    return warnings;
}

/**
 * Validates Rod Support Standards (15mm LWS vs 19mm Studio)
 */
function evaluateRodCompatibility(
    primary: HardwareEntity,
    peripheral: HardwareEntity
): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];

    // Check if both define a rod standard
    const primStd = normalizeRodStandard(primary.specs?.rod_standard);
    const periphStd = normalizeRodStandard(peripheral.specs?.rod_standard);

    if (primStd && periphStd && primStd !== periphStd) {
        warnings.push({
            type: 'ROD',
            severity: 'ERROR',
            message: `⚠️ Rod Uyumsuzluğu! Ana Parça: ${primary.specs?.rod_standard} | Aksesuar: ${peripheral.specs?.rod_standard}`,
            solution: `💡 Çözüm: ${primStd} uyumlu bir aksesuar veya bridge-plate seçin.`
        });
    }

    return warnings;
}

// --- HELPERS ---

function parseMaxVoltage(v: string | number): number {
    if (typeof v === 'number') return v;
    if (!v) return 0;

    // "14.4V / 28V" -> return 28
    // "12-17V" -> return 17

    const numbers = v.match(/(\d+(\.\d+)?)/g)?.map(parseFloat) || [];
    if (numbers.length === 0) return 0;
    return Math.max(...numbers);
}

function normalizeMount(m: string): string {
    if (!m) return '';
    const u = m.toUpperCase();
    if (u.includes('GOLD') || u.includes('ANTON')) return 'GOLD';
    if (u.includes('V-MOUNT') || u.includes('V-LOCK')) return 'V-MOUNT';
    if (u.includes('B-MOUNT')) return 'B-MOUNT';
    return u;
}

function normalizeTripodMount(m: string | undefined): string {
    if (!m) return '';
    const u = m.toUpperCase();
    if (u.includes('MITCHELL') || u.includes('MOY') || u.includes('FLAT')) return 'MOY';
    if (u.includes('150')) return '150MM';
    if (u.includes('100')) return '100MM';
    if (u.includes('75')) return '75MM';
    return u;
}

function normalizeRodStandard(m: string | undefined): string {
    if (!m) return '';
    const u = m.toUpperCase();
    if (u.includes('19') || u.includes('STUDIO')) return '19MM';
    if (u.includes('15') && (u.includes('LWS') || u.includes('LIGHT'))) return '15MM LWS';
    if (u.includes('15') && u.includes('STUDIO')) return '15MM STUDIO';
    return u;
}


/**
 * Validates that all required dependencies for selected items are present in the project.
 */
export function validateDependencies(
    inventory: DependencyInventoryEntry[], // List of selected items in the project
    catalog: DependencyCatalogItem[]    // Full catalog to lookup item names if needed
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
