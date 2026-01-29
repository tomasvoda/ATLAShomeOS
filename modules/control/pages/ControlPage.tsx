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
        <ResponsiveContainer className="py-8 space-y-10">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Control Center</h1>
                    <p className="text-gray-500 text-lg mt-1">Manual Override & Systems</p>
                </div>
                {/* Global Action Button Example */}
                <Button variant="outline" className="gap-2">
                    <Icon name="Power" size={16} /> All Off
                </Button>
            </div>

            {/* LIGHTS SECTION */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                    <Icon name="Lightbulb" size={24} className="text-amber-500" />
                    <h2 className="text-xl font-medium text-gray-900">Lights</h2>
                    <span className="text-sm text-gray-400 bg-gray-50 px-2 rounded-full">{capabilities.lights.filter(l => l.state.operational === 'on').length} On</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {capabilities.lights.map(thing => (
                        <ControlTile key={thing.id} thing={thing} icon="Lightbulb" />
                    ))}
                </div>
            </section>

            {/* CLIMATE SECTION */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                    <Icon name="Thermometer" size={24} className="text-blue-500" />
                    <h2 className="text-xl font-medium text-gray-900">Climate</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {capabilities.climate.map(thing => (
                        <ControlTile key={thing.id} thing={thing} icon="Thermometer" />
                    ))}
                </div>
            </section>

            {/* SECURITY SECTION */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                    <Icon name="Shield" size={24} className="text-emerald-500" />
                    <h2 className="text-xl font-medium text-gray-900">Security</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {capabilities.security.map(thing => (
                        <ControlTile key={thing.id} thing={thing} icon="Lock" />
                    ))}
                </div>
            </section>

            {/* MEDIA SECTION */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                    <Icon name="Tv" size={24} className="text-purple-500" />
                    <h2 className="text-xl font-medium text-gray-900">Media</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Active Media Card */}
                    {activeMedia.isPlaying ? (
                        <div className="bg-gray-900 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-inner">
                                <Icon name="Music" size={32} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded text-white uppercase tracking-wider">
                                        {activeMedia.source}
                                    </span>
                                    <span className="text-xs text-gray-400">• {activeMedia.mood}</span>
                                </div>
                                <h3 className="font-bold text-xl">{activeMedia.title}</h3>
                                <p className="text-gray-400">{activeMedia.artist}</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <Icon name="Pause" size={20} />
                                </button>
                                <span className="text-xs font-mono text-gray-500">Vol {activeMedia.volume}%</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400">
                            <Icon name="Music" size={32} className="mb-2 opacity-50" />
                            <p>No Media Playing</p>
                        </div>
                    )}

                    {/* Media Devices Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {capabilities.media.map(thing => (
                            <ControlTile key={thing.id} thing={thing} icon="Tv" />
                        ))}
                    </div>
                </div>
            </section>

        </ResponsiveContainer>
    );
}

function ControlTile({ thing, icon }: { thing: any, icon: any }) {
    const isOn = thing.state.operational === 'on' || thing.state.operational === 'heating' || thing.state.operational === 'cooling' || thing.state.operational === 'playing';
    const isLocked = thing.state.operational === 'locked';

    // Visual determination
    const isActive = isOn || isLocked;

    return (
        <button className={cn(
            "flex flex-col items-center justify-center aspect-square rounded-xl transition-all duration-200 border-2 outline-none focus:ring-2 focus:ring-blue-500/50",
            isActive
                ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20"
                : "bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm"
        )}>
            <Icon
                name={icon}
                size={28}
                className={cn(
                    "mb-3 transition-colors",
                    isActive ? "text-blue-600" : "text-gray-400"
                )}
            />
            <span className={cn("font-medium text-sm px-2 truncate w-full text-center", isActive ? "text-gray-900" : "text-gray-500")}>
                {thing.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">
                {thing.state.operational}
            </span>
        </button>
    )
}
