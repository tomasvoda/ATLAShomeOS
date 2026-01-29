'use client';

import React from 'react';
import { Panel } from '@/ui/primitives/Panel';
import { ResponsiveContainer } from '@/ui/primitives/ResponsiveContainer';
import { Icon } from '@/ui/primitives/Icon';
import { useUXData } from '@/context/UXDataContext';
import { cn } from '@/core/utils/cn';

export function InsightsPage() {
    const { data, activeRecommendation } = useUXData();

    // In a real app we might filter recommendations. 
    // For now show active one first (if any), then the rest.
    const recommendations = React.useMemo(() => {
        const allInfo = data.recommendations;
        if (!activeRecommendation) return allInfo;
        return [activeRecommendation, ...allInfo.filter(r => r.id !== activeRecommendation.id)];
    }, [data.recommendations, activeRecommendation]);

    return (
        <ResponsiveContainer className="py-8 space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Icon name="Lightbulb" size={32} className="text-yellow-500" />
                <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map(rec => {
                    const isActive = activeRecommendation?.id === rec.id;
                    const isSilent = rec.communicationLevel === 'silent';

                    return (
                        <Panel
                            key={rec.id}
                            title={rec.title}
                            className={cn(isActive && "ring-2 ring-blue-500 ring-offset-2", isSilent && "opacity-75")}
                        >
                            <div className={cn("p-4 rounded-lg border mb-4",
                                isActive ? "bg-blue-50 border-blue-100" :
                                    isSilent ? "bg-gray-100 border-gray-200" :
                                        "bg-yellow-50 border-yellow-100"
                            )}>
                                <div className="flex items-start gap-3">
                                    <Icon name={isActive ? "Zap" : isSilent ? "Moon" : "Sparkles"}
                                        className={cn("mt-1",
                                            isActive ? "text-blue-600" :
                                                isSilent ? "text-gray-500" :
                                                    "text-yellow-600"
                                        )}
                                        size={18} />
                                    <div>
                                        <h4 className={cn("font-medium",
                                            isActive ? "text-blue-900" :
                                                isSilent ? "text-gray-700" :
                                                    "text-yellow-900"
                                        )}>
                                            {rec.why}
                                        </h4>
                                        <p className={cn("text-xs mt-1",
                                            isActive ? "text-blue-700" :
                                                isSilent ? "text-gray-500" :
                                                    "text-yellow-800"
                                        )}>
                                            Confidence: {(rec.confidence * 100).toFixed(0)}% • Signals: {rec.signals.join(', ')}
                                        </p>

                                        {/* COMM POLICY BADGE */}
                                        {isSilent && (
                                            <div className="mt-2 inline-flex items-center gap-1 bg-gray-200 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 uppercase">
                                                <Icon name="VolumeX" size={10} />
                                                Silenced (Night)
                                            </div>
                                        )}
                                        {rec.communicationLevel === 'passive' && (
                                            <div className="mt-2 inline-flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded text-[10px] font-bold text-blue-600 uppercase">
                                                <Icon name="BellOff" size={10} />
                                                Passive (Media Playing)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                {rec.actions.map(action => (
                                    <button key={action} className="text-xs font-medium px-3 py-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors uppercase">
                                        {action.replace(/_/g, ' ')}
                                    </button>
                                ))}
                            </div>
                        </Panel>
                    )
                })}
            </div>
        </ResponsiveContainer>
    );
}
