"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { User, Bell, Users, Play, SkipForward } from "lucide-react";

interface Candidate {
    id: string;
    name: string;
    rollNumber: string;
    status: 'waiting' | 'interviewing' | 'completed';
}

export default function InterviewQueue({ driveId, isAdmin }: { driveId: string, isAdmin?: boolean }) {
    const { socket, connected } = useSocket();
    const [queue, setQueue] = useState<Candidate[]>([]);
    const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);

    useEffect(() => {
        if (socket) {
            socket.emit("join-room", driveId);

            socket.on("queue-updated", (newQueue: Candidate[]) => {
                setQueue(newQueue);
            });

            socket.on("candidate-called", (candidate: Candidate) => {
                setCurrentCandidate(candidate);
                // Play bell sound if not admin (for candidates/large display)
                if (!isAdmin) {
                    const audio = new Audio("/bell.mp3");
                    audio.play().catch(() => { });
                }
            });
        }
    }, [socket, driveId, isAdmin]);

    const callNext = () => {
        if (queue.length > 0) {
            const nextCandidate = queue[0];
            const updatedQueue = queue.slice(1);

            socket.emit("update-queue", { roomName: driveId, queue: updatedQueue });
            socket.emit("call-candidate", { roomName: driveId, candidate: nextCandidate });

            setQueue(updatedQueue);
            setCurrentCandidate(nextCandidate);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Candidate Display */}
            <div className="lg:col-span-2">
                <div className="glass-dark p-12 rounded-3xl border border-primary/20 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    </div>

                    <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Now Interviewing</h2>

                    {currentCandidate ? (
                        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                            <h1 className="text-6xl font-black text-white">{currentCandidate.name}</h1>
                            <p className="text-2xl text-gray-400">{currentCandidate.rollNumber}</p>
                        </div>
                    ) : (
                        <div className="py-20">
                            <Users size={64} className="mx-auto text-gray-700 mb-4 opacity-20" />
                            <p className="text-gray-500">Waiting for next candidate...</p>
                        </div>
                    )}

                    {isAdmin && (
                        <div className="pt-8 flex justify-center">
                            <button
                                onClick={callNext}
                                disabled={queue.length === 0}
                                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                            >
                                <Play size={20} className="mr-2" /> Call Next Candidate
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Queue Sidebar */}
            <div className="space-y-6">
                <div className="glass-dark p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white flex items-center">
                            <Users size={18} className="mr-2 text-primary" /> Waiting Queue
                        </h3>
                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-500">{queue.length} Remaining</span>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {queue.map((candidate, index) => (
                            <div key={candidate.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:border-primary/30 transition-all">
                                <div>
                                    <p className="font-semibold text-white group-hover:text-primary transition-colors">{candidate.name}</p>
                                    <p className="text-xs text-gray-500">{candidate.rollNumber}</p>
                                </div>
                                {index === 0 && <SkipForward size={14} className="text-primary animate-bounce-x" />}
                            </div>
                        ))}
                        {queue.length === 0 && (
                            <p className="text-center py-8 text-sm text-gray-600 italic">Queue is empty</p>
                        )}
                    </div>
                </div>

                {isAdmin && (
                    <div className="glass-dark p-6 rounded-2xl border border-white/5 bg-primary/5">
                        <h3 className="font-bold text-white mb-2">Admin Tools</h3>
                        <p className="text-xs text-gray-400 mb-4">Click below to announce general updates or reset the queue.</p>
                        <button className="w-full py-3 rounded-xl bg-white/5 text-white text-sm font-semibold border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center">
                            <Bell size={16} className="mr-2" /> Ring Bell Manually
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
