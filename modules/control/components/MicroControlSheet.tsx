'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/ui/primitives/Icon';
import { IntentType } from './IntentRow';
import { UXThing } from '@/core/mock/types';

interface MicroControlSheetProps {
    intent: IntentType;
    things: UXThing[];
    onClose: () => void;
}

// VisionOS standard easing
const VISION_EASE = [0.22, 0.61, 0.36, 1] as const;

export function MicroControlSheet({ intent, things, onClose }: MicroControlSheetProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // if (!intent) return null; // Removed to allow AnimatePresence to handle exit animations

    // Common Components for Uniform Layout
    const OverlayHeader = ({ title, sensorValue, sensorIcon }: { title: string, sensorValue?: string, sensorIcon?: any }) => (
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
            <div className="flex flex-col">
                <h3 className="text-lg font-medium text-text-primary tracking-tight">
                    {title}
                </h3>
                {sensorValue && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Icon name={sensorIcon || 'Activity'} size={12} className="text-text-secondary opacity-70" />
                        <span className="text-xs font-medium text-text-secondary tracking-wide">{sensorValue}</span>
                    </div>
                )}
            </div>
            {/* Visual Anchor / Close Hint */}
            <div className="flex gap-2">
                <div className="w-10 h-1 rounded-full bg-black/10 dark:bg-white/10 mx-auto absolute top-3 left-0 right-0" />
            </div>
        </div>
    );

    const renderContent = () => {
        if (!intent) return null;
        switch (intent) {
            case 'light':
                return (
                    <div className="space-y-6">
                        {/* Header */}
                        <OverlayHeader title="Lighting" sensorValue="350 lux" sensorIcon="Sun" />

                        {/* Primary Toggle (Context B) & Main Control (Context C) Combined visually or separate? 
                           User asked for: B) Primary Toggle AND C) Main Parameter.
                        */}
                        <div className="flex items-center gap-4 px-6">
                            {/* Big Toggle */}
                            <button className="h-32 w-24 rounded-[1.8rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                                <Icon name="Power" size={28} className="text-text-primary" />
                                <span className="text-xs font-bold uppercase text-text-secondary tracking-widest">Off</span>
                            </button>

                            {/* Main Slider */}
                            <div className="h-32 flex-1 bg-amber-400/20 rounded-[1.8rem] border border-amber-400/20 relative overflow-hidden flex flex-col justify-end p-6 group active:scale-[0.99] transition-transform">
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent opacity-60" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <Icon name="Sun" size={32} className="text-amber-700 dark:text-amber-100 drop-shadow-lg" />
                                    <span className="text-3xl font-light text-text-primary tracking-tight">65%</span>
                                </div>
                            </div>
                        </div>

                        {/* Presets (Context D) */}
                        <div className="grid grid-cols-3 gap-3 px-6 pb-6">
                            {['Relax', 'Focus', 'Bright'].map(preset => (
                                <button key={preset} className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'climate':
                return (
                    <div className="space-y-6">
                        <OverlayHeader title="Climate" sensorValue="22.4° • 45%" sensorIcon="Thermometer" />

                        <div className="flex items-center gap-4 px-6">
                            {/* Toggle */}
                            <button className="h-32 w-24 rounded-[1.8rem] bg-orange-500/20 border border-orange-500/20 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                                <Icon name="Flame" size={28} className="text-orange-700 dark:text-orange-200" />
                                <span className="text-xs font-bold uppercase text-orange-700/70 dark:text-orange-200/70 tracking-widest">Heating</span>
                            </button>

                            {/* Dial / Temp Control */}
                            <div className="h-32 flex-1 flex items-center justify-between px-6 bg-black/5 dark:bg-white/5 rounded-[1.8rem] border border-black/5 dark:border-white/10">
                                <button className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10">
                                    <Icon name="Minus" size={20} />
                                </button>
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-light text-text-primary tracking-tighter">21.5°</span>
                                    <span className="text-xs text-text-secondary uppercase tracking-widest mt-1">Target</span>
                                </div>
                                <button className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10">
                                    <Icon name="Plus" size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="grid grid-cols-3 gap-3 px-6 pb-6">
                            {['Eco', 'Comfort', 'Boost'].map(mode => (
                                <button key={mode} className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'shades':
                return (
                    <div className="space-y-6">
                        <OverlayHeader title="Shades" sensorValue="Sunlight: Direct" sensorIcon="SunDim" />

                        <div className="flex items-center gap-4 px-6">
                            {/* Toggle (Close All) */}
                            <button className="h-32 w-24 rounded-[1.8rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                                <Icon name="ArrowDownToLine" size={28} className="text-text-primary" />
                                <span className="text-xs font-bold uppercase text-text-secondary tracking-widest">Close</span>
                            </button>

                            {/* Shade Slider */}
                            <div className="h-32 flex-1 bg-black/5 dark:bg-white/5 rounded-[1.8rem] border border-black/5 dark:border-white/10 relative overflow-hidden flex flex-col justify-end p-6 group active:scale-[0.99] transition-transform">
                                <div className="absolute top-0 left-0 right-0 h-[40%] bg-black/30 border-b border-black/5 dark:border-white/10" />
                                <div className="relative z-10 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <Icon name="GalleryVerticalEnd" size={28} className="text-text-primary drop-shadow-lg" />
                                        <span className="text-xl font-light text-text-primary tracking-tight">40% Open</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="grid grid-cols-3 gap-3 px-6 pb-6">
                            {['Open', 'Privacy', 'Closed'].map(action => (
                                <button key={action} className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            // ... other cases (Media, Security) would follow same pattern
            case 'media':
                return (
                    <div className="space-y-6">
                        <OverlayHeader title="Media" sensorValue="Apple TV" sensorIcon="Monitor" />

                        <div className="flex items-center gap-4 px-6">
                            {/* Play/Pause Toggle */}
                            <button className="h-32 w-24 rounded-[1.8rem] bg-purple-500/20 border border-purple-500/20 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                                <Icon name="Play" size={28} className="text-purple-700 dark:text-purple-200 ml-1" />
                                <span className="text-xs font-bold uppercase text-purple-700/70 dark:text-purple-200/70 tracking-widest">Play</span>
                            </button>

                            {/* Volume Slider */}
                            <div className="h-32 flex-1 bg-black/5 dark:bg-white/5 rounded-[1.8rem] border border-black/5 dark:border-white/10 relative overflow-hidden flex flex-col justify-end p-6 group active:scale-[0.99] transition-transform">
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-400/10 to-transparent opacity-60" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <Icon name="Volume2" size={32} className="text-purple-700 dark:text-purple-100 drop-shadow-lg" />
                                    <span className="text-3xl font-light text-text-primary tracking-tight">45</span>
                                </div>
                            </div>
                        </div>

                        {/* Source Presets */}
                        <div className="grid grid-cols-3 gap-3 px-6 pb-6">
                            {['TV', 'Music', 'Quiet'].map(preset => (
                                <button key={preset} className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6">
                        <OverlayHeader title="Security" sensorValue="All Secure" sensorIcon="ShieldCheck" />

                        <div className="flex items-center gap-4 px-6">
                            {/* Arm Toggle */}
                            <button className="h-32 w-24 rounded-[1.8rem] bg-emerald-500/20 border border-emerald-500/20 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                                <Icon name="Shield" size={28} className="text-emerald-700 dark:text-emerald-200" />
                                <span className="text-xs font-bold uppercase text-emerald-700/70 dark:text-emerald-200/70 tracking-widest">Armed</span>
                            </button>

                            {/* Mode Display / Selector */}
                            <div className="h-32 flex-1 flex items-center justify-center px-6 bg-black/5 dark:bg-white/5 rounded-[1.8rem] border border-black/5 dark:border-white/10">
                                <div className="flex flex-col items-center">
                                    <Icon name="Lock" size={32} className="text-emerald-600 dark:text-emerald-400 mb-2 opacity-80" />
                                    <span className="text-xl font-light text-text-primary tracking-tight">Night Mode</span>
                                </div>
                            </div>
                        </div>

                        {/* Mode Presets */}
                        <div className="grid grid-cols-3 gap-3 px-6 pb-6">
                            {['Home', 'Away', 'Night'].map(mode => (
                                <button key={mode} className={`h-14 rounded-2xl border text-sm font-medium transition-colors ${mode === 'Night' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-200' : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-text-secondary'}`}>
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            default:
                // Fallback
                return (
                    <div className="space-y-6">
                        <OverlayHeader title={intent.charAt(0).toUpperCase() + intent.slice(1)} />
                        <div className="px-6 pb-6">
                            <div className="p-8 text-center bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 text-text-secondary/60">
                                <Icon name="Activity" size={32} className="mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Control surface for {intent}</p>
                            </div>
                        </div>
                    </div>
                )
        }
    };

    const content = (
        <AnimatePresence>
            {intent && (
                <>
                    {/* Backdrop - Dims everything else */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: VISION_EASE }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[140]"
                    />

                    {/* Floating Control Panel */}
                    <motion.div
                        key={intent}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{
                            duration: 0.28,
                            ease: VISION_EASE
                        }}
                        className="fixed bottom-28 left-4 right-4 md:inset-0 md:flex md:items-center md:justify-center z-[150] pointer-events-none"
                    >
                        {/* Panel Container */}
                        <div className="pointer-events-auto w-full md:w-[420px] glass-liquid rounded-[2.2rem] overflow-hidden">
                            {/* Content */}
                            <div className="flex flex-col">
                                {renderContent()}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    if (!mounted) return null;

    return createPortal(content, document.body);
}
