"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    FileText,
    Plus,
    MoreVertical,
    Play,
    Clock,
    Settings,
    Trash2,
    Edit2,
    Loader2,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function AdminExamsPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/exams");
            if (res.ok) {
                const data = await res.json();
                setExams(data);
            } else {
                setError("Failed to fetch exams");
            }
        } catch (error) {
            console.error("Failed to fetch exams:", error);
            setError("Failed to fetch exams");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (examId: string) => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/exams/${examId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setExams(exams.filter(e => e._id !== examId));
                setDeleteId(null);
            } else {
                alert("Failed to delete exam");
            }
        } catch (error) {
            console.error("Failed to delete exam:", error);
            alert("Failed to delete exam");
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatus = (exam: any) => {
        const now = new Date();
        const startTime = new Date(exam.startTime);
        const endTime = new Date(startTime.getTime() + exam.duration * 60000);

        if (now >= startTime && now < endTime) {
            return { status: "live", label: "Live" };
        } else if (now < startTime) {
            return { status: "scheduled", label: "Scheduled" };
        } else {
            return { status: "completed", label: "Completed" };
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout role="admin">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Online Examinations</h1>
                        <p className="text-gray-400 mt-2">Create and monitor online assessments for students.</p>
                    </div>
                    <Link
                        href="/admin/exams/create"
                        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center"
                    >
                        <Plus size={20} className="mr-2" /> Create Exam
                    </Link>
                </div>

                {error && (
                    <div className="glass-dark border border-red-500/20 bg-red-500/5 p-6 rounded-3xl flex items-center gap-4">
                        <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-red-500 font-bold">Error</h3>
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {exams.length === 0 ? (
                    <div className="glass-dark rounded-[2.5rem] border border-white/5 p-12 text-center">
                        <FileText className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white mb-2">No Exams Created Yet</h3>
                        <p className="text-gray-400 mb-6">Create your first online examination to get started.</p>
                        <Link
                            href="/admin/exams/create"
                            className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all"
                        >
                            Create First Exam
                        </Link>
                    </div>
                ) : (
                    <div className="glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-500 text-xs uppercase tracking-widest font-black">
                                <tr>
                                    <th className="px-8 py-6">Exam Details</th>
                                    <th className="px-8 py-6">Duration</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {exams.map((exam) => {
                                    const { status, label } = getStatus(exam);
                                    return (
                                        <tr key={exam._id} className="hover:bg-white/5 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-white/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white">{exam.title}</h4>
                                                        <p className="text-xs text-gray-500 mt-1">{exam.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center text-sm text-gray-300">
                                                    <Clock size={16} className="mr-2 text-primary" />
                                                    {exam.duration} mins
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${status === 'live' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse' :
                                                    status === 'scheduled' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                        'bg-white/5 text-gray-500'
                                                    }`}>
                                                    {label}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={`/admin/exams/${exam._id}/edit`}
                                                        className="p-2 bg-white/5 text-gray-500 rounded-lg hover:text-white hover:bg-white/10 transition-all"
                                                        title="Edit exam"
                                                    >
                                                        <Edit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(exam._id)}
                                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                                                        title="Delete exam"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-3xl">
                        <div className="glass-dark rounded-3xl border border-white/5 p-8 max-w-md">
                            <h3 className="text-xl font-bold text-white mb-4">Delete Exam?</h3>
                            <p className="text-gray-400 mb-6">This action cannot be undone. All associated data will be permanently deleted.</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteId && handleDelete(deleteId)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
