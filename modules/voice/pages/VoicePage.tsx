'use client';

import React from 'react';
import { Panel } from '@/ui/primitives/Panel';
import { ResponsiveContainer } from '@/ui/primitives/ResponsiveContainer';
import { Icon } from '@/ui/primitives/Icon';
import { Button } from '@/ui/primitives/Button';
import { useUXData } from '@/context/UXDataContext';
import { cn } from '@/core/utils/cn';

export function VoicePage() {
    const { currentVoiceSnapshot } = useUXData();

    return (
        <ResponsiveContainer className="py-12 h-[calc(100vh-140px)] flex flex-col font-sans antialiased">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full glass-surface flex items-center justify-center">
                    <Icon name="Mic" size={24} className="text-blue-400" />
                </div>
                <h1 className="text-4xl font-light text-text-primary tracking-tight">Voice Interface</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-12">
                {/* Voice Activity Indicator */}
                <div className="relative">
                    <div className={cn(
                        "w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 glass-elevated shadow-2xl relative z-10",
                        currentVoiceSnapshot?.state === 'listening' ? "scale-110" : "scale-100"
                    )}>
                        <Icon name="Mic" size={56} strokeWidth={1.5} className={cn(
                            "transition-colors duration-500",
                            currentVoiceSnapshot?.state === 'listening' ? "text-red-400" : "text-blue-400"
                        )} />
                    </div>

                    {/* Pulsing Aura */}
                    <div className={cn(
                        "absolute inset-0 rounded-full transition-all duration-1000",
                        currentVoiceSnapshot?.state === 'listening' ? "bg-red-500/10 scale-150 animate-pulse opacity-100" :
                            currentVoiceSnapshot?.state === 'thinking' ? "bg-blue-500/10 scale-125 animate-bounce opacity-100" :
                                "scale-100 opacity-0"
                    )} />
                </div>

                <div className="text-center max-w-lg space-y-8 px-4">
                    <p className="text-3xl text-text-primary font-light italic leading-snug tracking-tight">
                        {currentVoiceSnapshot?.transcript ? `"${currentVoiceSnapshot.transcript}"` : "..."}
                    </p>

                    {currentVoiceSnapshot && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="glass-surface p-6 rounded-[2.5rem] border border-glass-border/10">
                                <p className="text-[10px] font-bold text-text-secondary opacity-30 uppercase tracking-[0.2em] mb-2 text-center">Interpretation</p>
                                <p className="text-text-secondary font-light text-lg">{currentVoiceSnapshot.interpretation}</p>

                                {currentVoiceSnapshot.ambiguity && currentVoiceSnapshot.ambiguity !== 'none' && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-orange-400">
                                        <Icon name="CircleAlert" size={14} />
                                        <span className="text-xs font-medium">{currentVoiceSnapshot.ambiguity}</span>
                                    </div>
                                )}
                            </div>

                            {/* SUPPRESSION INDICATOR */}
                            {currentVoiceSnapshot.wasSpeechAllowed === false && (
                                <div className="glass-elevated bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-2xl flex items-center gap-4 justify-center">
                                    <Icon name="VolumeX" size={18} className="text-indigo-400" />
                                    <div className="text-left">
                                        <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                                            Voice Suppressed
                                        </p>
                                        <p className="text-xs text-text-secondary opacity-70">
                                            {currentVoiceSnapshot.reasonIfSuppressed}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Input Overlay */}
            <div className="mt-auto pb-12">
                <div className="glass-surface p-2 rounded-full flex items-center gap-2 shadow-2xl border border-glass-border/10">
                    <div className="w-10 h-10 rounded-full bg-text-primary/5 flex items-center justify-center ml-1">
                        <Icon name="MessageSquareText" size={18} className="text-text-secondary opacity-40" />
                    </div>
                    <input
                        type="text"
                        placeholder="Type a command..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder:text-text-secondary placeholder:opacity-30 text-base px-2"
                    />
                    <button className="w-12 h-12 rounded-full bg-text-primary/5 hover:bg-text-primary/10 transition-all flex items-center justify-center group active:scale-90">
                        <Icon name="Send" size={18} className="text-text-primary group-hover:text-blue-400 transition-colors" />
                    </button>
                </div>
            </div>
        </ResponsiveContainer>
    );
}
