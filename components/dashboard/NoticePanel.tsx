"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { format } from "date-fns";

interface Notice {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

export default function NoticePanel() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // helper to fetch and refresh notices
    const loadNotices = async () => {
        try {
            const res = await fetch("/api/student/notices");
            if (!res.ok) {
                throw new Error("Failed to fetch notices");
            }
            const data = await res.json();
            setNotices(data);
        } catch (err: unknown) {
            console.error("Error fetching notices:", err);
            const message = err instanceof Error ? err.message : String(err);
            setError(message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNotices();
        // refresh every 30 seconds so users see new notices without reloading
        const interval = setInterval(loadNotices, 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="glass-dark p-6 rounded-[2.5rem] border border-white/5 flex flex-col justify-between relative overflow-hidden">
                <p className="text-gray-400">Loading notices...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-dark p-6 rounded-[2.5rem] border border-white/5 flex flex-col justify-between relative overflow-hidden">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="glass-dark p-6 rounded-[2.5rem] border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Campus Notices</p>
            {notices.length === 0 ? (
                <div className="text-gray-400">
                    <BellRing size={24} className="mb-2 text-gray-500" />
                    <p>No new notices at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-2">
                    {notices.map(notice => (
                        <div key={notice._id} className="pb-4 border-b border-white/5 last:border-b-0">
                            <h3 className="text-lg font-bold text-white leading-tight">{notice.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{notice.content}</p>
                            <p className="text-gray-500 text-xs mt-2">Posted on {format(new Date(notice.createdAt), "PPP")}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
