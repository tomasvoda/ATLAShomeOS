'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { usePresence } from '@/context/PresenceContext';
import { SECTION_LIST } from '@/core/navigation/SectionRegistry';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';

// Placeholder rooms data
const ROOMS = [
    { id: 'living', name: 'Living Room', icon: 'Armchair' },
    { id: 'kitchen', name: 'Kitchen', icon: 'Utensils' },
    { id: 'bedroom', name: 'Bedroom', icon: 'Bed' },
    { id: 'office', name: 'Office', icon: 'Monitor' },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
    const { activeSection } = useApp();
    const { focusRoom, setFocusRoom } = usePresence(); // Updated destructuring
    const [isNavExpanded, setIsNavExpanded] = React.useState(true); // Default open for now
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col relative overflow-hidden">
            {/* Main Content Area */}
            <main className="flex-1 relative z-0 overflow-y-auto pb-24 md:pb-0">
                {children}
            </main>

            {/* Primary Navigation - Bottom Left / Pill */}
            <nav
                className={cn(
                    'fixed bottom-6 left-6 z-50 transition-all duration-300 ease-in-out',
                    isNavExpanded ? 'w-auto' : 'w-12'
                )}
            >
                <div
                    className={cn(
                        'bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl rounded-full flex items-center p-2 gap-2 overflow-hidden',
                        !isNavExpanded && 'justify-center p-0 w-12 h-12 rounded-full cursor-pointer hover:bg-gray-100'
                    )}
                    onClick={() => !isNavExpanded && setIsNavExpanded(true)}
                >
                    {isNavExpanded ? (
                        <>
                            {SECTION_LIST.map((section) => {
                                const isActive = activeSection === section.id;
                                return (
                                    <Link
                                        key={section.id}
                                        href={section.path}
                                        className={cn(
                                            'p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10',
                                            isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-500'
                                        )}
                                        title={section.label}
                                    >
                                        <Icon name={section.icon} size={20} />
                                    </Link>
                                );
                            })}
                            <div className="w-px h-6 bg-gray-200 mx-1" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsNavExpanded(false);
                                }}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 w-10 h-10 flex items-center justify-center"
                            >
                                <Icon name="ChevronLeft" size={20} />
                            </button>
                        </>
                    ) : (
                        <Icon name="Menu" size={20} className="text-gray-600 m-auto" />
                    )}
                </div>
            </nav>

            {/* Secondary Room Navigation - Right Edge Slide-out */}
            <aside className="fixed top-1/2 -translate-y-1/2 right-0 z-40">
                <div className="bg-white/90 backdrop-blur-lg border-l border-y border-gray-200 shadow-xl rounded-l-2xl py-4 px-2 flex flex-col gap-4">
                    {ROOMS.map((room) => (
                        <Link
                            key={room.id}
                            href={`/control/${room.id}`} // URL drives context in future, but for now we set it explicitly
                            onClick={() => setFocusRoom(room.id)}
                            className={cn(
                                "p-2 rounded-xl flex flex-col items-center gap-1 transition-all hover:bg-gray-100 hover:scale-110",
                                focusRoom === room.id ? "text-blue-600 bg-blue-50" : "text-gray-400"
                            )}
                            title={room.name}
                        >
                            <Icon name={room.icon as any} size={20} />
                        </Link>
                    ))}
                </div>
            </aside>
        </div>
    );
}
