'use client';

import React from 'react';
import { cn } from '@/core/utils/cn';

interface StateAnchorProps {
    roomName?: string;
    statusText?: string;
    metric?: string;
}

export function StateAnchor({
    roomName = "Home",
    statusText = "System is Active",
    metric
}: StateAnchorProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 pb-8 text-center pointer-events-none sticky top-0 z-0">
            {/* Visual Anchor Line - very subtle */}
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent mb-6" />

            <h1 className="text-4xl md:text-5xl font-light text-text-primary tracking-tight mb-2 drop-shadow-sm">
                {roomName}
            </h1>

            <p className="text-lg md:text-xl text-text-secondary font-medium tracking-wide opacity-60">
                {statusText}
            </p>

            {metric && (
                <div className="mt-4 px-4 py-1.5 rounded-full glass-surface-heavy backdrop-blur-md border border-white/5 inline-flex items-center">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-secondary/80">
                        {metric}
                    </span>
                </div>
            )}
        </div>
    );
}
