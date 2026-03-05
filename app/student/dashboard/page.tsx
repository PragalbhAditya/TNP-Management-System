"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
    Users,
    FileCheck,
    Award,
    Briefcase,
    ArrowUpRight,
    ChevronRight,
    TrendingUp,
    Clock,
    User,
    CheckCircle
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import NoticePanel from "@/components/dashboard/NoticePanel";
import Link from "next/link";

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [drives, setDrives] = useState<any[]>([]);
    const [isLoadingDrives, setIsLoadingDrives] = useState(true);

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Fetch Drives
        fetch("/api/drives")
            .then(res => res.json())
            .then(data => {
                setDrives(data);
                setIsLoadingDrives(false);
            })
            .catch(() => setIsLoadingDrives(false));

        // Fetch Profile
        fetch("/api/student/profile")
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Profile fetch error:", err));
    }, []);

    const isProfileComplete = user?.rollNumber && user?.branch && user?.contact && user?.cgpa;

    return (
        <DashboardLayout role="student">
            <div className="space-y-8 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            Hey {session?.user?.name?.split(' ')[0]} 👋
                        </h1>
                        <p className="text-gray-400 mt-2">Ready to level up your career today?</p>
                    </div>
                    <div className="flex space-x-2">
                        <div className="glass-dark px-4 py-2 rounded-xl border border-white/5 flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <Clock size={14} className="mr-2 text-primary" /> 23 Days to Next Drive
                        </div>
                    </div>
                </div>

                {/* Hero Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`md:col-span-2 glass-dark p-10 rounded-[2.5rem] border relative overflow-hidden group transition-all ${!isProfileComplete ? "border-amber-500/20 bg-amber-500/5" : "border-white/5 bg-gradient-to-br from-primary/20 via-transparent to-transparent"
                        }`}>
                        <div className="relative z-10 space-y-6 max-w-lg">
                            {!isProfileComplete ? (
                                <>
                                    <h2 className="text-3xl font-bold text-white leading-tight">Complete your <span className="text-amber-500">Placement Profile</span></h2>
                                    <p className="text-gray-400 font-medium">Your academic details and contact info are required to apply for upcoming placement drives.</p>
                                    <Link href="/student/profile" className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/20">
                                        Setup Profile <ChevronRight size={18} className="ml-1" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold text-white leading-tight">Your profile is <span className="text-emerald-500 font-black italic">Verified</span> & Ready</h2>
                                    <p className="text-gray-400 font-medium font-mono text-sm tracking-tighter">You are eligible to apply for all active placement drives. Keep your skills updated!</p>
                                    <Link href="/student/drives" className="inline-flex items-center px-6 py-3 bg-white text-black rounded-2xl font-bold hover:scale-105 transition-all">
                                        Explore Jobs <Briefcase size={18} className="ml-2" />
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className={`absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-[100px] transition-all ${!isProfileComplete ? "bg-amber-500/10" : "bg-primary/20"
                            }`}></div>
                    </div>

                    <NoticePanel />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Drives */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <Briefcase size={20} className="mr-2 text-primary" /> Active Opportunities
                            </h3>
                            <Link href="/student/drives" className="text-sm font-bold text-gray-500 hover:text-white transition-all">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {isLoadingDrives ? (
                                [1, 2].map(i => <div key={i} className="glass-dark h-24 rounded-3xl animate-pulse bg-white/5"></div>)
                            ) : drives.length === 0 ? (
                                <div className="glass-dark p-12 text-center rounded-3xl border border-white/5">
                                    <p className="text-gray-500">No active opportunities found.</p>
                                </div>
                            ) : (
                                drives.slice(0, 2).map((drive) => (
                                    <div key={drive._id} className="glass-dark p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-xl text-white group-hover:bg-primary/10 transition-colors uppercase">
                                                {drive.companyName[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{drive.companyName}</h4>
                                                <p className="text-xs text-gray-500">{drive.role} • {drive.package}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {drive.status === 'expired' ? (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                                                    Expired
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center">
                            <TrendingUp size={20} className="mr-2 text-primary" /> Progress Overview
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="glass-dark p-6 rounded-3xl border border-white/5 flex items-center space-x-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                                    <FileCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">12</p>
                                    <p className="text-xs text-gray-500">Applied Drives</p>
                                </div>
                            </div>
                            <div className="glass-dark p-6 rounded-3xl border border-white/5 flex items-center space-x-4">
                                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">1,240</p>
                                    <p className="text-xs text-gray-500">Total Points</p>
                                </div>
                            </div>
                            <div className="glass-dark p-6 rounded-3xl border border-white/5 flex items-center space-x-4">
                                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">4</p>
                                    <p className="text-xs text-gray-500">Skill Badges</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
