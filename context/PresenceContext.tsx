'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

export type RoomId = string;

interface PresenceContextState {
    focusRoom: RoomId | null;    // Where the user WANTS to act
    presenceRoom: RoomId | null; // Where the system THINKS the user is
    activeRoom: RoomId | null;   // Computed: focusRoom ?? presenceRoom

    setFocusRoom: (room: RoomId | null) => void;
    // setPresenceRoom would be internal or driven by HA later
}

const PresenceContext = createContext<PresenceContextState | undefined>(undefined);

export function PresenceProvider({ children }: { children: React.ReactNode }) {
    const [focusRoom, setFocusRoom] = useState<RoomId | null>(null);
    const [presenceRoom] = useState<RoomId | null>(null); // Stub for sensor data

    const activeRoom = useMemo(() => focusRoom ?? presenceRoom, [focusRoom, presenceRoom]);

    const value = useMemo(
        () => ({
            focusRoom,
            presenceRoom,
            activeRoom,
            setFocusRoom,
        }),
        [focusRoom, presenceRoom, activeRoom]
    );

    return (
        <PresenceContext.Provider value={value}>
            {children}
        </PresenceContext.Provider>
    );
}

export function usePresence() {
    const context = useContext(PresenceContext);
    if (context === undefined) {
        throw new Error('usePresence must be used within a PresenceProvider');
    }
    return context;
}
