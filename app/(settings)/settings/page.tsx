'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { AppIcon } from '@/ui/components/AppIcon/AppIcon';
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
        <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans antialiased p-8 lg:p-12 animate-in fade-in duration-1000">
            <header className="flex items-center gap-6 mb-16">
                <button
                    onClick={() => {
                        triggerFeedback('light');
                        router.back();
                    }}
                    className="w-12 h-12 rounded-full glass-surface flex items-center justify-center hover:bg-text-primary/10 transition-all active:scale-95 shadow-lg border border-glass-border/10"
                >
                    <Icon name="ArrowLeft" size={24} />
                </button>
                <h1 className="text-4xl font-light tracking-tight">System Settings</h1>
            </header>

            <div className="max-w-3xl w-full mx-auto space-y-10 pb-40">
                {/* 1. Theme Selection */}
                <section className="p-8 rounded-[2.5rem] glass-surface border border-glass-border/10 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-text-primary/5 flex items-center justify-center">
                            <Icon name="Sun" size={20} className="text-amber-400" />
                        </div>
                        <h2 className="text-xl font-medium">Appearance</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {(['light', 'dark', 'system'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => handleThemeChange(t)}
                                className={cn(
                                    "flex flex-col items-center gap-4 p-6 rounded-3xl transition-all duration-300 border relative overflow-hidden group",
                                    theme === t
                                        ? "glass-elevated bg-text-primary text-background border-transparent shadow-2xl scale-[1.02] z-10"
                                        : "glass-surface border-glass-border/10 text-text-secondary opacity-60 hover:opacity-100 hover:bg-text-primary/5"
                                )}
                            >
                                <Icon name={t === 'light' ? 'Sun' : t === 'dark' ? 'Moon' : 'Laptop'} size={24} strokeWidth={theme === t ? 2 : 1.5} />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{t}</span>

                                {theme === t && (
                                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-background/50" />
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. App Icon */}
                <section className="p-8 rounded-[2.5rem] glass-surface border border-glass-border/10 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-text-primary/5 flex items-center justify-center">
                            <Icon name="AppWindow" size={20} className="text-purple-400" />
                        </div>
                        <h2 className="text-xl font-medium">App Icon</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 max-w-md">
                        {(['light', 'dark'] as const).map((iconMode) => (
                            <button
                                key={iconMode}
                                onClick={() => {
                                    triggerFeedback('light');
                                    // In a real PWA/Native context, this would trigger the icon change.
                                    // For now, we simulate selection.
                                    // setAppIcon(iconMode); 
                                }}
                                className="group relative flex flex-col items-center gap-3"
                            >
                                <div className={cn(
                                    "w-20 h-20 rounded-[1.5rem] shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden border border-glass-border/10",
                                    "bg-white" // Icon has white bg baked in or we ensure it
                                )}>
                                    {/* Dynamic Icon Preview */}
                                    <AppIcon mode={iconMode} className="w-full h-full" />
                                </div>
                                <span className={cn(
                                    "text-[10px] uppercase tracking-[0.2em] font-bold transition-colors",
                                    "text-text-secondary group-hover:text-text-primary"
                                )}>
                                    {iconMode}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. Feedback Settings */}
                <section className="p-8 rounded-[2.5rem] glass-surface border border-glass-border/10 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-text-primary/5 flex items-center justify-center">
                            <Icon name="Activity" size={20} className="text-blue-400" />
                        </div>
                        <h2 className="text-xl font-medium">Microinteractions</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Haptic Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-text-primary/[0.02] transition-colors group">
                            <div className="flex flex-col gap-1">
                                <span className="text-base font-medium text-text-primary">Haptic Feedback</span>
                                <span className="text-xs text-text-secondary opacity-40 font-light">Tactile confirmation on touch</span>
                            </div>
                            <button
                                onClick={toggleHaptic}
                                className={cn(
                                    "w-14 h-8 rounded-full transition-all duration-500 relative p-1.5 shadow-inner border border-glass-border/10",
                                    hapticEnabled ? "bg-text-primary" : "glass-surface"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full shadow-lg transition-all duration-500",
                                    hapticEnabled ? "translate-x-6 bg-background scale-110" : "translate-x-0 bg-text-secondary opacity-30"
                                )} />
                            </button>
                        </div>

                        <div className="h-px bg-glass-border/5 mx-4" />

                        {/* Sound Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-text-primary/[0.02] transition-colors group">
                            <div className="flex flex-col gap-1">
                                <span className="text-base font-medium text-text-primary">Sound Effects</span>
                                <span className="text-xs text-text-secondary opacity-40 font-light">Subtle UI tick on interaction</span>
                            </div>
                            <button
                                onClick={toggleSound}
                                className={cn(
                                    "w-14 h-8 rounded-full transition-all duration-500 relative p-1.5 shadow-inner border border-glass-border/10",
                                    soundEnabled ? "bg-text-primary" : "glass-surface"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full shadow-lg transition-all duration-500",
                                    soundEnabled ? "translate-x-6 bg-background scale-110" : "translate-x-0 bg-text-secondary opacity-30"
                                )} />
                            </button>
                        </div>
                    </div>
                </section>

                <section className="p-8 rounded-[2.5rem] glass-surface border border-glass-border/10 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-text-primary/5 flex items-center justify-center">
                            <Icon name="User" size={20} className="text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-medium">Identity</h2>
                    </div>

                    <div className="space-y-6 px-4">
                        <div className="flex justify-between items-baseline border-b border-glass-border/5 pb-4">
                            <span className="text-sm font-light text-text-secondary opacity-60">User</span>
                            <span className="text-base font-medium text-text-primary">Admin</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-light text-text-secondary opacity-60">Home ID</span>
                            <span className="text-lg font-mono text-text-primary tracking-tighter">ATLAS-01</span>
                        </div>
                    </div>
                </section>

                <section className="pt-20 pb-12 text-center opacity-20 group hover:opacity-100 transition-opacity duration-1000">
                    <p className="text-xs font-bold tracking-[0.4em] uppercase text-text-primary">Built for Frontiers</p>
                    <p className="text-[10px] mt-2 font-mono text-text-secondary">v0.1.0-alpha · Space Grade OS</p>
                </section>
            </div>
        </div>
    );
}
