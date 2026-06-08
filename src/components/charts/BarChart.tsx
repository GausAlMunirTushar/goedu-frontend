import React from "react";
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useThemeDetector } from "@/hooks/useThemeDetector";

interface BarChartProps {
    data: Array<Record<string, number | string>>;
    dataKey: string;
    valueKey: string;
    title?: string;
    color?: string;
    height?: number;
    isLoading?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
    data,
    dataKey,
    valueKey,
    title,
    color = "#3b82f6",
    height = 300,
    isLoading = false,
}) => {
    const {
        getGridStrokeColor,
        getTickColor,
        getTooltipBackgroundColor,
        getTooltipBorderColor,
        getTextColor,
    } = useThemeDetector();

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
                <RechartsBarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={getGridStrokeColor()} />
                    <XAxis dataKey={dataKey} tick={{ fontSize: 12, fill: getTickColor() }} />
                    <YAxis tick={{ fontSize: 12, fill: getTickColor() }} />
                    <Tooltip
                        formatter={(value) => [value, valueKey]}
                        labelFormatter={(label) => `${dataKey}: ${label}`}
                        contentStyle={{
                            fontSize: "12px",
                            backgroundColor: getTooltipBackgroundColor(),
                            borderColor: getTooltipBorderColor(),
                            borderRadius: "0.5rem",
                            color: getTextColor(),
                        }}
                    />
                    <Legend wrapperStyle={{ color: getTextColor() }} />
                    <Bar dataKey={valueKey} fill={color} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;
