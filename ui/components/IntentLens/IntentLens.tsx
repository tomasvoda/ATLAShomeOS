'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { TheLens } from './TheLens';
import { DeviceCloud } from './DeviceCloud';
import { useApp } from '@/context/AppContext';
import { usePresence } from '@/context/PresenceContext';

export type IntentType = 'lights' | 'climate' | 'security' | 'energy' | 'media';
// Updated Scope Types according to new strict prompt: "Here, This Room, Whole Home" + Custom implies Detail
export type ScopeType = 'here' | 'room' | 'home' | 'custom';
export type ViewState = 'calm' | 'focused' | 'detail';

interface IntentLensProps {
    roomId?: string;
}

export function IntentLens({ roomId }: IntentLensProps) {
    const { activeRoom } = usePresence();
    // 3-STATE MACHINE
    const [viewState, setViewState] = useState<ViewState>('calm');
    const [activeIntent, setActiveIntent] = useState<IntentType | null>(null);
    const [activeScope, setActiveScope] = useState<ScopeType>('here');
    const [duration, setDuration] = useState('Now');

    // Room OS vs Control Center Mode
    const mode = roomId ? 'Room OS' : 'Control Center';

    const { setActionActive } = useApp();

    // TRANSITIONS
    const handleIntentSelect = (intent: IntentType) => {
        setActiveIntent(intent);
        setViewState('focused');
        setActiveScope('here');
        setActionActive(true);
    };

    const handleScopeSelect = (scope: ScopeType) => {
        if (scope === 'custom') {
            setViewState('detail');
            setActionActive(true);
        } else {
            setActiveScope(scope);
        }
    };

    const handleBack = () => {
        if (viewState === 'detail') {
            setViewState('focused');
            setActionActive(true);
        } else if (viewState === 'focused') {
            setViewState('calm');
            setActiveIntent(null);
            setActionActive(false);
        }
    };

    // LABELS
    const actionLabel = React.useMemo(() => {
        switch (activeIntent) {
            case 'lights': return 'Toggle Lights';
            case 'climate': return 'Set Comfort';
            case 'media': return 'Play / Pause';
            case 'security': return 'Arm System';
            case 'energy': return 'Optimize';
            default: return 'Action';
        }
    }, [activeIntent]);

    // Weighted visionOS Motion System - Liquid Glass Easing
    const visionTransition = {
        ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
        duration: 0.32, // Focus changes
    };

    return (
        <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col font-sans antialiased">
            <AnimatePresence>
                <motion.div
                    key={activeRoom || 'all'}
                    initial={{ opacity: 0, transform: 'translate3d(0, 4px, 0)' }}
                    animate={{ opacity: 1, transform: 'translate3d(0, 0, 0)' }}
                    exit={{ opacity: 0, transform: 'translate3d(0, -4px, 0)' }}
                    transition={visionTransition}
                    className="flex-1 flex flex-col relative will-change-[transform,opacity]"
                >
                    {/* Header / Back Navigation */}
                    <AnimatePresence>
                        {viewState !== 'calm' && (
                            <motion.div
                                initial={{ opacity: 0, transform: 'translate3d(0, -20px, 0)' }}
                                animate={{ opacity: 1, transform: 'translate3d(0, 0, 0)' }}
                                exit={{ opacity: 0, transform: 'translate3d(0, -20px, 0)' }}
                                transition={visionTransition}
                                className="absolute top-8 left-8 z-30 will-change-transform"
                            >
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-4 text-text-secondary hover:text-text-primary transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full glass-elevated flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-all">
                                        <Icon name="ArrowLeft" size={20} />
                                    </div>
                                    <span className="text-[13px] font-medium tracking-widest uppercase opacity-60 bg-text-primary/5 backdrop-blur px-4 py-1.5 rounded-full border border-glass-border">
                                        {activeIntent}
                                    </span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* DUAL-MOUNT VIEW STATES */}
                    <AnimatePresence>
                        {viewState === 'calm' && (
                            <motion.div
                                key="calm"
                                initial={{ opacity: 0.96, filter: 'blur(6px)', y: 4 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                exit={{ opacity: 0.96, filter: 'blur(6px)', y: 4 }}
                                transition={visionTransition}
                                className="flex-1 flex flex-col justify-center px-6 will-change-[transform,opacity,filter]"
                            >
                                <div className="text-center space-y-2 mb-16">
                                    <h2 className="text-4xl font-light text-text-primary tracking-tight">
                                        {mode === 'Room OS' ? 'Room Controls' : 'Control Center'}
                                    </h2>
                                    <p className="text-text-secondary opacity-40 font-light text-lg tracking-wide uppercase text-[10px]">What do you want to change?</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full max-sm mx-auto">
                                    {(['lights', 'climate', 'security', 'media', 'energy'] as IntentType[]).map(intent => {
                                        const isActive = activeIntent === intent;
                                        return (
                                            <button
                                                key={intent}
                                                onClick={() => handleIntentSelect(intent)}
                                                className={cn(
                                                    "aspect-square rounded-[2.2rem] glass-liquid hover:bg-white/[0.08] transition-all duration-320 flex flex-col items-center justify-center gap-5 group shadow-sm hover:shadow-2xl active:scale-95",
                                                    intent === 'media' && "col-span-2 aspect-[2.2/1]",
                                                    isActive && "active-energized"
                                                )}
                                            >
                                                <div className="w-16 h-16 rounded-full bg-white/[0.05] group-hover:bg-white/[0.1] flex items-center justify-center text-text-primary transition-colors inner-glow">
                                                    <Icon name={getIntentIcon(intent)} size={28} strokeWidth={1.5} />
                                                </div>
                                                <span className="text-xs font-semibold text-text-primary opacity-60 group-hover:opacity-100 uppercase tracking-[0.15em]">{intent}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {viewState === 'focused' && activeIntent && (
                            <motion.div
                                key="focused"
                                initial={{ opacity: 0.96, filter: 'blur(6px)', y: 4 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                exit={{ opacity: 0.96, filter: 'blur(6px)', y: 4 }}
                                transition={visionTransition}
                                className="absolute inset-0 flex flex-col items-center justify-center w-full will-change-[transform,opacity,filter]"
                            >
                                {/* The Lens (Primary Control) */}
                                <div className="mb-12">
                                    <TheLens
                                        intent={activeIntent}
                                        scope={activeScope}
                                        label={actionLabel}
                                    />
                                </div>

                                {/* Controls Layer */}
                                <div className="flex flex-col items-center gap-8 w-full max-w-md px-6">
                                    <div className="flex p-1.5 rounded-full glass-dock shadow-2xl gap-1.5">
                                        {[
                                            { id: 'here', label: 'Here' },
                                            { id: 'room', label: 'Room' },
                                            { id: 'home', label: 'Home' },
                                            { id: 'custom', label: 'Custom' }
                                        ].map(scope => (
                                            <button
                                                key={scope.id}
                                                onClick={() => handleScopeSelect(scope.id as ScopeType)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-320 active:scale-95",
                                                    activeScope === scope.id
                                                        ? "text-background active-energized !bg-text-primary !scale-100"
                                                        : "text-text-secondary hover:text-text-primary hover:bg-white/[0.05] scale-95"
                                                )}
                                            >
                                                {scope.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex p-1 rounded-2xl glass-surface/50">
                                        {['Now', '1h', 'Morning'].map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setDuration(d)}
                                                className={cn(
                                                    "px-5 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                                                    duration === d
                                                        ? "bg-text-primary/10 text-text-primary shadow-sm"
                                                        : "text-text-secondary hover:text-text-primary opacity-40 hover:opacity-100"
                                                )}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>

            {/* STATE 3: DETAIL (Device Cloud Overlay) */}
            <DeviceCloud
                isOpen={viewState === 'detail'}
                onClose={() => handleBack()}
                intent={activeIntent || 'lights'}
            />

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
