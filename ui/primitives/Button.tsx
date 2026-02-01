import * as React from 'react';
import { cn } from '@/core/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-2xl text-[13px] font-medium transition-all duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
                    {
                        'bg-accent text-white shadow-lg shadow-accent/20 hover:brightness-110': variant === 'primary',
                        'bg-foreground/5 text-foreground hover:bg-foreground/10': variant === 'secondary',
                        'glass-surface shadow-sm hover:bg-foreground/5': variant === 'glass',
                        'hover:bg-foreground/5 text-foreground': variant === 'ghost',
                        'border border-glass-border bg-transparent hover:bg-foreground/5': variant === 'outline',
                        'h-9 px-4': size === 'sm',
                        'h-11 px-6': size === 'md',
                        'h-13 px-10 text-base': size === 'lg',
                        'h-11 w-11': size === 'icon',
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button };
