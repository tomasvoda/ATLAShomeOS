'use client';

import React, { createContext, useContext, useState } from 'react';

export type HouseMode = 'automatic' | 'manual' | 'guided';

interface HouseModeContextState {
    mode: HouseMode;
    setMode: (mode: HouseMode) => void;
}

const HouseModeContext = createContext<HouseModeContextState | undefined>(undefined);

export function HouseModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<HouseMode>('automatic');

    return (
        <HouseModeContext.Provider value={{ mode, setMode }}>
            {children}
        </HouseModeContext.Provider>
    );
}

export function useHouseMode() {
    const context = useContext(HouseModeContext);
    if (context === undefined) {
        throw new Error('useHouseMode must be used within a HouseModeProvider');
    }
    return context;
}
