'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUXData } from '@/context/UXDataContext';
import { usePresence } from '@/context/PresenceContext';
import { CompactStateAnchor } from '../components/CompactStateAnchor';
import { SensorStrip } from '../components/SensorStrip';
import { IntentGrid } from '../components/IntentGrid';
import { MicroControlSheet } from '../components/MicroControlSheet';
import { IntentType } from '../components/IntentRow';

export function ControlPage({ room }: { room?: string }) {
    const { activeThings } = useUXData();
    const { activeRoom } = usePresence();
    const [selectedIntent, setSelectedIntent] = useState<IntentType>(null);

    // Filter things based on context
    const targetRoom = room || activeRoom;
    const filteredThings = targetRoom
        ? activeThings.filter(t => t.roomId === targetRoom)
        : activeThings;

    // Reset intent on room change
    useEffect(() => {
        setSelectedIntent(null);
    }, [targetRoom]);

    // Calculate Active Counts & States for Grid Indicators
    const activeCount = filteredThings.filter(t => t.state.operational === 'on' || t.state.operational === 'playing').length;

    const activeStates = {
        light: filteredThings.some(t => t.capabilities.includes('light') && t.state.operational === 'on'),
        climate: filteredThings.some(t => (t.capabilities.includes('climate') || t.capabilities.includes('fan')) && (t.state.operational === 'heating' || t.state.operational === 'cooling' || t.state.operational === 'on')),
        media: filteredThings.some(t => t.capabilities.includes('media') && t.state.operational === 'playing'),
        security: filteredThings.some(t => (t.capabilities.includes('security') || t.capabilities.includes('lock')) && t.state.operational === 'locked'),
    };

    return (
        <div className="h-screen flex flex-col relative overflow-hidden bg-background pt-20 pb-40">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-black/20 to-black pointer-events-none z-[-1]" />

            {/* ZONE 1: CONTEXT HEADER (Anchor + Sensors) */}
            <motion.div
                className="flex-none flex flex-col z-10"
                animate={{
                    filter: selectedIntent ? "blur(12px) opacity(0.6)" : "blur(0px) opacity(1)",
                    scale: selectedIntent ? 0.98 : 1,
                    y: selectedIntent ? -8 : 0 // Slight retreat
                }}
                transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }} // Updated to 320ms for focus
            >
                <CompactStateAnchor
                    roomName={targetRoom ? targetRoom.charAt(0).toUpperCase() + targetRoom.slice(1) : "Home"}
                    activeCount={activeCount}
                />
                <SensorStrip
                    temp={22.4}
                    humidity={42}
                    co2={activeCount > 2 ? 850 : 420} // Dynamic mock based on activity
                    lux={350}
                    presenceCount={1}
                />
            </motion.div>

            {/* ZONE 2: INTENT GRID (Core) - Anchored to center/top, ensuring visibility */}
            <div className="flex-1 flex flex-col justify-start md:justify-center pt-4 md:pt-0 max-w-4xl mx-auto w-full z-0 px-4">
                <IntentGrid
                    selectedIntent={selectedIntent}
                    onSelect={setSelectedIntent}
                    activeStates={activeStates}
                />
            </div>

            {/* ZONE 3: COMPACT CONTROL OVERLAY (Floating Mode) */}
            <MicroControlSheet
                intent={selectedIntent}
                things={filteredThings}
                onClose={() => setSelectedIntent(null)}
            />
        </div>
    );
}
