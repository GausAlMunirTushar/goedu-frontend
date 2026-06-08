import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Custom hook to detect the current theme and provide theme-aware colors
 * @returns Object containing current theme and color mapping functions
 */
export const useThemeDetector = () => {
    const { theme, resolvedTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Determine the actual theme (resolvedTheme accounts for system preference)
    const currentTheme = resolvedTheme || theme;

    /**
     * Get theme-aware colors based on current theme
     * @param lightColor Color to use in light theme
     * @param darkColor Color to use in dark theme
     * @returns Appropriate color based on current theme
     */
    const getThemeAwareColor = (lightColor: string, darkColor: string): string => {
        if (!isMounted) return lightColor; // Default to light theme during SSR
        return currentTheme === "dark" ? darkColor : lightColor;
    };

    /**
     * Get theme-aware grid stroke color
     * @returns Grid stroke color appropriate for current theme
     */
    const getGridStrokeColor = (): string => {
        return getThemeAwareColor("#e5e7eb", "#374151");
    };

    /**
     * Get theme-aware tick color
     * @returns Tick color appropriate for current theme
     */
    const getTickColor = (): string => {
        return getThemeAwareColor("#4b5563", "#d1d5db");
    };

    /**
     * Get theme-aware tooltip background color
     * @returns Tooltip background color appropriate for current theme
     */
    const getTooltipBackgroundColor = (): string => {
        return getThemeAwareColor("#ffffff", "#1f2937");
    };

    /**
     * Get theme-aware tooltip border color
     * @returns Tooltip border color appropriate for current theme
     */
    const getTooltipBorderColor = (): string => {
        return getThemeAwareColor("#e5e7eb", "#374151");
    };

    /**
     * Get theme-aware text color
     * @returns Text color appropriate for current theme
     */
    const getTextColor = (): string => {
        return getThemeAwareColor("#111827", "#f9fafb");
    };

    return {
        theme: currentTheme,
        isDark: currentTheme === "dark",
        isLight: currentTheme === "light",
        isMounted,
        getThemeAwareColor,
        getGridStrokeColor,
        getTickColor,
        getTooltipBackgroundColor,
        getTooltipBorderColor,
        getTextColor,
    };
};
