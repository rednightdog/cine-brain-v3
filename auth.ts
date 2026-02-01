
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: (user as any).image || null
                };
            }
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Allow initial sign in for the admin or if user is already approved
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email as string }
            });

            // If user doesn't exist yet (first time OAuth), they will be created with isApproved: false
            // We allow them to be created, but they won't be able to "do" anything if we protect routes
            // OR we can block the sign in here if we want to be strict.

            // For now, let's allow the creation of the user record but we can check isApproved
            if (dbUser && !dbUser.isApproved) {
                // You can add logic here to allow specific emails to bypass
                const adminEmails = ["arasdemiray@gmail.com"]; // Example, update with your email
                if (adminEmails.includes(user.email as string)) {
                    return true;
                }
                return false; // Deny sign in
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id as string
            }
            return session
        },
    },
})
