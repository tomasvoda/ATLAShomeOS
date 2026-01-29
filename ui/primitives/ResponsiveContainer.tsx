import * as React from 'react';
import { cn } from '@/core/utils/cn';

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    fluid?: boolean;
}

export function ResponsiveContainer({ className, fluid, children, ...props }: ResponsiveContainerProps) {
    return (
        <div
            className={cn(
                'w-full mx-auto px-4 sm:px-6 lg:px-8',
                fluid ? 'max-w-full' : 'max-w-7xl',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
