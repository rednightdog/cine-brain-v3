/**
 * Camera-specific accessories database
 * These are optional add-ons that can be attached to specific camera models
 */

export interface CameraAccessory {
    id: string;
    name: string;
    brand: string;
    model: string;
    category: 'Support';
    subcategory: 'Camera Accessory' | 'Media' | 'Batteries';
    description: string;
    compatible_cameras: string[]; // Camera IDs this accessory works with
    weight_kg?: number;
    specs?: Record<string, any>;
}

export const cameraAccessories: CameraAccessory[] = [
    // Sony Rialto Systems
    {
        id: 'acc-rialto-venice',
        name: 'Sony Rialto Extension',
        brand: 'Sony',
        model: 'CBK-3610XS',
        category: 'Support',
        subcategory: 'Camera Accessory',
        description: 'Extension system for Venice. Separates sensor block from camera body.',
        compatible_cameras: ['cam-sony-venice-1', 'cam-sony-venice-2-8k', 'cam-sony-venice-2-6k'],
        weight_kg: 0.8,
        specs: { type: 'Extension System' }
    },
    {
        id: 'acc-rialto-cable-2m',
        name: 'Rialto Cable 2m',
        brand: 'Sony',
        model: 'Extension Cable',
        category: 'Support',
        subcategory: 'Camera Accessory',
        description: '2 meter extension cable for Rialto system.',
        compatible_cameras: ['cam-sony-venice-1', 'cam-sony-venice-2-8k', 'cam-sony-venice-2-6k'],
        specs: { length_m: 2 }
    },
    {
        id: 'acc-rialto-cable-5m',
        name: 'Rialto Cable 5m',
        brand: 'Sony',
        model: 'Extension Cable',
        category: 'Support',
        subcategory: 'Camera Accessory',
        description: '5 meter extension cable for Rialto system.',
        compatible_cameras: ['cam-sony-venice-1', 'cam-sony-venice-2-8k', 'cam-sony-venice-2-6k'],
        specs: { length_m: 5 }
    },

    // ARRI Recording Media
    {
        id: 'acc-codex-drive-1tb',
        name: 'Codex Drive 1TB',
        brand: 'Codex',
        model: 'Compact Drive',
        category: 'Support',
        subcategory: 'Media',
        description: 'Recording media for ARRI cameras.',
        compatible_cameras: ['cam-arri-35', 'cam-arri-35-xtreme', 'cam-arri-mini-lf', 'cam-arri-lf'],
        weight_kg: 0.3,
        specs: { capacity_tb: 1 }
    },
    {
        id: 'acc-codex-drive-2tb',
        name: 'Codex Drive 2TB',
        brand: 'Codex',
        model: 'Compact Drive',
        category: 'Support',
        subcategory: 'Media',
        description: 'Recording media for ARRI cameras.',
        compatible_cameras: ['cam-arri-35', 'cam-arri-35-xtreme', 'cam-arri-mini-lf', 'cam-arri-lf'],
        weight_kg: 0.3,
        specs: { capacity_tb: 2 }
    },

    // RED Recording Media
    {
        id: 'acc-red-cfexpress-1tb',
        name: 'RED CFexpress 1TB',
        brand: 'RED',
        model: 'PRO CFexpress',
        category: 'Support',
        subcategory: 'Media',
        description: 'High-speed recording media for RED cameras.',
        compatible_cameras: ['cam-red-raptor-x', 'cam-red-vraptor-8k', 'cam-red-komodo-x', 'cam-red-komodo'],
        weight_kg: 0.1,
        specs: { capacity_tb: 1, speed_gbps: 1.7 }
    },
    {
        id: 'acc-red-cfexpress-512gb',
        name: 'RED CFexpress 512GB',
        brand: 'RED',
        model: 'PRO CFexpress',
        category: 'Support',
        subcategory: 'Media',
        description: 'High-speed recording media for RED cameras.',
        compatible_cameras: ['cam-red-raptor-x', 'cam-red-vraptor-8k', 'cam-red-komodo-x', 'cam-red-komodo'],
        weight_kg: 0.1,
        specs: { capacity_gb: 512, speed_gbps: 1.7 }
    },

    // Sony Recording Media
    {
        id: 'acc-sony-axs-1tb',
        name: 'Sony AXS-A1TS66 1TB',
        brand: 'Sony',
        model: 'AXS Memory',
        category: 'Support',
        subcategory: 'Media',
        description: 'High-speed AXS memory card for Venice 2.',
        compatible_cameras: ['cam-sony-venice-2-8k', 'cam-sony-venice-2-6k'],
        weight_kg: 0.2,
        specs: { capacity_tb: 1, speed_gbps: 6.6 }
    },

    // Universal Batteries
    {
        id: 'acc-vmount-150wh',
        name: 'V-Mount 150Wh',
        brand: 'Anton Bauer',
        model: 'Titon 150',
        category: 'Support',
        subcategory: 'Batteries',
        description: 'High capacity V-mount battery.',
        compatible_cameras: ['*'], // Universal - works with all cameras
        weight_kg: 0.9,
        specs: { capacity_wh: 150, voltage: '14.4V' }
    },
    {
        id: 'acc-vmount-90wh',
        name: 'V-Mount 90Wh',
        brand: 'Anton Bauer',
        model: 'Titon 90',
        category: 'Support',
        subcategory: 'Batteries',
        description: 'Compact V-mount battery.',
        compatible_cameras: ['*'], // Universal
        weight_kg: 0.6,
        specs: { capacity_wh: 90, voltage: '14.4V' }
    }
];

/**
 * Get accessories compatible with a specific camera
 */
export function getCompatibleAccessories(cameraId: string): CameraAccessory[] {
    return cameraAccessories.filter(acc =>
        acc.compatible_cameras.includes('*') || acc.compatible_cameras.includes(cameraId)
    );
}

/**
 * Check if an accessory is compatible with a camera
 */
export function isAccessoryCompatible(accessoryId: string, cameraId: string): boolean {
    const accessory = cameraAccessories.find(acc => acc.id === accessoryId);
    if (!accessory) return false;
    return accessory.compatible_cameras.includes('*') || accessory.compatible_cameras.includes(cameraId);
}
