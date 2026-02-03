'use client';

import React from 'react';
import { Button } from '@/ui/primitives/Button';
import { Icon } from '@/ui/primitives/Icon';

interface CompactStateAnchorProps {
    roomName?: string;
    activeCount?: number;
}

export function CompactStateAnchor({
    roomName = "Home",
    activeCount = 0,
}: CompactStateAnchorProps) {
    return (
        <div className="flex items-center justify-between px-6 py-4 pt-16 md:pt-6 sticky top-0 z-10 w-full max-w-4xl mx-auto">
            {/* Left: Identity */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-medium text-text-primary tracking-tight leading-none drop-shadow-md">
                    {roomName}
                </h1>
                <span className="text-[11px] font-bold text-text-secondary/70 uppercase tracking-widest mt-1.5">
                    {activeCount > 0 ? `${activeCount} Active Devices` : "All Systems Idle"}
                </span>
            </div>

            {/* Right: Quick Actions (None - Zone 1 is Static) */}
            <div className="flex items-center gap-3">
                {/* Reserved for future status indicators, but no interaction allowed here. */}
            </div>
        </div>
    );
}
