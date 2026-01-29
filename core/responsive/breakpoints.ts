export const BREAKPOINTS = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
} as const;

export const FILTERS = {
    isMobile: `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
    isTablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
    isDesktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
};
