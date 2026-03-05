"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Building2,
    Search,
    Filter,
    ArrowRight,
    Clock,
    ShieldCheck
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentDrivesPage() {
    const [drives, setDrives] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/drives").then(res => res.json()),
            fetch("/api/applications").then(res => res.json())
        ]).then(([drivesData, appsData]) => {
            setDrives(drivesData);
            setApplications(appsData);
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }, []);

    const filteredDrives = drives.filter(drive => {
        const matchesSearch = drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            drive.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || drive.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleApply = async (driveId: string) => {
        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ driveId }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Applied successfully!");
                setApplications([...applications, data]);
            } else {
                alert(data.error || "Failed to apply");
            }
        } catch (error) {
            alert("Error applying to drive");
        }
    };

    const isApplied = (driveId: string) => applications.some(app => app.drive._id === driveId || app.drive === driveId);

    return (
        <DashboardLayout role="student">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Placement Drives</h1>
                    <p className="text-gray-400 mt-2">Explore and apply to active recruitment opportunities.</p>
                </div>

                {/* Search & Filter */}
                <div className="glass-dark p-6 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[300px] flex items-center bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none px-3 text-sm w-full text-white"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary transition-all cursor-pointer"
                    >
                        <option value="all" className="bg-gray-900">All Status</option>
                        <option value="upcoming" className="bg-gray-900">Upcoming</option>
                        <option value="ongoing" className="bg-gray-900">Ongoing</option>
                        <option value="expired" className="bg-gray-900">Expired</option>
                    </select>
                </div>

                {/* Drives List */}
                <div className="space-y-6">
                    {isLoading ? (
                        [1, 2].map(i => <div key={i} className="glass-dark h-40 rounded-2xl animate-pulse bg-white/5"></div>)
                    ) : filteredDrives.length === 0 ? (
                        <div className="glass-dark p-20 text-center rounded-3xl border border-white/5">
                            <Building2 size={64} className="mx-auto text-gray-700 mb-6" />
                            <h3 className="text-xl font-bold text-white">{searchQuery || statusFilter !== 'all' ? "No matches found" : "No active drives at the moment"}</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
                        </div>
                    ) : (
                        filteredDrives.map((drive) => (
                            <div key={drive._id} className="glass-dark p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                                <div className="flex items-center space-x-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-2xl text-white group-hover:bg-primary/10 transition-colors">
                                        {drive.companyName[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{drive.companyName}</h3>
                                        <p className="text-gray-400 font-medium">{drive.role}</p>
                                        <div className="flex flex-wrap gap-3 mt-3">
                                            <span className="flex items-center text-xs text-gray-500 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                <Clock size={12} className="mr-1.5" /> Deadline: {formatDate(drive.applicationDeadline)}
                                            </span>
                                            <span className="flex items-center text-xs text-emerald-500/80 px-3 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                                <ShieldCheck size={12} className="mr-1.5" /> Eligible: {drive.eligibility.minCgpa}+ CGPA
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-8 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                                    <div className="text-right flex-1 md:flex-none">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">Package</p>
                                        <p className="text-xl font-bold text-white">{drive.package}</p>
                                    </div>
                                    {isApplied(drive._id) ? (
                                        <button disabled className="px-8 py-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold cursor-not-allowed min-w-[140px]">
                                            Applied
                                        </button>
                                    ) : drive.status === 'expired' ? (
                                        <button disabled className="px-8 py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold cursor-not-allowed min-w-[140px]">
                                            Deadline Passed
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleApply(drive._id)}
                                            className="px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center group/btn min-w-[140px] justify-center"
                                        >
                                            Apply Now <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
