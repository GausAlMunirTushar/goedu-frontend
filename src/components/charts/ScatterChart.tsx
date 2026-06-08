import React from "react";
import {
    ScatterChart as RechartsScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useThemeDetector } from "@/hooks/useThemeDetector";

interface ScatterChartProps {
    data: Array<Record<string, number | string>>;
    xDataKey: string;
    yDataKey: string;
    zDataKey?: string;
    title?: string;
    color?: string;
    height?: number;
    isLoading?: boolean;
}

const ScatterChart: React.FC<ScatterChartProps> = ({
    data,
    xDataKey,
    yDataKey,
    zDataKey = "z",
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
                <RechartsScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={getGridStrokeColor()} />
                    <XAxis
                        type="number"
                        dataKey={xDataKey}
                        tick={{ fontSize: 12, fill: getTickColor() }}
                    />
                    <YAxis
                        type="number"
                        dataKey={yDataKey}
                        tick={{ fontSize: 12, fill: getTickColor() }}
                    />
                    <ZAxis range={[100, 1000]} dataKey={zDataKey} />
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
                    <Scatter name="Data Points" data={data} fill={color} />
                </RechartsScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScatterChart;
