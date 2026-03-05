"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Loader2, Clock, ChevronLeft, ChevronRight, Send } from "lucide-react";

interface Question {
    _id: string;
    text: string;
    type: "mcq" | "coding";
    options?: string[];
    correctAnswer: string;
}

interface Exam {
    _id: string;
    title: string;
    description: string;
    duration: number;
    questions: Question[];
}

export default function StudentExamPage() {
    const params = useParams();
    const router = useRouter();
    const examId = (params?.id as string) || "";

    const [exam, setExam] = useState<Exam | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchExam = useCallback(async () => {
        if (!examId) return;
        try {
            const res = await fetch(`/api/exams/${examId}`);
            if (!res.ok) throw new Error("Failed to load exam");
            const data: Exam = await res.json();
            setExam(data);
            setTimeRemaining(data.duration * 60);
        } catch (err) {
            console.error("Error loading exam:", err);
            alert("Failed to load exam");
            router.back();
        } finally {
            setIsLoading(false);
        }
    }, [examId, router]);

    const handleSubmitExam = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/exams/${examId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
            });

            if (!res.ok) throw new Error("Failed to submit exam");
            router.push(`/student/tests/${examId}/results`);
        } catch (err) {
            console.error("Error submitting exam:", err);
            alert("Failed to submit exam");
            setIsSubmitting(false);
        }
    }, [examId, answers, router]);

    useEffect(() => {
        fetchExam();
    }, [fetchExam]);

    useEffect(() => {
        if (!exam || timeRemaining <= 0) return;
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    handleSubmitExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [exam, timeRemaining, handleSubmitExam]);


    if (isLoading) {
        return (
            <DashboardLayout role="student">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={48} />
                        <p className="text-gray-400">Loading exam...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!exam) {
        return (
            <DashboardLayout role="student">
                <div className="text-center py-12">
                    <p className="text-red-400">Failed to load exam</p>
                </div>
            </DashboardLayout>
        );
    }

    const currentQuestion = exam.questions?.[currentQuestionIndex];
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAnswerChange = (value: string) => {
        if (currentQuestion) {
            setAnswers({ ...answers, [currentQuestion._id]: value });
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{exam.title}</h1>
                        <p className="text-gray-400 mt-2">{exam.description}</p>
                    </div>
                    <div className="glass-dark p-4 rounded-2xl border border-white/5 flex items-center gap-2">
                        <Clock size={20} className="text-red-500" />
                        <span className="text-xl font-bold text-white">{formatTime(timeRemaining)}</span>
                    </div>
                </div>

                {/* Progress */}
                <div className="glass-dark p-6 rounded-3xl border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-semibold text-white">
                            Question {currentQuestionIndex + 1} of {exam.questions?.length || 1}
                        </p>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            {Math.round(((currentQuestionIndex + 1) / (exam.questions?.length || 1)) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                            style={{ width: `${((currentQuestionIndex + 1) / (exam.questions?.length || 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                {currentQuestion && (
                    <div className="glass-dark p-8 rounded-3xl border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.text}</h2>

                        {currentQuestion.type === "mcq" ? (
                            <div className="space-y-3">
                                {currentQuestion.options?.map((option: string, idx: number) => (
                                    <label
                                        key={idx}
                                        className="flex items-center p-4 rounded-xl border-2 border-white/10 cursor-pointer hover:border-primary/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                                    >
                                        <input
                                            type="radio"
                                            name={currentQuestion._id}
                                            value={option}
                                            checked={answers[currentQuestion._id] === option}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="ml-3 text-white font-medium">{option}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea
                                value={answers[currentQuestion._id] || ""}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                placeholder="Write your answer here..."
                                rows={8}
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all resize-none"
                            />
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center gap-6">
                    <button
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={20} /> Previous
                    </button>

                    <div className="flex gap-2 flex-wrap justify-center">
                        {exam.questions?.map((question: Question, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                    currentQuestionIndex === idx
                                        ? "bg-primary text-white"
                                        : answers[exam.questions[idx]._id]
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "bg-white/10 text-gray-400 hover:bg-white/20"
                                }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    {currentQuestionIndex === (exam.questions?.length || 1) - 1 ? (
                        <button
                            onClick={handleSubmitExam}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-all"
                        >
                            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            Submit Exam
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all"
                        >
                            Next <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
