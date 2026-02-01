import React from 'react';
import Image from 'next/image';
import { cn } from '@/core/utils/cn';

interface AppIconProps {
    mode: 'light' | 'dark' | 'preview';
    className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ mode, className }) => {
    // Since we now have a single "Truth" icon (the gradient house),
    // we will use CSS filters to simulate variations if needed, 
    // or just display the premium icon as is.

    // Logic:
    // Light/Preview: Original full color
    // Dark: Maybe slightly brighter or original (it glows already)
    // System: Maybe grayscale for neutral look? Or just keep original.

    // For now, let's keep the original integrity as it's a specific brand asset.
    // We can add a grayscale filter for 'system' if the user wants a neutral option.

    const isGrayscale = mode === 'dark'; // Let's try inverting logic or just keeping it simple. 
    // Actually user selected *this* icon. Let's show it in its full glory.

    return (
        <div className={cn("relative overflow-hidden flex items-center justify-center bg-white", className)}>
            <Image
                src="/icon.png"
                alt="App Icon"
                width={512}
                height={512}
                className={cn(
                    "w-full h-full object-cover",
                    // Invert colors for dark mode to achieve black background
                    mode === 'dark' && "invert"
                )}
            />
        </div>
    );
};
