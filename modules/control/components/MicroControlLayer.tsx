'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/ui/primitives/Icon';
import { IntentType } from './IntentRow';
import { UXThing } from '@/core/mock/types';
import { ControlTile } from './ControlTile'; // Re-use atomic tile for now, but in a new layout

interface MicroControlLayerProps {
    intent: IntentType;
    things: UXThing[];
}

export function MicroControlLayer({ intent, things }: MicroControlLayerProps) {
    // Filter things based on intent
    const relevantThings = React.useMemo(() => {
        if (!intent) return [];
        return things.filter(t => {
            if (intent === 'light') return t.capabilities.includes('light');
            if (intent === 'climate') return t.capabilities.includes('climate') || t.capabilities.includes('fan');
            if (intent === 'media') return t.capabilities.includes('media');
            if (intent === 'security') return t.capabilities.includes('security') || t.capabilities.includes('lock') || t.capabilities.includes('camera');
            return false;
        });
    }, [intent, things]);

    return (
        <AnimatePresence mode="wait">
            {intent && (
                <motion.div
                    key={intent}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                        duration: 0.32,
                        ease: [0.22, 0.61, 0.36, 1]
                    }}
                    className="w-full min-h-[40vh] bg-black/40 backdrop-blur-3xl rounded-t-[3rem] border-t border-white/10 mt-8 p-8 pb-32 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h3 className="text-xl font-medium text-text-primary tracking-tight">
                            {intent.charAt(0).toUpperCase() + intent.slice(1)} Controls
                        </h3>
                        {/* Placeholder for "Presets" or simplified controls */}
                        <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-full glass-surface text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                                Auto
                            </button>
                            <button className="px-4 py-2 rounded-full glass-surface text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                                Off
                            </button>
                        </div>
                    </div>

                    {/* Main Control Surface (Sliders/Dials would go here - using Grid for now) */}
                    {relevantThings.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relevantThings.map(thing => (
                                <ControlTile
                                    key={thing.id}
                                    thing={thing}
                                    icon={
                                        intent === 'light' ? 'Lightbulb' :
                                            intent === 'climate' ? 'Thermometer' :
                                                intent === 'media' ? 'Tv' : 'Shield'
                                    }
                                    // Custom colors per intent
                                    activeColor={
                                        intent === 'light' ? 'text-amber-400' :
                                            intent === 'climate' ? 'text-blue-400' :
                                                intent === 'media' ? 'text-purple-400' : 'text-emerald-400'
                                    }
                                    accentColor={
                                        intent === 'light' ? 'bg-amber-400/20 shadow-[0_4px_12px_-2px_rgba(251,191,36,0.15)]' :
                                            intent === 'climate' ? 'bg-blue-400/20 shadow-[0_4px_12px_-2px_rgba(96,165,250,0.15)]' :
                                                intent === 'media' ? 'bg-purple-400/20 shadow-[0_4px_12px_-2px_rgba(192,132,252,0.15)]' : 'bg-emerald-400/20 shadow-[0_4px_12px_-2px_rgba(52,211,153,0.15)]'
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 opacity-40">
                            <Icon name="Search" size={32} className="mb-4" />
                            <p className="text-sm font-medium uppercase tracking-widest">No devices found</p>
                        </div>
                    )}

                </motion.div>
            )}
        </AnimatePresence>
    );
}
