import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

type CliOptions = {
    filePath: string | null;
    dryRunOnly: boolean;
    skipQuality: boolean;
    onlyCamLens: boolean;
    status: "PENDING" | "APPROVED" | null;
};

type ImportReport = {
    issues?: {
        errors?: number;
        warnings?: number;
    };
    preview?: {
        inserts?: number;
        updates?: number;
        unchanged?: number;
    };
};

function parseCliOptions(): CliOptions {
    const args = process.argv.slice(2);
    const options: CliOptions = {
        filePath: null,
        dryRunOnly: false,
        skipQuality: false,
        onlyCamLens: false,
        status: null,
    };

    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (arg === "--dry-run-only") {
            options.dryRunOnly = true;
            continue;
        }
        if (arg === "--skip-quality") {
            options.skipQuality = true;
            continue;
        }
        if (arg === "--only-cam-lens") {
            options.onlyCamLens = true;
            continue;
        }
        if (arg.startsWith("--file=")) {
            options.filePath = arg.slice("--file=".length).trim();
            continue;
        }
        if (arg === "--file") {
            options.filePath = (args[i + 1] || "").trim();
            i += 1;
            continue;
        }
        if (arg.startsWith("--status=")) {
            const raw = arg.slice("--status=".length).trim().toUpperCase();
            if (raw === "PENDING" || raw === "APPROVED") {
                options.status = raw;
            }
            continue;
        }
        if (arg === "--status") {
            const raw = (args[i + 1] || "").trim().toUpperCase();
            if (raw === "PENDING" || raw === "APPROVED") {
                options.status = raw;
            }
            i += 1;
            continue;
        }
    }

    return options;
}

function runCommand(cmd: string, args: string[]) {
    const result = spawnSync(cmd, args, {
        stdio: "inherit",
        shell: false,
    });
    if (result.status !== 0) {
        throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
    }
}

function readImportReport(reportPath: string): ImportReport {
    if (!existsSync(reportPath)) return {};
    try {
        return JSON.parse(readFileSync(reportPath, "utf8")) as ImportReport;
    } catch {
        return {};
    }
}

function findLatestBackup(backupsDir: string): string | null {
    if (!existsSync(backupsDir)) return null;

    const files = readdirSync(backupsDir)
        .filter((name) => extname(name).toLowerCase() === ".csv")
        .map((name) => ({
            name,
            path: join(backupsDir, name),
        }))
        .sort((a, b) => b.name.localeCompare(a.name));

    if (files.length === 0) return null;
    return files[0].path;
}

async function run() {
    const options = parseCliOptions();
    const backupsDir = resolve(process.cwd(), "./imports/backups");

    const selectedPath = options.filePath
        ? resolve(process.cwd(), options.filePath)
        : findLatestBackup(backupsDir);

    if (!selectedPath || !existsSync(selectedPath)) {
        throw new Error("Restore icin backup CSV bulunamadi. --file ile yol verebilirsin.");
    }

    console.log(`Selected backup: ${selectedPath}`);

    const dryRunArgs = ["run", "db:import:csv", "--", "--file", selectedPath, "--dry-run"];
    if (options.onlyCamLens) dryRunArgs.push("--only-cam-lens");
    if (options.status) dryRunArgs.push("--status", options.status);

    console.log("Step 1/3: Dry-run restore validation...");
    runCommand("npm", dryRunArgs);

    const reportPath = resolve(process.cwd(), "./reports/inventory-import-report.json");
    const report = readImportReport(reportPath);
    const errors = report.issues?.errors || 0;
    const warnings = report.issues?.warnings || 0;
    const inserts = report.preview?.inserts || 0;
    const updates = report.preview?.updates || 0;
    const unchanged = report.preview?.unchanged || 0;

    if (errors > 0) {
        throw new Error(`Dry-run errors bulundu (${errors}). Restore durduruldu. Rapor: ${reportPath}`);
    }

    console.log(`Dry-run preview: ${inserts} inserts, ${updates} updates, ${unchanged} unchanged`);

    if (options.dryRunOnly) {
        console.log("Dry-run-only restore complete.");
        console.log(`Warnings: ${warnings}`);
        return;
    }

    const importArgs = ["run", "db:import:csv", "--", "--file", selectedPath];
    if (options.onlyCamLens) importArgs.push("--only-cam-lens");
    if (options.status) importArgs.push("--status", options.status);

    console.log("Step 2/3: Real restore import...");
    runCommand("npm", importArgs);

    if (!options.skipQuality) {
        console.log("Step 3/3: Quality pipeline...");
        runCommand("npm", ["run", "db:pipeline:quality"]);
    } else {
        console.log("Step 3/3: Quality pipeline skipped (--skip-quality).");
    }

    console.log("Restore cycle complete.");
    console.log(`Backup file: ${selectedPath}`);
    console.log(`Warnings: ${warnings}`);
}

run().catch((error) => {
    console.error("Restore cycle failed:", error);
    process.exit(1);
});
