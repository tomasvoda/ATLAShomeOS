'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import uxDataRaw from '@/core/mock/ux-data.json';
import { UXData, UXIssue, UXThing, UXSensor, UXRecommendation, UXVoiceSnapshot, DayPart, UXMediaState, NotificationLevel } from '@/core/mock/types';

const DATA = uxDataRaw as unknown as UXData;

type ScenarioId = keyof typeof DATA.scenarios;

interface UXContextState {
    data: UXData;
    scenario: ScenarioId;
    setScenario: (id: ScenarioId) => void;

    // Simulation Controls
    simulatedTime: string;
    setSimulatedTime: (time: string) => void;
    dayPart: DayPart;
    setDayPart: (part: DayPart) => void;
    homeMode: string;
    setHomeMode: (mode: string) => void;

    // Derived Data
    activeHomeMode: string;
    visibleIssues: UXIssue[];
    activeThings: UXThing[]; // Replaces highlightedThings with all things + state logic
    activeSensors: UXSensor[];
    activeRecommendation: UXRecommendation | null;
    currentVoiceSnapshot: UXVoiceSnapshot | null;
    activeMedia: UXMediaState;
}

const UXDataContext = createContext<UXContextState | undefined>(undefined);

export function UXDataProvider({ children }: { children: React.ReactNode }) {
    const [scenario, setScenario] = useState<ScenarioId>('calm_everything_ok');

    // Simulation State
    const [simulatedTime, setSimulatedTime] = useState('08:15');
    const [dayPart, setDayPart] = useState<DayPart>('morning');
    const [homeMode, setHomeMode] = useState('home');

    const currentScenarioData = DATA.scenarios[scenario];

    // Auto-update DayPart based on Time if user manually changes time (optional helper)
    // For now we trust the explicit DayPart derived from the controls or initial state.

    // Derive Thing States based on Simulation
    const activeThings = useMemo(() => {
        return DATA.things.map(thing => {
            const newThing = { ...thing, state: { ...thing.state } }; // shallow clone

            // --- SIMULATION LOGIC ---

            // 1. LIGHTS
            if (thing.capabilities.includes('light')) {
                const roomId = thing.roomId;
                const room = DATA.rooms.find(r => r.id === roomId);
                const isOccupied = room?.sensors?.occupied;

                if (dayPart === 'night') {
                    // Night: mostly off, except Hallway/Bathroom if occupied
                    if (isOccupied && (roomId === 'hallway' || roomId === 'bathroom_main')) {
                        newThing.state.operational = 'on';
                        newThing.readings.brightness = '20%'; // Dimmed
                    } else {
                        newThing.state.operational = 'off';
                        newThing.readings.brightness = '0%';
                    }
                } else if (dayPart === 'evening') {
                    // Evening: Main rooms ON if occupied
                    if (isOccupied) {
                        newThing.state.operational = 'on';
                        newThing.readings.brightness = '70%';
                        if (newThing.readings.color) newThing.readings.color = 'warm_white';
                    } else {
                        newThing.state.operational = 'off';
                    }
                } else if (dayPart === 'morning') {
                    // Morning: Kitchen/Bath ON if occupied
                    if (isOccupied && (roomId === 'kitchen' || roomId === 'bathroom_main')) {
                        newThing.state.operational = 'on';
                        newThing.readings.brightness = '90%';
                    } else {
                        newThing.state.operational = 'off';
                    }
                } else {
                    // Afternoon: Mostly OFF (daylight) unless Office
                    if (isOccupied && roomId === 'office') {
                        newThing.state.operational = 'on';
                    } else {
                        newThing.state.operational = 'off';
                    }
                }
            }

            // 2. BLINDS
            if (thing.capabilities.includes('cover')) {
                if (dayPart === 'night') {
                    newThing.state.operational = 'closed';
                    newThing.readings.position = '0%';
                } else if (dayPart === 'morning' || dayPart === 'afternoon') {
                    newThing.state.operational = 'open';
                    newThing.readings.position = '100%';
                }
            }

            // 3. LOCKS
            if (thing.capabilities.includes('lock')) {
                if (dayPart === 'night' || homeMode === 'away') {
                    newThing.state.operational = 'locked';
                } else {
                    newThing.state.operational = 'locked'; // Generally always locked exterior
                }
            }

            // 4. THERMOSTAT
            if (thing.capabilities.includes('climate') && thing.capabilities.includes('control')) {
                if (dayPart === 'night') {
                    newThing.readings.target = '18.5°C';
                    newThing.state.operational = 'idle';
                } else if (dayPart === 'morning') {
                    newThing.readings.target = '21.5°C';
                    newThing.state.operational = 'heating';
                }
            }

            // 5. MEDIA
            if (thing.capabilities.includes('media')) {
                if (dayPart === 'evening' && thing.roomId === 'living_room') {
                    newThing.state.operational = 'busy';
                } else {
                    newThing.state.operational = 'idle';
                }
            }

            return newThing;
        });
    }, [dayPart, homeMode]);

    // Derive Sensor States based on Simulation
    const activeSensors = useMemo(() => {
        return (DATA.sensors || []).map(sensor => {
            const newSensor = { ...sensor, interpretation: { ...sensor.interpretation } }; // shallow clone

            // --- TIME-BASED SIMULATION ---

            // 1. MOTION / PRESENCE
            // Active in Living/Kitchen during Day/Eve.
            // Quiet at Night (except Bed usage).
            // Away = Quiet.
            if (sensor.type === 'motion' || sensor.type === 'presence') {
                if (homeMode === 'away') {
                    newSensor.value = false;
                    newSensor.interpretation.meaning = "Secure";
                } else if (dayPart === 'night') {
                    // Generally quiet at night
                    newSensor.value = false;
                    newSensor.interpretation.meaning = "Quiet";
                } else {
                    // Active in common areas
                    if (['living_room', 'kitchen', 'hallway'].includes(sensor.roomId)) {
                        newSensor.value = true;
                        newSensor.interpretation.meaning = "Active";
                    } else {
                        newSensor.value = false; // Default off
                    }
                }
            }

            // 2. CO2 (Simulation of air quality)
            if (sensor.type === 'co2') {
                if (dayPart === 'night' && sensor.roomId === 'bedroom_master') {
                    // CO2 rises at night in bedroom
                    newSensor.value = 1100;
                    newSensor.interpretation.meaning = "Stuffy";
                    newSensor.interpretation.trend = "rising";
                } else if (dayPart === 'evening' && sensor.roomId === 'living_room') {
                    newSensor.value = 800;
                    newSensor.interpretation.meaning = "Fair";
                    newSensor.interpretation.trend = "stable";
                } else {
                    newSensor.value = 450; // Fresh
                    newSensor.interpretation.meaning = "Fresh";
                    newSensor.interpretation.trend = "stable";
                }
            }

            // 3. LIGHT (Lux)
            if (sensor.type === 'light') {
                if (dayPart === 'night') {
                    newSensor.value = 0;
                    newSensor.interpretation.meaning = "Dark";
                } else if (dayPart === 'evening') {
                    newSensor.value = 150; // Dim artificial
                    newSensor.interpretation.meaning = "Reading level";
                } else {
                    newSensor.value = 800; // Bright day
                    newSensor.interpretation.meaning = "Bright";
                }
            }

            // 4. POWER
            if (sensor.type === 'power' && sensor.unit === 'W') {
                if (dayPart === 'morning' || dayPart === 'evening') {
                    newSensor.value = 2400; // Peaks
                    newSensor.interpretation.meaning = "High Load";
                    newSensor.interpretation.trend = "rising";
                } else if (dayPart === 'night') {
                    newSensor.value = 350; // Base load
                    newSensor.interpretation.meaning = "Base Load";
                    newSensor.interpretation.trend = "stable";
                } else {
                    newSensor.value = 800; // Moderate
                    newSensor.interpretation.meaning = "Normal";
                }
            }

            return newSensor;
        });
    }, [dayPart, homeMode]);

    // --- MEDIA SIMULATION ---
    const activeMedia = useMemo<UXMediaState>(() => {
        // Defaults
        let media: UXMediaState = {
            isPlaying: false,
            source: 'system',
            title: '',
            artist: '',
            mood: 'background',
            volume: 0,
            roomIds: [],
            startedBy: 'system'
        };

        if (homeMode === 'away' || dayPart === 'night') {
            return media; // Silence
        }

        if (dayPart === 'morning') {
            media = {
                isPlaying: true,
                source: 'spotify',
                title: 'Morning Coffee',
                artist: 'Jazz Vibes',
                mood: 'chill',
                volume: 25,
                roomIds: ['kitchen', 'living_room'],
                startedBy: 'automation'
            };
        } else if (dayPart === 'evening') {
            media = {
                isPlaying: true,
                source: 'spotify',
                title: 'Lo-Fi Beats',
                artist: 'Chillhop',
                mood: 'focus',
                volume: 40,
                roomIds: ['living_room'],
                startedBy: 'user'
            };
        }

        return media;
    }, [dayPart, homeMode]);

    // Update Sensors based on Media (Noise)
    const activeSensorsWithMedia = useMemo(() => {
        if (!activeMedia.isPlaying) return activeSensors;

        return activeSensors.map(s => {
            if (s.type === 'noise' && activeMedia.roomIds.includes(s.roomId)) {
                // Boost noise level if music is playing in this room
                const baseNoise = Number(s.value);
                return {
                    ...s,
                    value: baseNoise + activeMedia.volume,
                    interpretation: {
                        meaning: `Music (${activeMedia.mood})`,
                        attention: 'none' as const,
                        trend: 'stable' as const
                    }
                };
            }
            return s;
        });
    }, [activeSensors, activeMedia]);

    // Derive visible state based on scenario instructions
    const visibleIssues = useMemo(() => {
        // 1. Static Scenario Issues
        // We need to map static issues to include communicationLevel defaults if missing
        const scenarioIssues = DATA.issues.filter(issue =>
            currentScenarioData.issues_active.includes(issue.id)
        ).map(i => ({ ...i, communicationLevel: (i.communicationLevel || 'notify') as NotificationLevel }));

        // 2. Dynamic Sensor Issues
        const sensorIssues: UXIssue[] = [];

        activeSensorsWithMedia.forEach(s => {
            // LEAK
            if (s.type === 'leak' && s.value === true) {
                sensorIssues.push({
                    id: `gen_leak_${s.id}`,
                    category: 'safety',
                    attentionLevel: 'critical',
                    urgency: 'immediate',
                    impact: 'high',
                    title: `Water Leak Detected`,
                    detail: `Moisture sensor ${s.name} detected water.`,
                    evidence: [`Sensor: ${s.value}`],
                    suggestedActions: ['shut_water'],
                    lifecycleState: 'open',
                    communicationLevel: 'interrupt'
                });
            }
            // CO2 High
            if (s.type === 'co2' && Number(s.value) > 1000) {
                const level: NotificationLevel = dayPart === 'night' ? 'passive' : 'notify';
                sensorIssues.push({
                    id: `gen_co2_${s.id}`,
                    category: 'health',
                    attentionLevel: 'medium',
                    urgency: 'medium',
                    impact: 'low',
                    title: `High CO2 in ${s.roomId}`,
                    detail: `Air quality is poor (${s.value} ppm).`,
                    evidence: [`Sensor: ${s.value}`],
                    suggestedActions: ['open_window'],
                    lifecycleState: 'open',
                    communicationLevel: level
                });
            }
            // Security: Door Open + Away
            if (homeMode === 'away' && (s.type === 'door' || s.type === 'window') && s.value === true) {
                sensorIssues.push({
                    id: `gen_sec_${s.id}`,
                    category: 'security',
                    attentionLevel: 'critical',
                    urgency: 'immediate',
                    impact: 'high',
                    title: `Intrusion Alert`,
                    detail: `${s.name} is OPEN while system is ARMED/AWAY.`,
                    evidence: [`Sensor: ${s.value}`],
                    suggestedActions: ['call_police'],
                    lifecycleState: 'open',
                    communicationLevel: 'interrupt'
                });
            }
        });

        const allIssues = [...scenarioIssues, ...sensorIssues];

        return allIssues.sort((a, b) => {
            const priority = { critical: 4, high: 3, medium: 2, low: 1, none: 0 };
            return priority[b.attentionLevel] - priority[a.attentionLevel];
        });
    }, [scenario, currentScenarioData, activeSensorsWithMedia, dayPart, homeMode]);

    const activeRecommendation = useMemo(() => {
        let recId = currentScenarioData.active_recommendation;

        // Dynamic Recommendation Override
        if (dayPart === 'night') recId = 'rec_routine_sleep';
        if (dayPart === 'morning') recId = 'rec_morning_boost';

        if (!recId) return null;

        const baseRec = DATA.recommendations.find(r => r.id === recId);
        if (!baseRec) return null;

        // Apply Communication Policy to Recommendation
        let commLevel: NotificationLevel = (baseRec.communicationLevel || 'notify') as NotificationLevel;

        if (dayPart === 'night' && baseRec.attentionLevel !== 'critical') {
            commLevel = 'silent';
        } else if (activeMedia.isPlaying && activeMedia.volume > 50) {
            commLevel = 'passive'; // Don't interrupt loud music
        }

        return { ...baseRec, communicationLevel: commLevel };

    }, [currentScenarioData, dayPart, activeMedia]);

    const activeHomeMode = homeMode; // Driven by sim state now, not scenario

    // Voice Snapshot with Suppression Logic
    const currentVoiceSnapshot = useMemo(() => {
        const latest = DATA.voiceSnapshots[DATA.voiceSnapshots.length - 1];
        if (!latest) return null;

        // Clone to avoid mutating raw data if we were modifying it, 
        // but here we are deriving a view property.
        // We simulate that the LATEST snapshot is happening NOW.

        let allowed = true;
        let reason = undefined;

        // Apply Policy:
        if (dayPart === 'night' && activeHomeMode !== 'away') {
            // Strict silence at night unless critical (assuming snapshot has intent)
            // For simulation, we'll assume standard voice commands are "allowed" but 
            // proactive system voice (outcome) might be suppressed. 
            // Let's interpret "wasSpeechAllowed" as "Did the system speak back aloud?"

            // If the snapshot just happened (simulated), we tag it.
            allowed = false;
            reason = "Night Mode (Silent Policy)";
        }

        return {
            ...latest,
            wasSpeechAllowed: allowed,
            reasonIfSuppressed: reason
        };
    }, [dayPart, activeHomeMode]);

    return (
        <UXDataContext.Provider
            value={{
                data: DATA,
                scenario,
                setScenario,
                simulatedTime,
                setSimulatedTime,
                dayPart,
                setDayPart,
                homeMode,
                setHomeMode,
                activeHomeMode,
                visibleIssues,
                activeThings,
                activeSensors: activeSensorsWithMedia,
                activeMedia,
                activeRecommendation,
                currentVoiceSnapshot
            }}
        >
            {children}
        </UXDataContext.Provider>
    );
}

export function useUXData() {
    const context = useContext(UXDataContext);
    if (context === undefined) {
        throw new Error('useUXData must be used within a UXDataProvider');
    }
    return context;
}
