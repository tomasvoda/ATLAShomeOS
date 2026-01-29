'use client';

import { useCallback } from 'react';
import { useApp } from '@/context/AppContext';

export const useFeedback = () => {
    const { soundEnabled, hapticEnabled } = useApp();

    const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
        if (!hapticEnabled || typeof window === 'undefined') return;

        // Browser Vibration API (Support varies, light/medium/firm mapping)
        const intensityMap = {
            light: [10],
            medium: [30],
            heavy: [60]
        };

        if ('vibrate' in navigator) {
            navigator.vibrate(intensityMap[type]);
        }
    }, [hapticEnabled]);

    const playSound = useCallback((type: 'tick' | 'click' | 'mute' = 'tick') => {
        if (!soundEnabled || typeof window === 'undefined') return;

        // Note: In a real implementation, we'd preload small Audio objects or use Web Audio API
        // For now, we'll implement the logic hook. 
        // We'll use very high-frequency, short oscillators to mock "premium" ticks.

        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = context.createOscillator();
            const gain = context.createGain();

            osc.connect(gain);
            gain.connect(context.destination);

            if (type === 'tick') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, context.currentTime);
                gain.gain.setValueAtTime(0.05, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.05);
            } else if (type === 'click') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, context.currentTime);
                gain.gain.setValueAtTime(0.1, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);
            }

            osc.start();
            osc.stop(context.currentTime + 0.1);
        } catch (e) {
            console.warn('Audio playback failed', e);
        }
    }, [soundEnabled]);

    const triggerFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
        triggerHaptic(type);
        playSound(type === 'heavy' ? 'click' : 'tick');
    }, [triggerHaptic, playSound]);

    return { triggerHaptic, playSound, triggerFeedback };
};
