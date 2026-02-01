'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { useUXData } from '@/context/UXDataContext';
import { IntentType } from './IntentLens';

interface DeviceCloudProps {
    isOpen: boolean;
    onClose: () => void;
    intent: IntentType;
}

export function DeviceCloud({ isOpen, onClose, intent }: DeviceCloudProps) {
    const { activeThings } = useUXData();

    // Filter things based on intent
    const relevantThings = React.useMemo(() => {
        return activeThings.filter(t => {
            if (intent === 'lights') return t.capabilities.includes('light');
            if (intent === 'climate') return t.capabilities.includes('climate') || t.capabilities.includes('fan');
            if (intent === 'media') return t.capabilities.includes('media');
            if (intent === 'security') return t.capabilities.includes('security') || t.capabilities.includes('lock') || t.capabilities.includes('camera');
            return false;
        });
    }, [activeThings, intent]);

    const visionTransition = {
        ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number], // --ease-liquid
        duration: 0.32, // Overlay timing
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] pointer-events-none flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-auto"
                    />

                    <motion.div
                        initial={{ transform: 'translate3d(10px, 0, 0)', opacity: 0 }}
                        animate={{ transform: 'translate3d(0, 0, 0)', opacity: 1 }}
                        exit={{ transform: 'translate3d(10px, 0, 0)', opacity: 0 }}
                        transition={visionTransition}
                        className="relative w-full md:w-[400px] glass-liquid h-[70vh] md:h-screen shadow-2xl pointer-events-auto flex flex-col will-change-transform overflow-visible"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between glass-liquid sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-text-primary capitalize flex items-center gap-2">
                                <Icon name={intent === 'climate' ? 'Thermometer' : 'Zap'} size={20} />
                                {intent} Devices
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <Icon name="X" size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            <div className="grid grid-cols-2 gap-4 pb-20">
                                {relevantThings.length > 0 ? relevantThings.map(thing => (
                                    <button
                                        key={thing.id}
                                        className={cn(
                                            "aspect-square rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all p-4 active:scale-95 group relative",
                                            thing.state.operational === 'on'
                                                ? "glass-liquid active-energized !scale-100"
                                                : "glass-liquid bg-white/[0.04] opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        <Icon
                                            name={getIconForCapability(thing.capabilities)}
                                            size={32}
                                            className={cn(
                                                "transition-colors duration-500",
                                                thing.state.operational === 'on' ? "text-text-primary" : "text-text-secondary opacity-20 group-hover:opacity-40"
                                            )}
                                        />
                                        <span className={cn(
                                            "font-medium text-[13px] tracking-tight text-center line-clamp-2 transition-colors",
                                            thing.state.operational === 'on' ? "text-text-primary" : "text-text-secondary opacity-60"
                                        )}>
                                            {thing.name}
                                        </span>
                                        <span className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-40">
                                            {thing.state.operational}
                                        </span>

                                        {thing.state.operational === 'on' && (
                                            <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-text-primary shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                                        )}
                                    </button>
                                )) : (
                                    <div className="col-span-2 text-center text-text-secondary opacity-40 py-12">
                                        No devices found for {intent}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function getIconForCapability(caps: string[]): any {
    if (caps.includes('light')) return 'Lightbulb';
    if (caps.includes('climate') || caps.includes('fan')) return 'Thermometer';
    if (caps.includes('security') || caps.includes('lock')) return 'Lock';
    if (caps.includes('media')) return 'Tv';
    if (caps.includes('camera')) return 'Camera';
    if (caps.includes('appliance')) return 'Power';
    return 'Box';
}
