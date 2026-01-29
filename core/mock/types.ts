export type AttentionLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';
export type ThingState = 'off' | 'on' | 'idle' | 'busy' | 'transitioning' | 'unavailable' | 'locked' | 'heating' | 'cooling' | 'closed' | 'open' | 'recording';

export interface UXHomeHealth {
    status: string;
    attentionLevel: AttentionLevel;
    message: string;
}

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'night';

export interface UXHomeContext {
    timeOfDay: DayPart;
    simulatedTime: string;
    dayPart: DayPart;
    occupiedRooms: string[];
    quietHours: boolean;
    guestsPresent: boolean;
}

export interface UXHome {
    id: string;
    mode: string;
    health: UXHomeHealth;
    context: UXHomeContext;
}

export interface UXRoom {
    id: string;
    name: string;
    type: string;
    activityState: string;
    focusPriority: string;
    health: { status: string; message: string };
    sensors: Record<string, any>;
}

export interface UXThing {
    id: string;
    name: string;
    roomId: string;
    capabilities: string[];
    state: {
        operational: ThingState;
        health: string;
        attention: AttentionLevel;
    };
    readings: Record<string, string>;
    controlIntent: string[];
    explain: {
        reason: string;
        source: string;
        override: string;
    };
}

export type SensorType =
    | 'temperature' | 'humidity' | 'co2' | 'air_quality' | 'noise' | 'light'
    | 'motion' | 'presence' | 'occupancy'
    | 'door' | 'window' | 'lock' | 'glass_break'
    | 'smoke' | 'leak'
    | 'power' | 'network'
    | 'unknown';

export interface UXSensor {
    id: string;
    name: string;
    roomId: string;
    type: SensorType;
    value: number | string | boolean;
    unit?: string;
    lastUpdated: string; // ISO timestamp or friendly string
    interpretation: {
        meaning: string; // e.g., "Stuffy", "Quiet"
        attention: AttentionLevel;
        trend: 'stable' | 'rising' | 'falling';
    };
    explain: string; // "CO2 levels rising due to closed windows"
}

export type NotificationLevel = 'silent' | 'passive' | 'notify' | 'interrupt';

export interface UXIssue {
    id: string;
    category: string;
    attentionLevel: AttentionLevel;
    urgency: string;
    impact: string;
    title: string;
    detail: string;
    evidence: string[];
    suggestedActions: string[];
    lifecycleState: string;
    communicationLevel: NotificationLevel;
}

export interface UXRecommendation {
    id: string;
    title: string;
    why: string;
    attentionLevel: AttentionLevel;
    confidence: number;
    signals: string[];
    actions: string[];
    autonomous: boolean;
    communicationLevel: NotificationLevel;
}

export type MediaMood = 'chill' | 'focus' | 'energetic' | 'background' | 'party';

export interface UXMediaState {
    isPlaying: boolean;
    source: 'spotify' | 'tv' | 'system';
    title: string;
    artist: string;
    mood: MediaMood;
    volume: number;
    roomIds: string[]; // Multi-room support
    startedBy: string; // user, automation
}

export interface UXVoiceSnapshot {
    id: string;
    state: string;
    transcript: string;
    interpretation: string;
    ambiguity: string;
    outcome: string;
    wasSpeechAllowed?: boolean;
    reasonIfSuppressed?: string;
}

export interface UXScenarioData {
    home_mode: string;
    issues_active: string[]; // Issue IDs
    things_highlight: string[]; // Thing IDs
    active_recommendation?: string; // Recommendation ID
}

export interface UXData {
    home: UXHome;
    rooms: UXRoom[];
    things: UXThing[];
    sensors: UXSensor[];
    issues: UXIssue[];
    recommendations: UXRecommendation[];
    voiceSnapshots: UXVoiceSnapshot[];
    scenarios: Record<string, UXScenarioData>;
}
