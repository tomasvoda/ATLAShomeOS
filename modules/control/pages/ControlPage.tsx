'use client';

import React from 'react';
import { Panel } from '@/ui/primitives/Panel';
import { ResponsiveContainer } from '@/ui/primitives/ResponsiveContainer';
import { Icon } from '@/ui/primitives/Icon';
import { Button } from '@/ui/primitives/Button';
import { useUXData } from '@/context/UXDataContext';
import { cn } from '@/core/utils/cn';

import { ThingState } from '@/core/mock/types';

export function ControlPage({ room }: { room?: string }) {
    const { activeThings, activeMedia, dayPart } = useUXData();

    // 1. Group Things by Capability
    const capabilities = React.useMemo(() => {
        const groups = {
            lights: activeThings.filter(t => t.capabilities.includes('light')),
            climate: activeThings.filter(t => t.capabilities.includes('climate') || t.capabilities.includes('fan')),
            security: activeThings.filter(t => t.capabilities.includes('security') || t.capabilities.includes('lock') || t.capabilities.includes('camera')),
            media: activeThings.filter(t => t.capabilities.includes('media')),
            other: activeThings.filter(t => t.capabilities.length === 0 || (!t.capabilities.includes('light') && !t.capabilities.includes('climate') && !t.capabilities.includes('security') && !t.capabilities.includes('media')))
        };
        return groups;
    }, [activeThings]);

    return (
        <ResponsiveContainer className="py-12 space-y-12 pb-32">

            <div className="flex items-center justify-between pb-4">
                <div>
                    <h1 className="text-4xl font-light text-text-primary tracking-tight">Control Center</h1>
                    <p className="text-text-secondary opacity-40 text-[13px] uppercase tracking-[0.2em] font-medium mt-1.5">Manual Override & Systems</p>
                </div>
                <Button variant="ghost" className="gap-2.5 glass-surface border-glass-border/10 px-5">
                    <Icon name="Power" size={16} className="text-red-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">All Off</span>
                </Button>
            </div>

            {/* LIGHTS SECTION */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full glass-surface flex items-center justify-center">
                        <Icon name="Lightbulb" size={20} className="text-amber-400" />
                    </div>
                    <div className="flex-1 flex items-baseline gap-3">
                        <h2 className="text-xl font-medium text-text-primary">Lights</h2>
                        <span className="text-[10px] font-bold text-text-secondary opacity-30 uppercase tracking-widest">{capabilities.lights.filter(l => l.state.operational === 'on').length} active</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {capabilities.lights.map(thing => (
                        <ControlTile key={thing.id} thing={thing} icon="Lightbulb" activeColor="text-amber-400" accentColor="bg-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.15)]" />
                    ))}
                </div>
            </section>

            {/* CLIMATE SECTION */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full glass-surface flex items-center justify-center">
                        <Icon name="Thermometer" size={20} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-medium text-text-primary">Climate</h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {capabilities.climate.map(thing => (
                        <ControlTile key={thing.id} thing={thing} icon="Thermometer" activeColor="text-blue-400" accentColor="bg-blue-400/20 shadow-[0_0_20px_rgba(96,165,250,0.15)]" />
                    ))}
                </div>
            </section>

            {/* SECURITY SECTION */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full glass-surface flex items-center justify-center">
                        <Icon name="Shield" size={20} className="text-emerald-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-medium text-text-primary">Security</h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {capabilities.security.map(thing => (
                        <ControlTile key={thing.id} thing={thing} icon="Lock" activeColor="text-emerald-400" accentColor="bg-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.15)]" />
                    ))}
                </div>
            </section>

            {/* MEDIA SECTION */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full glass-surface flex items-center justify-center">
                        <Icon name="Tv" size={20} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-medium text-text-primary">Media</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Active Media Card */}
                    {activeMedia.isPlaying ? (
                        <div className="relative glass-elevated rounded-[2.5rem] p-8 shadow-2xl flex items-center gap-8 overflow-hidden group">
                            {/* Animated Background Pulse */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="w-20 h-20 glass-surface rounded-2xl flex items-center justify-center shadow-inner relative z-10 shrink-0">
                                <Icon name="Music" size={32} className="text-purple-400" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 flex gap-0.5 items-end">
                                        <div className="w-0.5 bg-white h-2 animate-pulse" />
                                        <div className="w-0.5 bg-white h-3 animate-pulse delay-75" />
                                        <div className="w-0.5 bg-white h-1.5 animate-pulse delay-150" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative z-10 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[9px] font-bold text-background bg-text-primary px-2.5 py-1 rounded-full uppercase tracking-[0.15em]">
                                        {activeMedia.source}
                                    </span>
                                    <span className="text-[10px] text-text-secondary font-medium opacity-40 uppercase tracking-widest">{activeMedia.mood}</span>
                                </div>
                                <h3 className="font-medium text-2xl text-text-primary truncate tracking-tight">{activeMedia.title}</h3>
                                <p className="text-text-secondary opacity-60 text-base font-light truncate">{activeMedia.artist}</p>
                            </div>

                            <div className="flex flex-col items-center gap-4 relative z-10">
                                <button className="w-14 h-14 rounded-full glass-surface flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl group/btn">
                                    <Icon name="Pause" size={24} className="text-text-primary group-hover/btn:text-purple-400 transition-colors" />
                                </button>
                                <div className="flex items-center gap-1.5 opacity-40">
                                    <Icon name="Volume2" size={10} />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">{activeMedia.volume}%</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-surface border-dashed border-glass-border/20 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-text-secondary/40">
                            <Icon name="Music" size={32} className="mb-4 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No Media Playing</p>
                        </div>
                    )}

                    {/* Media Devices Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {capabilities.media.map(thing => (
                            <ControlTile key={thing.id} thing={thing} icon="Tv" activeColor="text-purple-400" accentColor="bg-purple-400/20" />
                        ))}
                    </div>
                </div>
            </section>

        </ResponsiveContainer>
    );
}

function ControlTile({ thing, icon, activeColor = "text-blue-400", accentColor = "bg-blue-400/20" }: { thing: any, icon: any, activeColor?: string, accentColor?: string }) {
    const isOn = thing.state.operational === 'on' || thing.state.operational === 'heating' || thing.state.operational === 'cooling' || thing.state.operational === 'playing';
    const isLocked = thing.state.operational === 'locked';

    // Visual determination
    const isActive = isOn || isLocked;

    return (
        <button className={cn(
            "flex flex-col items-center justify-center aspect-square rounded-[2rem] transition-all duration-300 outline-none active:scale-95 group relative overflow-hidden",
            isActive
                ? cn("glass-elevated ring-1 ring-white/10", accentColor)
                : "glass-surface hover:bg-text-primary/[0.03] border-glass-border/5"
        )}>
            <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 mb-4",
                isActive ? "bg-text-primary/10 shadow-inner" : "bg-text-primary/5 group-hover:bg-text-primary/10"
            )}>
                <Icon
                    name={icon}
                    size={24}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={cn(
                        "transition-all duration-500",
                        isActive ? activeColor : "text-text-secondary opacity-40 group-hover:opacity-100"
                    )}
                />
            </div>
            <div className="flex flex-col items-center gap-1.5 px-4">
                <span className={cn(
                    "font-medium text-[13px] tracking-tight truncate w-full text-center transition-colors duration-300",
                    isActive ? "text-text-primary" : "text-text-secondary opacity-60 group-hover:opacity-100"
                )}>
                    {thing.name}
                </span>
                <span className={cn(
                    "text-[9px] uppercase tracking-[0.15em] font-bold transition-opacity duration-300",
                    isActive ? "opacity-100 text-text-primary/50" : "opacity-20"
                )}>
                    {thing.state.operational}
                </span>
            </div>

            {/* Active Indicator Dot */}
            {isActive && (
                <div className={cn("absolute top-5 right-5 w-1.5 h-1.5 rounded-full", activeColor.replace('text-', 'bg-'))} />
            )}
        </button>
    )
}
