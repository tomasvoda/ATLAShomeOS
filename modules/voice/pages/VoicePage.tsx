'use client';

import React from 'react';
import { Panel } from '@/ui/primitives/Panel';
import { ResponsiveContainer } from '@/ui/primitives/ResponsiveContainer';
import { Icon } from '@/ui/primitives/Icon';
import { Button } from '@/ui/primitives/Button';
import { useUXData } from '@/context/UXDataContext';
import { cn } from '@/core/utils/cn';

export function VoicePage() {
    const { currentVoiceSnapshot } = useUXData();

    return (
        <ResponsiveContainer className="py-8 h-[80vh] flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <Icon name="Mic" size={32} className="text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Voice Interface</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className={cn("w-32 h-32 rounded-full flex items-center justify-center ring-4 transition-all duration-500",
                    currentVoiceSnapshot?.state === 'listening' ? "bg-red-50 ring-red-100 animate-pulse" :
                        currentVoiceSnapshot?.state === 'thinking' ? "bg-blue-50 ring-blue-100 animate-bounce" :
                            "bg-gray-50 ring-gray-100"
                )}>
                    <Icon name="Mic" size={48} className={cn(
                        currentVoiceSnapshot?.state === 'listening' ? "text-red-600" : "text-blue-600"
                    )} />
                </div>

                <div className="text-center max-w-lg space-y-4">
                    <p className="text-2xl text-gray-900 font-light italic">
                        "{currentVoiceSnapshot?.transcript || "..."}"
                    </p>
                    {currentVoiceSnapshot && (
                        <div className="space-y-3">
                            <div className="bg-gray-100/50 p-4 rounded-xl text-sm text-gray-600">
                                <p className="font-semibold mb-1 text-gray-900">Interpretation:</p>
                                <p>{currentVoiceSnapshot.interpretation}</p>
                                {currentVoiceSnapshot.ambiguity && currentVoiceSnapshot.ambiguity !== 'none' && (
                                    <p className="mt-2 text-orange-600">
                                        <Icon name="CircleAlert" size={14} className="inline mr-1" />
                                        {currentVoiceSnapshot.ambiguity}
                                    </p>
                                )}
                            </div>

                            {/* SUPPRESSION INDICATOR */}
                            {currentVoiceSnapshot.wasSpeechAllowed === false && (
                                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex items-start gap-3">
                                    <Icon name="VolumeX" size={18} className="text-indigo-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                                            Voice Response Suppressed
                                        </p>
                                        <p className="text-sm text-indigo-700">
                                            {currentVoiceSnapshot.reasonIfSuppressed}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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
