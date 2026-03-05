"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    ScrollText, Search, RefreshCw, Loader2,
    UserCheck, UserX, Trash2, ArrowUpCircle,
    ArrowDownCircle, ShieldOff, Shield, UserPlus,
    Pencil, TrendingUp, ChevronLeft, ChevronRight,
    Filter
} from "lucide-react";
import { formatDate } from "@/lib/utils";

type AuditAction =
    | 'USER_APPROVED' | 'USER_REVOKED' | 'USER_PROMOTED' | 'USER_DEMOTED'
    | 'USER_BLOCKED' | 'USER_UNBLOCKED' | 'USER_DELETED' | 'USER_REGISTERED'
    | 'USER_UPDATED' | 'PLACEMENT_STATUS_CHANGED' | 'DRIVE_CREATED'
    | 'DRIVE_UPDATED' | 'DRIVE_DELETED' | 'APPLICATION_SUBMITTED';

interface AuditLog {
    _id: string;
    action: AuditAction;
    performedBy: { id: string; name: string; email: string; role: string };
    targetUser?: { id: string; name: string; email: string; role: string };
    details?: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

const ACTION_META: Record<AuditAction, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    USER_APPROVED: { label: "Approved", icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    USER_REVOKED: { label: "Revoked", icon: ShieldOff, color: "text-amber-400", bg: "bg-amber-500/10   border-amber-500/20" },
    USER_PROMOTED: { label: "Promoted", icon: ArrowUpCircle, color: "text-purple-400", bg: "bg-purple-500/10  border-purple-500/20" },
    USER_DEMOTED: { label: "Demoted", icon: ArrowDownCircle, color: "text-orange-400", bg: "bg-orange-500/10  border-orange-500/20" },
    USER_BLOCKED: { label: "Blocked", icon: ShieldOff, color: "text-red-400", bg: "bg-red-500/10     border-red-500/20" },
    USER_UNBLOCKED: { label: "Unblocked", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    USER_DELETED: { label: "Deleted", icon: Trash2, color: "text-red-400", bg: "bg-red-500/10     border-red-500/20" },
    USER_REGISTERED: { label: "Registered", icon: UserPlus, color: "text-blue-400", bg: "bg-blue-500/10    border-blue-500/20" },
    USER_UPDATED: { label: "Profile Updated", icon: Pencil, color: "text-gray-400", bg: "bg-white/5        border-white/10" },
    PLACEMENT_STATUS_CHANGED: { label: "Placement Updated", icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10    border-cyan-500/20" },
    DRIVE_CREATED: { label: "Drive Created", icon: UserCheck, color: "text-primary", bg: "bg-primary/10     border-primary/20" },
    DRIVE_UPDATED: { label: "Drive Updated", icon: Pencil, color: "text-gray-400", bg: "bg-white/5        border-white/10" },
    DRIVE_DELETED: { label: "Drive Deleted", icon: Trash2, color: "text-red-400", bg: "bg-red-500/10     border-red-500/20" },
    APPLICATION_SUBMITTED: { label: "Application", icon: UserCheck, color: "text-blue-400", bg: "bg-blue-500/10    border-blue-500/20" },
};

const ALL_ACTIONS = Object.keys(ACTION_META) as AuditAction[];

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
}

const LIMIT = 25;

export default function SuperAdminLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchLogs();
    }, [actionFilter, page]);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                action: actionFilter,
                page: String(page),
                limit: String(LIMIT),
            });
            const res = await fetch(`/api/super-admin/logs?${params}`);
            const data = await res.json();
            if (res.ok) {
                setLogs(data.logs);
                setTotal(data.total);
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            log.performedBy.name.toLowerCase().includes(q) ||
            log.performedBy.email.toLowerCase().includes(q) ||
            log.targetUser?.name.toLowerCase().includes(q) ||
            log.targetUser?.email.toLowerCase().includes(q) ||
            log.details?.toLowerCase().includes(q) ||
            log.action.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <DashboardLayout role="super-admin">
            <div className="space-y-8 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <ScrollText size={20} className="text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
                        </div>
                        <p className="text-gray-400">Complete record of all administrative actions across the system.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 font-medium">{total} total entries</span>
                        <button onClick={() => { setPage(1); fetchLogs(); }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-sm">
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-dark p-4 rounded-2xl border border-white/5 flex flex-wrap gap-3 items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
                        <input
                            type="text"
                            placeholder="Search by actor, target, or action..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary transition-all"
                        />
                    </div>
                    {/* Action filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-gray-500" />
                        <select
                            value={actionFilter}
                            onChange={e => { setActionFilter(e.target.value); setPage(1); }}
                            className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-medium text-white outline-none focus:border-primary cursor-pointer appearance-none"
                        >
                            <option value="all" className="bg-gray-900">All Actions</option>
                            {ALL_ACTIONS.map(a => (
                                <option key={a} value={a} className="bg-gray-900">{ACTION_META[a].label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Log Timeline */}
                <div className="glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-24">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center p-24 space-y-3">
                            <ScrollText size={40} className="text-gray-700 mx-auto" />
                            <p className="text-gray-500 text-sm">No log entries found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {filteredLogs.map(log => {
                                const meta = ACTION_META[log.action] ?? ACTION_META.USER_UPDATED;
                                const Icon = meta.icon;
                                const isExpanded = expandedId === log._id;

                                return (
                                    <div
                                        key={log._id}
                                        className="px-8 py-5 hover:bg-white/[0.02] transition-all cursor-pointer"
                                        onClick={() => setExpandedId(isExpanded ? null : log._id)}
                                    >
                                        <div className="flex items-start gap-5">
                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${meta.bg}`}>
                                                <Icon size={17} className={meta.color} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${meta.bg} ${meta.color}`}>
                                                        {meta.label}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                                        by
                                                    </span>
                                                    <span className={`text-xs font-bold ${log.performedBy.role === 'super-admin' ? 'text-primary' : 'text-amber-400'}`}>
                                                        {log.performedBy.name}
                                                    </span>
                                                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${log.performedBy.role === 'super-admin'
                                                        ? 'bg-primary/10 border-primary/20 text-primary'
                                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                        }`}>
                                                        {log.performedBy.role}
                                                    </span>
                                                </div>

                                                {log.details && (
                                                    <p className="text-sm text-gray-400 mt-1">{log.details}</p>
                                                )}

                                                {/* Expanded metadata */}
                                                {isExpanded && (
                                                    <div className="mt-3 p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs text-gray-500">
                                                        <p><span className="text-gray-400 font-bold">Actor:</span> {log.performedBy.name} &lt;{log.performedBy.email}&gt; [{log.performedBy.role}]</p>
                                                        {log.targetUser && (
                                                            <p><span className="text-gray-400 font-bold">Target:</span> {log.targetUser.name} &lt;{log.targetUser.email}&gt; [{log.targetUser.role}]</p>
                                                        )}
                                                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                            <p><span className="text-gray-400 font-bold">Metadata:</span> {JSON.stringify(log.metadata)}</p>
                                                        )}
                                                        <p><span className="text-gray-400 font-bold">Log ID:</span> {log._id}</p>
                                                        <p><span className="text-gray-400 font-bold">Timestamp:</span> {formatDate(log.createdAt)}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Timestamp */}
                                            <span className="text-xs text-gray-600 flex-shrink-0 mt-1">{timeAgo(log.createdAt)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm text-gray-400">
                            Page <span className="text-white font-bold">{page}</span> of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
