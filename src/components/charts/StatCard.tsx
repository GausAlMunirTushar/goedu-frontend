import React from "react";
import { useThemeDetector } from "@/hooks/useThemeDetector";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: "blue" | "green" | "purple" | "orange" | "red" | "indigo" | "yellow" | "gray" | "pink";
    trend?: {
        value: string;
        positive: boolean;
    };
    className?: string;
    isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    color = "blue",
    trend,
    className = "",
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

    const selectedColor = colorMap[color] || colorMap.blue;

    if (isLoading) {
        return (
            <div
                className={`border rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md ${className}`}
                style={{
                    backgroundColor: isDark ? "#1f2937" : selectedColor.bg,
                    borderColor: isDark ? "#374151" : selectedColor.border,
                    color: isDark ? "#d1d5db" : selectedColor.text,
                }}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <div
                            className={`h-4 rounded w-24 mb-2 animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
                        ></div>
                        <div
                            className={`h-6 rounded w-16 animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
                        ></div>
                        <div
                            className={`h-3 rounded w-20 mt-2 animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
                        ></div>
                    </div>
                    <div
                        className={`w-8 h-8 rounded animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
                    ></div>
                </div>
                <div
                    className={`h-3 rounded w-16 mt-3 animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
                ></div>
            </div>
        );
    }

    return (
        <div
            className={`border rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md ${className}`}
            style={{
                backgroundColor: isDark ? "#1f2937" : selectedColor.bg,
                borderColor: isDark ? "#374151" : selectedColor.border,
                color: isDark ? "#d1d5db" : selectedColor.text,
            }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p
                        className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                        {title}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">{value}</h3>
                    {subtitle && (
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {icon && <div className="text-xl sm:text-2xl">{icon}</div>}
            </div>
            {trend && (
                <div
                    className={`mt-2 sm:mt-3 text-xs sm:text-sm ${trend.positive ? (isDark ? "text-green-400" : "text-green-600") : isDark ? "text-red-400" : "text-red-600"}`}
                >
                    <span>{trend.value}</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
