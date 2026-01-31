export type ValidationResult = {
    valid: boolean;
    message?: string;
    severity: "info" | "warning" | "error";
};

// Types representing the minimal data needed for validation
export interface CameraSpecs {
    mount: string;
    sensorDiagonal?: number; // Calculated diagonal or direct value
}

export interface LensSpecs {
    mount: string;
    imageCircle?: number;
}

export function validateCompatibility(camera: CameraSpecs, lens: LensSpecs, hasAdapter: boolean = false): ValidationResult {
    const results: ValidationResult[] = [];

    // 1. Mount Check
    // If mounts differ and no adapter is declared, it's a critical warning
    if (camera.mount.toLowerCase() !== lens.mount.toLowerCase() && !hasAdapter) {
        return {
            valid: false,
            severity: "warning",
            message: `Critcal: Mount Mismatch. Camera is ${camera.mount}, Lens is ${lens.mount}. Adapter required.`
        };
    }

    // 2. Sensor Coverage Check
    // if (lens.circle < sensor.diagonal)
    if (camera.sensorDiagonal && lens.imageCircle) {
        if (lens.imageCircle < camera.sensorDiagonal) {
            return {
                valid: false, // Technically valid to mount, but image/vignetting issue
                severity: "warning",
                message: `Warning: Sensor Coverage Issue. Lens circle (${lens.imageCircle}mm) < Sensor diagonal (${camera.sensorDiagonal}mm).`
            };
        }
    }

    return { valid: true, severity: "info", message: "Compatible" };
}
