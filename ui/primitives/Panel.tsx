import * as React from 'react';
import { cn } from '@/core/utils/cn';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    variant?: 'default' | 'glass';
}

export function Panel({ className, title, variant = 'default', children, ...props }: PanelProps) {
    return (
        <div
            className={cn(
                'rounded-xl overflow-hidden',
                {
                    'bg-white border border-gray-200 shadow-sm': variant === 'default',
                    'bg-white/80 backdrop-blur-md border border-white/20': variant === 'glass',
                },
                className
            )}
            {...props}
        >
            {title && (
                <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                </div>
            )}
            <div className="p-4">{children}</div>
        </div>
    );
}
