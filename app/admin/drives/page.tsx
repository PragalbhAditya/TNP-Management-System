"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import {
    Plus,
    MoreVertical,
    Trash2,
    Edit,
    Users,
    Calendar,
    Building2,
    Search
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminDrivesPage() {
    const [drives, setDrives] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        fetch("/api/drives")
            .then((res) => res.json())
            .then((data) => {
                setDrives(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const filteredDrives = drives.filter(drive => {
        const matchesSearch = drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            drive.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || drive.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this drive?")) return;
        try {
            await fetch(`/api/drives/${id}`, { method: "DELETE" });
            setDrives(drives.filter((d) => d._id !== id));
        } catch (error) {
            alert("Failed to delete drive");
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Placement Drives</h1>
                        <p className="text-gray-400 mt-2">Create and manage recruitment drives for the campus.</p>
                    </div>
                    <Link
                        href="/admin/drives/create"
                        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center w-full md:w-auto justify-center"
                    >
                        <Plus size={20} className="mr-2" /> Create Drive
                    </Link>
                </div>

                {/* Search & Filter */}
                <div className="glass-dark p-6 rounded-3xl border border-white/5 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[300px] flex items-center bg-white/5 rounded-2xl px-5 py-3.5 border border-white/5">
                        <Search size={20} className="text-gray-500 mr-3" />
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-gray-600"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary transition-all cursor-pointer min-w-[160px]"
                    >
                        <option value="all" className="bg-gray-900">All Status</option>
                        <option value="upcoming" className="bg-gray-900">Upcoming</option>
                        <option value="ongoing" className="bg-gray-900">Ongoing</option>
                        <option value="expired" className="bg-gray-900">Expired</option>
                        <option value="completed" className="bg-gray-900">Completed</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="glass-dark h-64 rounded-2xl animate-pulse bg-white/5"></div>
                        ))
                    ) : filteredDrives.length === 0 ? (
                        <div className="col-span-full glass-dark p-20 text-center rounded-[2.5rem] border border-white/5">
                            <Building2 size={48} className="mx-auto text-gray-700 mb-6 opacity-20" />
                            <h3 className="text-xl font-bold text-white mb-2">{searchQuery || statusFilter !== 'all' ? "No Matches Found" : "No active drives found"}</h3>
                            <p className="text-gray-500">
                                {searchQuery || statusFilter !== 'all'
                                    ? "Try adjusting your search criteria or filters."
                                    : "Start by clicking the 'Create Drive' button to add your first recruitment drive!"}
                            </p>
                        </div>
                    ) : (
                        filteredDrives.map((drive) => (
                            <div key={drive._id} className="glass-dark p-6 rounded-3xl border border-white/5 flex flex-col justify-between group hover:border-primary/20 transition-all">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xl">
                                            {drive.companyName[0]}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/admin/drives/${drive._id}/edit`}
                                                className="p-2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(drive._id)}
                                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{drive.companyName}</h3>
                                    <p className="text-primary text-sm font-medium mt-1">{drive.role}</p>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar size={14} className="mr-2" />
                                            <span>Drive Date: {formatDate(drive.driveDate)}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Users size={14} className="mr-2" />
                                            <span>Eligible: CGPA {drive.eligibility.minCgpa}+</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                    <div className="space-y-2">
                                        <span className="block text-lg font-bold text-white">{drive.package}</span>
                                        <Link
                                            href={`/admin/drives/${drive._id}/applications`}
                                            className="inline-flex items-center text-[11px] font-semibold text-primary hover:text-primary/80"
                                        >
                                            <Users size={14} className="mr-1" /> View Applicants
                                        </Link>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${drive.status === 'upcoming' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                        drive.status === 'ongoing' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                            drive.status === 'expired' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                'bg-gray-500/10 text-gray-500'
                                        }`}>
                                        {drive.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
