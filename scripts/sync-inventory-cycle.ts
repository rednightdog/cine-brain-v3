import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

type CliOptions = {
    filePath: string;
    onlyCamLens: boolean;
    dryRunOnly: boolean;
    skipQuality: boolean;
    status: "PENDING" | "APPROVED" | null;
};

type ImportReport = {
    totals?: {
        csvRows?: number;
        importedRows?: number;
        invalidRows?: number;
        filteredRows?: number;
        upsertedRows?: number;
    };
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
    let filePath = "./imports/my-inventory.csv";
    let onlyCamLens = false;
    let dryRunOnly = false;
    let skipQuality = false;
    let status: "PENDING" | "APPROVED" | null = null;

    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (arg === "--only-cam-lens") {
            onlyCamLens = true;
            continue;
        }
        if (arg === "--dry-run-only") {
            dryRunOnly = true;
            continue;
        }
        if (arg === "--skip-quality") {
            skipQuality = true;
            continue;
        }
        if (arg.startsWith("--file=")) {
            filePath = arg.slice("--file=".length).trim() || filePath;
            continue;
        }
        if (arg === "--file") {
            filePath = (args[i + 1] || "").trim() || filePath;
            i += 1;
            continue;
        }
        if (arg.startsWith("--status=")) {
            const raw = arg.slice("--status=".length).trim().toUpperCase();
            if (raw === "PENDING" || raw === "APPROVED") {
                status = raw;
            }
            continue;
        }
        if (arg === "--status") {
            const raw = (args[i + 1] || "").trim().toUpperCase();
            if (raw === "PENDING" || raw === "APPROVED") {
                status = raw;
            }
            i += 1;
            continue;
        }
    }

    return {
        filePath: resolve(process.cwd(), filePath),
        onlyCamLens,
        dryRunOnly,
        skipQuality,
        status,
    };
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

function nowStamp(): string {
    const d = new Date();
    const pad = (v: number) => String(v).padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function readImportReport(reportPath: string): ImportReport {
    if (!existsSync(reportPath)) return {};
    try {
        return JSON.parse(readFileSync(reportPath, "utf8")) as ImportReport;
    } catch {
        return {};
    }
}

async function run() {
    const options = parseCliOptions();

    if (!existsSync(options.filePath)) {
        throw new Error(`Input CSV bulunamadi: ${options.filePath}`);
    }

    const backupsDir = resolve(process.cwd(), "./imports/backups");
    mkdirSync(backupsDir, { recursive: true });
    const backupPath = join(backupsDir, `${basename(options.filePath, ".csv")}.backup-${nowStamp()}.csv`);

    const exportArgs = ["tsx", "scripts/export-inventory-csv.ts", "--file", backupPath, "--editable"];
    if (options.onlyCamLens) {
        exportArgs.push("--only-cam-lens");
    }
    if (!options.onlyCamLens) {
        exportArgs.push("--include-pending", "--include-private");
    }

    console.log("Step 1/4: DB snapshot backup exporting...");
    runCommand("npx", exportArgs);

    const dryRunArgs = ["run", "db:import:csv", "--", "--file", options.filePath, "--dry-run"];
    if (options.onlyCamLens) dryRunArgs.push("--only-cam-lens");
    if (options.status) dryRunArgs.push("--status", options.status);

    console.log("Step 2/4: Dry-run validation...");
    runCommand("npm", dryRunArgs);

    const reportPath = resolve(process.cwd(), "./reports/inventory-import-report.json");
    const report = readImportReport(reportPath);
    const errors = report.issues?.errors || 0;
    const warnings = report.issues?.warnings || 0;
    const inserts = report.preview?.inserts || 0;
    const updates = report.preview?.updates || 0;
    const unchanged = report.preview?.unchanged || 0;
    if (errors > 0) {
        throw new Error(`Dry-run errors bulundu (${errors}). Import durduruldu. Rapor: ${reportPath}`);
    }

    console.log(`Dry-run preview: ${inserts} inserts, ${updates} updates, ${unchanged} unchanged`);

    if (options.dryRunOnly) {
        console.log("Dry-run-only mode complete.");
        console.log(`Warnings: ${warnings}`);
        return;
    }

    const importArgs = ["run", "db:import:csv", "--", "--file", options.filePath];
    if (options.onlyCamLens) importArgs.push("--only-cam-lens");
    if (options.status) importArgs.push("--status", options.status);

    console.log("Step 3/4: Real import (upsert)...");
    runCommand("npm", importArgs);

    if (!options.skipQuality) {
        console.log("Step 4/4: Quality pipeline...");
        runCommand("npm", ["run", "db:pipeline:quality"]);
    } else {
        console.log("Step 4/4: Quality pipeline skipped (--skip-quality).");
    }

    console.log("Inventory sync cycle complete.");
    console.log(`Input CSV: ${options.filePath}`);
    console.log(`Backup CSV: ${backupPath}`);
    console.log(`Dry-run warnings: ${warnings}`);
}

run().catch((error) => {
    console.error("Sync cycle failed:", error);
    process.exit(1);
});
