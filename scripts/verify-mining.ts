
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkMiningResults() {
    const results = await prisma.equipmentItem.findMany({
        where: { id: { startsWith: "mega-" } },
        select: { id: true, name: true, brand: true, category: true, subcategory: true }
    });

    const autoResults = await prisma.equipmentItem.findMany({
        where: { id: { startsWith: "auto-" } },
        select: { id: true, name: true, brand: true, category: true, subcategory: true }
    });

    console.log(`\n📊 Mega Mined Items: ${results.length}`);
    console.log(`📊 Auto Mined Items: ${autoResults.length}`);
    console.log(`🚀 Total Newly Added Items: ${results.length + autoResults.length}\n`);

    if (results.length > 0) {
        console.log("Samples of Mega Catalog:");
        results.slice(0, 10).forEach(item => {
            console.log(` - [${item.id}] ${item.name} (${item.brand}) -> ${item.category}:${item.subcategory}`);
        });
    }
}

checkMiningResults().catch(console.error).finally(() => prisma.$disconnect());
