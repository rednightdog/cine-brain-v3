import { PrismaClient } from "@prisma/client";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseCsvTable, parseImportRow, type CsvImportIssue, type PreparedImportItem } from "../lib/inventory-import";

const prisma = new PrismaClient();

type CliOptions = {
    filePath: string | null;
    dryRun: boolean;
    onlyCamLens: boolean;
    forceStatus: "PENDING" | "APPROVED" | null;
    batchSize: number;
};

function parseCliOptions(): CliOptions {
    const args = process.argv.slice(2);
    const options: CliOptions = {
        filePath: null,
        dryRun: false,
        onlyCamLens: false,
        forceStatus: null,
        batchSize: 25,
    };

    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (arg === "--dry-run") {
            options.dryRun = true;
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
                options.forceStatus = raw;
            }
            continue;
        }
        if (arg === "--status") {
            const raw = (args[i + 1] || "").trim().toUpperCase();
            if (raw === "PENDING" || raw === "APPROVED") {
                options.forceStatus = raw;
            }
            i += 1;
            continue;
        }
        if (arg.startsWith("--batch-size=")) {
            const value = Number(arg.slice("--batch-size=".length).trim());
            if (Number.isFinite(value) && value > 0) {
                options.batchSize = Math.round(value);
            }
            continue;
        }
    }

    return options;
}

function countIssues(issues: CsvImportIssue[]) {
    return issues.reduce(
        (acc, issue) => {
            if (issue.level === "error") acc.errors += 1;
            if (issue.level === "warning") acc.warnings += 1;
            return acc;
        },
        { errors: 0, warnings: 0 }
    );
}

function chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

function printUsage() {
    console.log("Usage:");
    console.log("  npm run db:import:csv -- --file ./imports/inventory-template.csv --dry-run");
    console.log("Optional flags:");
    console.log("  --only-cam-lens");
    console.log("  --status APPROVED|PENDING");
    console.log("  --batch-size 25");
}

async function run() {
    const options = parseCliOptions();
    if (!options.filePath) {
        printUsage();
        throw new Error("--file parametresi zorunlu.");
    }

    const absolutePath = resolve(process.cwd(), options.filePath);
    if (!existsSync(absolutePath)) {
        throw new Error(`CSV dosyasi bulunamadi: ${absolutePath}`);
    }

    const csvText = readFileSync(absolutePath, "utf8");
    const parsedTable = parseCsvTable(csvText);

    const issues: CsvImportIssue[] = [...parsedTable.issues];
    const candidates: PreparedImportItem[] = [];

    let invalidRows = 0;
    let filteredRows = 0;

    for (let index = 0; index < parsedTable.rows.length; index += 1) {
        const rowNumber = index + 2;
        const parsed = parseImportRow(parsedTable.rows[index], rowNumber);
        issues.push(...parsed.issues);

        if (!parsed.item) {
            invalidRows += 1;
            continue;
        }

        if (options.forceStatus) {
            parsed.item.data.status = options.forceStatus;
        }

        if (options.onlyCamLens && parsed.item.category !== "CAM" && parsed.item.category !== "LNS") {
            filteredRows += 1;
            continue;
        }

        candidates.push(parsed.item);
    }

    const counts = countIssues(issues);
    const reportsDir = join(process.cwd(), "reports");
    mkdirSync(reportsDir, { recursive: true });
    const reportPath = join(reportsDir, "inventory-import-report.json");

    let upserted = 0;
    if (!options.dryRun) {
        const batches = chunk(candidates, options.batchSize);
        for (let i = 0; i < batches.length; i += 1) {
            await Promise.all(
                batches[i].map((item) =>
                    prisma.equipmentItem.upsert({
                        where: {
                            brand_model_name: item.key,
                        },
                        update: item.data,
                        create: item.data,
                    })
                )
            );
            upserted += batches[i].length;
            if ((i + 1) % 10 === 0 || i === batches.length - 1) {
                console.log(`Import progress: ${upserted}/${candidates.length}`);
            }
        }
    }

    const report = {
        generatedAt: new Date().toISOString(),
        sourceFile: absolutePath,
        options: {
            dryRun: options.dryRun,
            onlyCamLens: options.onlyCamLens,
            forceStatus: options.forceStatus,
            batchSize: options.batchSize,
        },
        totals: {
            csvRows: parsedTable.rows.length,
            importedRows: candidates.length,
            invalidRows,
            filteredRows,
            upsertedRows: options.dryRun ? 0 : upserted,
        },
        issues: {
            errors: counts.errors,
            warnings: counts.warnings,
            sample: issues.slice(0, 300),
        },
        sampleImportedRows: candidates.slice(0, 30).map((item) => ({
            row: item.rowNumber,
            key: item.key,
            category: item.category,
            status: item.data.status || "APPROVED",
            fields: Object.keys(item.data),
        })),
    };
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("CSV import completed.");
    console.log(`Source file: ${absolutePath}`);
    console.log(`Rows in CSV: ${report.totals.csvRows}`);
    console.log(`Imported candidates: ${report.totals.importedRows}`);
    console.log(`Invalid rows: ${report.totals.invalidRows}`);
    console.log(`Filtered rows: ${report.totals.filteredRows}`);
    console.log(`Upserted rows: ${report.totals.upsertedRows}`);
    console.log(`Issues: ${report.issues.errors} errors, ${report.issues.warnings} warnings`);
    console.log(`Report path: ${reportPath}`);

    if (candidates.length === 0) {
        throw new Error("Import edilebilir satir yok. Raporu kontrol et.");
    }
}

run()
    .catch((error) => {
        console.error("CSV import failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
