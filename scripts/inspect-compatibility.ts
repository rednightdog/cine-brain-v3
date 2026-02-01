import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function inspectItems() {
    try {
        const items = await prisma.equipmentItem.findMany({
            where: {
                specs_json: { not: null }
            },
            take: 20
        });

        const withCompatibility = items.filter(item => {
            try {
                const specs = JSON.parse(item.specs_json || "{}");
                return specs.compatibility && Array.isArray(specs.compatibility);
            } catch (e) {
                return false;
            }
        });

        console.log(`Total items checked: ${items.length}`);
        console.log(`Items with compatibility tags: ${withCompatibility.length}`);

        withCompatibility.forEach(item => {
            const specs = JSON.parse(item.specs_json || "{}");
            console.log(`- ${item.brand} ${item.model}: [${specs.compatibility.join(", ")}]`);
        });

    } catch (error) {
        console.error("Error inspecting items:", error);
    } finally {
        await prisma.$disconnect();
    }
}

inspectItems();
