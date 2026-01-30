
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // TODO: Replace with real database lookup and bcrypt check
                // For now, allow test user
                if (credentials.email === "demo@cinebrain.com" && credentials.password === "demo123") {
                    return {
                        id: "demo-user-1",
                        name: "Demo Producer",
                        email: "demo@cinebrain.com",
                        image: "https://avatar.vercel.sh/demo"
                    }
                }
                return null
            }
        })
    ],
    callbacks: {
        session({ session, user }) {
            session.user.id = user.id
            return session
        },
    },
})
