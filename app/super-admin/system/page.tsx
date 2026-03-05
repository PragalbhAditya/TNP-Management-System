"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Database,
    Shield,
    Users,
    Settings,
    Zap,
    HardDrive,
    AlertCircle,
    CheckCircle,
    Clock,
    Cpu,
    Server,
    BarChart3
} from "lucide-react";

const SystemHealthMetric = ({ label, status, percentage }: { label: string; status: "healthy" | "warning" | "critical"; percentage: number }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-300">{label}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                status === "healthy"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : status === "warning"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-red-500/20 text-red-400"
            }`}>
                {status.toUpperCase()}
            </span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
            <div
                className={`h-full rounded-full transition-all ${
                    status === "healthy"
                        ? "bg-emerald-500"
                        : status === "warning"
                        ? "bg-amber-500"
                        : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);

export default function SuperAdminSystemPage() {
    const systemMetrics = [
        { label: "Database Storage", status: "healthy" as const, percentage: 45 },
        { label: "API Response Time", status: "healthy" as const, percentage: 30 },
        { label: "Server Memory", status: "warning" as const, percentage: 72 },
        { label: "Backup Status", status: "healthy" as const, percentage: 100 },
    ];

    return (
        <DashboardLayout role="super-admin">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Infrastructure & System Settings</h1>
                    <p className="text-gray-400 mt-2">Manage system health, security, and infrastructure resources.</p>
                </div>

                {/* System Health Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Status</p>
                            <CheckCircle className="text-emerald-500" size={20} />
                        </div>
                        <h3 className="text-2xl font-black text-white mt-4">Online</h3>
                        <p className="text-xs text-emerald-500 mt-2">All services operational</p>
                    </div>

                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Uptime</p>
                            <Zap className="text-amber-500/50" size={20} />
                        </div>
                        <h3 className="text-2xl font-black text-white mt-4">99.8%</h3>
                        <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
                    </div>

                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Users</p>
                            <Users className="text-blue-500/50" size={20} />
                        </div>
                        <h3 className="text-2xl font-black text-white mt-4">284</h3>
                        <p className="text-xs text-gray-500 mt-2">Online right now</p>
                    </div>

                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Last Backup</p>
                            <Clock className="text-purple-500/50" size={20} />
                        </div>
                        <h3 className="text-2xl font-black text-white mt-4">2h ago</h3>
                        <p className="text-xs text-green-500 mt-2">Backup successful</p>
                    </div>
                </div>

                {/* Resource Monitoring */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-dark p-8 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <Cpu size={20} className="mr-2 text-primary" /> System Resources
                        </h3>
                        <div className="space-y-6">
                            {systemMetrics.map((metric, i) => (
                                <SystemHealthMetric key={i} {...metric} />
                            ))}
                        </div>
                    </div>

                    <div className="glass-dark p-8 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <Server size={20} className="mr-2 text-primary" /> Services Status
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: "Authentication Service", status: "operational" },
                                { name: "Database Server", status: "operational" },
                                { name: "File Storage", status: "operational" },
                                { name: "Email Service", status: "operational" },
                                { name: "Cache Service", status: "operational" },
                                { name: "Logging Service", status: "operational" }
                            ].map((svc, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-sm font-medium text-gray-300">{svc.name}</p>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-xs text-emerald-500 font-semibold">Operational</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="glass-dark p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <Shield size={20} className="mr-2 text-primary" /> Security & Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-left group">
                            <Database size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-1">Database Backup</h4>
                            <p className="text-xs text-gray-500">Schedule and manage database backups</p>
                        </button>

                        <button className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-left group">
                            <Shield size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-1">Security Audit</h4>
                            <p className="text-xs text-gray-500">Review system security and access logs</p>
                        </button>

                        <button className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-left group">
                            <HardDrive size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-1">Storage Management</h4>
                            <p className="text-xs text-gray-500">Monitor disk usage and cleanup</p>
                        </button>

                        <button className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-left group">
                            <AlertCircle size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-1">Alerts & Notifications</h4>
                            <p className="text-xs text-gray-500">Configure system alerts and thresholds</p>
                        </button>

                        <button className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-left group">
                            <BarChart3 size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-1">System Logs</h4>
                            <p className="text-xs text-gray-500">View detailed system and error logs</p>
                        </button>

                        <button className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-left group">
                            <Settings size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-1">Advanced Settings</h4>
                            <p className="text-xs text-gray-500">Configure advanced infrastructure settings</p>
                        </button>
                    </div>
                </div>

                {/* Recent System Events */}
                <div className="glass-dark p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Recent System Events</h3>
                    <div className="space-y-4">
                        {[
                            { time: "2:45 PM", event: "Database backup completed successfully", type: "success" },
                            { time: "1:30 PM", event: "Server memory usage exceeded 70% threshold", type: "warning" },
                            { time: "12:15 PM", event: "New admin user 'John Smith' registered", type: "info" },
                            { time: "11:00 AM", event: "Scheduled maintenance window completed", type: "success" },
                            { time: "10:30 AM", event: "System auto-scaling triggered", type: "info" }
                        ].map((event, i) => (
                            <div key={i} className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                    event.type === "success"
                                        ? "bg-emerald-500"
                                        : event.type === "warning"
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                }`}></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-300">{event.event}</p>
                                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
