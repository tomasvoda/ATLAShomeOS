'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
            icon: "ShieldCheck",
            color: "text-text-primary",
            iconColor: "text-emerald-500"
        },
        notice: {
            verdict: "Everything Is Fine",
            sub: "Some systems have adjusted automatically.",
            icon: "Shield",
            color: "text-text-primary",
            iconColor: "text-blue-500"
        },
        attention: {
            verdict: "Attention Needed",
            sub: "Something requires your decision.",
            context: visibleIssues[0]?.title || "Security state is unclear",
            icon: "ShieldAlert",
            color: "text-text-primary",
            iconColor: "text-orange-500"
        }
    }[currentState];

    const contextLine = `${activeHomeMode} · ${dayPart === 'night' ? 'Night' : 'Morning'} · ${currentState === 'normal' ? 'Monitoring active' : 'Nobody home'}`;

    const snapshot = [
        { id: 'env', name: 'Environment', status: 'Comfortable', icon: 'Thermometer' },
        { id: 'air', name: 'Air Quality', status: 'Excellent', icon: 'Wind' },
        { id: 'sec', name: 'Security', status: activeHomeMode === 'Away' ? 'Perimeter secure' : 'Secure', icon: 'Shield' },
        { id: 'nrg', name: 'Energy', status: 'Normal', icon: 'Zap' },
        { id: 'pres', name: 'Presence', status: '2 people', icon: 'User' },
    ];

    const lastChange = "10:42 · Front door locked automatically";

    return (
        <div className="min-h-[calc(100vh-140px)] w-full max-w-lg mx-auto flex flex-col px-6 pt-4 pb-12 relative font-sans">

            {/* 2. CONTEXT LINE */}
            <div className="text-[10px] font-medium text-text-secondary uppercase tracking-[0.2em] text-center mb-8 opacity-40">
                {contextLine}
            </div>

            {/* 3. VERDICT */}
            <div className="flex flex-col items-center text-center space-y-4 mb-14 shrink-0">
                <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl glass-elevated"
                )}>
                    <Icon name={config.icon as any} size={36} className={config.iconColor} />
                </div>
                <div className="space-y-1.5">
                    <h1 className={cn("text-3xl font-medium tracking-tight", config.color)}>
                        {config.verdict}
                    </h1>
                    <p className="text-[15px] text-text-secondary font-light">
                        {config.sub}
                    </p>
                    {currentState === 'attention' && (
                        <p className="text-[11px] font-medium text-orange-500 mt-3 px-4 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20 inline-block">
                            {config.context}
                        </p>
                    )}
                </div>
            </div>

            {/* 4. SYSTEM SNAPSHOT */}
            <div className="w-full grid grid-cols-1 gap-2 mb-auto">
                {snapshot.map((sys) => (
                    <button
                        key={sys.id}
                        onClick={() => { setSelectedSystem(sys.name); setActiveOverlay('explanation'); }}
                        className="w-full flex items-center justify-between p-4 rounded-3xl glass-surface hover:bg-text-primary/[0.03] transition-all group active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <Icon name={sys.icon as any} size={18} className="text-text-secondary group-hover:text-text-primary transition-colors opacity-40 group-hover:opacity-100" />
                            <span className="text-sm font-medium text-text-primary opacity-80">{sys.name}</span>
                        </div>
                        <span className="text-sm text-text-secondary font-light opacity-50">{sys.status}</span>
                    </button>
                ))}
            </div>

            {/* 5. LAST CHANGE */}
            {lastChange && (
                <div className="mt-10 mb-8 text-center">
                    <button
                        onClick={() => setActiveOverlay('activity')}
                        className="text-[11px] text-text-secondary hover:text-text-primary transition-all inline-flex items-center gap-2.5 px-4 py-1.5 glass-surface rounded-full opacity-60 hover:opacity-100"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        {lastChange}
                    </button>
                </div>
            )}

            {/* 6. DIAGNOSTICS LINK */}
            <div className="mt-auto flex justify-center pb-4">
                <button
                    onClick={() => setActiveOverlay('diagnostics')}
                    className="text-[10px] text-text-secondary hover:text-text-primary uppercase tracking-[0.2em] font-bold py-2 transition-all opacity-30 hover:opacity-100"
                >
                    System Diagnostics
                </button>
            </div>

            {/* OVERLAYS */}
            <AnimatePresence>
                {activeOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm"
                        onClick={() => setActiveOverlay(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full glass-elevated rounded-t-[3rem] shadow-2xl p-8 pb-16 border-t border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drag Handle */}
                            <div className="w-12 h-1.5 bg-text-primary/10 rounded-full mx-auto mb-10" />

                            <div className="flex justify-between items-start mb-8">
                                <h3 className="text-2xl font-medium text-text-primary">
                                    {activeOverlay === 'explanation' ? selectedSystem : (activeOverlay === 'activity' ? 'Recent Activity' : 'Diagnostics')}
                                </h3>
                                <button
                                    onClick={() => setActiveOverlay(null)}
                                    className="p-2.5 bg-text-primary/5 rounded-full text-text-secondary hover:bg-text-primary/10 transition-colors"
                                >
                                    <Icon name="X" size={18} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {activeOverlay === 'explanation' && (
                                    <p className="text-text-secondary leading-relaxed font-light text-base">
                                        The {selectedSystem} system is currently operating within normal parameters.
                                        Sensors indicate authoritative consistency with the current home state.
                                    </p>
                                )}

                                {activeOverlay === 'activity' && (
                                    <div className="space-y-5">
                                        {[
                                            "10:42 · Front door locked automatically",
                                            "10:15 · Living room lights dimmed for morning",
                                            "09:30 · Climate adjusted to Eco mode",
                                            "08:45 · Perimeter security armed",
                                            "07:30 · Night mode deactivated"
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 text-sm text-text-secondary items-center">
                                                <div className="w-1 h-1 rounded-full bg-text-primary/20 shrink-0" />
                                                <span className="opacity-80">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeOverlay === 'diagnostics' && (
                                    <div className="space-y-3 text-[11px] font-mono text-text-secondary bg-black/40 p-6 rounded-3xl overflow-hidden shadow-inner border border-white/5">
                                        <p className="text-accent tracking-widest uppercase text-[9px] mb-3 font-bold opacity-80">System Status Report</p>
                                        <div className="h-[1px] bg-white/5 w-full mb-3" />
                                        <p>KERNEL: 4.8.1-atlas-stable</p>
                                        <p>UPTIME: 12d 4h 12m 3s</p>
                                        <p>NODES: 42 (ALL ONLINE)</p>
                                        <p>LOAD: 0.12 (BALANCED)</p>
                                        <p>MESH: ENCRYPTED / STABLE</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
