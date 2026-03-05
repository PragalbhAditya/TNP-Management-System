"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Book,
    Code,
    BarChart,
    ChevronRight,
    Brain,
    Zap,
    CheckCircle2,
    Users
} from "lucide-react";

const TopicCard = ({ title, count, icon: Icon, color }: any) => (
    <button className="glass-dark p-6 rounded-3xl border border-white/5 hover:border-primary/50 transition-all text-left flex items-center space-x-6 group">
        <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
            <Icon size={32} />
        </div>
        <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-500">{count} practicing now</p>
        </div>
        <ChevronRight size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
    </button>
);

export default function PreparationPage() {
    return (
        <DashboardLayout role="student">
            <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Placement Preparation</h1>
                        <p className="text-gray-400 mt-2 text-lg">Master the skills required for top-tier companies.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass-dark px-6 py-3 rounded-2xl border border-white/5 flex items-center space-x-3">
                            <Zap size={20} className="text-amber-500" />
                            <span className="text-white font-bold">42 Day Streak</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <TopicCard title="Coding Practice" count="1.2k" icon={Code} color="blue" />
                    <TopicCard title="Aptitude & Reasoning" count="850" icon={Brain} color="purple" />
                    <TopicCard title="Technical MCQ" count="640" icon={Book} color="emerald" />
                    <TopicCard title="Mock Interviews" count="320" icon={Users} color="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <section className="lg:col-span-2 glass-dark rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-8 border-b border-white/5">
                            <h2 className="text-2xl font-bold text-white">Recommended Companies</h2>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: "Google", topics: ["DSA", "System Design"], color: "blue" },
                                { name: "TCS Ninja", topics: ["Aptitude", "C/C++"], color: "red" },
                                { name: "Accenture", topics: ["Verbal", "Critical Thinking"], color: "purple" },
                                { name: "Amazon", topics: ["DSA", "OS/DBMS"], color: "amber" }
                            ].map((company) => (
                                <div key={company.name} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-lg font-bold text-white">{company.name}</h4>
                                        <div className={`w-2 h-2 rounded-full bg-${company.color}-500`}></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {company.topics.map(t => (
                                            <span key={t} className="text-[10px] uppercase font-bold text-gray-500 px-2 py-1 bg-white/5 rounded-md">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-dark p-8 rounded-3xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-6">Recent Achievements</h2>
                        <div className="space-y-6">
                            {[
                                "Completed Array Challenge",
                                "Scored 90% in Logical Quiz",
                                "Unlocked 'Greedy' Badge",
                                "Solved 50+ Easy Problems"
                            ].map((note, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="mt-1">
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium">{note}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}
