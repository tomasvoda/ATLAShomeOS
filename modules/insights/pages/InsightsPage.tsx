'use client';

import React from 'react';
import { Panel } from '@/ui/primitives/Panel';
import { ResponsiveContainer } from '@/ui/primitives/ResponsiveContainer';
import { Icon } from '@/ui/primitives/Icon';
import { useUXData } from '@/context/UXDataContext';
import { cn } from '@/core/utils/cn';

export function InsightsPage() {
    const { data, activeRecommendation } = useUXData();

    // In a real app we might filter recommendations. 
    // For now show active one first (if any), then the rest.
    const recommendations = React.useMemo(() => {
        const allInfo = data.recommendations;
        if (!activeRecommendation) return allInfo;
        return [activeRecommendation, ...allInfo.filter(r => r.id !== activeRecommendation.id)];
    }, [data.recommendations, activeRecommendation]);

    return (
        <ResponsiveContainer className="py-12 space-y-12 pb-32 font-sans antialiased">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass-surface flex items-center justify-center">
                    <Icon name="Lightbulb" size={24} className="text-amber-400" />
                </div>
                <h1 className="text-4xl font-light text-text-primary tracking-tight">Insights</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {recommendations.map(rec => {
                    const isActive = activeRecommendation?.id === rec.id;
                    const isSilent = rec.communicationLevel === 'silent';

                    return (
                        <div
                            key={rec.id}
                            className={cn(
                                "flex flex-col group transition-all duration-500",
                                isActive ? "scale-105 z-10" : "scale-100"
                            )}
                        >
                            <Panel
                                className={cn(
                                    "h-full flex flex-col p-8 rounded-[2.5rem] transition-all duration-500",
                                    isActive ? "glass-elevated ring-2 ring-blue-500/20 shadow-2xl" : "glass-surface hover:bg-text-primary/[0.02]",
                                    isSilent && "opacity-60"
                                )}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-medium text-text-primary tracking-tight leading-none">{rec.title}</h3>
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                        isActive ? "bg-blue-500/20 text-blue-400" : "bg-text-primary/5 text-text-secondary opacity-40 group-hover:opacity-100"
                                    )}>
                                        <Icon name={isActive ? "Zap" : isSilent ? "Moon" : "Sparkles"} size={20} />
                                    </div>
                                </div>

                                <div className={cn(
                                    "flex-1 p-6 rounded-3xl border transition-all duration-500 mb-8",
                                    isActive ? "bg-blue-500/5 border-blue-500/10" : "bg-text-primary/[0.03] border-glass-border/10"
                                )}>
                                    <p className={cn(
                                        "text-lg font-light leading-relaxed mb-4",
                                        isActive ? "text-text-primary" : "text-text-secondary"
                                    )}>
                                        {rec.why}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary opacity-30">
                                            Confidence: {(rec.confidence * 100).toFixed(0)}%
                                        </p>
                                        <div className="h-1 w-1 rounded-full bg-text-secondary opacity-20" />
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary opacity-30">
                                            Signals: {rec.signals.join(' · ')}
                                        </p>
                                    </div>

                                    {/* POLICY BADGES */}
                                    {(isSilent || rec.communicationLevel === 'passive') && (
                                        <div className="flex gap-2 mt-6">
                                            {isSilent && (
                                                <div className="inline-flex items-center gap-2 bg-text-primary/5 px-3 py-1 rounded-full text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
                                                    <Icon name="VolumeX" size={12} />
                                                    Silenced
                                                </div>
                                            )}
                                            {rec.communicationLevel === 'passive' && (
                                                <div className="inline-flex items-center gap-2 bg-text-primary/5 px-3 py-1 rounded-full text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
                                                    <Icon name="BellOff" size={12} />
                                                    Passive
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {rec.actions.map(action => (
                                        <button
                                            key={action}
                                            className={cn(
                                                "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 border",
                                                isActive
                                                    ? "bg-text-primary text-background border-transparent shadow-lg"
                                                    : "glass-surface border-glass-border/20 text-text-primary hover:bg-text-primary/10"
                                            )}
                                        >
                                            {action.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </Panel>
                        </div>
                    )
                })}
            </div>
        </ResponsiveContainer>
    );
}
