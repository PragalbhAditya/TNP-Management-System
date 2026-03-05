"use client";

import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    ShieldCheck, Users, Settings, Database, Search,
    Activity, Lock, Mail, CheckCircle, XCircle,
    Loader2, Trash2, RefreshCw, UserCheck, UserX,
    GraduationCap, Crown
} from "lucide-react";
import { useState, useEffect } from "react";

type TabFilter = "all" | "student" | "admin" | "pending";

export default function SuperAdminDashboard() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabFilter>("all");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
            if (res.ok) setUsers(data);
            else showToast(data.error || "Failed to fetch users", "error");
        } catch {
            showToast("Network error fetching users", "error");
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
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, isVerified: !currentStatus } : u));
                showToast(currentStatus ? "Approval revoked." : "User approved!", "success");
            } else {
                showToast(data.error || "Failed to update status.", "error");
            }
        } catch {
            showToast("Network error. Please try again.", "error");
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (userId: string) => {
        setProcessingId(userId);
        setDeleteConfirm(null);
        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                setUsers(prev => prev.filter(u => u._id !== userId));
                showToast("User deleted permanently.", "success");
            } else {
                showToast(data.error || "Failed to delete user.", "error");
            }
        } catch {
            showToast("Network error. Please try again.", "error");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
            activeTab === "all" ? true :
                activeTab === "pending" ? !user.isVerified :
                    user.role === activeTab;

        return matchesSearch && matchesTab;
    });

    const counts = {
        all: users.length,
        student: users.filter(u => u.role === "student").length,
        admin: users.filter(u => u.role === "admin").length,
        pending: users.filter(u => !u.isVerified).length,
    };

    const tabs: { key: TabFilter; label: string; icon: React.ElementType; color: string }[] = [
        { key: "all", label: "All Users", icon: Users, color: "blue" },
        { key: "student", label: "Students", icon: GraduationCap, color: "blue" },
        { key: "admin", label: "Admins", icon: Crown, color: "amber" },
        { key: "pending", label: "Pending Approval", icon: Lock, color: "amber" },
    ];

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

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-dark rounded-3xl border border-red-500/20 p-8 max-w-sm w-full mx-4 space-y-6 shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                            <Trash2 size={28} className="text-red-400" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-white">Delete User?</h3>
                            <p className="text-sm text-gray-400">
                                This action is <span className="text-red-400 font-bold">permanent</span> and cannot be undone. All data associated with this user will be lost.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold text-sm transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-bold text-sm transition-all"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/5 p-8 rounded-[2.5rem] border border-primary/20">
                    <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight">System Authority</h1>
                            <p className="text-gray-400 mt-1">Global administrator control and system infrastructure monitoring.</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest gap-2">
                            <Activity size={14} className="text-emerald-500" />
                            System Status: Operational
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Accounts", val: counts.all.toString(), icon: Users, color: "blue" },
                        { label: "Pending Approvals", val: counts.pending.toString(), icon: Lock, color: "amber" },
                        { label: "Admin Accounts", val: counts.admin.toString(), icon: Crown, color: "purple" },
                        { label: "Students", val: counts.student.toString(), icon: GraduationCap, color: "emerald" },
                    ].map(stat => (
                        <div key={stat.label} className="glass-dark p-6 rounded-3xl border border-white/5 group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                <stat.icon className={`text-${stat.color}-500/50 group-hover:text-${stat.color}-500 transition-colors`} size={18} />
                            </div>
                            <h3 className="text-3xl font-black text-white mt-3">{stat.val}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Users Table */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Tab Bar + Search */}
                        <div className="glass-dark p-4 rounded-2xl border border-white/5 flex flex-wrap gap-3 items-center justify-between">
                            <div className="flex gap-2 flex-wrap">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.key
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "bg-white/5 text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        <tab.icon size={13} />
                                        {tab.label}
                                        <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.key ? "bg-white/20" : "bg-white/10"
                                            }`}>
                                            {counts[tab.key]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search name, email, role..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-white outline-none focus:border-primary w-52"
                                    />
                                </div>
                                <button
                                    onClick={fetchUsers}
                                    className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                                >
                                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden">
                            {isLoading ? (
                                <div className="flex items-center justify-center p-20">
                                    <Loader2 className="animate-spin text-primary" size={40} />
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="text-center p-16 space-y-3">
                                    <Users size={40} className="text-gray-700 mx-auto" />
                                    <p className="text-gray-500 text-sm">No users found.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                                        <tr>
                                            <th className="px-6 py-5">Identity</th>
                                            <th className="px-6 py-5">Role</th>
                                            <th className="px-6 py-5">Status</th>
                                            <th className="px-6 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-primary/5 transition-all group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm uppercase ${user.role === "admin"
                                                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                            }`}>
                                                            {user.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white text-sm">{user.name}</p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Mail size={10} /> {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === "admin"
                                                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                            : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {user.isVerified ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {processingId === user._id ? (
                                                            <Loader2 size={18} className="animate-spin text-primary" />
                                                        ) : (
                                                            <>
                                                                {/* Approve / Revoke */}
                                                                <button
                                                                    onClick={() => handleToggleVerification(user._id, user.isVerified)}
                                                                    className={`p-2 rounded-xl transition-all ${user.isVerified
                                                                            ? "text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20"
                                                                            : "text-emerald-400 hover:bg-emerald-400/10 border border-transparent hover:border-emerald-400/20"
                                                                        }`}
                                                                    title={user.isVerified ? "Revoke Approval" : "Approve User"}
                                                                >
                                                                    {user.isVerified ? <UserX size={17} /> : <UserCheck size={17} />}
                                                                </button>
                                                                {/* Delete */}
                                                                <button
                                                                    onClick={() => setDeleteConfirm(user._id)}
                                                                    className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all"
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 size={17} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Infrastructure Sidebar */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center px-4">
                            <Settings size={20} className="mr-2 text-primary" /> Infrastructure
                        </h3>
                        <div className="glass-dark p-8 rounded-[2rem] border border-white/5 space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Security</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Lock size={16} className="text-emerald-500" />
                                        <span className="text-xs font-bold text-white">2-Factor Override</span>
                                    </div>
                                    <div className="w-10 h-5 bg-primary/20 rounded-full border border-primary/40 relative">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Mail size={16} className="text-blue-500" />
                                        <span className="text-xs font-bold text-white">SMTP Gateway</span>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-500">CONNECTED</span>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Quick Stats</p>
                                <div className="space-y-3">
                                    {[
                                        { label: "Verified Users", val: users.filter(u => u.isVerified).length, color: "emerald" },
                                        { label: "Blocked Accounts", val: users.filter(u => u.isBlocked).length, color: "red" },
                                        { label: "Total Admins", val: counts.admin, color: "amber" },
                                    ].map(s => (
                                        <div key={s.label} className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">{s.label}</span>
                                            <span className={`text-sm font-black text-${s.color}-400`}>{s.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/5 space-y-3">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Maintenance</p>
                                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-all">
                                    Download Audit Logs
                                </button>
                                <button className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-500/20 transition-all">
                                    Clear Temporary Buffers
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
