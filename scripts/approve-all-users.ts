import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function approveAllUsers() {
    try {
        const result = await prisma.user.updateMany({
            data: { isApproved: true },
        });
        console.log(`✅ Successfully approved ${result.count} existing users.`);
    } catch (error) {
        console.error("❌ Error approving all users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

approveAllUsers();
