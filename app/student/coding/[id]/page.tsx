"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
    Play,
    Send,
    Settings,
    Maximize2,
    ChevronRight,
    ShieldAlert,
    Terminal,
    RotateCcw
} from "lucide-react";

export default function CodingPage({ params }: { params: { id: string } }) {
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
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#252526]">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold">C</div>
                    <h1 className="font-bold text-sm tracking-tight">Two Sum Problem</h1>
                    <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded">Medium</span>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <ShieldAlert size={14} className="text-emerald-500" />
                        <span>Exam Mode Active</span>
                    </div>

                    <div className="flex items-center bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
                        <span className="text-xs text-gray-500 mr-2">Language:</span>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-xs font-bold outline-none"
                        >
                            <option value="cpp">C++</option>
                            <option value="python">Python 3</option>
                            <option value="java">Java</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                    </div>

                    <button onClick={enterFullscreen} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <Maximize2 size={18} className="text-gray-400" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Problem Description */}
                <div className="w-1/3 border-r border-white/5 overflow-y-auto p-8 space-y-8 bg-[#1e1e1e] custom-scrollbar">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">1. Two Sum</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.
                            You may assume that each input would have exactly one solution, and you may not use the same element twice.
                        </p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-600">Examples</h3>
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-xs font-mono text-gray-500 mb-2">Input</p>
                                <code className="text-xs">nums = [2,7,11,15], target = 9</code>
                                <p className="text-xs font-mono text-gray-500 mt-4 mb-2">Output</p>
                                <code className="text-xs">[0,1]</code>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-600">Constraints</h3>
                        <ul className="list-disc list-inside text-xs text-gray-400 space-y-2">
                            <li>2 ≤ nums.length ≤ 104</li>
                            <li>-109 ≤ nums[i] ≤ 109</li>
                            <li>-109 ≤ target ≤ 109</li>
                        </ul>
                    </div>
                </div>

                {/* Right: Code Editor & Output */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    <div className="flex-1 border-b border-white/5">
                        <Editor
                            height="100%"
                            defaultLanguage="cpp"
                            language={language}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                padding: { top: 20 },
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Terminal Output */}
                    <div className="h-1/3 flex flex-col bg-[#181818]">
                        <div className="h-10 border-b border-white/5 flex items-center justify-between px-4">
                            <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <Terminal size={14} />
                                <span>Output</span>
                            </div>
                            <button onClick={() => setOutput("")} className="text-gray-600 hover:text-white transition-colors">
                                <RotateCcw size={14} />
                            </button>
                        </div>
                        <div className="flex-1 p-4 font-mono text-xs text-emerald-500/80 overflow-y-auto whitespace-pre">
                            {output || "Run code to see output..."}
                        </div>

                        <div className="h-16 border-t border-white/5 flex items-center justify-end px-6 space-x-4 bg-[#252526]">
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="flex items-center px-6 py-2 bg-white/5 text-white rounded-lg font-bold border border-white/10 hover:bg-white/10 transition-all text-sm disabled:opacity-50"
                            >
                                {isRunning ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
                                Run Code
                            </button>
                            <button className="flex items-center px-8 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm">
                                Submit Solution <ChevronRight size={16} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
