"use client";

import { Users, UserCheck, UserX, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard, ChartCard, AreaChart, BarChart } from "@/components/charts";

export function AttendanceDashboard() {
    const weeklyData = [
        { day: "Mon", present: 1150 },
        { day: "Tue", present: 1180 },
        { day: "Wed", present: 1120 },
        { day: "Thu", present: 1160 },
        { day: "Fri", present: 1190 },
        { day: "Sat", present: 1140 },
    ];

    const classWiseData = [
        { class: "Class 6", attendance: 95 },
        { class: "Class 7", attendance: 92 },
        { class: "Class 8", attendance: 98 },
        { class: "Class 9", attendance: 94 },
        { class: "Class 10", attendance: 91 },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Overview of today's attendance status and trends</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Students" 
                    value="1,250" 
                    icon={<Users className="w-5 h-5" />} 
                    color="blue"
                    subtitle="Active students this session"
                />
                <StatCard 
                    title="Present Today" 
                    value="1,190" 
                    icon={<UserCheck className="w-5 h-5" />} 
                    color="green"
                    trend={{ value: "+2.5% from yesterday", positive: true }}
                />
                <StatCard 
                    title="Absent Today" 
                    value="60" 
                    icon={<UserX className="w-5 h-5" />} 
                    color="red"
                    trend={{ value: "-1.2% from yesterday", positive: true }}
                />
                <StatCard 
                    title="Avg. Attendance" 
                    value="95.2%" 
                    icon={<BarChart3 className="w-5 h-5" />} 
                    color="purple"
                    subtitle="Overall monthly average"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard 
                    title="Weekly Attendance Trends" 
                    subtitle="Number of students present over the last 6 days"
                    color="indigo"
                >
                    <AreaChart 
                        data={weeklyData} 
                        dataKey="day" 
                        valueKey="present" 
                        color="#4f46e5"
                        height={300}
                    />
                </ChartCard>

                <ChartCard 
                    title="Attendance by Class" 
                    subtitle="Percentage of attendance per class"
                    color="green"
                >
                    <BarChart 
                        data={classWiseData} 
                        dataKey="class" 
                        valueKey="attendance" 
                        color="#10b981"
                        height={300}
                    />
                </ChartCard>
            </div>
        </div>
    );
}
