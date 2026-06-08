"use client";
import React from "react";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Award,
} from "lucide-react";
import { StatCard } from "@/components/charts";

const PersonalDashboardPage = () => {
    // User profile data
    const userProfile = {
        name: "John Doe",
        email: "john.doe@company.com",
        phone: "+1 (555) 123-4567",
        designation: "Senior Software Engineer",
        department: "Engineering",
        employeeId: "EMP-2024-001",
        joinDate: "January 15, 2022",
        location: "New York, NY",
        manager: "Sarah Johnson",
        workType: "Hybrid",
    };

    // Personal stats
    const statsData = {
        tasksCompleted: 48,
        pendingTasks: 12,
        attendanceRate: 96.5,
        projectsInvolved: 8,
        leavesTaken: 8,
        leavesRemaining: 17,
        performanceScore: 4.7,
        workHours: 162,
    };

    // Recent tasks
    const recentTasks = [
        {
            id: 1,
            title: "Complete API integration",
            status: "completed",
            dueDate: "Today",
            priority: "high",
        },
        {
            id: 2,
            title: "Review pull requests",
            status: "in-progress",
            dueDate: "Today",
            priority: "medium",
        },
        {
            id: 3,
            title: "Team meeting preparation",
            status: "pending",
            dueDate: "Tomorrow",
            priority: "medium",
        },
        {
            id: 4,
            title: "Update documentation",
            status: "pending",
            dueDate: "Mar 15, 2026",
            priority: "low",
        },
        {
            id: 5,
            title: "Code review session",
            status: "in-progress",
            dueDate: "Mar 16, 2026",
            priority: "high",
        },
    ];

    // Upcoming events
    const upcomingEvents = [
        {
            id: 1,
            title: "Sprint Planning",
            date: "Today, 10:00 AM",
            type: "meeting",
        },
        {
            id: 2,
            title: "Client Demo",
            date: "Tomorrow, 2:00 PM",
            type: "presentation",
        },
        {
            id: 3,
            title: "Team Building Event",
            date: "Mar 15, 2026",
            type: "event",
        },
        {
            id: 4,
            title: "Performance Review",
            date: "Mar 18, 2026",
            type: "meeting",
        },
    ];

    // Recent achievements
    const achievements = [
        {
            id: 1,
            title: "Employee of the Month",
            date: "February 2026",
            icon: Award,
        },
        {
            id: 2,
            title: "Project Excellence Award",
            date: "January 2026",
            icon: Award,
        },
        {
            id: 3,
            title: "Perfect Attendance",
            date: "Q4 2025",
            icon: CheckCircle,
        },
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            case "medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
            case "low":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "in-progress":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    const getEventTypeIcon = (type: string) => {
        switch (type) {
            case "meeting":
                return <User className="h-4 w-4" />;
            case "presentation":
                return <Briefcase className="h-4 w-4" />;
            case "event":
                return <Calendar className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Personal Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Welcome back, {userProfile.name}</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="rounded-xl border shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="h-10 w-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                            <p className="text-white/80">{userProfile.designation}</p>
                            <p className="text-white/60 text-sm">{userProfile.department}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Location</p>
                            <p className="text-sm text-muted-foreground">{userProfile.location}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Work Type</p>
                            <p className="text-sm text-muted-foreground">{userProfile.workType}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Employee ID</p>
                            <p className="text-sm text-muted-foreground">
                                {userProfile.employeeId}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Join Date</p>
                            <p className="text-sm text-muted-foreground">{userProfile.joinDate}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-indigo-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Manager</p>
                            <p className="text-sm text-muted-foreground">{userProfile.manager}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Tasks Completed"
                    value={statsData.tasksCompleted.toString()}
                    subtitle="This month"
                    icon={<CheckCircle className="h-5 w-5" />}
                    color="green"
                    trend={{ value: "+12% from last month", positive: true }}
                />
                <StatCard
                    title="Pending Tasks"
                    value={statsData.pendingTasks.toString()}
                    subtitle="Awaiting action"
                    icon={<AlertCircle className="h-5 w-5" />}
                    color="orange"
                    trend={{ value: "3 urgent", positive: false }}
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${statsData.attendanceRate}%`}
                    subtitle="This quarter"
                    icon={<TrendingUp className="h-5 w-5" />}
                    color="blue"
                    trend={{ value: "+2.3% from last quarter", positive: true }}
                />
                <StatCard
                    title="Projects Involved"
                    value={statsData.projectsInvolved.toString()}
                    subtitle="Active projects"
                    icon={<Briefcase className="h-5 w-5" />}
                    color="purple"
                    trend={{ value: "2 new this month", positive: true }}
                />
            </div>

            {/* Second row of stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Leaves Taken"
                    value={statsData.leavesTaken.toString()}
                    subtitle="This year"
                    icon={<Calendar className="h-5 w-5" />}
                    color="pink"
                    trend={{ value: `${statsData.leavesRemaining} days remaining`, positive: true }}
                />
                <StatCard
                    title="Performance Score"
                    value={statsData.performanceScore.toString()}
                    subtitle="Out of 5.0"
                    icon={<Award className="h-5 w-5" />}
                    color="yellow"
                    trend={{ value: "Excellent", positive: true }}
                />
                <StatCard
                    title="Work Hours"
                    value={statsData.workHours.toString()}
                    subtitle="This month"
                    icon={<Clock className="h-5 w-5" />}
                    color="indigo"
                    trend={{ value: "+8% from last month", positive: true }}
                />
                <StatCard
                    title="Achievements"
                    value={achievements.length.toString()}
                    subtitle="Recent awards"
                    icon={<Award className="h-5 w-5" />}
                    color="red"
                    trend={{ value: "Keep it up!", positive: true }}
                />
            </div>

            {/* Tasks and Events */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Tasks */}
                <div className="rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-5 border-b">
                        <h3 className="text-base sm:text-lg font-semibold">Recent Tasks</h3>
                        <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                            Your recent and upcoming tasks
                        </p>
                    </div>
                    <div className="p-4 space-y-3">
                        {recentTasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{task.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(task.status)}`}
                                        >
                                            {task.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Due: {task.dueDate}
                                        </span>
                                    </div>
                                </div>
                                <span
                                    className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-5 border-b">
                        <h3 className="text-base sm:text-lg font-semibold">Upcoming Events</h3>
                        <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                            Your scheduled events
                        </p>
                    </div>
                    <div className="p-4 space-y-3">
                        {upcomingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex-shrink-0 mt-1 p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                    {getEventTypeIcon(event.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{event.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            {event.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b">
                    <h3 className="text-base sm:text-lg font-semibold">Recent Achievements</h3>
                    <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                        Your awards and recognitions
                    </p>
                </div>
                <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className="flex items-center gap-3 p-4 rounded-lg border bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20"
                        >
                            <div className="flex-shrink-0 p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
                                <achievement.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-medium">{achievement.title}</p>
                                <p className="text-sm text-muted-foreground">{achievement.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PersonalDashboardPage;
