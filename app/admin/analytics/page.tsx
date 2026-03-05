"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Users,
    CheckCircle,
    TrendingUp,
    Award,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell
} from "recharts";

const placementData = [
    { month: "Jan", placed: 28, applied: 45 },
    { month: "Feb", placed: 35, applied: 52 },
    { month: "Mar", placed: 42, applied: 58 },
    { month: "Apr", placed: 51, applied: 68 },
    { month: "May", placed: 63, applied: 75 },
    { month: "Jun", placed: 71, applied: 82 },
];

const packageDistribution = [
    { name: "8-10 LPA", value: 120, color: "#3b82f6" },
    { name: "10-12 LPA", value: 85, color: "#8b5cf6" },
    { name: "12-15 LPA", value: 45, color: "#ec4899" },
    { name: "15+ LPA", value: 28, color: "#f59e0b" },
];

const companyData = [
    { name: "Google", placements: 12 },
    { name: "Microsoft", placements: 10 },
    { name: "Amazon", placements: 15 },
    { name: "Meta", placements: 8 },
    { name: "Apple", placements: 6 },
];

export default function AdminAnalyticsPage() {
    const stats = {
        totalStudents: 842,
        placedStudents: 612,
        pendingApplications: 156,
        activeCompanies: 18,
    };

    const placementRate = ((stats.placedStudents / stats.totalStudents) * 100).toFixed(1);
    const avgPackage = "11.2 LPA";
    const highestPackage = "42 LPA";

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Placement Analytics</h1>
                    <p className="text-gray-400 mt-2">Comprehensive placement statistics and performance metrics.</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Students</p>
                            <Users className="text-blue-500/50" size={20} />
                        </div>
                        <h3 className="text-3xl font-black text-white mt-4">{stats.totalStudents}</h3>
                        <p className="text-xs text-gray-500 mt-2">Enrolled this batch</p>
                    </div>

                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Placed Students</p>
                            <CheckCircle className="text-emerald-500/50" size={20} />
                        </div>
                        <h3 className="text-3xl font-black text-white mt-4">{stats.placedStudents}</h3>
                        <p className="text-xs text-emerald-500 mt-2">{placementRate}% placement rate</p>
                    </div>

                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Avg Package</p>
                            <TrendingUp className="text-amber-500/50" size={20} />
                        </div>
                        <h3 className="text-3xl font-black text-white mt-4">{avgPackage}</h3>
                        <p className="text-xs text-gray-500 mt-2">Average CTC offered</p>
                    </div>

                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Highest Package</p>
                            <Award className="text-yellow-500/50" size={20} />
                        </div>
                        <h3 className="text-3xl font-black text-white mt-4">{highestPackage}</h3>
                        <p className="text-xs text-gray-500 mt-2">Maximum CTC received</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Placement Timeline */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6">Placement Progress</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={placementData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#18181b", border: "1px solid #ffffff10", borderRadius: "12px" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="placed" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 5 }} />
                                    <Line type="monotone" dataKey="applied" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#6366f1", r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Recruiting Companies */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6">Top Recruiting Companies</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={companyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#18181b", border: "1px solid #ffffff10", borderRadius: "12px" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Bar dataKey="placements" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Package Distribution */}
                <div className="glass-dark p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Package Distribution</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={packageDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {packageDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#18181b", border: "1px solid #ffffff10", borderRadius: "12px" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-4 flex flex-col justify-center">
                            {packageDistribution.map((pkg, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pkg.color }}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">{pkg.name}</p>
                                        <p className="text-xs text-gray-500">{pkg.value} students</p>
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
