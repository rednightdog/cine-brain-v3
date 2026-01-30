'use client';

import { Suspense, useActionState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react'; // Client side sign-in

export default function LoginPage() {
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
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="h-12 bg-white text-black font-bold rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Sign in with Google
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-800"></div>
                        <span className="flex-shrink mx-4 text-gray-600 text-xs uppercase font-bold">Or</span>
                        <div className="flex-grow border-t border-gray-800"></div>
                    </div>

                    <form
                        action={async (formData) => {
                            await signIn("credentials", {
                                email: formData.get("email"),
                                password: formData.get("password"),
                                callbackUrl: '/'
                            });
                        }}
                        className="flex flex-col gap-3"
                    >
                        <input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            className="h-12 bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg px-4 text-sm font-medium focus:outline-none focus:border-[#007AFF] transition-colors"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="h-12 bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg px-4 text-sm font-medium focus:outline-none focus:border-[#007AFF] transition-colors"
                            required
                        />
                        <button
                            type="submit"
                            className="h-12 bg-[#007AFF] text-white font-bold rounded-lg flex items-center justify-center hover:bg-[#0062CC] transition-all active:scale-95 mt-1"
                        >
                            Login Access <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-gray-600">
                    Restricted System. Authorized Personnel Only. <br />
                    © 2026 CineBrain Inc.
                </p>
            </div>
        </div>
    );
}
