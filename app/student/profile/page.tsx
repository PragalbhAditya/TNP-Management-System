"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    User as UserIcon,
    Mail,
    Phone,
    BookOpen,
    GraduationCap,
    FileText,
    Upload,
    CheckCircle,
    Loader2,
    Save,
    X,
    Pencil,
    Plus,
    Calendar,
    MapPin,
    Award
} from "lucide-react";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils";

const BRANCHES_BTECH = [
    "Aeronautical Engineering",
    "Artificial Intelligence & Machine Learning",
    "Civil Engineering",
    "Computer Science & Engineering",
    "Electrical & Electronics Engineering",
    "Mechanical Engineering",
];

const BRANCHES_MTECH = [
    "Computer Science & Engineering",
    "Power Systems",
];

const COURSES = ['B.Tech', 'M.Tech'];
const GENDERS = ['Male', 'Female', 'Other'];
const CATEGORIES = ['GEN', 'OBC', 'SC', 'ST', 'EWS'];
const BOARDS = [
    'CBSE',
    'ICSE',
    'ISC',
    'State Board',
    'Other'
];

const getBranches = (course: string) => {
    if (course === 'M.Tech') return BRANCHES_MTECH;
    return BRANCHES_BTECH;
};

export default function StudentProfilePage() {
    const { data: session } = useSession();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [editedData, setEditedData] = useState<any>({});
    const [newSkill, setNewSkill] = useState("");
    const [newSemester, setNewSemester] = useState({ semester: "", sgpa: "" });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/student/profile");
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setEditedData(data);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/student/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedData),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                setIsEditing(false);
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("resume", file);

        try {
            const res = await fetch("/api/student/resume", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
                fetchProfile();
            } else {
                alert("Failed to upload resume");
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            alert("Failed to upload resume");
        } finally {
            setIsUploading(false);
        }
    };

    const addSkill = () => {
        if (!newSkill.trim()) return;
        const currentSkills = editedData.skills || [];
        if (!currentSkills.includes(newSkill.trim())) {
            setEditedData({ ...editedData, skills: [...currentSkills, newSkill.trim()] });
        }
        setNewSkill("");
    };

    const removeSkill = (skillToRemove: string) => {
        setEditedData({
            ...editedData,
            skills: (editedData.skills || []).filter((s: string) => s !== skillToRemove)
        });
    };

    const addSemesterSGPA = () => {
        if (!newSemester.semester || !newSemester.sgpa) return;
        const currentSGPA = editedData.semesterWiseSGPA || [];
        const semesterNum = parseInt(newSemester.semester);
        const sgpaNum = parseFloat(newSemester.sgpa);
        
        // Check if semester already exists
        const exists = currentSGPA.some((s: any) => s.semester === semesterNum);
        if (!exists && semesterNum > 0 && sgpaNum >= 0 && sgpaNum <= 10) {
            setEditedData({
                ...editedData,
                semesterWiseSGPA: [...currentSGPA, { semester: semesterNum, sgpa: sgpaNum }].sort((a, b) => a.semester - b.semester)
            });
        }
        setNewSemester({ semester: "", sgpa: "" });
    };

    const removeSemesterSGPA = (semesterToRemove: number) => {
        setEditedData({
            ...editedData,
            semesterWiseSGPA: (editedData.semesterWiseSGPA || []).filter((s: any) => s.semester !== semesterToRemove)
        });
    };

    if (isLoading) {
        return (
            <DashboardLayout role="student">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </DashboardLayout>
        );
    }

    const needsSetup = !user?.branch || !user?.contact || !user?.course;

    return (
        <DashboardLayout role="student">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Profile Completion Alert */}
                {needsSetup && !isEditing && (
                    <div className="glass-dark border border-amber-500/20 bg-amber-500/5 p-6 rounded-3xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <UserIcon size={24} />
                            </div>
                            <div>
                                <h3 className="text-amber-200 font-bold">Incomplete Profile</h3>
                                <p className="text-sm text-amber-500/60">Please complete your information to participate in placement drives.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Complete Profile
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Avatar & Resume */}
                    <div className="w-full lg:w-1/4 space-y-6">
                        <div className="glass-dark p-8 rounded-3xl border border-white/5 text-center relative group">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil size={16} />
                                </button>
                            )}
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary to-accent mx-auto mb-6 shadow-2xl shadow-primary/20 flex items-center justify-center text-white text-4xl font-black">
                                {user?.name?.[0]}
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h2>
                            <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-bold">
                                {user?.course || 'Course'} Student
                            </p>

                            <div className="mt-8 pt-6 border-t border-white/5 space-y-4 text-left">
                                <div className="flex items-center text-sm text-gray-400">
                                    <Mail size={16} className="mr-3 text-primary flex-shrink-0" />
                                    <span className="truncate">{user?.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-400">
                                    <Phone size={16} className="mr-3 text-primary flex-shrink-0" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData.contact || ""}
                                            onChange={(e) => setEditedData({ ...editedData, contact: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white w-full outline-none focus:border-primary"
                                            placeholder="Contact Number"
                                        />
                                    ) : (
                                        <span>{user?.contact || "Not Provided"}</span>
                                    )}
                                </div>
                                {user?.rollNumber && (
                                    <div className="flex items-center text-sm text-gray-400">
                                        <Award size={16} className="mr-3 text-primary flex-shrink-0" />
                                        <span>{user.rollNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="glass-dark p-6 rounded-3xl border border-white/5 space-y-6">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <FileText size={18} className="text-primary" /> Resume
                            </h3>
                            <div className="relative group">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept=".pdf"
                                    onChange={handleResumeUpload}
                                    disabled={isUploading}
                                />
                                <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${isUploading ? 'border-gray-700 bg-white/5' :
                                    uploadSuccess ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 group-hover:border-primary group-hover:bg-primary/5'
                                    }`}>
                                    {isUploading ? (
                                        <Loader2 className="text-primary animate-spin mb-2" size={32} />
                                    ) : uploadSuccess ? (
                                        <CheckCircle className="text-emerald-500 mb-2" size={32} />
                                    ) : (
                                        <Upload className="text-gray-600 group-hover:text-primary mb-2 transition-colors" size={32} />
                                    )}
                                    <p className="text-sm font-bold text-white">
                                        {isUploading ? "Uploading..." : uploadSuccess ? "Success!" : "Upload Resume"}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">PDF, max 5MB</p>
                                </div>
                            </div>
                            {user?.resumeUrl && (
                                <a
                                    href={user.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 rounded-xl bg-white/5 text-white text-sm font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <FileText size={16} /> View Current Resume
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Edit Controls */}
                        {isEditing && (
                            <div className="flex gap-2 justify-end sticky top-4 z-10">
                                <button
                                    onClick={() => { setIsEditing(false); setEditedData(user); }}
                                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                                >
                                    <X size={18} />
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {/* Basic Information */}
                        <section className="glass-dark p-8 rounded-3xl border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <UserIcon className="mr-3 text-primary" size={24} /> Basic Information
                                </h3>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Registration Number</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData.rollNumber || ""}
                                            onChange={(e) => setEditedData({ ...editedData, rollNumber: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                            placeholder="Enter Registration Number"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white font-mono">{user?.rollNumber || "Not Provided"}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Course</p>
                                    {isEditing ? (
                                        <select
                                            value={editedData.course || ""}
                                            onChange={(e) => setEditedData({ ...editedData, course: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-gray-900">Select Course</option>
                                            {COURSES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                                        </select>
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.course || "Not Set"}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Branch / Department</p>
                                    {isEditing ? (
                                        <select
                                            value={editedData.branch || ""}
                                            onChange={(e) => setEditedData({ ...editedData, branch: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-gray-900">Select Branch</option>
                                            {getBranches(editedData.course || "B.Tech").map(b => <option key={b} value={b} className="bg-gray-900">{b}</option>)}
                                        </select>
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.branch || "Not Set"}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Batch / Passing Year</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editedData.batchYear || ""}
                                            onChange={(e) => setEditedData({ ...editedData, batchYear: parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                            placeholder="e.g., 2024"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.batchYear || "Not Set"}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Gender</p>
                                    {isEditing ? (
                                        <select
                                            value={editedData.gender || ""}
                                            onChange={(e) => setEditedData({ ...editedData, gender: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-gray-900">Select Gender</option>
                                            {GENDERS.map(g => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
                                        </select>
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.gender || "Not Set"}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Date of Birth</p>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={editedData.dateOfBirth ? new Date(editedData.dateOfBirth).toISOString().split('T')[0] : ""}
                                            onChange={(e) => setEditedData({ ...editedData, dateOfBirth: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary [color-scheme:dark]"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.dateOfBirth ? formatDate(user.dateOfBirth) : "Not Set"}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Category</p>
                                    {isEditing ? (
                                        <select
                                            value={editedData.category || ""}
                                            onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-gray-900">Select Category</option>
                                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                                        </select>
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.category || "Not Set"}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Aadhaar (Optional)</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData.aadhaar || ""}
                                            onChange={(e) => setEditedData({ ...editedData, aadhaar: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                            placeholder="Enter Aadhaar"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.aadhaar ? '*'.repeat(user.aadhaar.length - 4) + user.aadhaar.slice(-4) : "Not Provided"}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section className="glass-dark p-8 rounded-3xl border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <Phone className="mr-3 text-primary" size={24} /> Contact Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Personal Email</p>
                                    <p className="text-lg font-bold text-white">{user?.email}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Phone Number</p>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editedData.contact || ""}
                                            onChange={(e) => setEditedData({ ...editedData, contact: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                            placeholder="Enter Phone Number"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.contact || "Not Provided"}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Alternate Phone</p>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editedData.alternatePhone || ""}
                                            onChange={(e) => setEditedData({ ...editedData, alternatePhone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                            placeholder="Alternate Phone (Optional)"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.alternatePhone || "Not Provided"}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Permanent Address</p>
                                    {isEditing ? (
                                        <textarea
                                            value={editedData.permanentAddress || ""}
                                            onChange={(e) => setEditedData({ ...editedData, permanentAddress: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary resize-none"
                                            placeholder="Enter your permanent address"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white">{user?.permanentAddress || "Not Provided"}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Academic Information */}
                        <section className="glass-dark p-8 rounded-3xl border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <GraduationCap className="mr-3 text-primary" size={24} /> Academic Information
                            </h3>

                            <div className="space-y-8">
                                {/* 10th Board */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1 space-y-1.5">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">10th Board</p>
                                        {isEditing ? (
                                            <select
                                                value={editedData.board10th || ""}
                                                onChange={(e) => setEditedData({ ...editedData, board10th: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-gray-900">Select Board</option>
                                                {BOARDS.map(b => <option key={b} value={b} className="bg-gray-900">{b}</option>)}
                                            </select>
                                        ) : (
                                            <p className="text-lg font-bold text-white">{user?.board10th || "Not Set"}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-1 space-y-1.5">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">10th Percentage</p>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editedData.percentage10th || ""}
                                                onChange={(e) => setEditedData({ ...editedData, percentage10th: parseFloat(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                placeholder="e.g., 85.50"
                                            />
                                        ) : (
                                            <p className="text-lg font-bold text-white">{user?.percentage10th ? user.percentage10th.toFixed(2) : "Not Set"}%</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-1 space-y-1.5">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">10th Year</p>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editedData.year10th || ""}
                                                onChange={(e) => setEditedData({ ...editedData, year10th: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                placeholder="e.g., 2018"
                                            />
                                        ) : (
                                            <p className="text-lg font-bold text-white">{user?.year10th || "Not Set"}</p>
                                        )}
                                    </div>
                                </div>

                                {/* 12th Board */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1 space-y-1.5">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">12th Board</p>
                                        {isEditing ? (
                                            <select
                                                value={editedData.board12th || ""}
                                                onChange={(e) => setEditedData({ ...editedData, board12th: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-gray-900">Select Board</option>
                                                {BOARDS.map(b => <option key={b} value={b} className="bg-gray-900">{b}</option>)}
                                            </select>
                                        ) : (
                                            <p className="text-lg font-bold text-white">{user?.board12th || "Not Set"}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-1 space-y-1.5">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">12th Percentage</p>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editedData.percentage12th || ""}
                                                onChange={(e) => setEditedData({ ...editedData, percentage12th: parseFloat(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                placeholder="e.g., 88.75"
                                            />
                                        ) : (
                                            <p className="text-lg font-bold text-white">{user?.percentage12th ? user.percentage12th.toFixed(2) : "Not Set"}%</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-1 space-y-1.5">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">12th Year</p>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editedData.year12th || ""}
                                                onChange={(e) => setEditedData({ ...editedData, year12th: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                placeholder="e.g., 2020"
                                            />
                                        ) : (
                                            <p className="text-lg font-bold text-white">{user?.year12th || "Not Set"}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Diploma (if applicable) */}
                                <div className="border-t border-white/5 pt-6">
                                    <h4 className="text-sm font-bold text-gray-300 mb-4">Diploma (if applicable)</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Diploma Board</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedData.diplomaBoard || ""}
                                                    onChange={(e) => setEditedData({ ...editedData, diplomaBoard: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                    placeholder="e.g., AICTE Approved"
                                                />
                                            ) : (
                                                <p className="text-lg font-bold text-white">{user?.diplomaBoard || "Not Provided"}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Diploma Percentage</p>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editedData.diplomaPercentage || ""}
                                                    onChange={(e) => setEditedData({ ...editedData, diplomaPercentage: parseFloat(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                    placeholder="e.g., 82.00"
                                                />
                                            ) : (
                                                <p className="text-lg font-bold text-white">{user?.diplomaPercentage ? user.diplomaPercentage.toFixed(2) : "Not Provided"}%</p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Diploma Year</p>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editedData.diplomaYear || ""}
                                                    onChange={(e) => setEditedData({ ...editedData, diplomaYear: parseInt(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                    placeholder="e.g., 2020"
                                                />
                                            ) : (
                                                <p className="text-lg font-bold text-white">{user?.diplomaYear || "Not Provided"}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Current Academic Performance */}
                                <div className="border-t border-white/5 pt-6">
                                    <h4 className="text-sm font-bold text-gray-300 mb-4">Current Academic Performance</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Current CGPA / Percentage</p>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    max="10"
                                                    min="0"
                                                    value={editedData.cgpa || ""}
                                                    onChange={(e) => setEditedData({ ...editedData, cgpa: parseFloat(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                    placeholder="e.g., 8.75"
                                                />
                                            ) : (
                                                <p className="text-3xl font-black text-primary">{user?.cgpa ? user.cgpa.toFixed(2) : "0.00"}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Active Backlogs</p>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editedData.activeBacks || 0}
                                                    onChange={(e) => setEditedData({ ...editedData, activeBacks: parseInt(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                />
                                            ) : (
                                                <p className="text-3xl font-black text-amber-500">{user?.activeBacks || 0}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Total Backlogs (Active + Cleared)</p>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editedData.totalBacklogs || 0}
                                                    onChange={(e) => setEditedData({ ...editedData, totalBacklogs: parseInt(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                                />
                                            ) : (
                                                <p className="text-lg font-bold text-white">{user?.totalBacklogs || 0}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Semester-wise SGPA */}
                                <div className="border-t border-white/5 pt-6">
                                    <h4 className="text-sm font-bold text-gray-300 mb-4">Semester-wise SGPA</h4>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            {(isEditing ? editedData.semesterWiseSGPA : user?.semesterWiseSGPA)?.map((semester: any) => (
                                                <div key={`sem-${semester.semester}`} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-black mb-1">Sem {semester.semester}</p>
                                                    <p className="text-2xl font-black text-primary flex items-center justify-between">
                                                        {semester.sgpa}
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => removeSemesterSGPA(semester.semester)}
                                                                className="text-gray-500 hover:text-red-400 text-sm"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {isEditing && (
                                            <div className="flex gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="8"
                                                    value={newSemester.semester}
                                                    onChange={(e) => setNewSemester({ ...newSemester, semester: e.target.value })}
                                                    placeholder="Semester"
                                                    className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-sm outline-none focus:border-primary"
                                                />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="10"
                                                    value={newSemester.sgpa}
                                                    onChange={(e) => setNewSemester({ ...newSemester, sgpa: e.target.value })}
                                                    placeholder="SGPA"
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-sm outline-none focus:border-primary"
                                                />
                                                <button
                                                    onClick={addSemesterSGPA}
                                                    className="px-4 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all text-sm font-bold"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Technical Skills */}
                        <section className="glass-dark p-8 rounded-3xl border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <BookOpen className="mr-3 text-primary" size={24} /> Technical Skills
                            </h3>
                            <div className="flex flex-wrap gap-3 mb-6">
                                {(isEditing ? editedData.skills : user?.skills)?.map((skill: string) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white border border-white/10 text-sm font-medium hover:border-primary transition-all group"
                                    >
                                        {skill}
                                        {isEditing && (
                                            <button onClick={() => removeSkill(skill)} className="text-gray-500 hover:text-red-400 transition-colors">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {isEditing && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                        placeholder="Add a skill (e.g. React, Python, Java)..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
                                    />
                                    <button
                                        onClick={addSkill}
                                        className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary transition-all hover:text-white"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
