'use client';

import React, { useRef } from 'react';
import { useHouseMode } from '@/context/HouseModeContext';
import { useUXData } from '@/context/UXDataContext';
import { useApp } from '@/context/AppContext';
import { cn } from '@/core/utils/cn';
import { Icon } from '@/ui/primitives/Icon';

export function WorldHeader() {
    const { mode: houseMode } = useHouseMode();
    const {
        dayPart,
        activeHomeMode,
        visibleIssues,
        activeRecommendation,
        activeMedia
    } = useUXData();
    const { setDebugOpen } = useApp();

    // INTERACTION LOGIC
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = () => {
        longPressTimer.current = setTimeout(() => {
            setDebugOpen(true);
            if (typeof navigator !== 'undefined') navigator.vibrate?.(50); // Haptic feedback
        }, 800); // 800ms for long press
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleClick = () => {
        // Read-only: no action on tap
    };

    // 1. Mood / Attention Level
    // Find the highest priority issue to determine the global mood color
    const highestIssue = visibleIssues[0]; // Sorted by priority in context
    const attentionLevel = highestIssue?.attentionLevel || 'none';

    // 2. Presence Summary
    // For now, simple text mapping based on homeMode
    const presenceText = activeHomeMode === 'away'
        ? 'Nobody Is Home'
        : 'Tomas Is Home';

    // Styles based on Attention Level
    const indicatorColor = {
        none: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]',
        low: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.3)]',
        medium: 'bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.4)]',
        high: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse',
        critical: 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse',
    };

    const containerStyles = attentionLevel === 'critical' ? 'bg-red-50 border-red-100' :
        attentionLevel === 'high' ? 'bg-red-50/50 border-red-100/50' :
            'bg-white/80 backdrop-blur-xl border-white/20';

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none">
            <button
                className={cn(
                    "pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-sm transition-all duration-500 hover:scale-[1.02] active:scale-95 cursor-pointer outline-none",
                    containerStyles
                )}
                onClick={handleClick}
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                title="Tap to understand Home State"
            >
                {/* Living Indicator */}
                <div className={cn("w-2 h-2 rounded-full transition-all duration-700", indicatorColor[attentionLevel])} />

                {/* The Sentence */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 tracking-wide antialiased">
                    <span className="capitalize text-gray-900">{activeHomeMode}</span>
                    <span className="text-gray-300 font-light">|</span>
                    <span className="capitalize">{dayPart}</span>
                    <span className="text-gray-300 font-light">|</span>
                    <span className="opacity-80">{presenceText}</span>
                </div>
            </button>
        </header>
    );
}
