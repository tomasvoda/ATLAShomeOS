'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';

export type IntentType = 'light' | 'climate' | 'media' | 'security' | 'shades' | 'scenes' | null;

interface IntentRowProps {
    selectedIntent: IntentType;
    onSelect: (intent: IntentType) => void;
}

const INTENTS = [
    { id: 'light', label: 'Light', icon: 'Sun' },
    { id: 'climate', label: 'Comfort', icon: 'Thermometer' },
    { id: 'media', label: 'Sound', icon: 'Music' },
    { id: 'security', label: 'Secure', icon: 'Shield' },
] as const;

export function IntentRow({ selectedIntent, onSelect }: IntentRowProps) {
    return (
        <div className="flex gap-3 px-6 overflow-x-auto no-scrollbar snap-x py-4 relative z-10">
            {INTENTS.map((intent) => {
                const isSelected = selectedIntent === intent.id;

                return (
                    <motion.button
                        key={intent.id}
                        onClick={() => onSelect(isSelected ? null : intent.id as IntentType)}
                        layout
                        className={cn(
                            "relative flex-shrink-0 snap-center min-w-[28vw] md:min-w-[140px] h-32 md:h-40 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-colors duration-500 outline-none",
                            isSelected
                                ? "glass-elevated bg-white/[0.08] shadow-2xl ring-1 ring-white/20"
                                : "glass-surface hover:bg-white/[0.04] active:scale-95"
                        )}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                    >
                        {/* Icon */}
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                            isSelected
                                ? "bg-white text-black shadow-lg scale-110"
                                : "bg-white/5 text-text-secondary opacity-60"
                        )}>
                            <Icon name={intent.icon as any} size={24} strokeWidth={isSelected ? 2 : 1.5} />
                        </div>

                        {/* Label */}
                        <span className={cn(
                            "text-sm font-medium tracking-tight transition-colors duration-300",
                            isSelected ? "text-text-primary" : "text-text-secondary opacity-60"
                        )}>
                            {intent.label}
                        </span>

                        {/* Active Indicator (Subtle Glow) */}
                        {isSelected && (
                            <motion.div
                                layoutId="intent-glow"
                                className="absolute inset-0 rounded-[2rem] shadow-[0_0_40px_-10px_rgba(255,255,255,0.15)] pointer-events-none"
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
