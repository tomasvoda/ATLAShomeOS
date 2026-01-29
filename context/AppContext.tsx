'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SECTION_LIST, SectionId } from '@/core/navigation/SectionRegistry';

interface AppContextType {
    activeSection: SectionId | null;
    isNavExpanded: boolean;
    toggleNav: () => void;
    setNavExpanded: (expanded: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState<SectionId | null>(null);
    const [isNavExpanded, setNavExpanded] = useState(false);

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
