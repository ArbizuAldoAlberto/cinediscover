/**
 * @file theme.ts
 * @description Centralized design system following Stitch Home Explorer aesthetics.
 */

export const theme = {
    colors: {
        primary: '#00d6a4', // Vibrant neon green
        background: '#121212', // Deep dark mode
        surface: '#1A1A1A', // Card/Elevated surface
        text: '#FFFFFF',
        textSecondary: '#94A3B8', // Slate 400
        accent: '#00d6a4',
        error: '#FF4B4B',
        success: '#00D6A4',
        border: 'rgba(255, 255, 255, 0.05)',
        overlay: 'rgba(0, 0, 0, 0.6)',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },
    roundness: {
        small: 8,
        medium: 12,
        large: 16,
        xl: 24,
        full: 9999,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: '700' as const,
            letterSpacing: -1,
        },
        h2: {
            fontSize: 24,
            fontWeight: '700' as const,
            letterSpacing: -0.5,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600' as const,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400' as const,
        },
        caption: {
            fontSize: 12,
            fontWeight: '500' as const,
            textTransform: 'uppercase' as const,
            letterSpacing: 1,
        },
        tiny: {
            fontSize: 10,
            fontWeight: '700' as const,
            textTransform: 'uppercase' as const,
            letterSpacing: 1.5,
        }
    },
    shadows: {
        light: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        glow: {
            shadowColor: "#00d6a4",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 15,
            elevation: 10,
        }
    }
} as const;

export type Theme = typeof theme;
