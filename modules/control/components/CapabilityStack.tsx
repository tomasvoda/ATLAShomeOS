'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { ThingState, UXThing } from '@/core/mock/types';
import { ControlTile } from './ControlTile';

interface CapabilityStackProps {
    title: string;
    icon: any;
    things: UXThing[];
    activeColor: string;
    accentColor: string;
    defaultExpanded?: boolean;
}

export function CapabilityStack({
    title,
    icon,
    things,
    activeColor,
    accentColor,
    defaultExpanded = false
}: CapabilityStackProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const activeCount = things.filter(t => t.state.operational === 'on' || t.state.operational === 'playing').length;

    // "Liquid Glass" easing - Tuned for speed (Snappy)
    const transition = {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8
    } as const;

    return (
        <motion.div
            layout
            className={cn(
                "rounded-[2.5rem] border border-glass-border/10 overflow-hidden relative transition-colors duration-500",
                isExpanded ? "glass-surface-heavy shadow-2xl bg-black/40" : "glass-surface hover:bg-white/[0.02]"
            )}
            initial={false}
            animate={{
                // Subtle darkening when expanded to focus attention
                backgroundColor: isExpanded ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0)"
            }}
        >
            {/* Header / Trigger */}
            <motion.button
                layout="position"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-6 z-10 relative outline-none"
            >
                <div className="flex items-center gap-4">
                    <motion.div
                        layout
                        className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                            isExpanded ? cn("glass-elevated", "bg-white/5") : "glass-surface-heavy"
                        )}
                    >
                        <Icon name={icon} size={22} className={cn(activeColor, "brightness-110")} />
                    </motion.div>

                    <div className="flex flex-col items-start gap-0.5">
                        <motion.h2 layout className="text-lg font-medium text-text-primary tracking-tight">
                            {title}
                        </motion.h2>
                        <motion.span layout className="text-[10px] font-bold text-text-secondary opacity-40 uppercase tracking-widest">
                            {things.length} Devices &bull; {activeCount} Active
                        </motion.span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Preview Dots (Only when collapsed) */}
                    <AnimatePresence>
                        {!isExpanded && activeCount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center -space-x-1 mr-2"
                            >
                                {[...Array(Math.min(activeCount, 3))].map((_, i) => (
                                    <div key={i} className={cn("w-2 h-2 rounded-full ring-2 ring-black/20", activeColor.replace('text-', 'bg-'))} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Icon
                        name="ChevronDown"
                        size={18}
                        className={cn(
                            "text-text-secondary transition-transform duration-300 opacity-40",
                            isExpanded && "rotate-180 opacity-100"
                        )}
                    />
                </div>
            </motion.button>

            {/* Expanded Content Grid */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={transition}
                        className="px-6 pb-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.25, delay: 0.05 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2"
                        >
                            {things.map(thing => (
                                <ControlTile
                                    key={thing.id}
                                    thing={thing}
                                    icon={icon}
                                    activeColor={activeColor}
                                    accentColor={accentColor}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
