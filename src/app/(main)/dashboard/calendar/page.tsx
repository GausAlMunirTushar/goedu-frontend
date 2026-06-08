"use client";
import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Users,
    Plus,
    Filter,
} from "lucide-react";

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
    const [selectedDate, setSelectedDate] = useState<number | null>(12);
    const [view, setView] = useState<"month" | "week" | "day">("month");

    // Sample events data
    const events = {
        5: [
            {
                id: 1,
                title: "Team Standup",
                time: "10:00 AM - 10:30 AM",
                type: "meeting",
                location: "Conference Room A",
            },
        ],
        8: [
            {
                id: 2,
                title: "Project Review",
                time: "2:00 PM - 4:00 PM",
                type: "meeting",
                location: "Virtual",
            },
        ],
        10: [
            {
                id: 3,
                title: "Client Presentation",
                time: "11:00 AM - 12:00 PM",
                type: "presentation",
                location: "Client Office",
            },
        ],
        12: [
            {
                id: 4,
                title: "Sprint Planning",
                time: "9:00 AM - 11:00 AM",
                type: "meeting",
                location: "Conference Room B",
            },
            {
                id: 5,
                title: "Team Lunch",
                time: "12:30 PM - 1:30 PM",
                type: "event",
                location: "Cafeteria",
            },
        ],
        15: [
            {
                id: 6,
                title: "Training Session",
                time: "3:00 PM - 5:00 PM",
                type: "training",
                location: "Training Room",
            },
        ],
        18: [
            {
                id: 7,
                title: "Performance Review",
                time: "10:00 AM - 11:00 AM",
                type: "meeting",
                location: "HR Office",
            },
        ],
        20: [
            {
                id: 8,
                title: "Company Town Hall",
                time: "4:00 PM - 5:30 PM",
                type: "event",
                location: "Main Auditorium",
            },
        ],
        25: [
            {
                id: 9,
                title: "Product Launch",
                time: "10:00 AM - 12:00 PM",
                type: "event",
                location: "Event Hall",
            },
        ],
        27: [
            {
                id: 10,
                title: "Quarterly Review",
                time: "1:00 PM - 3:00 PM",
                type: "meeting",
                location: "Board Room",
            },
        ],
    };

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const navigateMonth = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate);
        if (direction === "prev") {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
        setSelectedDate(null);
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today.getDate());
    };

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Previous month's days
        const prevMonthDays = getDaysInMonth(year, month - 1);
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(
                <div
                    key={`prev-${i}`}
                    className="h-24 sm:h-32 p-2 border bg-gray-50 dark:bg-gray-900 text-muted-foreground"
                >
                    <span className="text-sm">{prevMonthDays - i}</span>
                </div>,
            );
        }

        // Current month's days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday =
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate();
            const isSelected = selectedDate === day;
            const hasEvents = events[day as keyof typeof events];

            days.push(
                <div
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`h-24 sm:h-32 p-2 border cursor-pointer transition-colors relative ${
                        isSelected
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    } ${isToday ? "bg-indigo-50 dark:bg-indigo-900/20" : ""}`}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span
                            className={`text-sm font-medium ${
                                isToday
                                    ? "bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center"
                                    : ""
                            }`}
                        >
                            {day}
                        </span>
                        {hasEvents && (
                            <span className="flex gap-0.5">
                                {hasEvents.slice(0, 3).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="w-1.5 h-1.5 rounded-full bg-blue-500"
                                    />
                                ))}
                            </span>
                        )}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                        {hasEvents?.slice(0, 2).map((event) => (
                            <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate ${getEventTypeBgColor(event.type)}`}
                            >
                                {event.title}
                            </div>
                        ))}
                        {hasEvents && hasEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground pl-1">
                                +{hasEvents.length - 2} more
                            </div>
                        )}
                    </div>
                </div>,
            );
        }

        // Next month's days to fill the grid
        const totalCells = days.length;
        const remainingCells = 42 - totalCells; // 6 rows x 7 columns = 42
        for (let i = 1; i <= remainingCells; i++) {
            days.push(
                <div
                    key={`next-${i}`}
                    className="h-24 sm:h-32 p-2 border bg-gray-50 dark:bg-gray-900 text-muted-foreground"
                >
                    <span className="text-sm">{i}</span>
                </div>,
            );
        }

        return days;
    };

    const getEventTypeBgColor = (type: string) => {
        switch (type) {
            case "meeting":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "presentation":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            case "event":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "training":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    const getEventTypeIcon = (type: string) => {
        switch (type) {
            case "meeting":
                return <Users className="h-4 w-4" />;
            case "presentation":
                return <CalendarIcon className="h-4 w-4" />;
            case "event":
                return <CalendarIcon className="h-4 w-4" />;
            case "training":
                return <Users className="h-4 w-4" />;
            default:
                return <CalendarIcon className="h-4 w-4" />;
        }
    };

    const selectedDateEvents = selectedDate ? events[selectedDate as keyof typeof events] : [];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Calendar</h1>
                    <p className="text-muted-foreground mt-1">Manage your schedule and events</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>Add Event</span>
                </button>
            </div>

            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateMonth("prev")}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-semibold min-w-[200px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                        onClick={() => navigateMonth("next")}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <button
                        onClick={goToToday}
                        className="ml-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Today
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Filter className="h-5 w-5" />
                    </button>
                    <div className="flex border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setView("month")}
                            className={`px-4 py-2 text-sm transition-colors ${
                                view === "month"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setView("week")}
                            className={`px-4 py-2 text-sm transition-colors border-l ${
                                view === "week"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setView("day")}
                            className={`px-4 py-2 text-sm transition-colors border-l ${
                                view === "day"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            Day
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3 rounded-xl border shadow-sm overflow-hidden">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="p-3 text-center text-sm font-semibold border-b"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7">{renderCalendarDays()}</div>
                </div>

                {/* Selected Date Events Panel */}
                <div className="lg:col-span-2 rounded-xl border shadow-sm overflow-hidden h-fit">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold">
                            {selectedDate
                                ? `${monthNames[currentDate.getMonth()]} ${selectedDate}, ${currentDate.getFullYear()}`
                                : "Select a date"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {selectedDateEvents?.length || 0} events scheduled
                        </p>
                    </div>
                    <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                        {selectedDateEvents && selectedDateEvents.length > 0 ? (
                            selectedDateEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-medium">{event.title}</h4>
                                        <div
                                            className={`p-1.5 rounded-full ${getEventTypeBgColor(event.type)}`}
                                        >
                                            {getEventTypeIcon(event.type)}
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No events scheduled for this date</p>
                                <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    + Add your first event
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upcoming Events Summary */}
            <div className="rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Upcoming Events</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Quick overview of your next events
                    </p>
                </div>
                <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(events)
                        .slice(0, 4)
                        .map(([day, dayEvents]) =>
                            dayEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                            {getEventTypeIcon(event.type)}
                                        </div>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900">
                                            {event.type}
                                        </span>
                                    </div>
                                    <h4 className="font-medium mb-1">{event.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {monthNames[currentDate.getMonth()]} {day}, {event.time}
                                    </p>
                                </div>
                            )),
                        )}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
