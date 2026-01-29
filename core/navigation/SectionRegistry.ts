import { icons } from 'lucide-react';

export type SectionId = 'status' | 'control' | 'voice' | 'settings';
export type SectionIntent = 'observe' | 'act' | 'interact' | 'configure';

export interface AppSection {
    id: SectionId;
    label: string;
    icon: keyof typeof icons;
    path: string;
    description: string;
    intent: SectionIntent;
    order: number;
    enabled: boolean;
    showInNav: boolean;
}

export const SECTIONS: Record<SectionId, AppSection> = {
    status: {
        id: 'status',
        label: 'Status',
        path: '/status',
        icon: 'Activity',
        description: 'System health and diagnostics',
        intent: 'observe',
        order: 1,
        enabled: true,
        showInNav: true,
    },
    control: {
        id: 'control',
        label: 'Control',
        path: '/control',
        icon: 'LayoutGrid',
        description: 'Home control interface',
        intent: 'act',
        order: 2,
        enabled: true,
        showInNav: true,
    },
    voice: {
        id: 'voice',
        label: 'Voice',
        path: '/voice',
        icon: 'Mic',
        description: 'Voice interaction',
        intent: 'interact',
        order: 3,
        enabled: true,
        showInNav: true,
    },
    settings: {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: 'Settings',
        description: 'System configuration',
        intent: 'configure',
        order: 4,
        enabled: true,
        showInNav: true,
    },
};

export const SECTION_LIST = Object.values(SECTIONS).sort((a, b) => a.order - b.order);
