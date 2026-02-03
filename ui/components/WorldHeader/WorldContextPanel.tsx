'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useUXData } from '@/context/UXDataContext';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';

export function WorldContextPanel() {
    const { isContextOpen, setContextOpen } = useApp();
    const {
        dayPart,
        activeHomeMode,
        visibleIssues,
        activeRecommendation,
        activeMedia
    } = useUXData();

    if (!isContextOpen) return null;

    // Narrative Logic
    const stateSentence = `The home is currently in ${activeHomeMode} mode because it is ${dayPart}.`;

    // Construct "Why" narrative
    const reasons: string[] = [];

    // Issues
    visibleIssues.forEach(issue => {
        reasons.push(issue.detail || issue.title);
    });

    // Media
    if (activeMedia.isPlaying) {
        reasons.push(`${activeMedia.source} is playing "${activeMedia.title}" in the ${activeMedia.roomIds.join(' and ')}.`);
    }

    // Recommendation (as suggestion, not reason usually, but sometimes reason)
    // We treat activeRecommendation as a SUGGESTION in this new paradigm

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 md:pt-32 px-4 pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-xl pointer-events-auto transition-opacity duration-300"
                onClick={() => setContextOpen(false)}
            />

            {/* Content Container - No Card/Border look, just floating text content */}
            <div className="relative z-10 w-full max-w-2xl pointer-events-auto flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-300">

                {/* Close Button - Minimal */}
                <button
                    onClick={() => setContextOpen(false)}
                    className="absolute -top-12 right-0 md:-right-12 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-secondary transition-colors"
                >
                    <Icon name="X" size={20} />
                </button>

                {/* 1. STATE STATEMENT */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-light text-text-primary leading-tight">
                        {stateSentence}
                    </h1>
                </div>

                {/* 2. EXPLANATION (Reasons) */}
                {reasons.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Context</h2>
                        <div className="space-y-3">
                            {reasons.map((reason, idx) => (
                                <div key={idx} className="flex gap-4 items-baseline">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 translate-y-2" />
                                    <p className="text-lg md:text-xl text-text-primary font-light leading-relaxed">
                                        {reason}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. SUGGESTIONS (Optional, Calm) */}
                {activeRecommendation && (
                    <div className="mt-4 pt-8 border-t border-black/5 dark:border-white/10">
                        <div className="flex items-center gap-3 text-text-secondary mb-2">
                            <Icon name="Sparkles" size={16} className="text-blue-400" />
                            <span className="text-sm font-medium">Suggestion</span>
                        </div>
                        <p className="text-base md:text-lg text-text-primary">
                            {activeRecommendation.why || activeRecommendation.title}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
