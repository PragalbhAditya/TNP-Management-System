"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    FileText,
    Code,
    Users,
    Settings,
    LogOut,
    Bell,
    BellRing,
    Search,
    ShieldCheck,
    Building2,
    UserCheck,
    Crown,
    ScrollText,
    Menu,
    X
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
    href: string;
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const SidebarItem = ({ href, icon: Icon, label, active, onClick }: SidebarItemProps) => (
    <Link
        href={href}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active
            ? "bg-primary text-white shadow-lg shadow-primary/20"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
    >
        <Icon size={20} />
        <span className="font-medium text-sm md:text-base">{label}</span>
    </Link>
);

export default function DashboardLayout({
    children,
    role,
}: {
    children: React.ReactNode;
    role: "student" | "admin" | "super-admin";
}) {
    const { data: session } = useSession();
    const pathname = usePathname();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // notification states (student only)
    const [notifications, setNotifications] = useState<{
        _id: string;
        title: string;
        content: string;
        createdAt: string;
    }[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/student/notices");
            if (!res.ok) return;
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to load notifications", err);
        }
    };

    useEffect(() => {
        if (session?.user?.role === "student") {
            fetchNotifications();
            const iv = setInterval(fetchNotifications, 30000);
            return () => clearInterval(iv);
        }
    }, [session?.user?.role]);

    // click outside to close dropdown
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const menuItems = {
        student: [
            { href: "/student/dashboard", icon: LayoutDashboard, label: "Overview" },
            { href: "/student/drives", icon: Users, label: "Placements" },
            { href: "/student/coding", icon: Code, label: "Coding Practice" },
            { href: "/student/tests", icon: FileText, label: "Exams" },
            { href: "/student/profile", icon: Settings, label: "Profile" },
        ],
        admin: [
            { href: "/admin/dashboard", icon: LayoutDashboard, label: "Admin Console" },
            { href: "/admin/drives", icon: Building2, label: "Manage Drives" },
            { href: "/admin/exams", icon: FileText, label: "Exam Control" },
            { href: "/admin/students", icon: Users, label: "Student Records" },
            { href: "/admin/approvals", icon: UserCheck, label: "Approvals" },
            { href: "/admin/analytics", icon: Settings, label: "Analytics" },
        ],
        "super-admin": [
            { href: "/super-admin/dashboard", icon: LayoutDashboard, label: "Overview" },
            { href: "/super-admin/admins", icon: Crown, label: "Admin Records" },
            { href: "/super-admin/logs", icon: ScrollText, label: "Audit Logs" },
            { href: "/admin/drives", icon: Building2, label: "Manage Drives" },
            { href: "/admin/exams", icon: FileText, label: "Exam Control" },
            { href: "/admin/students", icon: Users, label: "Student Records" },
            { href: "/admin/approvals", icon: UserCheck, label: "Approvals" },
            { href: "/super-admin/system", icon: Settings, label: "Infrastructure" },
        ],
    };

    const effectiveRole = (session?.user as any)?.role || role;
    const currentMenuItems = menuItems[effectiveRole as keyof typeof menuItems] || menuItems[role] || [];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar Backdrop (Mobile only) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-72 h-full border-r border-white/5 flex flex-col p-6 space-y-8 glass-dark z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">N</div>
                        <span className="text-xl font-bold tracking-tight">NCE T&P</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                    {currentMenuItems.map((item) => (
                        <SidebarItem
                            key={`${item.label}-${item.href}`}
                            {...item}
                            active={pathname === item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/5">
                    <button
                        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all w-full"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto flex flex-col">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 glass sticky top-0 z-10 shrink-0">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5"
                        >
                            <Menu size={22} />
                        </button>

                        <div className="hidden md:flex items-center bg-white/5 rounded-xl px-4 py-2 w-64 lg:w-96 border border-white/5 focus-within:border-primary transition-all">
                            <Search size={18} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none px-3 text-sm w-full text-white placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-6">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications((v) => !v)}
                                className="relative p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5"
                            >
                                <Bell size={20} />
                                {notifications.length > 0 && !showNotifications && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0a0a0a]"></span>
                                )}
                            </button>
                            {showNotifications && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-3 w-72 md:w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                                >
                                    <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                                            Campus Notices
                                        </p>
                                        {notifications.length === 0 ? (
                                            <div className="text-gray-400 flex flex-col items-center py-4">
                                                <BellRing size={24} className="mb-2 text-gray-600" />
                                                <p className="text-sm">No new notices.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                                {notifications.map((notice) => (
                                                    <div
                                                        key={notice._id}
                                                        className="pb-4 border-b border-white/5 last:border-b-0"
                                                    >
                                                        <h3 className="text-sm font-bold text-white leading-tight">
                                                            {notice.title}
                                                        </h3>
                                                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                                            {notice.content}
                                                        </p>
                                                        <p className="text-gray-500 text-[10px] mt-2">
                                                            {format(
                                                                new Date(notice.createdAt),
                                                                "PPP"
                                                            )}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 pl-2 md:pl-0">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-bold text-white leading-none mb-1">{session?.user?.name || "User"}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-white/10 flex-shrink-0"></div>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
