"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Loader2, Users, ArrowLeft, Calendar, School, Mail, Download, SlidersHorizontal } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DriveApplicantsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [applications, setApplications] = useState<any[]>([]);
    const [drive, setDrive] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showColumnPicker, setShowColumnPicker] = useState(false);

    const ALL_FIELDS = [
        { key: "applicationId", label: "Application ID", getter: (app: any, driveData: any) => app._id },
        { key: "appliedAt", label: "Applied At", getter: (app: any) => (app.appliedAt ? new Date(app.appliedAt).toISOString() : "") },
        { key: "status", label: "Status", getter: (app: any) => app.status },
        { key: "driveCompany", label: "Drive Company", getter: (_app: any, driveData: any) => driveData?.companyName || "" },
        { key: "driveRole", label: "Drive Role", getter: (_app: any, driveData: any) => driveData?.role || "" },
        { key: "studentId", label: "Student ID", getter: (app: any) => app.student?._id || "" },
        { key: "name", label: "Name", getter: (app: any) => app.student?.name || "" },
        { key: "email", label: "Email", getter: (app: any) => app.student?.email || "" },
        { key: "rollNumber", label: "Roll Number", getter: (app: any) => app.student?.rollNumber || "" },
        { key: "registrationNumber", label: "Registration Number", getter: (app: any) => app.student?.registrationNumber || "" },
        { key: "branch", label: "Branch", getter: (app: any) => app.student?.branch || "" },
        { key: "course", label: "Course", getter: (app: any) => app.student?.course || "" },
        { key: "passingYear", label: "Passing Year", getter: (app: any) => app.student?.passingYear ?? "" },
        { key: "cgpa", label: "CGPA", getter: (app: any) => app.student?.cgpa ?? "" },
        { key: "backlogs", label: "Backlogs", getter: (app: any) => app.student?.backlogs ?? "" },
        { key: "activeBacks", label: "Active Backs", getter: (app: any) => app.student?.activeBacks ?? "" },
        { key: "contact", label: "Contact", getter: (app: any) => app.student?.contact || "" },
        { key: "whatsappNumber", label: "WhatsApp Number", getter: (app: any) => app.student?.whatsappNumber || "" },
        { key: "collegeName", label: "College Name", getter: (app: any) => app.student?.collegeName || "" },
        { key: "resumeUrl", label: "Resume URL", getter: (app: any) => app.student?.resumeUrl || "" },
        { key: "percentage10th", label: "10th Percentage", getter: (app: any) => app.student?.percentage10th ?? "" },
        { key: "year10th", label: "10th Year", getter: (app: any) => app.student?.year10th ?? "" },
        { key: "percentage12th", label: "12th Percentage", getter: (app: any) => app.student?.percentage12th ?? "" },
        { key: "year12th", label: "12th Year", getter: (app: any) => app.student?.year12th ?? "" },
        { key: "diplomaPercentage", label: "Diploma Percentage", getter: (app: any) => app.student?.diplomaPercentage ?? "" },
        { key: "diplomaYear", label: "Diploma Year", getter: (app: any) => app.student?.diplomaYear ?? "" },
        {
            key: "skills",
            label: "Skills",
            getter: (app: any) => (Array.isArray(app.student?.skills) ? app.student.skills.join("; ") : ""),
        },
        { key: "placementStatus", label: "Placement Status", getter: (app: any) => app.student?.placementStatus || "" },
    ] as const;

    const [selectedFieldKeys, setSelectedFieldKeys] = useState<string[]>(ALL_FIELDS.map((f) => f.key));

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [appsRes, driveRes] = await Promise.all([
                    fetch(`/api/applications?driveId=${id}`),
                    fetch(`/api/drives/${id}`),
                ]);

                if (appsRes.ok) {
                    const appsData = await appsRes.json();
                    setApplications(appsData || []);
                }

                if (driveRes.ok) {
                    const driveData = await driveRes.json();
                    setDrive(driveData);
                }
            } catch (error) {
                console.error("Failed to load applicants:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleExportCsv = () => {
        if (!applications.length) return;

        const activeFields =
            selectedFieldKeys.length > 0
                ? ALL_FIELDS.filter((f) => selectedFieldKeys.includes(f.key))
                : ALL_FIELDS;

        const headers = activeFields.map((f) => f.label);

        const rows = applications.map((app) =>
            activeFields.map((f) => f.getter(app, drive)),
        );

        const csvContent =
            headers.join(",") +
            "\n" +
            rows
                .map((row) =>
                    row
                        .map((value) => {
                            const str = String(value ?? "");
                            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                                return `"${str.replace(/"/g, '""')}"`;
                            }
                            return str;
                        })
                        .join(","),
                )
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileNameBase = drive
            ? `${drive.companyName || "drive"}-${drive.role || ""}`.replace(/[^a-z0-9]+/gi, "-").toLowerCase()
            : "drive-applicants";
        link.download = `${fileNameBase}-applicants.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <button
                        onClick={() => router.push("/admin/drives")}
                        className="inline-flex items-center text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to Drives
                    </button>

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                            <Users size={24} className="text-primary" /> Applicants
                        </h1>
                        {drive && (
                            <p className="text-gray-400 mt-1 text-sm">
                                {drive.companyName} &middot; {drive.role}
                            </p>
                        )}
                    </div>
                </div>

                {drive && (
                    <div className="glass-dark p-4 md:p-6 rounded-3xl border border-white/5 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-lg">
                                {drive.companyName?.[0]}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{drive.companyName}</p>
                                <p className="text-xs text-gray-400">{drive.role}</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 relative">
                            <div className="flex flex-wrap gap-3 text-[11px] text-gray-400">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                    <Calendar size={12} /> Drive: {formatDate(drive.driveDate)}
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                    <Calendar size={12} /> Applied: {applications.length}
                                </span>
                            </div>
                            <button
                                onClick={handleExportCsv}
                                disabled={!applications.length}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={14} className="mr-2" />
                                Export CSV
                            </button>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowColumnPicker((prev) => !prev)}
                                    className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10"
                                >
                                    <SlidersHorizontal size={14} className="mr-1" />
                                    Columns
                                </button>
                                {showColumnPicker && (
                                    <div className="absolute right-0 mt-2 w-64 glass-dark border border-white/10 rounded-2xl shadow-2xl p-3 z-20 max-h-72 overflow-y-auto text-xs">
                                        <p className="text-[11px] font-semibold text-gray-400 mb-2">
                                            Select fields to include
                                        </p>
                                        <div className="space-y-1">
                                            {ALL_FIELDS.map((field) => (
                                                <label
                                                    key={field.key}
                                                    className="flex items-center gap-2 text-[11px] text-gray-200 cursor-pointer hover:text-white"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-white/20 bg-transparent"
                                                        checked={selectedFieldKeys.includes(field.key)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedFieldKeys((prev) =>
                                                                    Array.from(new Set([...prev, field.key])),
                                                                );
                                                            } else {
                                                                setSelectedFieldKeys((prev) =>
                                                                    prev.filter((k) => k !== field.key),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <span>{field.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="mt-2 flex justify-between gap-2">
                                            <button
                                                type="button"
                                                className="text-[11px] text-primary hover:text-primary/80"
                                                onClick={() => setSelectedFieldKeys(ALL_FIELDS.map((f) => f.key))}
                                            >
                                                Select all
                                            </button>
                                            <button
                                                type="button"
                                                className="text-[11px] text-gray-400 hover:text-gray-200"
                                                onClick={() => setSelectedFieldKeys([])}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-16">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="p-16 text-center text-gray-500">
                            <Users size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm">No students have applied to this drive yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                                    <tr>
                                        <th className="px-6 md:px-8 py-4 md:py-5">Student</th>
                                        <th className="px-6 md:px-8 py-4 md:py-5">Branch / Year</th>
                                        <th className="px-6 md:px-8 py-4 md:py-5">Academics</th>
                                        <th className="px-6 md:px-8 py-4 md:py-5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-primary/5 transition-all">
                                            <td className="px-6 md:px-8 py-4 md:py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center text-xs font-bold text-primary">
                                                        {app.student?.name?.[0]}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm font-semibold text-white">
                                                            {app.student?.name || "Unknown"}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                                            <Mail size={11} /> {app.student?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 md:px-8 py-4 md:py-5 text-sm text-gray-200">
                                                <div className="space-y-0.5">
                                                    <p className="font-medium text-white text-xs md:text-sm">
                                                        {app.student?.branch || "N/A"}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                                        <School size={11} />
                                                        {app.student?.passingYear
                                                            ? `Passout: ${app.student.passingYear}`
                                                            : "Passout: N/A"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 md:px-8 py-4 md:py-5 text-sm text-gray-200">
                                                <div className="space-y-0.5 text-[11px] md:text-xs">
                                                    <p>CGPA: {app.student?.cgpa ?? "N/A"}</p>
                                                    <p>Backlogs: {app.student?.backlogs ?? app.student?.activeBacks ?? 0}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 md:px-8 py-4 md:py-5 text-right">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                        app.status === "placed"
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                            : app.status === "rejected"
                                                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                                                            : app.status === "shortlisted"
                                                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                                            : "bg-gray-500/10 text-gray-300 border-gray-500/30"
                                                    }`}
                                                >
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

