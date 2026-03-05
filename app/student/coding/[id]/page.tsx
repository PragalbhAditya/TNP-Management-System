"use client";

import { useState, useEffect, use } from "react";
import Editor from "@monaco-editor/react";
import {
    Play,
    Send,
    Settings,
    Maximize2,
    ChevronRight,
    ShieldAlert,
    Terminal,
    RotateCcw,
    Loader2
} from "lucide-react";

export default function CodingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [code, setCode] = useState("// Write your code here...");
    const [language, setLanguage] = useState("cpp");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Anti-cheating: Fullscreen Enforcement
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                alert("Tab switching detected! This incident has been logged.");
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const enterFullscreen = () => {
        document.documentElement.requestFullscreen().catch(() => { });
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Executing code...\n");

        // Simulate API call to Judge0
        setTimeout(() => {
            setOutput("Running test cases...\nTest Case 1: PASSED\nTest Case 2: PASSED\nTest Case 3: FAILED (Expected: 10, Got: 0)\n\nExecution Time: 12ms\nMemory: 2.1MB");
            setIsRunning(false);
        }, 1500);
    };

    return (
        <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
            {/* Header */}
            <header className="h-14 md:h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#252526] shrink-0">
                <div className="flex items-center space-x-3 md:space-x-4 overflow-hidden">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded flex items-center justify-center font-bold text-xs md:text-sm shrink-0">C</div>
                    <h1 className="font-bold text-xs md:text-sm tracking-tight truncate">Two Sum Problem</h1>
                    <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded">Medium</span>
                </div>

                <div className="flex items-center space-x-3 md:space-x-6">
                    <div className="hidden sm:flex items-center space-x-2 text-[10px] md:text-xs text-gray-400">
                        <ShieldAlert size={14} className="text-emerald-500" />
                        <span className="hidden md:inline">Exam Mode Active</span>
                    </div>

                    <div className="flex items-center bg-white/5 rounded-lg px-2 md:px-3 py-1 md:py-1.5 border border-white/5">
                        <span className="hidden lg:inline text-[10px] text-gray-500 mr-2">Language:</span>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-[10px] md:text-xs font-bold outline-none cursor-pointer"
                        >
                            <option value="cpp">C++</option>
                            <option value="python">Py3</option>
                            <option value="java">Java</option>
                            <option value="javascript">JS</option>
                        </select>
                    </div>

                    <button onClick={enterFullscreen} className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <Maximize2 size={16} className="text-gray-400" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left: Problem Description */}
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 bg-[#1e1e1e] custom-scrollbar h-1/3 md:h-full">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between md:block">
                            <h2 className="text-lg md:text-xl font-bold">1. Two Sum</h2>
                            <span className="md:hidden text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded">Medium</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.
                            You may assume that each input would have exactly one solution, and you may not use the same element twice.
                        </p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                        <h3 className="font-bold text-[10px] md:text-sm uppercase tracking-widest text-gray-600">Examples</h3>
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-[10px] font-mono text-gray-500 mb-2">Input</p>
                                <code className="text-xs">nums = [2,7,11,15], target = 9</code>
                                <p className="text-[10px] font-mono text-gray-500 mt-4 mb-2">Output</p>
                                <code className="text-xs">[0,1]</code>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5 hidden md:block">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-600">Constraints</h3>
                        <ul className="list-disc list-inside text-xs text-gray-400 space-y-2">
                            <li>2 ≤ nums.length ≤ 104</li>
                            <li>-109 ≤ nums[i] ≤ 109</li>
                            <li>-109 ≤ target ≤ 109</li>
                        </ul>
                    </div>
                </div>

                {/* Right: Code Editor & Output */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] h-2/3 md:h-full">
                    <div className="flex-1 border-b border-white/5 relative">
                        <Editor
                            height="100%"
                            defaultLanguage="cpp"
                            language={language}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                padding: { top: 10 },
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: "on"
                            }}
                        />
                    </div>

                    {/* Terminal Output */}
                    <div className="h-40 md:h-1/3 flex flex-col bg-[#181818] shrink-0">
                        <div className="h-10 border-b border-white/5 flex items-center justify-between px-4">
                            <div className="flex items-center space-x-2 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <Terminal size={12} />
                                <span>Output</span>
                            </div>
                            <button onClick={() => setOutput("")} className="text-gray-600 hover:text-white transition-colors">
                                <RotateCcw size={12} />
                            </button>
                        </div>
                        <div className="flex-1 p-4 font-mono text-[10px] md:text-xs text-emerald-500/80 overflow-y-auto whitespace-pre">
                            {output || "Run code to see output..."}
                        </div>

                        <div className="h-14 md:h-16 border-t border-white/5 flex items-center justify-end px-4 md:px-6 space-x-2 md:space-x-4 bg-[#252526]">
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="flex items-center px-4 md:px-6 py-2 bg-white/5 text-white rounded-lg font-bold border border-white/10 hover:bg-white/10 transition-all text-xs md:text-sm disabled:opacity-50"
                            >
                                {isRunning ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Play size={14} className="mr-2" />}
                                Run
                            </button>
                            <button className="flex items-center px-6 md:px-8 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-xs md:text-sm">
                                Submit <ChevronRight size={14} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
