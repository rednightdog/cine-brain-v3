import { existsSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

type BackupEntry = {
    name: string;
    path: string;
    mtimeMs: number;
    bytes: number;
};

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(epochMs: number): string {
    return new Date(epochMs).toISOString();
}

function collectBackups(backupsDir: string): BackupEntry[] {
    if (!existsSync(backupsDir)) return [];

    const files = readdirSync(backupsDir)
        .filter((name) => extname(name).toLowerCase() === ".csv")
        .map((name) => {
            const path = join(backupsDir, name);
            const stat = statSync(path);
            return {
                name,
                path,
                mtimeMs: stat.mtimeMs,
                bytes: stat.size,
            };
        })
        .sort((a, b) => b.name.localeCompare(a.name));

    return files;
}

async function run() {
    const backupsDir = resolve(process.cwd(), "./imports/backups");
    const backups = collectBackups(backupsDir);

    console.log(`Backups directory: ${backupsDir}`);
    console.log(`Total backups: ${backups.length}`);

    if (backups.length === 0) {
        console.log("No backup files found.");
        return;
    }

    console.log("");
    console.log("Index | Modified (UTC)         | Size      | File");
    console.log("------|-------------------------|-----------|------------------------------");
    backups.forEach((entry, index) => {
        console.log(
            `${String(index).padStart(5)} | ${formatDate(entry.mtimeMs)} | ${formatBytes(entry.bytes).padStart(9)} | ${entry.name}`
        );
    });

    console.log("");
    console.log("Use with restore offset:");
    console.log("  npm run db:restore:latest:dry -- --offset 0   # latest");
    console.log("  npm run db:restore:latest:dry -- --offset 1   # previous");
}

run().catch((error) => {
    console.error("Backup list failed:", error);
    process.exit(1);
});
