"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

interface Question {
    questionText: string;
    type: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    options?: string[];
}

interface ExamResult {
    examTitle: string;
    correctAnswers: number;
    totalQuestions: number;
    completedAt: string;
    questions: Question[];
}

export default function StudentExamResultsPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params?.id as string;

    const [result, setResult] = useState<ExamResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchResults = useCallback(async () => {
        if (!examId) return;
        try {
            const res = await fetch(`/api/exams/${examId}/results`);
            if (!res.ok) throw new Error("Failed to load results");
            const data: ExamResult = await res.json();
            setResult(data);
        } catch (err) {
            console.error("Error loading results:", err);
            alert("Failed to load results");
        } finally {
            setIsLoading(false);
        }
    }, [examId]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);


    if (isLoading) {
        return (
            <DashboardLayout role="student">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={48} />
                        <p className="text-gray-400">Loading results...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!result) {
        return (
            <DashboardLayout role="student">
                <div className="text-center py-12">
                    <p className="text-red-400">Failed to load results</p>
                </div>
            </DashboardLayout>
        );
    }

    const { totalQuestions = 0, correctAnswers = 0, examTitle = "Exam", questions = [] } = result;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return (
        <DashboardLayout role="student">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                {/* Score Card */}
                <div className="glass-dark p-12 rounded-3xl border border-white/5 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">{examTitle}</h1>
                    <p className="text-gray-400 mb-8">Exam Completed</p>

                    <div className="mb-8">
                        <div className="relative w-40 h-40 mx-auto mb-6">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#ffffff10"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    strokeDasharray={`${(percentage / 100) * 283} 283`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient
                                        id="gradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-4xl font-black text-white">{percentage}%</p>
                                <p className="text-xs text-gray-500 mt-1">Score</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div>
                            <p className="text-2xl font-black text-white">{correctAnswers}</p>
                            <p className="text-xs text-emerald-500 font-semibold mt-1">Correct</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{totalQuestions - correctAnswers}</p>
                            <p className="text-xs text-red-500 font-semibold mt-1">Incorrect</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{totalQuestions}</p>
                            <p className="text-xs text-gray-500 font-semibold mt-1">Total</p>
                        </div>
                    </div>

                    <div className={`inline-block px-6 py-3 rounded-2xl font-bold ${
                        percentage >= 75
                            ? "bg-emerald-500/20 text-emerald-400"
                            : percentage >= 50
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-red-500/20 text-red-400"
                    }`}>
                        {percentage >= 75 ? "Excellent!" : percentage >= 50 ? "Good effort!" : "Keep practicing!"}
                    </div>
                </div>

                {/* Detailed Answers */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Detailed Review</h2>
                    {questions.map((q: Question, idx: number) => {
                        const isCorrect = q.isCorrect;
                        return (
                            <div
                                key={idx}
                                className={`glass-dark p-6 rounded-2xl border-2 transition-all ${
                                    isCorrect
                                        ? "border-emerald-500/30 bg-emerald-500/5"
                                        : "border-red-500/30 bg-red-500/5"
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {isCorrect ? (
                                        <CheckCircle className="text-emerald-500 flex-shrink-0" size={24} />
                                    ) : (
                                        <XCircle className="text-red-500 flex-shrink-0" size={24} />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white mb-3">
                                            Q{idx + 1}: {q.questionText}
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            {q.type === "mcq" && q.options ? (
                                                <>
                                                    <p className="text-gray-400">Your Answer:</p>
                                                    <p className={isCorrect ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                                                        {q.userAnswer || "Not answered"}
                                                    </p>
                                                    {!isCorrect && (
                                                        <>
                                                            <p className="text-gray-400 mt-2">Correct Answer:</p>
                                                            <p className="text-emerald-400 font-semibold">{q.correctAnswer}</p>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-gray-400">Your Answer:</p>
                                                    <p className="text-white font-mono text-xs bg-white/5 p-3 rounded border border-white/10 max-h-24 overflow-y-auto">
                                                        {q.userAnswer || "Not answered"}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/student/tests")}
                        className="flex-1 px-6 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
                    >
                        Back to Exams
                    </button>
                    <button
                        onClick={() => router.push("/student/dashboard")}
                        className="flex-1 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
