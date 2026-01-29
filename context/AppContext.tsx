'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SECTION_LIST, SectionId } from '@/core/navigation/SectionRegistry';

interface AppContextType {
    activeSection: SectionId | null;
    isNavExpanded: boolean;
    toggleNav: () => void;
    setNavExpanded: (expanded: boolean) => void;

    // Active Action State (hides nav)
    isActionActive: boolean;
    setActionActive: (active: boolean) => void;

    // Global Overlays
    isDebugOpen: boolean;
    setDebugOpen: (open: boolean) => void;
    isContextOpen: boolean;
    setContextOpen: (open: boolean) => void;

    // Preferences
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
    hapticEnabled: boolean;
    setHapticEnabled: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState<SectionId | null>(null);
    const [isNavExpanded, setNavExpanded] = useState(false);
    const [isActionActive, setActionActive] = useState(false);

    // Preferences
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [hapticEnabled, setHapticEnabled] = useState(true);

    // Global Overlays
    const [isDebugOpen, setDebugOpen] = useState(false);
    const [isContextOpen, setContextOpen] = useState(false);

    // Initial Load
    useEffect(() => {
        const savedTheme = localStorage.getItem('atlas-theme') as any;
        const savedSound = localStorage.getItem('atlas-sound') === 'true';
        const savedHaptic = localStorage.getItem('atlas-haptic') === 'true';

        if (savedTheme) setTheme(savedTheme);
        setSoundEnabled(savedSound);
        setHapticEnabled(savedHaptic);
    }, []);

    // Effect: Sync Theme to HTML
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        localStorage.setItem('atlas-theme', theme);
    }, [theme]);

    // Effect: Sync Sound/Haptic
    useEffect(() => localStorage.setItem('atlas-sound', String(soundEnabled)), [soundEnabled]);
    useEffect(() => localStorage.setItem('atlas-haptic', String(hapticEnabled)), [hapticEnabled]);

    useEffect(() => {
        // Determine active section from path
        const section = SECTION_LIST.find((s) => pathname.startsWith(s.path));
        if (section) {
            setActiveSection(section.id);
        }
    }, [pathname]);

    const toggleNav = () => setNavExpanded((prev) => !prev);

    return (
        <AppContext.Provider
            value={{
                activeSection,
                isNavExpanded,
                toggleNav,
                setNavExpanded,
                isActionActive,
                setActionActive,
                isDebugOpen,
                setDebugOpen,
                isContextOpen,
                setContextOpen,
                theme,
                setTheme,
                soundEnabled,
                setSoundEnabled,
                hapticEnabled,
                setHapticEnabled,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
