"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Clock, CheckCircle, Mail, ShieldCheck, ArrowRight, Hash, Calendar } from "lucide-react";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        rollNumber: "",
        dateOfBirth: "",
        role: "student",        // always student — super-admin promotes to admin
    });
    const [regNoError, setRegNoError] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [registeredName, setRegisteredName] = useState("");
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setRegNoError("");

        // Validate reg number format if provided
        if (formData.rollNumber && !/^\d{11}$/.test(formData.rollNumber)) {
            setRegNoError("Registration number must be exactly 11 digits (e.g. 25157109022)");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to register");
            }

            setRegisteredName(formData.name);
            setRegisteredEmail(formData.email);
            setIsRegistered(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isRegistered) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-lg text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    {/* Animated Icon */}
                    <div className="relative mx-auto w-32 h-32">
                        <div className="absolute inset-0 rounded-full bg-amber-500/10 border border-amber-500/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full bg-amber-500/10 border border-amber-500/20 animate-ping [animation-delay:0.3s]" />
                        <div className="relative w-32 h-32 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                            <Clock size={52} className="text-amber-400" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            Registration Submitted!
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Hey <span className="text-white font-bold">{registeredName}</span>, your account is now awaiting admin approval.
                        </p>
                    </div>

                    {/* Info Card */}
                    <div className="glass-dark rounded-3xl border border-white/10 p-8 space-y-5 text-left">
                        {[
                            {
                                icon: CheckCircle,
                                color: "text-emerald-400",
                                bg: "bg-emerald-500/10",
                                title: "Account Created",
                                desc: "Your credentials have been saved securely.",
                            },
                            {
                                icon: Clock,
                                color: "text-amber-400",
                                bg: "bg-amber-500/10",
                                title: "Pending Approval",
                                desc: "An admin will review and approve your account shortly.",
                            },
                            {
                                icon: Mail,
                                color: "text-blue-400",
                                bg: "bg-blue-500/10",
                                title: "Registered Email",
                                desc: registeredEmail,
                            },
                            {
                                icon: ShieldCheck,
                                color: "text-primary",
                                bg: "bg-primary/10",
                                title: "After Approval",
                                desc: "You'll be able to sign in and access the full platform.",
                            },
                        ].map(({ icon: Icon, color, bg, title, desc }) => (
                            <div key={title} className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={20} className={color} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <Link
                        href="/auth/signin"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 hover:gap-3"
                    >
                        Go to Sign In <ArrowRight size={18} />
                    </Link>

                    <p className="text-xs text-gray-600">
                        Contact your T&amp;P coordinator if approval takes longer than expected.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="glass-dark w-full max-w-md space-y-8 rounded-[2rem] p-8 shadow-2xl border border-white/5 animate-in fade-in duration-300">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={28} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Create Account</h1>
                    <p className="text-sm text-gray-400">Join the NCE T&amp;P Platform</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="name@college.edu"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-300">Registration Number</label>
                            </div>
                            <div className="relative">
                                <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={11}
                                    value={formData.rollNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                                        setFormData({ ...formData, rollNumber: val });
                                        if (regNoError) setRegNoError("");
                                    }}
                                    className={`block w-full rounded-xl bg-white/5 border px-4 py-3 pl-9 text-white placeholder-gray-600 focus:ring-1 outline-none transition-all font-mono tracking-widest ${regNoError
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-white/10 focus:border-primary focus:ring-primary"
                                        }`}
                                    placeholder="25157109022"
                                />
                            </div>
                            {regNoError && (
                                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                                    {regNoError}
                                </p>
                            )}
                            {formData.rollNumber && !regNoError && formData.rollNumber.length === 11 && (
                                <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
                                    <CheckCircle size={11} /> Valid registration number
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
                                <Calendar size={14} className="text-gray-500" />
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Min. 6 characters"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white hover:bg-primary/90 focus:outline-none transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                        {isLoading ? (
                            <><Loader2 className="h-5 w-5 animate-spin" /> Creating Account...</>
                        ) : (
                            <>Create Account <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-400">Already have an account? </span>
                    <Link href="/auth/signin" className="font-bold text-primary hover:text-primary/80 transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
