import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listUsers() {
    try {
        const users = await prisma.user.findMany();
        console.log("Current Users:", users.map(u => u.email));
    } catch (error) {
        console.error("❌ Error listing users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers();
