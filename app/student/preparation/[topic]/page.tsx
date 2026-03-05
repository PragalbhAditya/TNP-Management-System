"use client";

import { useState, useEffect, use } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    CheckCircle2,
    XCircle,
    ArrowRight,
    Clock,
    HelpCircle,
    Loader2
} from "lucide-react";

export default function MCQQuizPage({ params }: { params: Promise<{ topic: string }> }) {
    const { topic } = use(params);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (!topic) return;
        fetch(`/api/questions?topic=${topic}`)
            .then(res => res.json())
            .then(data => {
                setQuestions(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [topic]);

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleCheck = () => {
        if (selectedOption === null) return;
        setIsAnswered(true);
        if (selectedOption === questions[currentIndex].correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    if (isLoading) return (
        <DashboardLayout role="student">
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        </DashboardLayout>
    );

    if (questions.length === 0) return (
        <DashboardLayout role="student">
            <div className="text-center py-20">
                <HelpCircle size={64} className="mx-auto text-gray-700 mb-4" />
                <h2 className="text-2xl font-bold text-white">No questions found for this topic</h2>
            </div>
        </DashboardLayout>
    );

    if (showResult) return (
        <DashboardLayout role="student">
            <div className="max-w-2xl mx-auto py-12 text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-primary/20">
                    <CheckCircle2 size={64} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white">Quiz Completed!</h1>
                    <p className="text-gray-400 mt-2">Great job on finishing the practice session.</p>
                </div>
                <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-primary/5 to-transparent">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Your Score</p>
                    <h2 className="text-7xl font-black text-white mt-2">{score} <span className="text-2xl text-gray-600">/ {questions.length}</span></h2>
                </div>
                <button onClick={() => window.location.href = "/student/preparation"} className="px-8 py-4 bg-primary text-white rounded-2xl font-bold">
                    Back to Dashboard
                </button>
            </div>
        </DashboardLayout>
    );

    const currentQuestion = questions[currentIndex];

    return (
        <DashboardLayout role="student">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-400">
                        <Clock size={16} className="mr-2" />
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                    </div>
                    <span className="text-primary font-bold">Topic: {topic}</span>
                </div>

                <div className="glass-dark p-12 rounded-3xl border border-white/5 space-y-12 min-h-[400px]">
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option: string, pIndex: number) => (
                            <button
                                key={pIndex}
                                disabled={isAnswered}
                                onClick={() => handleOptionSelect(pIndex)}
                                className={`p-6 rounded-2xl text-left border text-lg transition-all ${selectedOption === pIndex
                                    ? 'border-primary bg-primary/10 text-white'
                                    : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'
                                    } ${isAnswered && pIndex === currentQuestion.correctAnswer
                                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                                        : ''
                                    } ${isAnswered && selectedOption === pIndex && selectedOption !== currentQuestion.correctAnswer
                                        ? 'border-red-500 bg-red-500/10 text-white'
                                        : ''
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{option}</span>
                                    {isAnswered && pIndex === currentQuestion.correctAnswer && <CheckCircle2 size={20} className="text-emerald-500" />}
                                    {isAnswered && selectedOption === pIndex && selectedOption !== currentQuestion.correctAnswer && <XCircle size={20} className="text-red-500" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    {!isAnswered ? (
                        <button
                            disabled={selectedOption === null}
                            onClick={handleCheck}
                            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            Check Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center"
                        >
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                            <ArrowRight size={20} className="ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
