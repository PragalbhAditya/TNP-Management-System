"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Clock, ShieldCheck } from "lucide-react";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPendingApproval, setIsPendingApproval] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setIsPendingApproval(false);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                if (result.error.includes("pending approval")) {
                    setIsPendingApproval(true);
                } else if (result.error.includes("blocked")) {
                    setError("Your account has been blocked. Please contact the administrator.");
                } else {
                    setError("Invalid email or password");
                }
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="glass-dark w-full max-w-md space-y-8 rounded-[2rem] p-8 shadow-2xl border border-white/5">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={28} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
                    <p className="text-sm text-gray-400">Sign in to your T&amp;P account</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Pending Approval Banner */}
                    {isPendingApproval && (
                        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                <Clock size={20} className="text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-amber-300">Account Pending Approval</p>
                                <p className="text-xs text-amber-500/80 mt-1">Your registration is under review. You will be able to sign in once an admin approves your account.</p>
                            </div>
                        </div>
                    )}

                    {/* Generic Error */}
                    {error && (
                        <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="name@college.edu"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white hover:bg-primary/90 focus:outline-none transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                        {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</> : "Sign In"}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-400">Don&apos;t have an account? </span>
                    <Link href="/auth/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
