'use client';

import React from 'react';
import { Panel } from '@/ui/primitives/Panel';
import { ResponsiveContainer } from '@/ui/primitives/ResponsiveContainer';
import { Icon } from '@/ui/primitives/Icon';

export function StatusPage() {
    return (
        <ResponsiveContainer className="py-8 space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Icon name="Activity" size={32} className="text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Panel title="System Health">
                    <div className="flex items-center gap-2 text-green-600">
                        <Icon name="CircleCheck" size={20} />
                        <span className="font-medium">All systems operational</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Uptime: 14 days, 3 hours</p>
                </Panel>

                <Panel title="Connectivity">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Home Assistant</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Connected
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Cloud Sync</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Syncing
                            </span>
                        </div>
                    </div>
                </Panel>

                <Panel title="Recent Events">
                    <ul className="text-sm space-y-2 text-gray-600">
                        <li>10:42 AM - Living Room Motion</li>
                        <li>09:15 AM - Front Door Locked</li>
                        <li>08:00 AM - Morning Scene Activated</li>
                    </ul>
                </Panel>
            </div>
        </ResponsiveContainer>
    );
}
