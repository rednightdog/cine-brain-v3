
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const id = "cml1mxmfs005klte5fa9d62j1"; // Aras şaryo ID
    console.log(`Attempting to delete item: ${id}...`);

    try {
        // 1. Check if item exists
        const item = await prisma.equipmentItem.findUnique({ where: { id } });
        if (!item) {
            console.log("Item not found in DB!");
            return;
        }
        console.log("Item found:", item.name);

        // 2. Try to delete KitItems first (Manual Cascade)
        const deletedKits = await prisma.kitItem.deleteMany({
            where: { equipmentId: id }
        });
        console.log(`Deleted ${deletedKits.count} associated KitItems.`);

        // 3. Delete EquipmentItem
        await prisma.equipmentItem.delete({ where: { id } });
        console.log("SUCCESS: EquipmentItem deleted.");

    } catch (e: any) {
        console.error("FAILURE: Could not delete item.");
        console.error(e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
