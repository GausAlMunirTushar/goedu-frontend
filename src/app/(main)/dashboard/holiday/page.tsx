"use client";
import React, { useState } from "react";
import {
    Calendar,
    Search,
    Filter,
    Sun,
    Palmtree,
    Gift,
    Flag,
    Heart,
    Users,
    Clock,
    MapPin,
    Info,
} from "lucide-react";

const HolidayPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");

    // Holiday data
    const holidays = [
        {
            id: 1,
            name: "New Year's Day",
            date: new Date(2026, 0, 1),
            type: "public",
            description: "Celebration of the beginning of the new year",
            icon: Gift,
        },
        {
            id: 2,
            name: "International Mother Language Day",
            date: new Date(2026, 1, 21),
            type: "public",
            description: "Commemorating the Bengali Language Movement",
            icon: Flag,
        },
        {
            id: 3,
            name: "Independence Day",
            date: new Date(2026, 2, 26),
            type: "public",
            description: "Celebrating Bangladesh's independence",
            icon: Flag,
        },
        {
            id: 4,
            name: "Bengali New Year (Pohela Boishakh)",
            date: new Date(2026, 3, 14),
            type: "public",
            description: "Traditional Bengali New Year celebration",
            icon: Sun,
        },
        {
            id: 5,
            name: "May Day",
            date: new Date(2026, 4, 1),
            type: "public",
            description: "International Workers' Day",
            icon: Users,
        },
        {
            id: 6,
            name: "National Mourning Day",
            date: new Date(2026, 7, 15),
            type: "public",
            description: "Remembrance of the Father of the Nation",
            icon: Heart,
        },
        {
            id: 7,
            name: "Victory Day",
            date: new Date(2026, 11, 16),
            type: "public",
            description: "Celebrating victory in the Liberation War",
            icon: Flag,
        },
        {
            id: 8,
            name: "Christmas Day",
            date: new Date(2026, 11, 25),
            type: "religious",
            description: "Celebration of the birth of Jesus Christ",
            icon: Gift,
        },
        {
            id: 9,
            name: "Eid-ul-Fitr",
            date: new Date(2026, 2, 20),
            type: "religious",
            description: "Festival marking the end of Ramadan",
            icon: Sun,
        },
        {
            id: 10,
            name: "Eid-ul-Adha",
            date: new Date(2026, 5, 27),
            type: "religious",
            description: "Festival of Sacrifice",
            icon: Sun,
        },
        {
            id: 11,
            name: "Durga Puja",
            date: new Date(2026, 9, 19),
            type: "religious",
            description: "Hindu festival celebrating Goddess Durga",
            icon: Gift,
        },
        {
            id: 12,
            name: "Buddha Purnima",
            date: new Date(2026, 4, 12),
            type: "religious",
            description: "Celebration of Buddha's birth, enlightenment, and death",
            icon: Sun,
        },
        {
            id: 13,
            name: "Company Annual Day",
            date: new Date(2026, 1, 15),
            type: "company",
            description: "Annual company celebration and team building",
            icon: Users,
        },
        {
            id: 14,
            name: "Team Retreat",
            date: new Date(2026, 4, 22),
            type: "company",
            description: "Company-wide team retreat and outdoor activities",
            icon: Palmtree,
        },
        {
            id: 15,
            name: "Founder's Day",
            date: new Date(2026, 8, 10),
            type: "company",
            description: "Celebrating the founding of our company",
            icon: Flag,
        },
        {
            id: 16,
            name: "Wellness Day",
            date: new Date(2026, 6, 5),
            type: "company",
            description: "Mental health and wellness awareness day",
            icon: Heart,
        },
    ];

    const holidayTypes = [
        {
            id: "all",
            label: "All Holidays",
            color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
        },
        {
            id: "public",
            label: "Public",
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
        {
            id: "religious",
            label: "Religious",
            color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        },
        {
            id: "company",
            label: "Company",
            color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        },
    ];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "public":
                return <Flag className="h-4 w-4" />;
            case "religious":
                return <Sun className="h-4 w-4" />;
            case "company":
                return <Users className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "public":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "religious":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            case "company":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    // Filter holidays
    const filteredHolidays = holidays.filter((holiday) => {
        const matchesSearch =
            holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            holiday.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "all" || holiday.type === selectedType;
        return matchesSearch && matchesType;
    });

    // Group holidays by month
    const holidaysByMonth = filteredHolidays.reduce(
        (acc, holiday) => {
            const month = formatMonth(holiday.date);
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(holiday);
            return acc;
        },
        {} as Record<string, typeof holidays>,
    );

    // Stats
    const stats = {
        total: holidays.length,
        public: holidays.filter((h) => h.type === "public").length,
        religious: holidays.filter((h) => h.type === "religious").length,
        company: holidays.filter((h) => h.type === "company").length,
    };

    // Upcoming holidays
    const today = new Date();
    const upcomingHolidays = holidays
        .filter((h) => h.date >= today)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 3);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Holiday Calendar</h1>
                    <p className="text-muted-foreground mt-1">
                        View upcoming holidays and company events
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border shadow-sm p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Holidays</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border shadow-sm p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                            <Flag className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Public Holidays</p>
                            <p className="text-2xl font-bold">{stats.public}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border shadow-sm p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                            <Sun className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Religious Holidays</p>
                            <p className="text-2xl font-bold">{stats.religious}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border shadow-sm p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Company Events</p>
                            <p className="text-2xl font-bold">{stats.company}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Holidays */}
            <div className="rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b">
                    <h3 className="text-base sm:text-lg font-semibold">Upcoming Holidays</h3>
                    <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                        Next holidays coming up
                    </p>
                </div>
                <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingHolidays.map((holiday) => (
                        <div
                            key={holiday.id}
                            className="p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300">
                                        <holiday.icon className="h-5 w-5" />
                                    </div>
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(holiday.type)}`}
                                    >
                                        {holiday.type}
                                    </span>
                                </div>
                            </div>
                            <h4 className="font-semibold mb-1">{holiday.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{formatDate(holiday.date)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search holidays..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                        {holidayTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    selectedType === type.id
                                        ? "bg-blue-600 text-white"
                                        : type.color + " hover:opacity-80"
                                }`}
                            >
                                {getTypeIcon(type.id)}
                                <span className="hidden sm:inline">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Holidays by Month */}
            <div className="space-y-6">
                {Object.entries(holidaysByMonth).map(([month, monthHolidays]) => (
                    <div key={month} className="rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-4 sm:p-5 border-b bg-gray-50 dark:bg-gray-900">
                            <h3 className="text-base sm:text-lg font-semibold">{month}</h3>
                            <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                                {monthHolidays.length}{" "}
                                {monthHolidays.length === 1 ? "holiday" : "holidays"}
                            </p>
                        </div>
                        <div className="divide-y">
                            {monthHolidays.map((holiday) => (
                                <div
                                    key={holiday.id}
                                    className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
                                                <holiday.icon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-base sm:text-lg">
                                                    {holiday.name}
                                                </h4>
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium w-fit ${getTypeColor(holiday.type)}`}
                                                >
                                                    {getTypeIcon(holiday.type)}
                                                    {holiday.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {holiday.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(holiday.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Info className="h-4 w-4" />
                                                    <span>
                                                        {holiday.date <= today
                                                            ? "Passed"
                                                            : `${Math.ceil((holiday.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days left`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredHolidays.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                        No holidays found matching your criteria
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedType("all");
                        }}
                        className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default HolidayPage;
