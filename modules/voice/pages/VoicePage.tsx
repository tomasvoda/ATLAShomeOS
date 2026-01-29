'use client';

import React from 'react';
import { Panel } from '@/ui/primitives/Panel';
import { ResponsiveContainer } from '@/ui/primitives/ResponsiveContainer';
import { Icon } from '@/ui/primitives/Icon';
import { Button } from '@/ui/primitives/Button';

export function VoicePage() {
    return (
        <ResponsiveContainer className="py-8 h-[80vh] flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <Icon name="Mic" size={32} className="text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Voice Interface</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center ring-4 ring-blue-100 animate-pulse">
                    <Icon name="Mic" size={48} className="text-blue-600" />
                </div>
                <p className="text-xl text-gray-600 font-light">"How can I help you?"</p>
            </div>

            <Panel className="mt-auto">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Type a command..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                    />
                    <Button size="sm" variant="ghost">
                        <Icon name="Send" size={16} />
                    </Button>
                </div>
            </Panel>
        </ResponsiveContainer>
    );
}
