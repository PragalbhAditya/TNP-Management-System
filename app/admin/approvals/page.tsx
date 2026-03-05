"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    CheckCircle,
    XCircle,
    Users,
    Loader2,
    Search,
    Clock,
    ShieldCheck,
    GraduationCap,
    Mail,
    Hash,
    Filter,
    RefreshCw
} from "lucide-react";

export default function AdminApprovalsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMode, setFilterMode] = useState<"pending" | "verified" | "all">("pending");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/super-admin/users");
            const data = await res.json();
            if (res.ok) {
                setStudents(data.filter((u: any) => u.role === "student"));
            } else {
                showToast(data.error || "Failed to load students", "error");
            }
        } catch (error) {
            showToast("Network error. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
        setProcessingId(userId);
        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVerified: !currentStatus }),
            });
            const data = await res.json();
            if (res.ok) {
                setStudents(prev =>
                    prev.map(s => s._id === userId ? { ...s, isVerified: !currentStatus } : s)
                );
                showToast(
                    currentStatus ? "Approval revoked successfully." : "Student approved successfully!",
                    "success"
                );
            } else {
                showToast(data.error || "Failed to update status.", "error");
            }
        } catch (error) {
            showToast("Network error. Please try again.", "error");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filterMode === "all" ? true :
                filterMode === "pending" ? !student.isVerified :
                    student.isVerified;

        return matchesSearch && matchesFilter;
    });

    const pendingCount = students.filter(s => !s.isVerified).length;
    const verifiedCount = students.filter(s => s.isVerified).length;

    return (
        <DashboardLayout role="admin">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-4 duration-300 ${toast.type === "success"
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                        : "bg-red-500/20 border border-red-500/40 text-red-300"
                    }`}>
                    {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {toast.message}
                </div>
            )}

            <div className="space-y-8 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Student Approvals</h1>
                        <p className="text-gray-400 mt-2">Review and approve student registration requests.</p>
                    </div>
                    <button
                        onClick={fetchStudents}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-sm"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Students", value: students.length, icon: Users, color: "blue", filter: "all" },
                        { label: "Pending Approval", value: pendingCount, icon: Clock, color: "amber", filter: "pending" },
                        { label: "Verified", value: verifiedCount, icon: ShieldCheck, color: "emerald", filter: "verified" },
                    ].map(stat => (
                        <button
                            key={stat.label}
                            onClick={() => setFilterMode(stat.filter as any)}
                            className={`glass-dark p-6 rounded-3xl border transition-all text-left group ${filterMode === stat.filter
                                ? "border-primary/40 bg-primary/5"
                                : "border-white/5 hover:border-white/15"
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                <div className={`p-2 rounded-xl bg-${stat.color}-500/10`}>
                                    <stat.icon className={`text-${stat.color}-500`} size={18} />
                                </div>
                            </div>
                            <h3 className="text-4xl font-black text-white mt-4">{stat.value}</h3>
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="glass-dark p-5 rounded-3xl border border-white/5 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[300px] flex items-center bg-white/5 rounded-2xl px-5 py-3.5 border border-white/5">
                        <Search size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search by name, email or roll number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-gray-600"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-500" />
                        {(["all", "pending", "verified"] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setFilterMode(mode)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filterMode === mode
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-white/5 text-gray-400 hover:text-white"
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Students Table */}
                <div className="glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-24">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center p-24 space-y-4">
                            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto">
                                <CheckCircle size={40} className="text-emerald-500/30" />
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                {filterMode === "pending" ? "All caught up!" : "No students found"}
                            </h3>
                            <p className="text-gray-500">
                                {filterMode === "pending"
                                    ? "There are no pending student approval requests."
                                    : "Try adjusting your search or filter criteria."}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                                <tr>
                                    <th className="px-8 py-6">Student</th>
                                    <th className="px-8 py-6">Academic Details</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-primary/5 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg uppercase ${student.isVerified
                                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                    }`}>
                                                    {student.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{student.name}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Mail size={11} /> {student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                                    <GraduationCap size={13} className="text-gray-500" />
                                                    <span>{student.branch || <span className="text-gray-600 italic">No branch</span>}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Hash size={13} />
                                                    <span>Roll: {student.rollNumber || "—"} &nbsp;|&nbsp; CGPA: {student.cgpa || "—"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {student.isVerified ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                    Pending Review
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {processingId === student._id ? (
                                                <div className="flex justify-end">
                                                    <Loader2 size={20} className="animate-spin text-primary" />
                                                </div>
                                            ) : student.isVerified ? (
                                                <button
                                                    onClick={() => handleToggleVerification(student._id, true)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-xs font-bold"
                                                >
                                                    <XCircle size={14} />
                                                    Revoke
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleVerification(student._id, false)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-xs font-bold"
                                                >
                                                    <CheckCircle size={14} />
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
