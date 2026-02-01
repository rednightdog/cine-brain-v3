import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function approveUser(email: string) {
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { isApproved: true },
        });
        console.log(`✅ User ${email} has been approved.`);
    } catch (error) {
        console.error(`❌ Error approving user ${email}:`, error);
    } finally {
        await prisma.$disconnect();
    }
}

const email = process.argv[2];
if (!email) {
    console.log("Usage: npx ts-node scripts/approve-user.ts <email>");
    process.exit(1);
}

approveUser(email);
