'use client';

import React from 'react';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { UXThing } from '@/core/mock/types';

interface ControlTileProps {
    thing: UXThing;
    icon: any;
    activeColor?: string;
    accentColor?: string;
    onClick?: () => void;
}

export function ControlTile({
    thing,
    icon,
    activeColor = "text-blue-400",
    accentColor = "bg-blue-400/20",
    onClick
}: ControlTileProps) {
    const isOn = thing.state.operational === 'on' || thing.state.operational === 'heating' || thing.state.operational === 'cooling' || thing.state.operational === 'playing';
    const isLocked = thing.state.operational === 'locked';
    const isActive = isOn || isLocked;

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center aspect-square rounded-[1.5rem] transition-all duration-320 outline-none active:scale-95 group relative overflow-hidden",
                isActive
                    ? cn("glass-elevated ring-1 ring-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)]", accentColor)
                    : "glass-surface hover:bg-white/[0.04] border border-white/5"
            )}
        >
            {/* Icon Container */}
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 mb-3",
                isActive ? "bg-white/10 shadow-inner backdrop-blur-sm" : "bg-white/5 group-hover:bg-white/10"
            )}>
                <Icon
                    name={icon}
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={cn(
                        "transition-all duration-500",
                        isActive ? cn(activeColor, "brightness-110 drop-shadow-md") : "text-text-secondary opacity-50 group-hover:opacity-100"
                    )}
                />
            </div>

            {/* Labeling */}
            <div className="flex flex-col items-center gap-1 px-2 w-full">
                <span className={cn(
                    "font-medium text-[11px] tracking-tight truncate w-full text-center transition-colors duration-300",
                    isActive ? "text-text-primary" : "text-text-secondary opacity-70 group-hover:opacity-100"
                )}>
                    {thing.name}
                </span>

                {/* Status Text (Optional, maybe hide for extreme minimalism if not active?) */}
                <span className={cn(
                    "text-[8px] uppercase tracking-[0.15em] font-bold transition-all duration-300",
                    isActive ? "opacity-100 text-text-primary/60" : "opacity-0 group-hover:opacity-40"
                )}>
                    {thing.state.operational}
                </span>
            </div>

            {/* Active Glow/Indicator - "Slight elevation" illusion */}
            {isActive && (
                <div className={cn(
                    "absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay",
                    activeColor.replace('text-', 'bg-')
                )} />
            )}
        </button>
    );
}
