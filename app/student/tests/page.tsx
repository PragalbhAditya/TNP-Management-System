"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileText, Clock, Play, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function StudentTestsPage() {
    const [exams, setExams] = useState<{ _id: string; title: string; description: string; startTime: string; duration: number; questions: { _id: string }[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

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

    const getStatus = (exam: { startTime: string; duration: number }) => {
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <DashboardLayout role="student">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Online Examinations</h1>
                    <p className="text-gray-400 mt-2">Take online assessments and improve your skills</p>
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
                        <h3 className="text-xl font-bold text-white mb-2">No Exams Available</h3>
                        <p className="text-gray-400">Check back later for available exams.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => {
                            const { status, label } = getStatus(exam);
const isActive = status === "live";
                            const isUpcoming = status === "scheduled";

                            return (
                                <div
                                    key={exam._id}
                                    className="glass-dark rounded-3xl border border-white/5 p-6 hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-white/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                                            <FileText size={24} />
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${
                                            status === 'live' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse' :
                                            status === 'scheduled' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                'bg-white/5 text-gray-500'
                                        }`}>
                                            {label}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{exam.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{exam.description}</p>

                                    <div className="space-y-2 mb-6 text-sm text-gray-400">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center">
                                                <Clock size={14} className="mr-2 text-primary" />
                                                Duration
                                            </span>
                                            <span className="text-white font-semibold">{exam.duration} mins</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Questions</span>
                                            <span className="text-white font-semibold">{exam.questions.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Start Time</span>
                                            <span className="text-white font-semibold text-xs">{formatDate(exam.startTime)}</span>
                                        </div>
                                    </div>

                                    {isActive && (
                                        <Link
                                            href={`/student/tests/${exam._id}`}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            <Play size={16} /> Start Exam
                                        </Link>
                                    )}
                                    {isUpcoming && (
                                        <div className="w-full px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 text-center">
                                            Coming Soon
                                        </div>
                                    )}
                                    {status === "completed" && (
                                        <Link
                                            href={`/student/tests/${exam._id}/results`}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all text-center"
                                        >
                                            View Results
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
