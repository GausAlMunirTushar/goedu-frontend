"use client";
import React from "react";
import { LineChart, BarChart, PieChart, AreaChart, StatCard, ChartCard } from "@/components/charts";
import {
    Users,
    DollarSign,
    FileText,
    TrendingUp,
    Calendar,
    CreditCard,
    Briefcase,
    CheckCircle,
} from "lucide-react";
import bdtCurrency from "@/lib/currency";

const DashboardPage = () => {
    // Static data for stats
    const statsData = {
        totalEmployees: 1248,
        totalPayroll: 2450000,
        activeProjects: 42,
        pendingApprovals: 18,
        monthlyRevenue: 875000,
        attendanceRate: 94.5,
        employeeGrowth: 12.5,
        budgetUtilization: 78.3,
    };

    // Payroll trend data (last 12 months)
    const payrollTrendData = [
        { month: "Jan", payroll: 1850000, employees: 1180 },
        { month: "Feb", payroll: 1920000, employees: 1195 },
        { month: "Mar", payroll: 2100000, employees: 1210 },
        { month: "Apr", payroll: 2050000, employees: 1220 },
        { month: "May", payroll: 2200000, employees: 1225 },
        { month: "Jun", payroll: 2150000, employees: 1230 },
        { month: "Jul", payroll: 2300000, employees: 1235 },
        { month: "Aug", payroll: 2250000, employees: 1240 },
        { month: "Sep", payroll: 2400000, employees: 1242 },
        { month: "Oct", payroll: 2350000, employees: 1245 },
        { month: "Nov", payroll: 2450000, employees: 1248 },
        { month: "Dec", payroll: 2500000, employees: 1250 },
    ];

    // Department distribution data
    const departmentData = [
        { name: "HR", employees: 85, budget: 425000 },
        { name: "Engineering", employees: 420, budget: 2100000 },
        { name: "Finance", employees: 125, budget: 625000 },
        { name: "Marketing", employees: 180, budget: 900000 },
        { name: "Operations", employees: 290, budget: 1450000 },
        { name: "Sales", employees: 148, budget: 740000 },
    ];

    // Attendance data (last 7 days)
    const attendanceData = [
        { day: "Mon", present: 1185, absent: 63, rate: 95.0 },
        { day: "Tue", present: 1172, absent: 76, rate: 93.9 },
        { day: "Wed", present: 1190, absent: 58, rate: 95.4 },
        { day: "Thu", present: 1165, absent: 83, rate: 93.3 },
        { day: "Fri", present: 1145, absent: 103, rate: 91.7 },
        { day: "Sat", present: 985, absent: 263, rate: 78.9 },
        { day: "Sun", present: 425, absent: 823, rate: 34.1 },
    ];

    // Budget vs Actual spending
    const budgetData = [
        { category: "Q1", budget: 5000000, actual: 4750000 },
        { category: "Q2", budget: 5200000, actual: 5100000 },
        { category: "Q3", budget: 5500000, actual: 5350000 },
        { category: "Q4", budget: 5800000, actual: 4200000 },
    ];

    // Employee status distribution
    const employeeStatusData = [
        { name: "Active", value: 1185 },
        { name: "On Leave", value: 42 },
        { name: "Remote", value: 18 },
        { name: "Suspended", value: 3 },
    ];

    // Recent activities
    const recentActivities = [
        { id: 1, type: "payroll", message: "Payroll processed for November", time: "2 hours ago" },
        {
            id: 2,
            type: "employee",
            message: "New employee onboarded: Sarah Johnson",
            time: "4 hours ago",
        },
        {
            id: 3,
            type: "approval",
            message: "Leave request approved for John Doe",
            time: "6 hours ago",
        },
        { id: 4, type: "project", message: "Project Alpha milestone completed", time: "1 day ago" },
        { id: 5, type: "finance", message: "Budget report generated for Q4", time: "2 days ago" },
    ];

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat("en-US").format(value);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your organization&#39;s performance
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Employees"
                    value={formatNumber(statsData.totalEmployees)}
                    subtitle="Active workforce"
                    icon={<Users className="h-5 w-5" />}
                    color="blue"
                    trend={{
                        value: `+${statsData.employeeGrowth}% from last month`,
                        positive: true,
                    }}
                />
                <StatCard
                    title="Monthly Payroll"
                    value={bdtCurrency(statsData.totalPayroll)}
                    subtitle="Total disbursement"
                    icon={<DollarSign className="h-5 w-5" />}
                    color="green"
                    trend={{ value: "+8.2% from last month", positive: true }}
                />
                <StatCard
                    title="Active Projects"
                    value={statsData.activeProjects}
                    subtitle="Ongoing initiatives"
                    icon={<Briefcase className="h-5 w-5" />}
                    color="purple"
                    trend={{ value: "3 completed this month", positive: true }}
                />
                <StatCard
                    title="Pending Approvals"
                    value={statsData.pendingApprovals}
                    subtitle="Awaiting action"
                    icon={<FileText className="h-5 w-5" />}
                    color="orange"
                    trend={{ value: "5 urgent", positive: false }}
                />
            </div>

            {/* Second row of stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Monthly Revenue"
                    value={bdtCurrency(statsData.monthlyRevenue)}
                    subtitle="Current month"
                    icon={<TrendingUp className="h-5 w-5" />}
                    color="indigo"
                    trend={{ value: "+15.3% from last month", positive: true }}
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${statsData.attendanceRate}%`}
                    subtitle="Average this week"
                    icon={<CheckCircle className="h-5 w-5" />}
                    color="pink"
                    trend={{ value: "+2.1% from last week", positive: true }}
                />
                <StatCard
                    title="Employee Growth"
                    value={`+${statsData.employeeGrowth}%`}
                    subtitle="Year over year"
                    icon={<Users className="h-5 w-5" />}
                    color="yellow"
                    trend={{ value: "156 new hires", positive: true }}
                />
                <StatCard
                    title="Budget Utilization"
                    value={`${statsData.budgetUtilization}%`}
                    subtitle="Of annual budget"
                    icon={<CreditCard className="h-5 w-5" />}
                    color="red"
                    trend={{ value: "On track", positive: true }}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                    title="Payroll Trend"
                    subtitle="Monthly payroll disbursement over the last 12 months"
                    color="blue"
                >
                    <LineChart
                        data={payrollTrendData}
                        dataKey="month"
                        valueKey="payroll"
                        color="#3b82f6"
                        height={280}
                    />
                </ChartCard>

                <ChartCard
                    title="Employee Attendance"
                    subtitle="Daily attendance overview for the current week"
                    color="green"
                >
                    <BarChart
                        data={attendanceData}
                        dataKey="day"
                        valueKey="present"
                        color="#10b981"
                        height={280}
                    />
                </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                    title="Department Distribution"
                    subtitle="Employee count across departments"
                    color="purple"
                >
                    <PieChart
                        data={departmentData}
                        dataKey="employees"
                        nameKey="name"
                        height={280}
                    />
                </ChartCard>

                <ChartCard
                    title="Budget vs Actual Spending"
                    subtitle="Quarterly budget comparison"
                    color="orange"
                >
                    <AreaChart
                        data={budgetData}
                        dataKey="category"
                        valueKey="budget"
                        color="#f59e0b"
                        height={280}
                    />
                </ChartCard>
            </div>

            {/* Charts Row 3 */}
            <div className="grid gap-6 lg:grid-cols-3">
                <ChartCard
                    title="Employee Status"
                    subtitle="Current workforce distribution"
                    color="pink"
                >
                    <PieChart
                        data={employeeStatusData}
                        dataKey="value"
                        nameKey="name"
                        height={250}
                    />
                </ChartCard>

                <ChartCard
                    title="Revenue Trend"
                    subtitle="Monthly revenue progression"
                    color="indigo"
                >
                    <AreaChart
                        data={payrollTrendData}
                        dataKey="month"
                        valueKey="employees"
                        color="#6366f1"
                        height={250}
                    />
                </ChartCard>

                {/* Recent Activities */}
                <div className="rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-5 border-b">
                        <h3 className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                            Recent Activities
                        </h3>
                        <p className="text-xs sm:text-sm mt-1 text-gray-500 dark:text-gray-400">
                            Latest updates from your organization
                        </p>
                    </div>
                    <div className="p-3 sm:p-4">
                        <div className="space-y-3">
                            {recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        {activity.type === "payroll" && (
                                            <DollarSign className="h-4 w-4 text-green-500" />
                                        )}
                                        {activity.type === "employee" && (
                                            <Users className="h-4 w-4 text-blue-500" />
                                        )}
                                        {activity.type === "approval" && (
                                            <CheckCircle className="h-4 w-4 text-amber-500" />
                                        )}
                                        {activity.type === "project" && (
                                            <Briefcase className="h-4 w-4 text-purple-500" />
                                        )}
                                        {activity.type === "finance" && (
                                            <CreditCard className="h-4 w-4 text-indigo-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {activity.message}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Department Details Table */}
            <div className="rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b">
                    <h3 className="text-base sm:text-lg font-semibold">Department Overview</h3>
                    <p className="text-xs sm:text-sm mt-1 text-gray-500 dark:text-gray-400">
                        Employee count and budget allocation by department
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-sm">
                                    Department
                                </th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">
                                    Employees
                                </th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">
                                    Budget
                                </th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">
                                    Avg Salary
                                </th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">
                                    % of Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {departmentData.map((dept, index) => {
                                const totalBudget = departmentData.reduce(
                                    (sum, d) => sum + d.budget,
                                    0,
                                );
                                const percentage = ((dept.budget / totalBudget) * 100).toFixed(1);
                                const avgSalary = dept.budget / dept.employees;

                                return (
                                    <tr
                                        key={dept.name}
                                        className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <td className="py-3 px-4 font-medium">{dept.name}</td>
                                        <td className="text-right py-3 px-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {formatNumber(dept.employees)}
                                            </span>
                                        </td>
                                        <td className="text-right py-3 px-4 font-medium">
                                            {bdtCurrency(dept.budget)}
                                        </td>
                                        <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                                            {bdtCurrency(avgSalary)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
