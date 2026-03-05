"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ChevronLeft, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CreateExamPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [questions, setQuestions] = useState<{ _id: string; text: string; type: string; difficulty: string; topic: string }[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: 60,
        startTime: new Date().toISOString().split('T')[0],
        startTimeHour: "10",
        startTimeMinute: "00",
        questions: [],
        settings: {
            fullscreenRequired: true,
            tabSwitchLimit: 3,
            proctoringEnabled: true,
        },
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch("/api/questions");
            if (res.ok) {
                const data = await res.json();
                setQuestions(data);
            }
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData({
                ...formData,
                settings: {
                    ...formData.settings,
                    [name]: (e.target as HTMLInputElement).checked,
                },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const toggleQuestion = (questionId: string) => {
        setSelectedQuestions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!formData.title.trim()) {
            setError("Exam title is required");
            setIsLoading(false);
            return;
        }

        if (selectedQuestions.length === 0) {
            setError("Please select at least one question");
            setIsLoading(false);
            return;
        }

        try {
            const startDateTime = new Date(
                `${formData.startTime}T${formData.startTimeHour}:${formData.startTimeMinute}:00`
            );

            const examData = {
                title: formData.title,
                description: formData.description,
                duration: parseInt(formData.duration.toString()),
                startTime: startDateTime.toISOString(),
                questions: selectedQuestions,
                settings: formData.settings,
            };

            const res = await fetch("/api/exams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(examData),
            });

            if (res.ok) {
                router.push("/admin/exams");
            } else {
                const data = await res.json();
                setError(data.error || "Failed to create exam");
            }
        } catch (error) {
            console.error("Failed to create exam:", error);
            setError("An error occurred while creating the exam");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto">
                <Link href="/admin/exams" className="flex items-center text-primary hover:text-primary/80 mb-6">
                    <ChevronLeft size={20} className="mr-2" /> Back to Exams
                </Link>

                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Create New Exam</h1>
                    <p className="text-gray-400">Set up a new online examination for your students</p>
                </div>

                {error && (
                    <div className="glass-dark border border-red-500/20 bg-red-500/5 p-6 rounded-3xl flex items-start gap-4 mt-8 mb-8">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="text-red-500 font-bold">Error</h3>
                            <p className="text-red-400 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 mt-8">
                    {/* Basic Information */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="text-xl font-bold text-white">Basic Information</h3>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest">
                                Exam Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., General Aptitude Test 2026"
                                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter exam description..."
                                rows={4}
                                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest">
                                    Start Time
                                </label>
                                <div className="flex gap-3">
                                    <select
                                        name="startTimeHour"
                                        value={formData.startTimeHour}
                                        onChange={handleInputChange}
                                        className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary appearance-none cursor-pointer"
                                    >
                                        {Array.from({ length: 24 }, (_, i) => i).map(i => (
                                            <option key={i} value={String(i).padStart(2, '0')} className="bg-gray-900">
                                                {String(i).padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="startTimeMinute"
                                        value={formData.startTimeMinute}
                                        onChange={handleInputChange}
                                        className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary appearance-none cursor-pointer"
                                    >
                                        {Array.from({ length: 60 }, (_, i) => i).map(i => (
                                            <option key={i} value={String(i).padStart(2, '0')} className="bg-gray-900">
                                                {String(i).padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest">
                                Duration (Minutes)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                min="15"
                                max="480"
                                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="text-xl font-bold text-white">Settings</h3>

                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="fullscreenRequired"
                                checked={formData.settings.fullscreenRequired}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-white/10 accent-primary cursor-pointer"
                            />
                            <span className="text-white font-medium group-hover:text-gray-300 transition-colors">
                                Require Fullscreen Mode
                            </span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="proctoringEnabled"
                                checked={formData.settings.proctoringEnabled}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-white/10 accent-primary cursor-pointer"
                            />
                            <span className="text-white font-medium group-hover:text-gray-300 transition-colors">
                                Enable Proctoring
                            </span>
                        </label>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest">
                                Maximum Tab Switches Allowed
                            </label>
                            <input
                                type="number"
                                name="tabSwitchLimit"
                                value={formData.settings.tabSwitchLimit}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    settings: {
                                        ...formData.settings,
                                        tabSwitchLimit: parseInt(e.target.value),
                                    },
                                })}
                                min="0"
                                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Select Questions */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="text-xl font-bold text-white">Select Questions ({selectedQuestions.length})</h3>

                        {questions.length === 0 ? (
                            <p className="text-gray-400">No questions available. Create questions first.</p>
                        ) : (
                            <div className="max-h-96 overflow-y-auto space-y-3">
                                {questions.map((question) => (
                                    <label key={question._id} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestions.includes(question._id)}
                                            onChange={() => toggleQuestion(question._id)}
                                            className="w-5 h-5 rounded border-white/10 accent-primary cursor-pointer mt-1"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium line-clamp-2">{question.text}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                                <span className="px-2 py-1 rounded bg-white/5 group-hover:bg-white/10">
                                                    {question.type.toUpperCase()}
                                                </span>
                                                <span className="px-2 py-1 rounded bg-white/5 group-hover:bg-white/10">
                                                    {question.difficulty}
                                                </span>
                                                <span className="px-2 py-1 rounded bg-white/5 group-hover:bg-white/10">
                                                    {question.topic}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Link
                            href="/admin/exams"
                            className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            {isLoading ? "Creating..." : "Create Exam"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
