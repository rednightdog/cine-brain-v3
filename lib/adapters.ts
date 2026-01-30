/**
 * Adapter Database
 * Common lens mount adapters for cinema cameras
 */

export interface Adapter {
    id: string;
    name: string;
    brand: string;
    from_mount: string; // Lens mount
    to_mount: string;   // Camera mount
    maintains_infinity: boolean;
    notes?: string;
    daily_rate_est?: number;
    category: 'Support';
    subcategory: 'Adapter';
}

export const adapters: Adapter[] = [
    // ARRI Adapters
    {
        id: 'adp-arri-pl-to-lpl',
        name: 'ARRI PL-to-LPL Adapter',
        brand: 'ARRI',
        from_mount: 'PL',
        to_mount: 'LPL',
        maintains_infinity: true,
        notes: 'Official ARRI adapter. Allows PL lenses on LPL cameras (Alexa 35, Mini LF).',
        daily_rate_est: 50,
        category: 'Support',
        subcategory: 'Adapter'
    },

    // Sony E-Mount Adapters
    {
        id: 'adp-sony-pl-emount',
        name: 'Sony PL Adapter (LA-EA5)',
        brand: 'Sony',
        from_mount: 'PL',
        to_mount: 'E-Mount',
        maintains_infinity: true,
        notes: 'Official Sony PL adapter for E-mount cameras (Venice, FX series).',
        daily_rate_est: 150,
        category: 'Support',
        subcategory: 'Adapter'
    },
    {
        id: 'adp-metabones-ef-emount',
        name: 'Metabones EF to E-Mount (Mark V)',
        brand: 'Metabones',
        from_mount: 'EF',
        to_mount: 'E-Mount',
        maintains_infinity: true,
        notes: 'Electronic adapter with autofocus support. Popular for Canon lenses on Sony.',
        daily_rate_est: 40,
        category: 'Support',
        subcategory: 'Adapter'
    },
    {
        id: 'adp-sigma-mc11',
        name: 'Sigma MC-11 (EF to E-Mount)',
        brand: 'Sigma',
        from_mount: 'EF',
        to_mount: 'E-Mount',
        maintains_infinity: true,
        notes: 'Electronic adapter optimized for Sigma lenses.',
        daily_rate_est: 25,
        category: 'Support',
        subcategory: 'Adapter'
    },

    // Canon RF Adapters
    {
        id: 'adp-canon-pl-rf',
        name: 'Canon PL Mount Adapter',
        brand: 'Canon',
        from_mount: 'PL',
        to_mount: 'RF',
        maintains_infinity: true,
        notes: 'Official Canon adapter for PL lenses on RF mount (C70, C300 Mark III).',
        daily_rate_est: 80,
        category: 'Support',
        subcategory: 'Adapter'
    },
    {
        id: 'adp-canon-ef-rf',
        name: 'Canon EF to RF Adapter',
        brand: 'Canon',
        from_mount: 'EF',
        to_mount: 'RF',
        maintains_infinity: true,
        notes: 'Official Canon adapter with full electronic control.',
        daily_rate_est: 30,
        category: 'Support',
        subcategory: 'Adapter'
    },

    // RED Adapters
    {
        id: 'adp-red-pl-rf',
        name: 'RED PL Mount (for RF cameras)',
        brand: 'RED',
        from_mount: 'PL',
        to_mount: 'RF',
        maintains_infinity: true,
        notes: 'Allows PL lenses on RED RF-mount cameras (Komodo, V-Raptor).',
        daily_rate_est: 100,
        category: 'Support',
        subcategory: 'Adapter'
    },
    {
        id: 'adp-red-lpl-rf',
        name: 'RED LPL Mount (for RF cameras)',
        brand: 'RED',
        from_mount: 'LPL',
        to_mount: 'RF',
        maintains_infinity: true,
        notes: 'Allows LPL lenses on RED RF-mount cameras.',
        daily_rate_est: 120,
        category: 'Support',
        subcategory: 'Adapter'
    },

    // Universal Adapters
    {
        id: 'adp-novoflex-pl-ef',
        name: 'Novoflex PL to EF Adapter',
        brand: 'Novoflex',
        from_mount: 'PL',
        to_mount: 'EF',
        maintains_infinity: true,
        notes: 'Mechanical adapter for PL lenses on EF mount cameras.',
        daily_rate_est: 60,
        category: 'Support',
        subcategory: 'Adapter'
    },
    {
        id: 'adp-fotodiox-pl-ef',
        name: 'Fotodiox Pro PL to EF',
        brand: 'Fotodiox',
        from_mount: 'PL',
        to_mount: 'EF',
        maintains_infinity: true,
        notes: 'Budget-friendly mechanical adapter.',
        daily_rate_est: 35,
        category: 'Support',
        subcategory: 'Adapter'
    },

    // Anamorphic Adapters
    {
        id: 'adp-slr-magic-anamorphot',
        name: 'SLR Magic Anamorphot 1.33x',
        brand: 'SLR Magic',
        from_mount: 'Universal (Front Mount)',
        to_mount: 'Universal',
        maintains_infinity: true,
        notes: 'Front-mount anamorphic adapter. Creates 2.39:1 aspect ratio.',
        daily_rate_est: 75,
        category: 'Support',
        subcategory: 'Adapter'
    }
];

/**
 * Find compatible adapters for a given mount mismatch
 */
export function findCompatibleAdapters(lensMount: string, cameraMount: string): Adapter[] {
    const lensUpper = lensMount.toUpperCase();
    const camUpper = cameraMount.toUpperCase();

    return adapters.filter(adapter => {
        const fromUpper = adapter.from_mount.toUpperCase();
        const toUpper = adapter.to_mount.toUpperCase();

        return fromUpper === lensUpper && toUpper === camUpper;
    });
}

/**
 * Check if an adapter exists for a mount combination
 */
export function hasAdapter(lensMount: string, cameraMount: string): boolean {
    return findCompatibleAdapters(lensMount, cameraMount).length > 0;
}
