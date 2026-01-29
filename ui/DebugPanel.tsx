'use client';

import React from 'react';
import { useUXData } from '@/context/UXDataContext';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/ui/primitives/Icon';
import { UXData, DayPart } from '@/core/mock/types';

export function DebugPanel() {
    const {
        data,
        scenario,
        setScenario,
        activeHomeMode,
        homeMode,
        setHomeMode,
        dayPart,
        setDayPart,
        simulatedTime,
        setSimulatedTime
    } = useUXData();

    const { isDebugOpen, setDebugOpen } = useApp();

    if (!isDebugOpen) {
        return (
            <button
                onClick={() => setDebugOpen(true)}
                className="fixed bottom-4 right-4 z-[100] bg-black text-white p-2 rounded-full shadow-lg opacity-50 hover:opacity-100 transition-opacity"
                title="Open Debug Panel"
            >
                <Icon name="Bug" size={20} />
            </button>
        );
    }

    const scenarioKeys = Object.keys(data.scenarios) as (keyof typeof data.scenarios)[];
    const dayParts: DayPart[] = ['morning', 'afternoon', 'evening', 'night'];

    return (
        <div className="fixed bottom-4 right-4 z-[100] bg-black/90 text-white p-4 rounded-xl shadow-2xl w-80 text-xs font-mono border border-gray-800 backdrop-blur">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
                <h3 className="font-bold text-sm flex items-center gap-2">
                    <Icon name="Bug" size={14} /> UX Debug
                </h3>
                <button onClick={() => setDebugOpen(false)}>
                    <Icon name="X" size={14} />
                </button>
            </div>

            <div className="space-y-4">
                {/* TIME CONTROL */}
                <div className="space-y-2 border-b border-gray-800 pb-4">
                    <h4 className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Time Simulation</h4>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-500 mb-1">Time</label>
                            <input
                                type="time"
                                value={simulatedTime}
                                onChange={(e) => setSimulatedTime(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Mode</label>
                            <select
                                value={homeMode}
                                onChange={(e) => setHomeMode(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
                            >
                                <option value="home">Home</option>
                                <option value="away">Away</option>
                                <option value="night">Night</option>
                                <option value="vacation">Vacation</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-500 mb-1">Day Part</label>
                        <div className="flex rounded overflow-hidden border border-gray-700">
                            {dayParts.map(part => (
                                <button
                                    key={part}
                                    onClick={() => setDayPart(part)}
                                    className={`flex-1 py-1 text-[10px] capitalizetransition-colors ${dayPart === part ? 'bg-blue-600 text-white font-bold' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
                                >
                                    {part.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SCENARIO CONTROL */}
                <div>
                    <label className="block text-gray-500 mb-1">Active Scenario</label>
                    <select
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value as any)}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                        {scenarioKeys.map(key => (
                            <option key={key} value={key}>{key}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-900 p-2 rounded">
                        <span className="block text-gray-500">Home Mode</span>
                        <span className="font-bold text-blue-400">{activeHomeMode}</span>
                    </div>
                    <div className="bg-gray-900 p-2 rounded">
                        <span className="block text-gray-500">Day Part</span>
                        <span className="text-gray-300 capitalize">{dayPart}</span>
                    </div>
                </div>

                <div className="space-y-1 text-gray-400 border-t border-gray-800 pt-2">
                    <div className="flex justify-between">
                        <span>Rooms</span>
                        <span>{data.rooms.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Things</span>
                        <span>{data.things.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Issues</span>
                        <span>{data.issues.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
