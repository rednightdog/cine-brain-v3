import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

type CliOptions = {
    filePath: string | null;
    dryRunOnly: boolean;
    skipQuality: boolean;
    onlyCamLens: boolean;
    status: "PENDING" | "APPROVED" | null;
    maxTotalChanges: number | null;
    maxInserts: number | null;
    maxUpdates: number | null;
    maxChangeRatio: number | null;
    force: boolean;
};

type ImportReport = {
    totals?: {
        importedRows?: number;
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
    const options: CliOptions = {
        filePath: null,
        dryRunOnly: false,
        skipQuality: false,
        onlyCamLens: false,
        status: null,
        maxTotalChanges: null,
        maxInserts: null,
        maxUpdates: null,
        maxChangeRatio: null,
        force: false,
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
        if (arg === "--force") {
            options.force = true;
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
        if (arg.startsWith("--max-total-changes=")) {
            const value = Number(arg.slice("--max-total-changes=".length).trim());
            if (Number.isFinite(value) && value >= 0) options.maxTotalChanges = Math.round(value);
            continue;
        }
        if (arg === "--max-total-changes") {
            const value = Number((args[i + 1] || "").trim());
            if (Number.isFinite(value) && value >= 0) options.maxTotalChanges = Math.round(value);
            i += 1;
            continue;
        }
        if (arg.startsWith("--max-inserts=")) {
            const value = Number(arg.slice("--max-inserts=".length).trim());
            if (Number.isFinite(value) && value >= 0) options.maxInserts = Math.round(value);
            continue;
        }
        if (arg === "--max-inserts") {
            const value = Number((args[i + 1] || "").trim());
            if (Number.isFinite(value) && value >= 0) options.maxInserts = Math.round(value);
            i += 1;
            continue;
        }
        if (arg.startsWith("--max-updates=")) {
            const value = Number(arg.slice("--max-updates=".length).trim());
            if (Number.isFinite(value) && value >= 0) options.maxUpdates = Math.round(value);
            continue;
        }
        if (arg === "--max-updates") {
            const value = Number((args[i + 1] || "").trim());
            if (Number.isFinite(value) && value >= 0) options.maxUpdates = Math.round(value);
            i += 1;
            continue;
        }
        if (arg.startsWith("--max-change-ratio=")) {
            const value = Number(arg.slice("--max-change-ratio=".length).trim());
            if (Number.isFinite(value) && value >= 0) options.maxChangeRatio = value;
            continue;
        }
        if (arg === "--max-change-ratio") {
            const value = Number((args[i + 1] || "").trim());
            if (Number.isFinite(value) && value >= 0) options.maxChangeRatio = value;
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

function enforceGuards(snapshot: GuardSnapshot, options: CliOptions) {
    if (options.force) return;

    const totalChanges = snapshot.inserts + snapshot.updates;

    if (options.maxTotalChanges != null && totalChanges > options.maxTotalChanges) {
        throw new Error(
            `Guard blocked: total changes ${totalChanges} > max-total-changes ${options.maxTotalChanges}. ` +
                "Backup dosyasini kontrol et veya bilerek devam edeceksen --force kullan."
        );
    }
    if (options.maxInserts != null && snapshot.inserts > options.maxInserts) {
        throw new Error(
            `Guard blocked: inserts ${snapshot.inserts} > max-inserts ${options.maxInserts}. ` +
                "Backup dosyasini kontrol et veya bilerek devam edeceksen --force kullan."
        );
    }
    if (options.maxUpdates != null && snapshot.updates > options.maxUpdates) {
        throw new Error(
            `Guard blocked: updates ${snapshot.updates} > max-updates ${options.maxUpdates}. ` +
                "Backup dosyasini kontrol et veya bilerek devam edeceksen --force kullan."
        );
    }

    if (options.maxChangeRatio != null && snapshot.importedRows > 0) {
        const ratio = totalChanges / snapshot.importedRows;
        if (ratio > options.maxChangeRatio) {
            throw new Error(
                `Guard blocked: change ratio ${ratio.toFixed(4)} > max-change-ratio ${options.maxChangeRatio}. ` +
                    "Backup dosyasini kontrol et veya bilerek devam edeceksen --force kullan."
            );
        }
    }
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
    const importedRows = report.totals?.importedRows || 0;
    const inserts = report.preview?.inserts || 0;
    const updates = report.preview?.updates || 0;
    const unchanged = report.preview?.unchanged || 0;

    if (errors > 0) {
        throw new Error(`Dry-run errors bulundu (${errors}). Restore durduruldu. Rapor: ${reportPath}`);
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
