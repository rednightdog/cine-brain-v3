import { InventoryItem } from "@/components/CineBrainInterface";

export interface ClassificationResult {
    category: 'CAM' | 'LNS' | 'SUP';
    subcategory: string;
    subSubcategory?: string;
    coverage?: string; // For lenses: S35, FF, LF
    technicalSpecs: {
        mount?: string;
        sensor_size?: string;
        lens_type?: 'Anamorphic' | 'Spherical';
        front_diameter_mm?: number;
        weight_kg?: number;
    };
    confidence: number;
}

/**
 * AI Classification Engine
 * Automatically categorizes equipment into proper hierarchy
 */
export async function classifyEquipment(
    name: string,
    description?: string
): Promise<ClassificationResult | null> {
    const nameLower = name.toLowerCase();
    const descLower = (description || '').toLowerCase();
    const combined = `${nameLower} ${descLower}`;

    // ===== CAMERA CLASSIFICATION =====
    if (isCamera(combined)) {
        const sensorSize = detectCameraSensorSize(combined);
        const mount = detectMount(combined);

        return {
            category: 'CAM',
            subcategory: sensorSize, // S35, FF, LF
            technicalSpecs: {
                sensor_size: sensorSize,
                mount: mount
            },
            confidence: 0.95
        };
    }

    // ===== LENS CLASSIFICATION =====
    if (isLens(combined)) {
        const lensType = detectLensType(combined); // Anamorphic or Spherical
        const coverage = detectLensCoverage(combined); // S35, FF, LF
        const mount = detectMount(combined);
        const frontDiameter = extractFrontDiameter(name);

        return {
            category: 'LNS',
            subcategory: lensType,
            coverage: coverage,
            technicalSpecs: {
                lens_type: lensType as 'Anamorphic' | 'Spherical',
                mount: mount,
                front_diameter_mm: frontDiameter
            },
            confidence: 0.92
        };
    }

    // ===== SUPPORT CLASSIFICATION =====
    if (isSupport(combined)) {
        const supportType = classifySupportType(combined);

        return {
            category: 'SUP',
            subcategory: supportType,
            technicalSpecs: {},
            confidence: 0.88
        };
    }

    return null;
}

// ===== DETECTION HELPERS =====

function isCamera(text: string): boolean {
    const cameraKeywords = [
        'camera', 'cam', 'alexa', 'venice', 'red', 'arri', 'sony',
        'fx6', 'fx9', 'c300', 'c500', 'komodo', 'raptor', 'monstro',
        'body', 'kamera'
    ];
    return cameraKeywords.some(kw => text.includes(kw));
}

function isLens(text: string): boolean {
    const lensKeywords = [
        'lens', 'prime', 'zoom', 'mm', 'anamorphic', 'spherical',
        'master', 'signature', 'supreme', 'cooke', 'zeiss', 'angenieux',
        'objektif', 'optik'
    ];
    return lensKeywords.some(kw => text.includes(kw)) && !text.includes('filter');
}

function isSupport(text: string): boolean {
    const supportKeywords = [
        'tripod', 'head', 'monitor', 'follow focus', 'matte box',
        'filter', 'transmitter', 'wireless', 'teradek', 'smallhd',
        'oconnor', 'sachtler', 'easyrig', 'destek', 'aksesuar'
    ];
    return supportKeywords.some(kw => text.includes(kw));
}

// ===== CAMERA SENSOR SIZE DETECTION =====

function detectCameraSensorSize(text: string): string {
    // Large Format
    if (text.includes('lf') || text.includes('large format') ||
        text.includes('venice') || text.includes('alexa lf')) {
        return 'LF';
    }

    // Full Frame
    if (text.includes('ff') || text.includes('full frame') ||
        text.includes('fx6') || text.includes('fx9') ||
        text.includes('a7s') || text.includes('r5')) {
        return 'FF';
    }

    // Super 35
    if (text.includes('s35') || text.includes('super 35') ||
        text.includes('alexa 35') || text.includes('alexa mini') ||
        text.includes('c300') || text.includes('c500')) {
        return 'S35';
    }

    // Default to S35 for most cinema cameras
    return 'S35';
}

// ===== LENS TYPE DETECTION =====

function detectLensType(text: string): string {
    if (text.includes('anamorphic') || text.includes('anamorfik') ||
        text.includes('hawk') || text.includes('atlas orion')) {
        return 'Anamorphic';
    }

    return 'Spherical';
}

// ===== LENS COVERAGE DETECTION =====

function detectLensCoverage(text: string): string {
    // Large Format coverage
    if (text.includes('lf') || text.includes('large format') ||
        text.includes('signature') || text.includes('supreme')) {
        return 'LF';
    }

    // Full Frame coverage
    if (text.includes('ff') || text.includes('full frame') ||
        text.includes('vista')) {
        return 'FF';
    }

    // Super 35 coverage
    if (text.includes('s35') || text.includes('super 35') ||
        text.includes('master prime') || text.includes('ultra prime')) {
        return 'S35';
    }

    // Default based on common lens series
    if (text.includes('cooke') || text.includes('zeiss')) {
        return 'FF'; // Most modern Cooke/Zeiss are FF+
    }

    return 'S35'; // Conservative default
}

// ===== MOUNT DETECTION =====

function detectMount(text: string): string | undefined {
    if (text.includes('lpl')) return 'LPL';
    if (text.includes('pl') && !text.includes('lpl')) return 'PL';
    if (text.includes('ef')) return 'EF';
    if (text.includes('e-mount') || text.includes('e mount')) return 'E-Mount';
    if (text.includes('rf')) return 'RF';
    if (text.includes('l-mount')) return 'L-Mount';

    return undefined;
}

// ===== SUPPORT TYPE CLASSIFICATION =====

function classifySupportType(text: string): string {
    if (text.includes('filter') && !text.includes('matte')) return 'Filters';
    if (text.includes('matte box') || text.includes('mattebox')) return 'Matte Box';
    if (text.includes('follow focus') || text.includes('focus motor')) return 'Follow Focus';
    if (text.includes('wireless') || text.includes('wcu') || text.includes('teradek')) return 'Wireless Control';
    if (text.includes('monitor') || text.includes('smallhd') || text.includes('flanders')) return 'Monitors';
    if (text.includes('transmitter') || text.includes('bolt') || text.includes('video tx')) return 'Transmitters';
    if (text.includes('tripod') || text.includes('head') || text.includes('oconnor') ||
        text.includes('sachtler') || text.includes('easyrig')) return 'Accessories';

    return 'Accessories'; // Default
}

// ===== TECHNICAL SPEC EXTRACTION =====

function extractFrontDiameter(name: string): number | undefined {
    // Look for patterns like "114mm" or "Ø114"
    const match = name.match(/(?:Ø|ø)?(\d{2,3})\s*mm/i);
    if (match) {
        return parseInt(match[1]);
    }

    // Common lens series front diameters
    if (name.toLowerCase().includes('master prime')) return 110;
    if (name.toLowerCase().includes('signature')) return 114;
    if (name.toLowerCase().includes('supreme')) return 95;

    return undefined;
}

/**
 * Normalize equipment name for deduplication
 */
export function normalizeName(name: string): string {
    return name.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/\s+/g, '');
}
