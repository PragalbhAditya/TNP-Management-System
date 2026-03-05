"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Plus, Send, AlertCircle, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function AdminNotices() {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    if (session?.user?.role !== "admin" && session?.user?.role !== "super-admin") {
        return (
            <DashboardLayout role={session?.user?.role || "student"}>
                <div className="glass-dark p-8 rounded-[2.5rem] border border-red-500/20 bg-red-500/5">
                    <div className="flex items-start space-x-4">
                        <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                        <div>
                            <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
                            <p className="text-gray-400 mt-1">You don&apos;t have permission to create notices.</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/admin/notices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to create notice");
            }

            setTitle("");
            setContent("");
            showToast("Notice posted successfully!", "success");
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Something went wrong";
            showToast(errorMsg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout role={session?.user?.role || "student"}>
            <div className="space-y-8 pb-12">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight flex items-center">
                        <Plus size={28} className="mr-2 text-primary md:w-8 md:h-8" /> Create Notice
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm md:text-base">Post announcements to all students in the system</p>
                </div>

                <div className="glass-dark p-6 md:p-8 rounded-[2.5rem] border border-white/5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest">
                                Notice Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter notice title"
                                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest">
                                Notice Content
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter notice content"
                                rows={10}
                                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {toast && (
                            <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-4 duration-300 ${toast.type === "success"
                                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                                : "bg-red-500/20 border border-red-500/40 text-red-300"
                                }`}>
                                {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                {toast.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !title || !content}
                            className="w-full px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <Send size={20} className="mr-2" />
                            {isSubmitting ? "Publishing..." : "Publish Notice"}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
