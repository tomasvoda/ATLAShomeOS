'use client';

import React, { useRef, useState } from 'react';
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

    return (
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            {/* Outer Glow / Ring */}
            <div className={cn(
                "absolute inset-0 rounded-full border-[1px] opacity-20 scale-110",
                styles.ring
            )} />

            {/* The Actual Lens Button */}
            <button
                className={cn(
                    "relative w-56 h-56 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 outline-none",
                    styles.bg,
                    isPressed ? "scale-95 shadow-inner" : "hover:scale-[1.02]"
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
                    <circle
                        cx="50" cy="50" r="48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={styles.text}
                        strokeDasharray="301"
                        strokeDashoffset={301 - (301 * dragValue) / 100}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Content */}
                <div className="flex flex-col items-center gap-2 z-10 pointer-events-none">
                    <Icon name={getIntentIcon(intent)} size={48} className={styles.text} />
                    <span className={cn("text-4xl font-light tracking-tighter", styles.text)}>
                        {intent === 'climate' ? '21°' :
                            intent === 'media' ? 'Play' :
                                intent === 'lights' ? `${dragValue}%` :
                                    'Active'}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">{scope}</span>
                </div>
            </button>

            {/* Action Label Float */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-gray-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {isPressed ? 'Adjusting...' : label}
            </div>
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
