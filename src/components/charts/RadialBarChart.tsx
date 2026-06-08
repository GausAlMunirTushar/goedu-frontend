import React from "react";
import {
    RadialBarChart as RechartsRadialBarChart,
    RadialBar,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useThemeDetector } from "@/hooks/useThemeDetector";

interface RadialBarChartProps {
    data: Array<Record<string, number | string>>;
    dataKey: string;
    valueKey: string;
    title?: string;
    color?: string;
    height?: number;
    isLoading?: boolean;
}

const RadialBarChart: React.FC<RadialBarChartProps> = ({
    data,
    dataKey,
    valueKey,
    title,
    color = "#3b82f6",
    height = 300,
    isLoading = false,
}) => {
    const { getTickColor, getTextColor } = useThemeDetector();

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
                <RechartsRadialBarChart
                    innerRadius="10%"
                    outerRadius="80%"
                    barSize={10}
                    data={data}
                    startAngle={180}
                    endAngle={0}
                >
                    <RadialBar
                        label={{ position: "insideStart", fill: getTickColor(), fontSize: 12 }}
                        background
                        dataKey={valueKey}
                        fill={color}
                    />
                    <Legend
                        iconSize={10}
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="right"
                        wrapperStyle={{ color: getTextColor() }}
                    />
                </RechartsRadialBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RadialBarChart;
