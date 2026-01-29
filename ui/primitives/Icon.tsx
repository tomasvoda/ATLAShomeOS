import { LucideIcon, icons } from 'lucide-react';
import { cn } from '@/core/utils/cn';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: keyof typeof icons;
    size?: number | string;
}

export const Icon = ({ name, className, size = 24, ...props }: IconProps) => {
    const LucideIcon = icons[name] as LucideIcon;

    if (!LucideIcon) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return <LucideIcon className={cn('shrink-0', className)} size={size} {...props} />;
};
