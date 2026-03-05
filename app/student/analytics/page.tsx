"use client";

import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    BarChart2,
    TrendingUp,
    Target,
    Zap,
    Star,
    Activity,
    Calendar,
    Layers
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

const data = [
    { name: "Mon", score: 65, avg: 40 },
    { name: "Tue", score: 59, avg: 45 },
    { name: "Wed", score: 80, avg: 42 },
    { name: "Thu", score: 81, avg: 48 },
    { name: "Fri", score: 56, avg: 50 },
    { name: "Sat", score: 55, avg: 52 },
    { name: "Sun", score: 40, avg: 55 },
];

export default function AnalyticsPage() {
    return (
        <DashboardLayout role="student">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
                    <p className="text-gray-400 mt-2">Track your progress and compare with class averages.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Current CGPA", value: "8.42", icon: Target, color: "primary" },
                        { label: "Global Rank", value: "#42", icon: Star, color: "amber" },
                        { label: "Active Streak", value: "23", icon: Zap, color: "emerald" },
                        { label: "Assessments", value: "15", icon: Layers, color: "blue" }
                    ].map((stat) => (
                        <div key={stat.label} className="glass-dark p-6 rounded-3xl border border-white/5">
                            <div className="flex justify-between items-start">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                <stat.icon className={`text-${stat.color}-500/50`} size={18} />
                            </div>
                            <h3 className="text-3xl font-black text-white mt-2">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-dark p-8 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-8">Score History</h3>
                        <div className="h-80 w-full overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                    <Area type="monotone" dataKey="avg" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-dark p-8 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-8">Skill Proficiency</h3>
                        <div className="space-y-6">
                            {[
                                { skill: "Data Structures", val: 85, color: "blue" },
                                { skill: "Algorithms", val: 78, color: "purple" },
                                { skill: "Problem Solving", val: 92, color: "emerald" },
                                { skill: "Communication", val: 65, color: "amber" },
                                { skill: "Aptitude", val: 88, color: "red" }
                            ].map(s => (
                                <div key={s.skill} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium">{s.skill}</span>
                                        <span className="text-white font-bold">{s.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${s.color}-500/80 transition-all`} style={{ width: `${s.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
