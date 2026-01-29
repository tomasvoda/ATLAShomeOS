'use client';

import React from 'react';
import { Panel } from '@/ui/primitives/Panel';
import { ResponsiveContainer } from '@/ui/primitives/ResponsiveContainer';
import { Icon } from '@/ui/primitives/Icon';
import { Button } from '@/ui/primitives/Button';

interface ControlPageProps {
    room?: string;
}

export function ControlPage({ room }: ControlPageProps) {
    const title = room ? `${room.charAt(0).toUpperCase() + room.slice(1)} Control` : 'Home Control';

    return (
        <ResponsiveContainer className="py-8 space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Icon name={room ? 'MapPin' : 'LayoutGrid'} size={32} className="text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                </div>
                {room && (
                    <Button variant="outline" size="sm">
                        <Icon name="Settings" size={16} className="mr-2" /> Configure
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Placeholder Devices */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <Panel key={i} className="aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 transition-colors">
                        <Icon name="Power" size={24} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Light {i + 1}</span>
                    </Panel>
                ))}
            </div>

            <Panel title="Override State" className="mt-8">
                <p className="text-sm text-gray-500">
                    {room ? `Manual override active for ${room}.` : "System in automatic mode."}
                </p>
            </Panel>
        </ResponsiveContainer>
    );
}
