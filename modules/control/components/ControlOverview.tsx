'use client';

import React from 'react';
import { Icon } from '@/ui/primitives/Icon';
import { Button } from '@/ui/primitives/Button';
import { cn } from '@/core/utils/cn';

interface ControlOverviewProps {
    title?: string;
    subtitle?: string;
    onAllOff?: () => void;
}

export function ControlOverview({
    title = "Control Center",
    subtitle = "Manual Override & Systems",
    onAllOff
}: ControlOverviewProps) {
    return (
        <div className="sticky top-20 z-40 mb-8 pointer-events-none">
            <div className="pointer-events-auto flex items-center justify-between p-1">
                {/* Title Block - Glass Pill Effect */}
                <div className="flex flex-col justify-center px-4 py-2 rounded-2xl glass-surface-heavy backdrop-blur-xl border border-white/10 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.1)]">
                    <h1 className="text-xl font-medium text-text-primary tracking-tight leading-tight">
                        {title}
                    </h1>
                    <span className="text-[10px] font-bold text-text-secondary opacity-60 uppercase tracking-[0.15em] leading-tight">
                        {subtitle}
                    </span>
                </div>

                {/* Primary Action - "All Off" */}
                <Button
                    onClick={onAllOff}
                    variant="ghost"
                    className={cn(
                        "gap-2.5 h-12 rounded-2xl px-5 transition-all duration-300",
                        "glass-surface-heavy backdrop-blur-xl border border-white/10 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.1)]",
                        "hover:bg-red-500/10 hover:border-red-500/20 hover:scale-[1.02] active:scale-95"
                    )}
                >
                    <Icon name="Power" size={18} className="text-red-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-text-primary">
                        All Off
                    </span>
                </Button>
            </div>

            {/* Visual Divider / Edge separation */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mt-4 opacity-50" />
        </div>
    );
}
