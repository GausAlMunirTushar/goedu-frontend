import React from "react";
import {
    ComposedChart as RechartsComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useThemeDetector } from "@/hooks/useThemeDetector";

interface ComposedChartProps {
    data: Array<Record<string, number | string>>;
    dataKey: string;
    barValueKey: string;
    lineValueKey: string;
    title?: string;
    barColor?: string;
    lineColor?: string;
    height?: number;
    isLoading?: boolean;
}

const ComposedChart: React.FC<ComposedChartProps> = ({
    data,
    dataKey,
    barValueKey,
    lineValueKey,
    title,
    barColor = "#3b82f6",
    lineColor = "#10b981",
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
                <RechartsComposedChart
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
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: getTickColor() }} />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12, fill: getTickColor() }}
                    />
                    <Tooltip
                        contentStyle={{
                            fontSize: "12px",
                            backgroundColor: getTooltipBackgroundColor(),
                            borderColor: getTooltipBorderColor(),
                            borderRadius: "0.5rem",
                            color: getTextColor(),
                        }}
                    />
                    <Legend wrapperStyle={{ color: getTextColor() }} />
                    <Bar yAxisId="left" dataKey={barValueKey} fill={barColor} barSize={20} />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey={lineValueKey}
                        stroke={lineColor}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </RechartsComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ComposedChart;
