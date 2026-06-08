import React from "react";
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useThemeDetector } from "@/hooks/useThemeDetector";

interface PieChartProps {
    data: Array<Record<string, number | string>>;
    dataKey: string;
    nameKey: string;
    title?: string;
    colorPalette?: string[];
    height?: number;
    isLoading?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
    data,
    dataKey,
    nameKey,
    title,
    colorPalette = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#6366f1"],
    height = 300,
    isLoading = false,
}) => {
    const { getTooltipBackgroundColor, getTooltipBorderColor, getTextColor } = useThemeDetector();

    if (isLoading) {
        return (
            <div className="w-full">
                {title && (
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 dark:text-white">
                        {title}
                    </h3>
                )}
                <div
                    className="bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                    style={{ height: height }}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 dark:text-white">
                    {title}
                </h3>
            )}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#d1d5db"
                        dataKey={dataKey}
                        nameKey={nameKey}
                        label={({ name, percent }) =>
                            `${name}: ${percent ? (percent * 100).toFixed(0) : "0"}%`
                        }
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colorPalette[index % colorPalette.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [value, dataKey]}
                        contentStyle={{
                            fontSize: "12px",
                            backgroundColor: getTooltipBackgroundColor(),
                            borderColor: getTooltipBorderColor(),
                            borderRadius: "0.5rem",
                            color: getTextColor(),
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", color: getTextColor() }} />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;
