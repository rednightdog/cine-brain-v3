export type EquipmentCategory =
    | 'Camera'
    | 'Lens'
    | 'Support'
    | 'Lighting'
    | 'Audio'
    | 'Power'
    | 'Media'
    | 'Monitor'
    | 'Grip'
    | 'Accessory'
    | 'Filter';

export type LensMount = 'PL' | 'EF' | 'E-Mount' | 'LPL' | 'RF' | 'X-Mount' | 'MFT' | 'N/A' | 'Bowens' | 'V-Mount' | 'Gold Mount';

export interface TechnicalDataSection {
    title: string;
    items: { label: string; value: string }[];
    image_url?: string; // Optional diagram/photo for this section
}

export interface RecordingFormat {
    resolution: string; // e.g. "4.6K Open Gate"
    codec: string;      // e.g. "ARRIRAW", "ProRes 4444"
    max_fps: string;    // e.g. "75 fps"
    data_rate?: string; // e.g. "2.4 Gbps"
}

export interface EquipmentItem {
    id: string;
    name: string;
    brand: string;
    model: string;
    category: EquipmentCategory;
    subcategory?: string; // e.g. "Cinema Prime", "Zoom", "Mirrorless"
    description: string;
    specs: {
        mount?: string; // Relaxed to string to allow more types if needed
        weight_kg?: number;
        power_draw_w?: number;
        resolution?: string; // For cameras
        sensor_size?: string; // For cameras
        sensor_type?: string; // For cameras
        focal_length?: string; // For lenses
        aperture?: string; // For lenses
        image_circle_mm?: number; // For lenses

        // New Lens Data
        close_focus_m?: number;
        front_diameter_mm?: number;
        length_mm?: number;
        squeeze?: string;
        sensor_coverage?: 'S35' | 'FF' | 'LF'; // New Field

        // Detailed Recording Formats
        recording_formats?: RecordingFormat[];

        // Expansion Fields
        payload_kg?: number; // For supports
        length?: string; // For sliders/tubes
        nit?: number; // For monitors
        size?: string; // For monitors (screensize)
        type?: string; // For mics
        channels?: number; // For audio recorders
    };

    // New Deep Technical Data (Datasheet Style)
    technical_data?: TechnicalDataSection[];

    // CineD Lab Bench Data
    lab_metrics?: {
        dynamic_range_stops?: {
            snr_2: number; // Signal-to-Noise Ratio 2 (High Quality)
            snr_1: number; // Signal-to-Noise Ratio 1 (Low Quality)
        };
        rolling_shutter_ms?: number; // Sensor readout speed
        base_iso?: number | string;
        latitude_stops?: number; // Total usable latitude
        source_url?: string; // Link to CineD article
    };

    image_url?: string;
    daily_rate_est: number;

    // Optional timestamps if coming from DB
    createdAt?: Date;
    updatedAt?: Date;
}

export interface KitItem {
    item: EquipmentItem;
    quantity: number;
    notes?: string;
}

export interface Kit {
    id: string;
    name: string;
    description?: string;
    items: KitItem[];
    created_at: Date;
    updated_at: Date;
}
