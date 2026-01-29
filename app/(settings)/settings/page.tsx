'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { useApp } from '@/context/AppContext';
import { useFeedback } from '@/core/hooks/useFeedback';

export default function SettingsPage() {
    const router = useRouter();
    const {
        theme, setTheme,
        soundEnabled, setSoundEnabled,
        hapticEnabled, setHapticEnabled
    } = useApp();
    const { triggerFeedback } = useFeedback();

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        triggerFeedback('light');
        setTheme(newTheme);
    };

    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
        if (!soundEnabled) triggerFeedback('medium'); // Trigger on enabling
    };

    const toggleHaptic = () => {
        triggerFeedback('medium');
        setHapticEnabled(!hapticEnabled);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans p-8 animate-in fade-in duration-700">
            <header className="flex items-center gap-4 mb-12">
                <button
                    onClick={() => {
                        triggerFeedback('light');
                        router.back();
                    }}
                    className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
                >
                    <Icon name="ArrowLeft" size={20} />
                </button>
                <h1 className="text-3xl font-light tracking-tight">System Settings</h1>
            </header>

            <div className="max-w-2xl w-full mx-auto space-y-8 pb-32">
                {/* 1. Theme Selection */}
                <section className="p-6 rounded-3xl bg-foreground/[0.02] border border-foreground/[0.05]">
                    <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                        <Icon name="Sun" size={18} />
                        Appearance
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        {(['light', 'dark', 'system'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => handleThemeChange(t)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-280",
                                    theme === t
                                        ? "bg-foreground text-background border-transparent shadow-lg"
                                        : "bg-background/40 border-foreground/[0.05] text-foreground/40 hover:text-foreground hover:bg-background/60"
                                )}
                            >
                                <Icon name={t === 'light' ? 'Sun' : t === 'dark' ? 'Moon' : 'Laptop'} size={20} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">{t}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. Feedback Settings */}
                <section className="p-6 rounded-3xl bg-foreground/[0.02] border border-foreground/[0.05]">
                    <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                        <Icon name="Activity" size={18} />
                        Microinteractions
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Haptic Feedback</span>
                                <span className="text-xs text-foreground/40 font-light">Tactile confirmation on touch</span>
                            </div>
                            <button
                                onClick={toggleHaptic}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-all duration-500 relative p-1",
                                    hapticEnabled ? "bg-foreground" : "bg-foreground/10"
                                )}
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded-full bg-background shadow-sm transition-all duration-500",
                                    hapticEnabled ? "translate-x-6" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                        <div className="w-full h-px bg-foreground/[0.05]" />
                        <div className="flex items-center justify-between p-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Sound Effects</span>
                                <span className="text-xs text-foreground/40 font-light">Subtle UI tick on interaction</span>
                            </div>
                            <button
                                onClick={toggleSound}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-all duration-500 relative p-1",
                                    soundEnabled ? "bg-foreground" : "bg-foreground/10"
                                )}
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded-full bg-background shadow-sm transition-all duration-500",
                                    soundEnabled ? "translate-x-6" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                    </div>
                </section>

                <section className="p-6 rounded-3xl bg-foreground/[0.02] border border-foreground/[0.05]">
                    <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Icon name="User" size={18} />
                        Identity
                    </h2>
                    <div className="space-y-4 text-foreground/40 font-light">
                        <div className="flex justify-between border-b border-foreground/[0.05] pb-2">
                            <span>User</span>
                            <span className="text-foreground">Admin</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Home ID</span>
                            <span className="text-foreground">ATLAS-01</span>
                        </div>
                    </div>
                </section>

                <section className="p-12 text-center opacity-30">
                    <p className="text-xs font-light tracking-[0.2em] uppercase">Built for Frontiers</p>
                    <p className="text-[10px] mt-1 font-mono">v0.1.0-alpha</p>
                </section>
            </div>
        </div>
    );
}
