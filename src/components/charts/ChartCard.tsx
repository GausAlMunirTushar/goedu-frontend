import React from "react";
import { useThemeDetector } from "@/hooks/useThemeDetector";

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
    color?: "blue" | "green" | "purple" | "orange" | "red" | "indigo" | "yellow" | "gray" | "pink";
    isLoading?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({
    title,
    subtitle,
    children,
    actions,
    className = "",
    color = "gray",
    isLoading = false,
}) => {
    const { isDark } = useThemeDetector();

    // Define color mappings for both light and dark themes
    const colorMap = {
        blue: {
            bg: isDark ? "#1e3a8a" : "#eff6ff",
            border: isDark ? "#1e40af" : "#bfdbfe",
            text: isDark ? "#93c5fd" : "#1d4ed8",
        },
        green: {
            bg: isDark ? "#065f46" : "#f0fdfa",
            border: isDark ? "#047857" : "#99f6e4",
            text: isDark ? "#6ee7b7" : "#047857",
        },
        purple: {
            bg: isDark ? "#5b21b6" : "#faf5ff",
            border: isDark ? "#6d28d9" : "#d8b4fe",
            text: isDark ? "#c4b5fd" : "#7e22ce",
        },
        orange: {
            bg: isDark ? "#9a3412" : "#fffbeb",
            border: isDark ? "#ea580c" : "#fde68a",
            text: isDark ? "#fdba74" : "#b45309",
        },
        red: {
            bg: isDark ? "#7f1d1d" : "#fef2f2",
            border: isDark ? "#dc2626" : "#fecaca",
            text: isDark ? "#fca5a5" : "#b91c1c",
        },
        indigo: {
            bg: isDark ? "#312e81" : "#eef2ff",
            border: isDark ? "#4f46e5" : "#a5b4fc",
            text: isDark ? "#a5b4fc" : "#4338ca",
        },
        yellow: {
            bg: isDark ? "#854d0e" : "#fefce8",
            border: isDark ? "#ca8a04" : "#fde047",
            text: isDark ? "#fde047" : "#a16207",
        },
        gray: {
            bg: isDark ? "#374151" : "#f9fafb",
            border: isDark ? "#4b5563" : "#e5e7eb",
            text: isDark ? "#d1d5db" : "#374151",
        },
        pink: {
            bg: isDark ? "#831843" : "#fdf2f8",
            border: isDark ? "#be185d" : "#fbcfe8",
            text: isDark ? "#f9a8d4" : "#be185d",
        },
    };

    const selectedColor = colorMap[color] || colorMap.gray;

    if (isLoading) {
        return (
            <div
                className={`rounded-xl border shadow-sm overflow-hidden ${className}`}
                style={{
                    backgroundColor: isDark ? "#1f2937" : "white",
                    borderColor: selectedColor.border,
                }}
            >
                <div
                    className="p-4 sm:p-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    style={{
                        borderColor: selectedColor.border,
                    }}
                >
                    <div>
                        <div
                            className={`h-5 rounded w-32 mb-2 animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
                        ></div>
                        <div
                            className={`h-3 rounded w-40 animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
                        ></div>
                    </div>
                    {actions && <div>{actions}</div>}
                </div>
                <div className="p-3 sm:p-4">
                    <div
                        className={`rounded-xl animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                        style={{ height: 300 }}
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            <div className={`text-gray-500 ${isDark ? "text-gray-400" : ""}`}>
                                Loading chart...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`rounded-xl border shadow-sm overflow-hidden ${className}`}
            style={{
                backgroundColor: isDark ? "#1f2937" : "white",
                borderColor: selectedColor.border,
            }}
        >
            <div
                className="p-4 sm:p-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                style={{
                    borderColor: selectedColor.border,
                }}
            >
                <div>
                    <h3
                        className="text-base sm:text-lg font-semibold"
                        style={{ color: selectedColor.text }}
                    >
                        {title}
                    </h3>
                    {subtitle && (
                        <p
                            className="text-xs sm:text-sm mt-1"
                            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
                {actions && <div>{actions}</div>}
            </div>
            <div className="p-3 sm:p-4">{children}</div>
        </div>
    );
};

export default ChartCard;
