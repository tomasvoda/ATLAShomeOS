'use client';

import React from 'react';
import { Panel } from '@/ui/primitives/Panel';
import { ResponsiveContainer } from '@/ui/primitives/ResponsiveContainer';
import { Icon } from '@/ui/primitives/Icon';

export function InsightsPage() {
    return (
        <ResponsiveContainer className="py-8 space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Icon name="Lightbulb" size={32} className="text-yellow-500" />
                <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel title="Energy Optimization">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 mb-4">
                        <div className="flex items-start gap-3">
                            <Icon name="Zap" className="text-yellow-600 mt-1" size={18} />
                            <div>
                                <h4 className="font-medium text-yellow-900">High Usage Detected</h4>
                                <p className="text-sm text-yellow-800 mt-1">
                                    Living room AC is running while windows are reported open.
                                </p>
                            </div>
                        </div>
                    </div>
                </Panel>

                <Panel title="Routine Suggestions">
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Icon name="Moon" size={16} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Create "Good Night" Scene</p>
                                <p className="text-xs text-gray-500">Based on your common actions at 10 PM</p>
                            </div>
                        </li>
                    </ul>
                </Panel>
            </div>
        </ResponsiveContainer>
    );
}
