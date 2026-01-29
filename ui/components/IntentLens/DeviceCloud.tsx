'use client';

import React from 'react';
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-end md:justify-end pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={onClose}
            />

            {/* Drawer / Cloud Panel */}
            <div className="relative w-full md:w-[400px] bg-white h-[70vh] md:h-screen shadow-2xl pointer-events-auto animate-in slide-in-from-bottom md:slide-in-from-right duration-300 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-gray-900 capitalize flex items-center gap-2">
                        <Icon name="List" size={20} className="text-gray-400" />
                        {intent} Devices
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Icon name="X" size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        {relevantThings.length > 0 ? relevantThings.map(thing => (
                            <button
                                key={thing.id}
                                className={cn(
                                    "aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 border-2 transition-all p-4",
                                    thing.state.operational === 'on'
                                        ? "bg-blue-50 border-blue-500 text-blue-700"
                                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                )}
                            >
                                <Icon
                                    name={getIconForCapability(thing.capabilities)}
                                    size={32}
                                    className={thing.state.operational === 'on' ? "text-blue-600" : "text-gray-300"}
                                />
                                <span className="font-medium text-sm text-center line-clamp-2">
                                    {thing.name}
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                                    {thing.state.operational}
                                </span>
                            </button>
                        )) : (
                            <div className="col-span-2 text-center text-gray-400 py-12">
                                No devices found for {intent}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
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
