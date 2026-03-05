"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Loader2, Plus, X } from "lucide-react";

const BRANCHES = [
    "Aeronautical Engineering",
    "Artificial Intelligence & Machine Learning",
    "Civil Engineering",
    "Computer Science & Engineering",
    "Electrical & Electronics Engineering",
    "Mechanical Engineering",
    "Power Systems",
];

export default function EditDrivePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any | null>(null);
    const [newBranch, setNewBranch] = useState("");
    const [newPassoutYear, setNewPassoutYear] = useState("");

    useEffect(() => {
        if (!id) return;
        const fetchDrive = async () => {
            try {
                const res = await fetch(`/api/drives/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        companyName: data.companyName || "",
                        role: data.role || "",
                        description: data.description || "",
                        package: data.package || "",
                        location: data.location || "",
                        driveDate: data.driveDate ? data.driveDate.substring(0, 10) : "",
                        applicationDeadline: data.applicationDeadline ? data.applicationDeadline.substring(0, 10) : "",
                        eligibility: {
                            minCgpa: data.eligibility?.minCgpa ?? 0,
                            maxBacklogs: data.eligibility?.maxBacklogs ?? 0,
                            allowedBranches: data.eligibility?.allowedBranches || [],
                            passoutYears: data.eligibility?.passoutYears || [],
                        },
                        rounds: data.rounds && data.rounds.length > 0 ? data.rounds : [{ name: "Aptitude", type: "aptitude" }],
                    });
                } else {
                    alert("Failed to load drive");
                    router.push("/admin/drives");
                }
            } catch {
                alert("Failed to load drive");
                router.push("/admin/drives");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDrive();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        setIsSaving(true);

        try {
            const res = await fetch(`/api/drives/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/drives");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update drive");
            }
        } catch {
            alert("Error updating drive");
        } finally {
            setIsSaving(false);
        }
    };

    const addBranch = () => {
        if (!formData) return;
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
        if (!formData) return;
        setFormData({
            ...formData,
            eligibility: {
                ...formData.eligibility,
                allowedBranches: formData.eligibility.allowedBranches.filter((b: string) => b !== branch),
            },
        });
    };

    const addPassoutYear = () => {
        if (!formData) return;
        const yearNum = parseInt(newPassoutYear, 10);
        if (!isNaN(yearNum) && !formData.eligibility.passoutYears.includes(yearNum)) {
            setFormData({
                ...formData,
                eligibility: {
                    ...formData.eligibility,
                    passoutYears: [...formData.eligibility.passoutYears, yearNum],
                },
            });
            setNewPassoutYear("");
        }
    };

    const removePassoutYear = (year: number) => {
        if (!formData) return;
        setFormData({
            ...formData,
            eligibility: {
                ...formData.eligibility,
                passoutYears: formData.eligibility.passoutYears.filter((y: number) => y !== year),
            },
        });
    };

    const addRound = () => {
        if (!formData) return;
        setFormData({
            ...formData,
            rounds: [...formData.rounds, { name: "", type: "technical" }],
        });
    };

    if (isLoading || !formData) {
        return (
            <DashboardLayout role="admin">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Edit Placement Drive</h1>
                        <p className="text-gray-400 mt-2">Update the details for this recruitment drive.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Company Name</label>
                                <input
                                    required
                                    type="text"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Min CGPA</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                        value={formData.eligibility.minCgpa}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                eligibility: {
                                                    ...formData.eligibility,
                                                    minCgpa: parseFloat(e.target.value),
                                                },
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Max Backlogs</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                        value={formData.eligibility.maxBacklogs}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                eligibility: {
                                                    ...formData.eligibility,
                                                    maxBacklogs: parseInt(e.target.value, 10) || 0,
                                                },
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Allowed Branches</label>
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary appearance-none cursor-pointer"
                                        value={newBranch}
                                        onChange={(e) => setNewBranch(e.target.value)}
                                    >
                                        <option value="" className="bg-gray-900">
                                            Select Branch
                                        </option>
                                        {BRANCHES.map((branch) => (
                                            <option key={branch} value={branch} className="bg-gray-900">
                                                {branch}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={addBranch}
                                        className="p-3 bg-primary rounded-xl text-white hover:bg-primary/90 transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.eligibility.allowedBranches.map((branch: string) => (
                                        <span
                                            key={branch}
                                            className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 text-sm"
                                        >
                                            {branch}
                                            <button onClick={() => removeBranch(branch)} className="ml-2 hover:text-white">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Eligible Passout Years</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="e.g. 2025"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                        value={newPassoutYear}
                                        onChange={(e) => setNewPassoutYear(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPassoutYear())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addPassoutYear}
                                        className="p-3 bg-primary rounded-xl text-white hover:bg-primary/90 transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.eligibility.passoutYears.map((year: number) => (
                                        <span
                                            key={year}
                                            className="flex items-center bg-white/5 text-white px-3 py-1 rounded-lg border border-white/10 text-sm"
                                        >
                                            {year}
                                            <button onClick={() => removePassoutYear(year)} className="ml-2 hover:text-red-400">
                                                <X size={14} />
                                            </button>
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
                                {formData.rounds.map((round: any, index: number) => (
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
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        rounds: formData.rounds.filter((_: any, i: number) => i !== index),
                                                    })
                                                }
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
                            disabled={isSaving}
                            className="px-12 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center disabled:opacity-60"
                        >
                            {isSaving ? <Loader2 className="mr-2 animate-spin" /> : null}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

