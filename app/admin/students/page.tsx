"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Loader2,
    Pencil,
    Ban,
    ShieldCheck,
    AlertCircle,
    X,
    Lock,
    Unlock,
    History,
    Briefcase,
    Calendar,
    Award,
    Trash2
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [editingStudent, setEditingStudent] = useState<any | null>(null);
    const [historyStudent, setHistoryStudent] = useState<any | null>(null);
    const [studentHistory, setStudentHistory] = useState<{ applications: any[], interviews: any[] } | null>(null);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [branchFilter, setBranchFilter] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (student.rollNumber && student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesBranch = branchFilter === "all" || student.branch === branchFilter;
        const matchesVerification = verificationFilter === "all" ||
            (verificationFilter === "verified" ? student.isVerified : !student.isVerified);

        return matchesSearch && matchesBranch && matchesVerification;
    });

    const uniqueBranches = Array.from(new Set(students.map(s => s.branch).filter(Boolean))) as string[];

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/super-admin/users"); // Reuse the same endpoint as it returns all non-super-admins
            const data = await res.json();
            if (res.ok) {
                // Filter specifically for students if needed, or show all for admin to manage
                setStudents(data.filter((u: any) => u.role === 'student'));
            }
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (userId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placementStatus: newStatus }),
            });
            if (res.ok) {
                setStudents(students.map(s => s._id === userId ? { ...s, placementStatus: newStatus } : s));
            }
        } catch (error) {
            console.error("Failed to update placement status:", error);
        }
    };

    const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVerified: !currentStatus }),
            });
            if (res.ok) {
                setStudents(students.map(s => s._id === userId ? { ...s, isVerified: !currentStatus } : s));
            }
        } catch (error) {
            console.error("Failed to update student status:", error);
        }
    };

    const handleToggleBlock = async (userId: string, currentBlockedStatus: boolean) => {
        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isBlocked: !currentBlockedStatus }),
            });
            if (res.ok) {
                setStudents(students.map(s => s._id === userId ? { ...s, isBlocked: !currentBlockedStatus } : s));
            }
        } catch (error) {
            console.error("Failed to toggle block status:", error);
        }
    };

    const handleUpdateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;
        try {
            const res = await fetch(`/api/super-admin/users/${editingStudent._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingStudent),
            });
            if (res.ok) {
                setStudents(students.map(s => s._id === editingStudent._id ? editingStudent : s));
                setEditingStudent(null);
            }
        } catch (error) {
            console.error("Failed to update student data:", error);
        }
    };

    const handleDelete = async (userId: string) => {
        setDeleteConfirm(null);
        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setStudents(prev => prev.filter(s => s._id !== userId));
            } else {
                const data = await res.json();
                console.error("Failed to delete:", data.error);
            }
        } catch (error) {
            console.error("Failed to delete student:", error);
        }
    };

    const fetchStudentHistory = async (student: any) => {
        setHistoryStudent(student);
        setIsHistoryLoading(true);
        try {
            const res = await fetch(`/api/admin/students/${student._id}/history`);
            const data = await res.json();
            if (res.ok) {
                setStudentHistory(data);
            }
        } catch (error) {
            console.error("Failed to fetch student history:", error);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Student Records</h1>
                    <p className="text-gray-400 mt-2">Manage student profiles, performance, and placement eligibility.</p>
                </div>

                <div className="glass-dark rounded-[2.5rem] border border-white/5">
                    <div className="p-8 border-b border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                        <div className="relative w-full xl:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email or roll number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                            <select
                                value={branchFilter}
                                onChange={(e) => setBranchFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-primary transition-all cursor-pointer min-w-[140px]"
                            >
                                <option value="all" className="bg-gray-900">All Branches</option>
                                {uniqueBranches.map(branch => (
                                    <option key={branch} value={branch} className="bg-gray-900">{branch}</option>
                                ))}
                            </select>

                            <select
                                value={verificationFilter}
                                onChange={(e) => setVerificationFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-primary transition-all cursor-pointer min-w-[140px]"
                            >
                                <option value="all" className="bg-gray-900">All Status</option>
                                <option value="verified" className="bg-gray-900">Verified</option>
                                <option value="pending" className="bg-gray-900">Pending</option>
                            </select>

                            {(branchFilter !== "all" || verificationFilter !== "all" || searchQuery !== "") && (
                                <button
                                    onClick={() => {
                                        setBranchFilter("all");
                                        setVerificationFilter("all");
                                        setSearchQuery("");
                                    }}
                                    className="px-4 py-3 text-xs text-gray-400 hover:text-white transition-colors flex items-center"
                                >
                                    <X size={14} className="mr-1" /> Clear
                                </button>
                            )}

                            <button className="flex-1 md:flex-none px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all ml-auto">
                                Export Data
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-20">
                                <Loader2 className="animate-spin text-primary" size={40} />
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center p-20 text-gray-500">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No student records found.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-6">Student</th>
                                        <th className="px-8 py-6">Academic Info</th>
                                        <th className="px-8 py-6">Placement Status</th>
                                        <th className="px-8 py-6">Security</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-primary/5 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center font-bold text-primary">
                                                        {student.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{student.name}</p>
                                                        <p className="text-xs text-gray-500">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-white font-medium">{student.branch || 'N/A'}</p>
                                                    <p className="text-[10px] text-gray-500">CGPA: {student.cgpa || 'N/A'} | Roll: {student.rollNumber || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <select
                                                    value={student.placementStatus || 'unplaced'}
                                                    onChange={(e) => handleStatusUpdate(student._id, e.target.value)}
                                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer ${student.placementStatus === 'placed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        student.placementStatus === 'offered' ? 'bg-blue-500/10 text-blue-500' :
                                                            'bg-gray-500/10 text-gray-500'
                                                        }`}
                                                >
                                                    <option value="unplaced" className="bg-gray-900">Unplaced</option>
                                                    <option value="offered" className="bg-gray-900">Offered</option>
                                                    <option value="placed" className="bg-gray-900">Placed</option>
                                                </select>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${student.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                        <span className="text-[10px] font-medium text-gray-400">{student.isVerified ? 'VERIFIED' : 'PENDING'}</span>
                                                    </div>
                                                    {student.isBlocked && (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                            <span className="text-[10px] font-medium text-red-500 uppercase tracking-tighter flex items-center">
                                                                <Lock size={10} className="mr-1" /> BLOCKED
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === student._id ? null : student._id)}
                                                        className={`p-2 rounded-lg transition-colors ${openMenuId === student._id ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>

                                                    {openMenuId === student._id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-[60]"
                                                                onClick={() => setOpenMenuId(null)}
                                                            />
                                                            <div className="absolute right-0 mt-2 w-48 glass-dark border border-primary/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 z-[70] animate-in fade-in zoom-in duration-200">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingStudent({ ...student });
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-all text-left"
                                                                >
                                                                    <Pencil size={14} className="text-primary" />
                                                                    <span>Edit Profile</span>
                                                                </button>

                                                                <button
                                                                    onClick={() => {
                                                                        fetchStudentHistory(student);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-all text-left"
                                                                >
                                                                    <History size={14} className="text-blue-400" />
                                                                    <span>Placement History</span>
                                                                </button>

                                                                <button
                                                                    onClick={() => {
                                                                        handleToggleVerification(student._id, student.isVerified);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-all text-left"
                                                                >
                                                                    {student.isVerified ? (
                                                                        <>
                                                                            <ShieldCheck size={14} className="text-amber-500" />
                                                                            <span>Revoke Approval</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <CheckCircle size={14} className="text-emerald-500" />
                                                                            <span>Approve Student</span>
                                                                        </>
                                                                    )}
                                                                </button>

                                                                <div className="h-px bg-white/5 my-1" />

                                                                <button
                                                                    onClick={() => {
                                                                        setDeleteConfirm(student._id);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-red-400 hover:bg-red-400/10 transition-all text-left"
                                                                >
                                                                    <Trash2 size={14} />
                                                                    <span>Delete Student</span>
                                                                </button>

                                                                <div className="h-px bg-white/5 my-1" />

                                                                <button
                                                                    onClick={() => {
                                                                        handleToggleBlock(student._id, !!student.isBlocked);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className={`w-full flex items-center space-x-3 px-4 py-2.5 text-xs transition-all text-left ${student.isBlocked
                                                                        ? 'text-emerald-400 hover:bg-emerald-400/10'
                                                                        : 'text-red-400 hover:bg-red-400/10'
                                                                        }`}
                                                                >
                                                                    {student.isBlocked ? (
                                                                        <>
                                                                            <Unlock size={14} />
                                                                            <span>Unblock Student</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Ban size={14} />
                                                                            <span>Block Student</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
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
            </div>

            {/* Edit Student Modal */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg glass-dark border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-xl font-bold text-white">Edit Student Profile</h2>
                                <p className="text-xs text-gray-500 mt-1">Update information for {editingStudent.name}</p>
                            </div>
                            <button
                                onClick={() => setEditingStudent(null)}
                                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateStudent} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        value={editingStudent.name}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        value={editingStudent.email}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Roll Number</label>
                                    <input
                                        type="text"
                                        value={editingStudent.rollNumber || ''}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editingStudent.cgpa || ''}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, cgpa: parseFloat(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Branch</label>
                                    <input
                                        type="text"
                                        value={editingStudent.branch || ''}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, branch: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={editingStudent.dateOfBirth ? new Date(editingStudent.dateOfBirth).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, dateOfBirth: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingStudent(null)}
                                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {historyStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl glass-dark border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[85vh] flex flex-col">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <History size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Placement Journey</h2>
                                    <p className="text-xs text-gray-400 mt-1">Tracks and history for {historyStudent.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setHistoryStudent(null);
                                    setStudentHistory(null);
                                }}
                                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {isHistoryLoading ? (
                                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                                    <Loader2 className="animate-spin text-primary" size={40} />
                                    <p className="text-sm text-gray-500 font-medium tracking-widest uppercase">Fetching Records...</p>
                                </div>
                            ) : studentHistory ? (
                                <>
                                    {/* Application History */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center">
                                            <Briefcase size={14} className="mr-2 text-primary" /> Recent Applications
                                        </h3>
                                        <div className="space-y-3">
                                            {studentHistory.applications.length === 0 ? (
                                                <div className="p-6 rounded-2xl border border-white/5 bg-white/5 text-center text-gray-500 text-sm">
                                                    No applications recorded yet.
                                                </div>
                                            ) : (
                                                studentHistory.applications.map((app: any) => (
                                                    <div key={app._id} className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-gray-400 group-hover:text-primary transition-colors">
                                                                {app.drive?.companyName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{app.drive?.companyName}</p>
                                                                <p className="text-[10px] text-gray-500">{app.drive?.role} • {formatDate(app.appliedAt)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'placed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                                app.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                                }`}>
                                                                {app.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </section>

                                    {/* Interview Timeline */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center">
                                            <Calendar size={14} className="mr-2 text-accent" /> Interview Timeline
                                        </h3>
                                        <div className="space-y-3">
                                            {studentHistory.interviews.length === 0 ? (
                                                <div className="p-6 rounded-2xl border border-white/5 bg-white/5 text-center text-gray-500 text-sm">
                                                    No interview schedules found.
                                                </div>
                                            ) : (
                                                studentHistory.interviews.map((interview: any) => (
                                                    <div key={interview._id} className="p-4 rounded-2xl border border-white/5 bg-white/5 group border-l-4 border-l-primary">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{interview.drive?.companyName}</p>
                                                                <p className="text-xs text-primary font-medium">{interview.interviewer}</p>
                                                            </div>
                                                            <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${interview.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                interview.status === 'scheduled' ? 'bg-blue-500/10 text-blue-500' :
                                                                    'bg-gray-500/10 text-gray-500'
                                                                }`}>
                                                                {interview.status}
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex items-center text-[10px] text-gray-500 space-x-4">
                                                            <span className="flex items-center"><Calendar size={12} className="mr-1" /> {formatDate(interview.startTime)}</span>
                                                            <span className="flex items-center"><Award size={12} className="mr-1" /> {interview.score !== undefined ? `Result: ${interview.score}/10` : 'Result Pending'}</span>
                                                        </div>
                                                        {interview.feedback && (
                                                            <p className="mt-2 p-2 bg-white/5 rounded-lg text-[10px] italic text-gray-400">
                                                                "{interview.feedback}"
                                                            </p>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </section>
                                </>
                            ) : null}
                        </div>

                        <div className="p-6 border-t border-white/5 bg-white/5 text-center">
                            <p className="text-[10px] text-gray-500 font-medium">Placement data is synchronized with live recruitment drives.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-sm glass-dark border border-red-500/20 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                                <Trash2 size={28} className="text-red-400" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-white">Delete Student?</h3>
                                <p className="text-sm text-gray-400">
                                    This action is <span className="text-red-400 font-bold">permanent</span> and cannot be undone. All data for this student will be lost.
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
                </div>
            )}
        </DashboardLayout>
    );
}
