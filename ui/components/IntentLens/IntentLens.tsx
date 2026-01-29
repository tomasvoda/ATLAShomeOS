'use client';

import React, { useState } from 'react';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { TheLens } from './TheLens';
import { DeviceCloud } from './DeviceCloud';
import { useApp } from '@/context/AppContext';

export type IntentType = 'lights' | 'climate' | 'security' | 'energy' | 'media';
// Updated Scope Types according to new strict prompt: "Here, This Room, Whole Home" + Custom implies Detail
export type ScopeType = 'here' | 'room' | 'home' | 'custom';
export type ViewState = 'calm' | 'focused' | 'detail';

interface IntentLensProps {
    roomId?: string;
}

export function IntentLens({ roomId }: IntentLensProps) {
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
        setActiveScope('here'); // Reset scope on new intent
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
            setViewState('focused'); // Back from Detail -> Focused
            setActionActive(true);
        } else if (viewState === 'focused') {
            setViewState('calm'); // Back from Focused -> Calm
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

    return (
        <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col font-sans">

            {/* Header / Back Navigation (Visible in Focused/Detail) */}
            {viewState !== 'calm' && (
                <div className="absolute top-6 left-6 z-30 animate-in fade-in slide-in-from-top-4 duration-500">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-sm group-hover:bg-white/80 transition-all">
                            <Icon name="ArrowLeft" size={18} />
                        </div>
                        <span className="text-sm font-medium tracking-wide capitalize bg-white/40 backdrop-blur px-3 py-1 rounded-full border border-white/20">
                            {activeIntent}
                        </span>
                    </button>
                </div>
            )}

            {/* STATE 1: CALM (Default) - Question: "What do I want to change?" */}
            {viewState === 'calm' && (
                <div className="flex-1 flex flex-col justify-center px-6 animate-in fade-in zoom-in-95 duration-500">
                    <h2 className="text-3xl font-light text-gray-900 mb-2 tracking-tight text-center">
                        {mode === 'Room OS' ? 'Room Controls' : 'Control Center'}
                    </h2>
                    <p className="text-center text-gray-400 mb-12 font-light">What do you want to change?</p>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
                        {(['lights', 'climate', 'security', 'media', 'energy'] as IntentType[]).map(intent => (
                            <button
                                key={intent}
                                onClick={() => handleIntentSelect(intent)}
                                className={cn(
                                    "aspect-square rounded-3xl bg-white/40 border border-white/50 shadow-sm hover:shadow-md hover:bg-white/60 transition-all flex flex-col items-center justify-center gap-4 group backdrop-blur-sm",
                                    intent === 'media' && "col-span-2 aspect-[2/1]" // Distinct media tile
                                )}
                            >
                                <div className="w-14 h-14 rounded-full bg-white/50 group-hover:bg-white flex items-center justify-center text-gray-600 transition-colors shadow-inner">
                                    <Icon name={getIntentIcon(intent)} size={26} />
                                </div>
                                <span className="font-medium text-gray-700 capitalize tracking-wide">{intent}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STATE 2: FOCUSED ACTION (The Lens) */}
            {viewState === 'focused' && activeIntent && (
                <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-12 duration-500 w-full relative">

                    {/* The Lens (Primary Control) */}
                    <div className="scale-100 transition-transform duration-500 mb-8">
                        <TheLens
                            intent={activeIntent}
                            scope={activeScope}
                            label={actionLabel}
                        />
                    </div>

                    {/* Controls Layer */}
                    <div className="flex flex-col items-center gap-6 w-full max-w-md px-6">

                        {/* Scope Selector */}
                        <div className="flex p-1 rounded-full bg-gray-100/50 backdrop-blur-md border border-white/20 shadow-inner gap-1">
                            {[
                                { id: 'here', label: 'Here' },
                                { id: 'room', label: 'This Room' },
                                { id: 'home', label: 'Whole Home' },
                                { id: 'custom', label: 'Custom...' }
                            ].map(scope => (
                                <button
                                    key={scope.id}
                                    onClick={() => handleScopeSelect(scope.id as ScopeType)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
                                        activeScope === scope.id
                                            ? "bg-white text-gray-900 shadow-sm scale-100"
                                            : "text-gray-400 hover:text-gray-600 scale-95"
                                    )}
                                >
                                    {scope.label}
                                </button>
                            ))}
                        </div>

                        {/* Duration Selector */}
                        <div className="flex items-center justify-center gap-2 w-full">
                            <div className="flex items-center gap-1 bg-white/30 backdrop-blur px-2 py-2 rounded-2xl border border-white/40">
                                {['Now', '1h', 'Morning'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-sm transition-all duration-200",
                                            duration === d
                                                ? "bg-white text-gray-900 font-medium shadow-sm"
                                                : "text-gray-500 hover:text-gray-800"
                                        )}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STATE 3: DETAIL (Device Cloud Overlay) */}
            {/* The ONLY place devices are visible */}
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
