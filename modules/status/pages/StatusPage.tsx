'use client';

import React, { useState } from 'react';
import { Icon } from '@/ui/primitives/Icon';
import { useUXData } from '@/context/UXDataContext';
import { cn } from '@/core/utils/cn';

type SystemStatusState = 'normal' | 'notice' | 'attention';

export function StatusPage() {
    const { data, visibleIssues, activeHomeMode, dayPart } = useUXData();
    const [activeOverlay, setActiveOverlay] = useState<'explanation' | 'activity' | 'diagnostics' | null>(null);
    const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

    // DETERMINE STATE
    let currentState: SystemStatusState = 'normal';
    if (visibleIssues.length > 0) {
        currentState = 'attention';
    } else if (activeHomeMode === 'Eco') {
        currentState = 'notice';
    }

    const config = {
        normal: {
            verdict: "All Systems Normal",
            sub: "Home operating as expected.",
            context: "",
            icon: "ShieldCheck",
            color: "text-gray-900",
            iconColor: "text-green-600"
        },
        notice: {
            verdict: "Everything Is Fine",
            sub: "Some systems have adjusted automatically.",
            context: "",
            icon: "Shield",
            color: "text-blue-900",
            iconColor: "text-blue-600"
        },
        attention: {
            verdict: "Attention Needed",
            sub: "Something requires your decision.",
            context: visibleIssues[0]?.title || "Security state is unclear",
            icon: "ShieldAlert",
            color: "text-orange-900",
            iconColor: "text-orange-600"
        }
    }[currentState];

    const contextLine = `${activeHomeMode} · ${dayPart === 'night' ? 'Night' : 'Morning'} · ${currentState === 'normal' ? 'Monitoring active' : 'Nobody home'}`;

    const snapshot = [
        { id: 'env', name: 'Environment', status: 'Comfortable and steady', icon: 'Thermometer' },
        { id: 'air', name: 'Air Quality', status: 'Excellent', icon: 'Wind' },
        { id: 'sec', name: 'Security', status: activeHomeMode === 'Away' ? 'Perimeter secure' : 'Monitoring active', icon: 'Shield' },
        { id: 'nrg', name: 'Energy', status: 'Normal usage', icon: 'Zap' },
        { id: 'pres', name: 'Presence', status: '2 people home', icon: 'User' },
    ];

    const lastChange = "10:42 · Front door locked automatically";

    return (
        <div className="h-[calc(100vh-140px)] w-full max-w-md mx-auto flex flex-col px-6 pt-2 pb-8 overflow-hidden relative font-sans">

            {/* 2. CONTEXT LINE */}
            <div className="text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-widest text-center mb-6 opacity-70">
                {contextLine}
            </div>

            {/* 3. VERDICT */}
            <div className="flex flex-col items-center text-center space-y-3 mb-10 shrink-0">
                <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 shadow-sm backdrop-blur-md",
                    "bg-white/80 border border-white/40 ring-1 ring-black/5"
                )}>
                    <Icon name={config.icon as any} size={32} className={config.iconColor} />
                </div>
                <div className="space-y-1">
                    <h1 className={cn("text-2xl font-medium tracking-tight", config.color)}>
                        {config.verdict}
                    </h1>
                    <p className="text-sm text-gray-500 font-light">
                        {config.sub}
                    </p>
                    {currentState === 'attention' && (
                        <p className="text-xs font-medium text-orange-600 mt-2 px-4 py-1 bg-orange-50 rounded-full inline-block">
                            {config.context}
                        </p>
                    )}
                </div>
            </div>

            {/* 4. SYSTEM SNAPSHOT */}
            <div className="w-full space-y-1 mb-auto">
                {snapshot.map((sys) => (
                    <button
                        key={sys.id}
                        onClick={() => { setSelectedSystem(sys.name); setActiveOverlay('explanation'); }}
                        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/40 border border-white/20 hover:bg-white/60 transition-all backdrop-blur-md shadow-sm group active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <Icon name={sys.icon as any} size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                            <span className="text-sm font-medium text-gray-700">{sys.name}</span>
                        </div>
                        <span className="text-sm text-gray-400 font-light tracking-tight">{sys.status}</span>
                    </button>
                ))}
            </div>

            {/* 5. LAST CHANGE */}
            {lastChange && (
                <div className="mt-8 mb-6 text-center">
                    <button
                        onClick={() => setActiveOverlay('activity')}
                        className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-2 px-3 py-1 bg-gray-50/50 rounded-full border border-gray-100/50"
                    >
                        <div className="w-1 h-1 rounded-full bg-blue-400" />
                        {lastChange}
                    </button>
                </div>
            )}

            {/* 6. DIAGNOSTICS LINK */}
            <div className="mt-auto flex justify-center">
                <button
                    onClick={() => setActiveOverlay('diagnostics')}
                    className="text-[9px] text-gray-300 hover:text-gray-500 uppercase tracking-[0.15em] font-bold py-2 transition-colors"
                >
                    System Diagnostics
                </button>
            </div>

            {/* OVERLAYS */}
            {activeOverlay && (
                <div
                    className="absolute inset-0 z-50 flex items-end justify-center bg-black/5 backdrop-blur-[2px] animate-in fade-in duration-300"
                    onClick={() => setActiveOverlay(null)}
                >
                    <div
                        className="w-full bg-white/95 backdrop-blur-xl rounded-t-[32px] shadow-2xl p-8 pb-12 animate-in slide-in-from-bottom-full duration-500 border-t border-white/50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drag Handle */}
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-8" />

                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-medium text-gray-900">
                                {activeOverlay === 'explanation' ? selectedSystem : (activeOverlay === 'activity' ? 'Recent Activity' : 'Diagnostics')}
                            </h3>
                            <button
                                onClick={() => setActiveOverlay(null)}
                                className="p-2 bg-gray-100/50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                <Icon name="X" size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {activeOverlay === 'explanation' && (
                                <p className="text-gray-500 leading-relaxed font-light">
                                    The {selectedSystem} system is currently operating within normal parameters.
                                    Sensors indicate authoritative consistency with the current home state.
                                </p>
                            )}

                            {activeOverlay === 'activity' && (
                                <div className="space-y-4">
                                    {[
                                        "10:42 · Front door locked automatically",
                                        "10:15 · Living room lights dimmed for morning",
                                        "09:30 · Climate adjusted to Eco mode",
                                        "08:45 · Perimeter security armed",
                                        "07:30 · Night mode deactivated"
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 text-xs text-gray-500 items-center">
                                            <div className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeOverlay === 'diagnostics' && (
                                <div className="space-y-2 text-[10px] font-mono text-gray-400 bg-gray-950 p-6 rounded-2xl overflow-hidden shadow-inner ring-1 ring-white/10">
                                    <p className="text-green-500/80 tracking-widest uppercase text-[8px] mb-2 font-bold">System Status Report</p>
                                    <div className="h-[1px] bg-gray-800 w-full mb-2" />
                                    <p>KERNEL: 4.8.1-atlas-stable</p>
                                    <p>UPTIME: 12d 4h 12m 3s</p>
                                    <p>NODES: 42 (ALL ONLINE)</p>
                                    <p>LOAD: 0.12 (BALANCED)</p>
                                    <p>MESH: ENCRYPTED / STABLE</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
