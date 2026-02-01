'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { IntentType, ScopeType } from './IntentLens';

interface TheLensProps {
    intent: IntentType;
    scope: ScopeType;
    label: string;
}

export function TheLens({ intent, scope, label }: TheLensProps) {
    const [isPressed, setIsPressed] = useState(false);
    const [dragValue, setDragValue] = useState(50); // 0-100 placeholder

    // Visual Styles based on Intent
    const styles = React.useMemo(() => {
        switch (intent) {
            case 'lights': return { bg: 'bg-amber-100', text: 'text-amber-600', ring: 'border-amber-200' };
            case 'climate': return { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'border-blue-200' };
            case 'media': return { bg: 'bg-purple-100', text: 'text-purple-600', ring: 'border-purple-200' };
            case 'security': return { bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'border-emerald-200' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', ring: 'border-gray-200' };
        }
    }, [intent]);

    // Weighted visionOS Motion System - Liquid Glass Easing
    const visionTransition = {
        ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
        duration: 0.18, // Micro interactions timing
    };

    return (
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            {/* Outer Glow / Ring */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.2, scale: 1.1 }}
                transition={visionTransition}
                className={cn(
                    "absolute inset-0 rounded-full border-[1px] border-white/5 bg-white/[0.02] will-change-transform",
                    styles.ring
                )}
            />

            {/* The Actual Lens Button */}
            <motion.button
                initial={{ scale: 0.98, opacity: 0.85 }}
                animate={{
                    scale: isPressed ? 0.96 : 1,
                    opacity: 1,
                }}
                whileHover={{ scale: 1.01 }}
                transition={visionTransition}
                className={cn(
                    "relative w-56 h-56 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center shadow-2xl outline-none glass-liquid will-change-transform active-energized",
                    styles.bg
                )}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
            >
                {/* Drag Indicator Ring (Mock) */}
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg] pointer-events-none" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" className={styles.text} strokeOpacity="0.1" />
                    <motion.circle
                        cx="50" cy="50" r="48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={styles.text}
                        strokeDasharray="301"
                        animate={{ strokeDashoffset: 301 - (301 * dragValue) / 100 }}
                        transition={visionTransition}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Content */}
                <div className="flex flex-col items-center gap-2 z-10 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/[0.05] group-hover:bg-white/[0.1] flex items-center justify-center text-text-primary transition-colors active-inner-glow">
                        <Icon name={getIntentIcon(intent)} size={28} strokeWidth={1.5} />
                    </div>
                    <span className={cn("text-4xl font-light tracking-tighter", styles.text)}>
                        {intent === 'climate' ? '21°' :
                            intent === 'media' ? 'Play' :
                                intent === 'lights' ? `${dragValue}%` :
                                    'Active'}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary opacity-40 mt-2">{scope}</span>
                </div>
            </motion.button>

            {/* Action Label Float */}
            <AnimatePresence>
                {!isPressed && (
                    <motion.div
                        initial={{ opacity: 0, transform: 'translate3d(0, 6px, 0)' }}
                        animate={{ opacity: 1, transform: 'translate3d(0, 0, 0)' }}
                        exit={{ opacity: 0, transform: 'translate3d(0, 6px, 0)' }}
                        transition={visionTransition}
                        className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-text-secondary text-[11px] font-bold uppercase tracking-[0.2em] will-change-transform"
                    >
                        {label}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function getIntentIcon(intent: IntentType): any {
    switch (intent) {
        case 'lights': return 'Lightbulb';
        case 'climate': return 'Thermometer';
        case 'media': return 'Music';
        case 'security': return 'Shield';
        case 'energy': return 'Zap';
        default: return 'Circle';
    }
}
