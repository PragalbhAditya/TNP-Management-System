"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Crown, Users, Search, RefreshCw, Loader2,
    CheckCircle, XCircle, Trash2, UserCheck,
    ArrowUpCircle, ArrowDownCircle, Mail, Shield,
    ShieldOff, GraduationCap, Plus
} from "lucide-react";

export default function SuperAdminAdminsPage() {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [tab, setTab] = useState<"admins" | "promote">("admins");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/super-admin/users");
            const data = await res.json();
            if (res.ok) setAllUsers(data);
            else showToast(data.error || "Failed to load users", "error");
        } catch {
            showToast("Network error.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const admins = allUsers.filter(u => u.role === "admin");
    const students = allUsers.filter(u => u.role === "student");

    const filteredAdmins = admins.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStudents = students.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChangeRole = async (userId: string, newRole: "admin" | "student") => {
        setProcessingId(userId);
        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole, isVerified: true }),
            });
            const data = await res.json();
            if (res.ok) {
                setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole, isVerified: true } : u));
                showToast(
                    newRole === "admin" ? "Student promoted to Admin." : "Admin demoted to Student.",
                    "success"
                );
            } else {
                showToast(data.error || "Failed to update role.", "error");
            }
        } catch {
            showToast("Network error.", "error");
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (userId: string) => {
        setDeleteConfirm(null);
        setProcessingId(userId);
        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                setAllUsers(prev => prev.filter(u => u._id !== userId));
                showToast("Account deleted permanently.", "success");
            } else {
                showToast(data.error || "Failed to delete.", "error");
            }
        } catch {
            showToast("Network error.", "error");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <DashboardLayout role="super-admin">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold transition-all ${toast.type === "success"
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                        : "bg-red-500/20 border border-red-500/40 text-red-300"
                    }`}>
                    {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {toast.message}
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-dark rounded-3xl border border-red-500/20 p-8 max-w-sm w-full mx-4 space-y-6 shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                            <Trash2 size={28} className="text-red-400" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-white">Delete Account?</h3>
                            <p className="text-sm text-gray-400">
                                This action is <span className="text-red-400 font-bold">permanent</span> and cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold text-sm transition-all">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-bold text-sm transition-all">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-8 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Records</h1>
                        <p className="text-gray-400 mt-2">Manage T&amp;P officers — promote students or revoke admin access.</p>
                    </div>
                    <button onClick={fetchUsers}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-sm">
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Total Admins</p>
                        <div className="flex items-end justify-between mt-4">
                            <h3 className="text-4xl font-black text-white">{admins.length}</h3>
                            <Crown size={28} className="text-amber-500/40" />
                        </div>
                    </div>
                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Eligible Students</p>
                        <div className="flex items-end justify-between mt-4">
                            <h3 className="text-4xl font-black text-white">{students.length}</h3>
                            <GraduationCap size={28} className="text-blue-500/40" />
                        </div>
                    </div>
                </div>

                {/* Tab Bar + Search */}
                <div className="glass-dark p-4 rounded-2xl border border-white/5 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex gap-2">
                        {[
                            { key: "admins" as const, label: "Admin Accounts", icon: Crown, count: admins.length },
                            { key: "promote" as const, label: "Promote Student", icon: Plus, count: students.length },
                        ].map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${tab === t.key
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-white/5 text-gray-400 hover:text-white"
                                    }`}>
                                <t.icon size={13} />
                                {t.label}
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${tab === t.key ? "bg-white/20" : "bg-white/10"}`}>
                                    {t.count}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-white outline-none focus:border-primary w-56"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-24">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                                <tr>
                                    <th className="px-8 py-6">
                                        {tab === "admins" ? "Admin Officer" : "Student"}
                                    </th>
                                    <th className="px-8 py-6">Email</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tab === "admins" ? (
                                    filteredAdmins.length === 0 ? (
                                        <tr>
                                            <td colSpan={4}>
                                                <div className="text-center p-20 space-y-3">
                                                    <Crown size={40} className="text-gray-700 mx-auto" />
                                                    <p className="text-gray-500 text-sm">No admin accounts found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredAdmins.map(admin => (
                                        <tr key={admin._id} className="hover:bg-primary/5 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 uppercase text-sm">
                                                        {admin.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{admin.name}</p>
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-400 mt-0.5">
                                                            <Crown size={10} /> Admin
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                                    <Mail size={11} className="text-gray-600" /> {admin.email}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                {admin.isVerified ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    {processingId === admin._id ? (
                                                        <Loader2 size={18} className="animate-spin text-primary" />
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleChangeRole(admin._id, "student")}
                                                                title="Demote to Student"
                                                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-xs font-bold"
                                                            >
                                                                <ArrowDownCircle size={14} /> Demote
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(admin._id)}
                                                                title="Delete Account"
                                                                className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={4}>
                                                <div className="text-center p-20 space-y-3">
                                                    <GraduationCap size={40} className="text-gray-700 mx-auto" />
                                                    <p className="text-gray-500 text-sm">No students found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredStudents.map(student => (
                                        <tr key={student._id} className="hover:bg-primary/5 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 uppercase text-sm">
                                                        {student.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{student.name}</p>
                                                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest flex items-center gap-1">
                                                            <GraduationCap size={10} /> Student
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                                    <Mail size={11} className="text-gray-600" /> {student.email}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                {student.isVerified ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    {processingId === student._id ? (
                                                        <Loader2 size={18} className="animate-spin text-primary" />
                                                    ) : (
                                                        <button
                                                            onClick={() => handleChangeRole(student._id, "admin")}
                                                            title="Promote to Admin"
                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-xs font-bold"
                                                        >
                                                            <ArrowUpCircle size={14} /> Promote to Admin
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Info Note */}
                <p className="text-xs text-gray-600 text-center">
                    Promoted admins are auto-verified and can immediately access the admin dashboard. Only super-admins can change roles.
                </p>
            </div>
        </DashboardLayout>
    );
}
