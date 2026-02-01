import * as React from 'react';
import { cn } from '@/core/utils/cn';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    variant?: 'default' | 'glass' | 'elevated';
}

export function Panel({ className, title, variant = 'glass', children, ...props }: PanelProps) {
    return (
        <div
            className={cn(
                'rounded-3xl overflow-hidden transition-all duration-500',
                {
                    'bg-background/50 border border-glass-border': variant === 'default',
                    'glass-surface shadow-lg': variant === 'glass',
                    'glass-elevated shadow-xl': variant === 'elevated',
                },
                className
            )}
            {...props}
        >
            {title && (
                <div className="px-6 py-4 border-b border-glass-border">
                    <h3 className="text-[13px] font-medium tracking-wide uppercase opacity-40 text-text-primary">
                        {title}
                    </h3>
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
}
