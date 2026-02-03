'use client';

import React from 'react';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';

interface SensorProps {
    temp: number;
    humidity: number;
    co2?: number; // ppm
    lux?: number;
    presenceCount: number;
}

export function SensorStrip({
    temp = 21.5,
    humidity = 45,
    co2 = 420,
    lux,
    presenceCount = 0
}: SensorProps) {
    return (
        <div className="flex items-center gap-6 px-6 py-2 w-full max-w-4xl mx-auto overflow-hidden">
            {/* Presence (Primary Context) */}
            <div className={cn(
                "flex items-center gap-1.5 transition-colors duration-300",
                presenceCount > 0 ? "text-white" : "text-text-secondary opacity-50"
            )}>
                <Icon name="Users" size={14} className="" />
                <span className="text-[13px] font-medium tracking-tight">
                    {presenceCount > 0 ? presenceCount : "Away"}
                </span>
            </div>

            {/* Divider */}
            <div className="w-px h-3 bg-white/10" />

            {/* Environmental Data */}
            <div className="flex items-center gap-5">
                {/* Temp */}
                <SensorItem
                    icon="Thermometer"
                    value={`${temp}°`}
                    active={temp > 24 || temp < 18}
                />

                {/* Humidity */}
                <SensorItem
                    icon="Droplets"
                    value={`${humidity}%`}
                    active={humidity > 60 || humidity < 30}
                />

                {/* CO2 / Air */}
                {co2 && (
                    <SensorItem
                        icon="Wind"
                        value={`${co2}`}
                        unit="ppm"
                        active={co2 > 1000}
                        alert={co2 > 1200}
                    />
                )}
            </div>
        </div>
    );
}

function SensorItem({ icon, value, unit, active, alert }: { icon: any, value: string, unit?: string, active?: boolean, alert?: boolean }) {
    return (
        <div className="flex items-center gap-1.5">
            <Icon
                name={icon}
                size={14}
                className={cn(
                    "transition-colors duration-300",
                    alert ? "text-red-400" : active ? "text-blue-300" : "text-text-secondary opacity-50"
                )}
            />
            <div className="flex items-baseline gap-[1px]">
                <span className={cn(
                    "text-[13px] font-medium tracking-normal transition-colors duration-300",
                    alert ? "text-red-400" : active ? "text-text-primary" : "text-text-secondary"
                )}>
                    {value}
                </span>
                {unit && <span className="text-[9px] text-text-secondary/40 font-bold ml-0.5">{unit}</span>}
            </div>
        </div>
    )
}
