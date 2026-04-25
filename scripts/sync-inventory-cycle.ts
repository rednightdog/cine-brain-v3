import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

type CliOptions = {
    filePath: string;
    onlyCamLens: boolean;
    dryRunOnly: boolean;
    skipQuality: boolean;
    status: "PENDING" | "APPROVED" | null;
    maxTotalChanges: number | null;
    maxInserts: number | null;
    maxUpdates: number | null;
    maxChangeRatio: number | null;
    force: boolean;
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

type GuardSnapshot = {
    importedRows: number;
    inserts: number;
    updates: number;
};

function parseCliOptions(): CliOptions {
    const args = process.argv.slice(2);
    let filePath = "./imports/my-inventory.csv";
    let onlyCamLens = false;
    let dryRunOnly = false;
    let skipQuality = false;
    let status: "PENDING" | "APPROVED" | null = null;
    let maxTotalChanges: number | null = null;
    let maxInserts: number | null = null;
    let maxUpdates: number | null = null;
    let maxChangeRatio: number | null = null;
    let force = false;

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
        if (arg === "--force") {
            force = true;
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
        if (arg.startsWith("--max-total-changes=")) {
            const value = Number(arg.slice("--max-total-changes=".length).trim());
            if (Number.isFinite(value) && value >= 0) maxTotalChanges = Math.round(value);
            continue;
        }
        if (arg === "--max-total-changes") {
            const value = Number((args[i + 1] || "").trim());
            if (Number.isFinite(value) && value >= 0) maxTotalChanges = Math.round(value);
            i += 1;
            continue;
        }
        if (arg.startsWith("--max-inserts=")) {
            const value = Number(arg.slice("--max-inserts=".length).trim());
            if (Number.isFinite(value) && value >= 0) maxInserts = Math.round(value);
            continue;
        }
        if (arg === "--max-inserts") {
            const value = Number((args[i + 1] || "").trim());
            if (Number.isFinite(value) && value >= 0) maxInserts = Math.round(value);
            i += 1;
            continue;
        }
        if (arg.startsWith("--max-updates=")) {
            const value = Number(arg.slice("--max-updates=".length).trim());
            if (Number.isFinite(value) && value >= 0) maxUpdates = Math.round(value);
            continue;
        }
        if (arg === "--max-updates") {
            const value = Number((args[i + 1] || "").trim());
            if (Number.isFinite(value) && value >= 0) maxUpdates = Math.round(value);
            i += 1;
            continue;
        }
        if (arg.startsWith("--max-change-ratio=")) {
            const value = Number(arg.slice("--max-change-ratio=".length).trim());
            if (Number.isFinite(value) && value >= 0) maxChangeRatio = value;
            continue;
        }
        if (arg === "--max-change-ratio") {
            const value = Number((args[i + 1] || "").trim());
            if (Number.isFinite(value) && value >= 0) maxChangeRatio = value;
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
        maxTotalChanges,
        maxInserts,
        maxUpdates,
        maxChangeRatio,
        force,
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

function enforceGuards(snapshot: GuardSnapshot, options: CliOptions) {
    if (options.force) return;

    const totalChanges = snapshot.inserts + snapshot.updates;

    if (options.maxTotalChanges != null && totalChanges > options.maxTotalChanges) {
        throw new Error(
            `Guard blocked: total changes ${totalChanges} > max-total-changes ${options.maxTotalChanges}. ` +
                "CSV'yi kontrol et veya bilerek devam edeceksen --force kullan."
        );
    }
    if (options.maxInserts != null && snapshot.inserts > options.maxInserts) {
        throw new Error(
            `Guard blocked: inserts ${snapshot.inserts} > max-inserts ${options.maxInserts}. ` +
                "CSV'yi kontrol et veya bilerek devam edeceksen --force kullan."
        );
    }
    if (options.maxUpdates != null && snapshot.updates > options.maxUpdates) {
        throw new Error(
            `Guard blocked: updates ${snapshot.updates} > max-updates ${options.maxUpdates}. ` +
                "CSV'yi kontrol et veya bilerek devam edeceksen --force kullan."
        );
    }

    if (options.maxChangeRatio != null && snapshot.importedRows > 0) {
        const ratio = totalChanges / snapshot.importedRows;
        if (ratio > options.maxChangeRatio) {
            throw new Error(
                `Guard blocked: change ratio ${ratio.toFixed(4)} > max-change-ratio ${options.maxChangeRatio}. ` +
                    "CSV'yi kontrol et veya bilerek devam edeceksen --force kullan."
            );
        }
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

    const exportArgs = ["tsx", "scripts/export-inventory-csv.ts", "--file", backupPath];
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
    const importedRows = report.totals?.importedRows || 0;
    const inserts = report.preview?.inserts || 0;
    const updates = report.preview?.updates || 0;
    const unchanged = report.preview?.unchanged || 0;
    if (errors > 0) {
        throw new Error(`Dry-run errors bulundu (${errors}). Import durduruldu. Rapor: ${reportPath}`);
    }

    console.log(`Dry-run preview: ${inserts} inserts, ${updates} updates, ${unchanged} unchanged`);
    enforceGuards({ importedRows, inserts, updates }, options);
    if (
        options.maxTotalChanges != null ||
        options.maxInserts != null ||
        options.maxUpdates != null ||
        options.maxChangeRatio != null
    ) {
        console.log("Dry-run guard checks passed.");
    }

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
