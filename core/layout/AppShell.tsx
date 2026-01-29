'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { usePresence } from '@/context/PresenceContext';
import { SECTION_LIST } from '@/core/navigation/SectionRegistry';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { WorldHeader } from '@/ui/components/WorldHeader/WorldHeader';
import { useFeedback } from '@/core/hooks/useFeedback';

const ROOMS = [
    { id: 'living', name: 'Living Room', icon: 'Armchair' },
    { id: 'kitchen', name: 'Kitchen', icon: 'Utensils' },
    { id: 'bedroom', name: 'Bedroom', icon: 'Bed' },
    { id: 'office', name: 'Office', icon: 'Monitor' },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
    const { activeSection } = useApp();
    const { focusRoom, setFocusRoom, activeRoom } = usePresence();
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [isRoomOverlayOpen, setIsRoomOverlayOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { triggerFeedback, playSound } = useFeedback();

    // Scroll Logic: Morph Nav
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 60 && currentScrollY > lastScrollY) {
                if (!isNavCollapsed) {
                    setIsNavCollapsed(true);
                    setIsRoomOverlayOpen(false);
                }
            } else if (currentScrollY < lastScrollY - 10 || currentScrollY < 20) {
                if (isNavCollapsed) {
                    setIsNavCollapsed(false);
                }
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isNavCollapsed]);

    // Close on route change
    useEffect(() => {
        setIsRoomOverlayOpen(false);
        setIsNavCollapsed(false);
    }, [pathname]);

    const handleNavigate = (path: string) => {
        triggerFeedback('light');
        playSound('tick');
        router.push(path);
    };

    const handleRoomChange = (roomId: string | null) => {
        triggerFeedback('medium');
        playSound('click');
        setFocusRoom(roomId);
        setIsRoomOverlayOpen(false);
    };

    const activeSectionData = SECTION_LIST.find(s => s.id === activeSection) || SECTION_LIST[0];
    const currentRoomData = ROOMS.find(r => r.id === activeRoom);

    // Spring Presets
    const springTransition = { type: 'spring' as const, stiffness: 350, damping: 30, mass: 0.8 };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative font-sans antialiased transition-colors duration-700">
            <WorldHeader />

            <main className="flex-1 relative z-0 pt-20 pb-40">
                {children}
            </main>

            {/* UNIFIED NAVIGATION LAYER */}
            <div className="fixed inset-0 pointer-events-none z-[130] p-6 lg:p-10 flex flex-col justify-end items-start md:items-start">

                {/* ROOM PILL OVERLAY (Upward from Rooms Icon) */}
                <AnimatePresence>
                    {isRoomOverlayOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            transition={springTransition}
                            className="pointer-events-auto mb-4 glass-surface rounded-[2rem] p-1.5 flex items-center gap-1.5 shadow-2xl pill-glow border-white/[0.05]"
                        >
                            <button
                                onClick={() => handleRoomChange(null)}
                                className={cn(
                                    "h-12 px-5 rounded-full flex items-center justify-center transition-all active:scale-95",
                                    activeRoom === null
                                        ? "bg-foreground/10 text-foreground scale-[1.05] shadow-lg"
                                        : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                                )}
                            >
                                <Icon name="House" size={18} />
                                <span className="ml-2 text-[11px] font-medium tracking-wide">All</span>
                            </button>

                            <div className="w-px h-6 bg-foreground/10" />

                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[70vw] px-1">
                                {ROOMS.map(room => (
                                    <button
                                        key={room.id}
                                        onClick={() => handleRoomChange(room.id)}
                                        className={cn(
                                            "h-12 px-5 rounded-full whitespace-nowrap flex items-center transition-all active:scale-95",
                                            activeRoom === room.id
                                                ? "bg-foreground/10 text-foreground scale-[1.05] shadow-lg"
                                                : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                                        )}
                                    >
                                        <Icon name={room.icon as any} size={18} />
                                        <span className="ml-2 text-[11px] font-medium tracking-wide">{room.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* BOTTOM MODE PILL */}
                <motion.nav
                    layout
                    initial={false}
                    animate={{
                        width: isNavCollapsed ? '56px' : 'auto',
                        height: isNavCollapsed ? '56px' : '72px',
                        scale: isNavCollapsed ? 0.9 : 1,
                        opacity: isNavCollapsed ? 0.8 : 1,
                    }}
                    transition={springTransition}
                    className={cn(
                        "pointer-events-auto glass-surface rounded-[2.5rem] p-1.5 flex items-center shadow-2xl pill-glow border-white/[0.05] origin-bottom-left",
                        isNavCollapsed ? "justify-center" : "gap-1"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {isNavCollapsed ? (
                            <motion.div
                                key="collapsed"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="text-foreground"
                            >
                                <Icon name={activeSectionData.icon} size={24} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="expanded"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-1"
                            >
                                {SECTION_LIST.map((section) => {
                                    const isActive = activeSection === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => handleNavigate(section.path)}
                                            className={cn(
                                                "relative h-14 min-w-[64px] rounded-3xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 active:scale-95",
                                                isActive
                                                    ? "bg-foreground/10 text-foreground scale-[1.05] shadow-sm ring-1 ring-inset ring-white/[0.05]"
                                                    : "text-foreground/30 hover:text-foreground hover:bg-foreground/[0.03]"
                                            )}
                                        >
                                            <Icon name={section.icon} size={20} strokeWidth={isActive ? 2 : 1.5} />
                                            <span className="text-[9px] font-medium uppercase tracking-[0.1em]">
                                                {section.label}
                                            </span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-highlight"
                                                    className="absolute inset-0 bg-foreground/[0.02] rounded-3xl -z-10"
                                                />
                                            )}
                                        </button>
                                    );
                                })}

                                <div className="w-px h-8 bg-foreground/10 mx-1" />

                                {/* ROOMS TRIGGER */}
                                <button
                                    onClick={() => {
                                        triggerFeedback('light');
                                        setIsRoomOverlayOpen(!isRoomOverlayOpen);
                                    }}
                                    className={cn(
                                        "h-14 min-w-[64px] rounded-3xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95",
                                        isRoomOverlayOpen
                                            ? "bg-foreground text-background scale-[1.05]"
                                            : activeRoom
                                                ? "text-foreground bg-foreground/5"
                                                : "text-foreground/30 hover:text-foreground hover:bg-foreground/[0.03]"
                                    )}
                                >
                                    <Icon name={currentRoomData?.icon as any || 'LayoutGrid'} size={20} />
                                    <span className="text-[9px] font-medium uppercase tracking-[0.1em]">
                                        Rooms
                                    </span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            </div>

            {/* Tap Outside for Room Overlay */}
            <AnimatePresence>
                {isRoomOverlayOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[125] cursor-default pointer-events-auto bg-black/5 backdrop-blur-sm"
                        onClick={() => setIsRoomOverlayOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
