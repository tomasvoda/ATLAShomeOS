'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { usePresence } from '@/context/PresenceContext';
import { SECTION_LIST } from '@/core/navigation/SectionRegistry';
import { Icon } from '@/ui/primitives/Icon';
import { cn } from '@/core/utils/cn';
import { WorldHeader } from '@/ui/components/WorldHeader/WorldHeader';
import { useFeedback } from '@/core/hooks/useFeedback';
import { FrozenRouter } from './FrozenRouter';

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

    // Close on route change
    useEffect(() => {
        setIsRoomOverlayOpen(false);
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

        // Intentional Navigation: bridge to Control Center if not already there
        if (pathname !== '/control') {
            router.push('/control');
        }
    };


    const activeSectionData = SECTION_LIST.find(s => s.id === activeSection) || SECTION_LIST[0];
    const currentRoomData = ROOMS.find(r => r.id === activeRoom);

    // Context Rule: Room highlighting applies ONLY in Control Center
    const showRoomHighlight = activeSection === 'control';

    // Weighted visionOS Motion System - Liquid Glass Easing
    const visionTransition = {
        ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
        duration: 0.32, // Standard navigation impact
    };

    const largeTransition = {
        ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
        duration: 0.42, // Focus Shift / Large transitions
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative font-sans antialiased transition-colors duration-700">
            <WorldHeader />

            {/* CONTENT AREA with Liquid Flow Transition */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname}
                    initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.98 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(12px)', scale: 0.98 }}
                    transition={{
                        duration: 0.24,
                        ease: [0.22, 0.61, 0.36, 1], // Liquid Glass Easing
                    }}
                    className="flex-1 relative z-0 pt-20 pb-40 will-change-[transform,opacity,filter]"
                >
                    <FrozenRouter>{children}</FrozenRouter>
                </motion.main>
            </AnimatePresence>

            {/* UNIFIED NAVIGATION LAYER */}
            <div className="fixed inset-0 pointer-events-none z-[130] p-6 lg:p-10 flex flex-col justify-end">

                {/* Tap Outside for Room Overlay (Backdrop behind the pill) */}
                <AnimatePresence>
                    {isRoomOverlayOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-10 cursor-default pointer-events-auto bg-black/10 backdrop-blur-[2px]"
                            onClick={() => setIsRoomOverlayOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* BOTTOM NAV CONTAINER - Centered for pill, Left-aligned for button */}
                <div className="flex relative z-20 justify-center w-full">
                    <motion.nav
                        layout
                        initial={false}
                        animate={{
                            width: 'auto',
                            height: '72px',
                            borderRadius: '40px',
                        }}
                        transition={visionTransition}
                        className="pointer-events-auto glass-dock p-1.5 flex items-center gap-1"
                    >
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, filter: 'blur(2px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(2px)' }}
                            transition={visionTransition}
                            className="flex items-center gap-1"
                        >
                            {SECTION_LIST.map((section) => {
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => handleNavigate(section.path)}
                                        className={cn(
                                            "relative h-14 min-w-[64px] rounded-3xl flex flex-col items-center justify-center gap-0.5 transition-all duration-320 active:scale-95",
                                            isActive
                                                ? "text-text-primary"
                                                : "text-text-secondary hover:text-text-primary"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-highlight"
                                                className="absolute inset-0 rounded-3xl glass-liquid !bg-white/[0.04] !border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] z-0"
                                                transition={visionTransition}
                                            />
                                        )}
                                        <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                                            <Icon name={section.icon} size={20} strokeWidth={isActive ? 2 : 1.5} />
                                            <span className={cn(
                                                "text-[9px] font-bold uppercase tracking-[0.12em] transition-opacity",
                                                isActive ? "opacity-100" : "opacity-60"
                                            )}>
                                                {section.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}

                            <div className="w-px h-8 bg-white/5 mx-1" />

                            {/* ROOMS TRIGGER & SPATIAL OVERLAY */}
                            <div className="relative">
                                <AnimatePresence>
                                    {isRoomOverlayOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: -6 }}
                                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                                            transition={visionTransition}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 pointer-events-auto flex flex-col items-center will-change-transform"
                                        >
                                            <div className="rooms-blade p-1.5 flex flex-col items-center gap-1 min-w-[72px] relative">
                                                {ROOMS.map((room) => {
                                                    const isRoomActive = showRoomHighlight && activeRoom === room.id;
                                                    return (
                                                        <button
                                                            key={room.id}
                                                            onClick={() => handleRoomChange(room.id)}
                                                            className={cn(
                                                                "w-full aspect-square min-h-[64px] rounded-[1.2rem] flex flex-col items-center justify-center gap-1 transition-all duration-320 group relative active:scale-95",
                                                                isRoomActive
                                                                    ? "text-text-primary"
                                                                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
                                                            )}
                                                        >
                                                            {isRoomActive && (
                                                                <motion.div
                                                                    layoutId="room-highlight"
                                                                    className="absolute inset-0 rounded-[1.2rem] glass-liquid !bg-white/[0.04] !border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] z-0"
                                                                    transition={visionTransition}
                                                                />
                                                            )}
                                                            <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                                                                <Icon name={room.icon as any} size={18} strokeWidth={isRoomActive ? 2 : 1.5} />
                                                                <span className="text-[8px] font-bold uppercase tracking-[0.1em] whitespace-nowrap text-center px-1">
                                                                    {room.name.split(' ')[0]}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}

                                                <button
                                                    onClick={() => handleRoomChange(null)}
                                                    className={cn(
                                                        "w-full aspect-square min-h-[64px] rounded-[1.2rem] flex flex-col items-center justify-center gap-1 transition-all duration-320 group relative active:scale-95",
                                                        (showRoomHighlight && activeRoom === null)
                                                            ? "text-text-primary"
                                                            : "text-text-secondary opacity-60 hover:opacity-100 hover:bg-white/[0.04]"
                                                    )}
                                                >
                                                    {(showRoomHighlight && activeRoom === null) && (
                                                        <motion.div
                                                            layoutId="room-highlight"
                                                            className="absolute inset-0 rounded-[1.2rem] glass-liquid !bg-white/[0.04] !border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] z-0"
                                                            transition={visionTransition}
                                                        />
                                                    )}
                                                    <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                                                        <Icon name="House" size={18} />
                                                        <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-center px-1">ALL</span>
                                                    </div>
                                                </button>
                                            </div>

                                            {/* Visual Bridge Notch */}
                                            <div className="w-3 h-2 bg-white/10 backdrop-blur-xl mt-[-2px] clip-path-notch"
                                                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={() => {
                                        triggerFeedback('light');
                                        setIsRoomOverlayOpen(!isRoomOverlayOpen);
                                    }}
                                    className={cn(
                                        "h-14 min-w-[64px] rounded-3xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 relative z-10",
                                        isRoomOverlayOpen
                                            ? "text-text-primary scale-[1.04]"
                                            : (showRoomHighlight && activeRoom)
                                                ? "text-text-primary soft-glow-active"
                                                : "text-text-secondary opacity-60 hover:opacity-100 hover:text-text-primary"
                                    )}
                                >
                                    <Icon name={currentRoomData?.icon as any || 'LayoutGrid'} size={20} />
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-[0.12em]",
                                        (isRoomOverlayOpen || (showRoomHighlight && activeRoom)) ? "opacity-100" : "opacity-60"
                                    )}>
                                        {currentRoomData?.name || 'Rooms'}
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.nav>
                </div>
            </div>
        </div >
    );
}
