'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { IntentType } from './IntentRow'; // Reuse type

interface IntentGridProps {
    selectedIntent: IntentType;
    onSelect: (intent: IntentType) => void;
    activeStates: {
        light: boolean;
        climate: boolean;
        media: boolean;
        security: boolean;
    };
}

const INTENTS = [
    { id: 'light', label: 'Lights', icon: 'Sun', color: 'text-amber-400', bg: 'bg-amber-400/20' },
    { id: 'climate', label: 'Climate', icon: 'Thermometer', color: 'text-blue-400', bg: 'bg-blue-400/20' },
    { id: 'media', label: 'Media', icon: 'Music', color: 'text-purple-400', bg: 'bg-purple-400/20' },
    { id: 'security', label: 'Security', icon: 'Shield', color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
    // Placeholders for density demonstration
    { id: 'shades', label: 'Shades', icon: 'GalleryVerticalEnd', color: 'text-white', bg: 'bg-white/10' },
    { id: 'scenes', label: 'Scenes', icon: 'Zap', color: 'text-pink-400', bg: 'bg-pink-400/20' },
] as const;

export function IntentGrid({ selectedIntent, onSelect, activeStates }: IntentGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-4 pb-4">
            {INTENTS.map((intent) => {
                const isSelected = selectedIntent === intent.id;
                const isAnySelected = selectedIntent !== null;
                const isBlurred = isAnySelected && !isSelected;

                // @ts-ignore - dynamic key access
                const isActive = activeStates[intent.id] || false;

                return (
                    <motion.button
                        key={intent.id}
                        onClick={() => onSelect(isSelected ? null : intent.id as IntentType)}
                        layoutId={`intent-${intent.id}`}
                        className={cn(
                            "relative aspect-[5/4] rounded-[1.8rem] flex flex-col items-start justify-between p-5 outline-none overflow-hidden group border",
                            isSelected
                                ? "glass-elevated bg-white/[0.14] border-white/20 z-30 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
                                : "glass-surface hover:bg-white/[0.04] border-white/[0.08] active:scale-[0.98] z-0"
                        )}
                        animate={{
                            scale: isSelected ? 1.04 : 1, // Max 1.04 per spec
                            filter: isBlurred ? "blur(12px) opacity(0.4)" : "blur(0px) opacity(1)", // Max 12px blur
                            y: isSelected ? -4 : 0
                        }}
                        transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }} // Focus transition 320ms
                    >
                        {/* Active Indicator (Subtle background glow) */}
                        {isActive && !isSelected && (
                            <div className={cn("absolute inset-0 opacity-[0.08]", intent.bg)} />
                        )}

                        {/* Icon */}
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                            isSelected ? "bg-white text-black shadow-lg scale-110" : "bg-white/5 text-text-secondary group-hover:bg-white/10"
                        )}>
                            <Icon name={intent.icon as any} size={20} className={cn(isSelected ? "text-current" : intent.color, isSelected ? "" : "opacity-90")} />
                        </div>

                        {/* Label & Status */}
                        <div className="flex flex-col items-start gap-1">
                            <span className={cn(
                                "font-medium text-[15px] tracking-tight transition-colors",
                                isSelected ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
                            )}>
                                {intent.label}
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                                isActive ? "text-emerald-400 opacity-100" : "text-text-secondary/40"
                            )}>
                                {isActive ? 'Active' : 'Idle'}
                            </span>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
