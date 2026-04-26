"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get("message");
    const [error, setError] = useState("");

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black animate-pulse-slow"></div>

            <div className="z-10 w-full max-w-sm flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Logo */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        <ShieldCheck className="w-6 h-6 text-black" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter mt-4">
                        CineBrain <span className="text-[#007AFF]">Pro</span>
                    </h1>
                    <p className="text-sm text-gray-400 font-medium">Production Access</p>
                </div>

                {/* Login Form */}
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="h-14 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-sm font-black text-[#4285F4]">
                            G
                        </span>
                        <span className="flex flex-col items-start leading-tight">
                            <span>Sign in with Google</span>
                            <span className="text-xs font-medium text-gray-500">Log in with Google</span>
                        </span>
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-800"></div>
                        <span className="flex-shrink mx-4 text-gray-600 text-xs uppercase font-bold">Or</span>
                        <div className="flex-grow border-t border-gray-800"></div>
                    </div>

                    {message && (
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setError("");
                            const formData = new FormData(e.currentTarget);
                            const res = await signIn("credentials", {
                                email: formData.get("email"),
                                password: formData.get("password"),
                                redirect: false,
                            });

                            if (res?.error) {
                                setError("Email or password is incorrect.");
                            } else {
                                router.push("/");
                            }
                        }}
                        className="flex flex-col gap-3"
                    >
                        <input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            className="h-12 bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg px-4 text-sm font-medium focus:outline-none focus:border-[#007AFF] transition-colors text-white"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="h-12 bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg px-4 text-sm font-medium focus:outline-none focus:border-[#007AFF] transition-colors text-white"
                            required
                        />
                        <button
                            type="submit"
                            className="h-12 bg-[#007AFF] text-white font-bold rounded-lg flex items-center justify-center hover:bg-[#0062CC] transition-all active:scale-95 mt-1"
                        >
                            Sign in with Email <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Need an account?{" "}
                        <Link href="/register" className="font-bold text-white hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>

                <p className="text-center text-[10px] text-gray-600">
                    Restricted System. Authorized Personnel Only. <br />
                    © 2026 CineBrain Inc.
                </p>
            </div>
        </div>
    );
}
