import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Users,
    Building2,
    CalendarCheck,
    TrendingUp,
    ArrowUpRight
} from "lucide-react";

const QuickAction = ({ title, desc, icon: Icon }: any) => (
    <button className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-all text-left group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Icon size={24} />
            </div>
            <ArrowUpRight size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </button>
);

export default function AdminDashboard() {
    return (
        <DashboardLayout role="admin">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Control Panel</h1>
                        <p className="text-gray-400 mt-2">Overseeing campus recruitment drives and student performance.</p>
                    </div>
                    <button className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                        + New Placement Drive
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuickAction title="Total Students" desc="842 registered students" icon={Users} />
                    <QuickAction title="Active Companies" desc="18 ongoing drives" icon={Building2} />
                    <QuickAction title="Interviews Today" desc="12 scheduled slots" icon={CalendarCheck} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {[
                                "Google shortlist published for Batch 2026",
                                "Microsoft updated their eligibility criteria",
                                "New technical test scheduled for Tomorrow at 10 AM",
                                "Recruiter registration approved: NVIDIA"
                            ].map((activity, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                    <div>
                                        <p className="text-sm text-gray-300">{activity}</p>
                                        <p className="text-xs text-gray-500 mt-1">{i + 1}h ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/10 font-semibold text-white">
                            Placement Statistics
                        </div>
                        <div className="p-12 flex flex-col items-center justify-center space-y-4">
                            {/* Visual placeholder for chart */}
                            <div className="w-full h-48 bg-white/5 rounded-xl border border-white/5 border-dashed flex items-center justify-center text-gray-500">
                                Analytics Chart Placeholder
                            </div>
                            <p className="text-sm text-gray-400">72% of students placed in Phase 1</p>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}
