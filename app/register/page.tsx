"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUserAction } from "@/app/actions";
import Link from "next/link";
import { Camera, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const res = await registerUserAction(formData);

        if (res.success) {
            router.push("/login?message=Account created. Please login.");
        } else {
            setError(res.error || "Something went wrong");
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1A1A1A] text-white rounded-2xl mb-4 shadow-xl">
                        <Camera size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">CINEBRAIN PRO</h1>
                    <p className="text-[#64748B] mt-2 italic font-serif">Create your cinematic identity</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
                    <h2 className="text-xl font-semibold mb-6 text-[#1A1A1A]">Join the community</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-[#94A3B8]" size={18} />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Luca Guadagnino"
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all outline-none text-[#1A1A1A]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-[#94A3B8]" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="luca@cinebrain.pro"
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all outline-none text-[#1A1A1A]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-[#94A3B8]" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all outline-none text-[#1A1A1A]"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 animate-pulse">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1A1A1A] text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#F1F5F9] text-center">
                        <p className="text-sm text-[#64748B]">
                            Already a member?{" "}
                            <Link href="/login" className="text-[#1A1A1A] font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-[#94A3B8] text-xs mt-10 tracking-widest uppercase">
                    Advanced Cinema Workflow Solutions
                </p>
            </div>
        </main>
    );
}
