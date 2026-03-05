"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Loader2, Plus, X } from "lucide-react";

export default function CreateDrivePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        role: "",
        description: "",
        package: "",
        location: "",
        driveDate: "",
        applicationDeadline: "",
        eligibility: {
            minCgpa: 0,
            maxBacklogs: 0,
            allowedBranches: [] as string[],
        },
        rounds: [{ name: "Aptitude", type: "aptitude" }] as any[],
    });

    const [newBranch, setNewBranch] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/drives", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/drives");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create drive");
            }
        } catch (error) {
            alert("Error creating drive");
        } finally {
            setIsLoading(false);
        }
    };

    const addBranch = () => {
        if (newBranch && !formData.eligibility.allowedBranches.includes(newBranch)) {
            setFormData({
                ...formData,
                eligibility: {
                    ...formData.eligibility,
                    allowedBranches: [...formData.eligibility.allowedBranches, newBranch],
                },
            });
            setNewBranch("");
        }
    };

    const removeBranch = (branch: string) => {
        setFormData({
            ...formData,
            eligibility: {
                ...formData.eligibility,
                allowedBranches: formData.eligibility.allowedBranches.filter((b) => b !== branch),
            },
        });
    };

    const addRound = () => {
        setFormData({
            ...formData,
            rounds: [...formData.rounds, { name: "", type: "technical" }],
        });
    };

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">New Placement Drive</h1>
                    <p className="text-gray-400 mt-2">Enter the details for the upcoming recruitment drive.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Company Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Google"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Job Role</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. SDE-1"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Job Description</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Details about the role..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Annual Package (LPA)</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. 12 LPA"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                    value={formData.package}
                                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Location</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Bangalore / Remote"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Drive Date</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                    value={formData.driveDate}
                                    onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Application Deadline</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                    value={formData.applicationDeadline}
                                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
                            <h2 className="text-lg font-bold text-white">Eligibility Criteria</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Min CGPA</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                        value={formData.eligibility.minCgpa}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            eligibility: { ...formData.eligibility, minCgpa: parseFloat(e.target.value) }
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Max Backlogs</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                        value={formData.eligibility.maxBacklogs}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            eligibility: { ...formData.eligibility, maxBacklogs: parseInt(e.target.value) }
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Allowed Branches</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. CSE"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                        value={newBranch}
                                        onChange={(e) => setNewBranch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBranch())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addBranch}
                                        className="p-3 bg-primary rounded-xl text-white hover:bg-primary/90 transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.eligibility.allowedBranches.map((branch) => (
                                        <span key={branch} className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 text-sm">
                                            {branch}
                                            <button onClick={() => removeBranch(branch)} className="ml-2 hover:text-white"><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white">Selection Rounds</h2>
                                <button
                                    type="button"
                                    onClick={addRound}
                                    className="text-xs font-bold text-primary hover:underline"
                                >
                                    + Add Round
                                </button>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {formData.rounds.map((round, index) => (
                                    <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start">
                                        <div className="flex-1 space-y-3">
                                            <input
                                                required
                                                placeholder="Round Name"
                                                className="w-full bg-transparent border-b border-white/10 py-1 text-sm text-white outline-none focus:border-primary"
                                                value={round.name}
                                                onChange={(e) => {
                                                    const newRounds = [...formData.rounds];
                                                    newRounds[index].name = e.target.value;
                                                    setFormData({ ...formData, rounds: newRounds });
                                                }}
                                            />
                                            <select
                                                className="w-full bg-transparent text-xs text-gray-400 outline-none"
                                                value={round.type}
                                                onChange={(e) => {
                                                    const newRounds = [...formData.rounds];
                                                    newRounds[index].type = e.target.value;
                                                    setFormData({ ...formData, rounds: newRounds });
                                                }}
                                            >
                                                <option value="aptitude">Aptitude</option>
                                                <option value="coding">Coding Test</option>
                                                <option value="technical">Technical Interview</option>
                                                <option value="hr">HR Interview</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        {formData.rounds.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rounds: formData.rounds.filter((_, i) => i !== index) })}
                                                className="text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <button
                            disabled={isLoading}
                            className="px-12 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center"
                        >
                            {isLoading ? <Loader2 className="mr-2 animate-spin" /> : null}
                            Publish Drive
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
