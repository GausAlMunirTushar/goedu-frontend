"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, ArrowRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export function RoutineDashboard() {
    const cards = [
        {
            title: "Class Routine Management",
            desc: "Setup weekly periods schedules, classroom allocations, and time slots per grade.",
            icon: Calendar,
            path: "/routine/class",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Teacher Workload Planner",
            desc: "Inspect teachers' schedules, free periods, and weekly teaching assignments.",
            icon: Users,
            path: "/routine/teacher",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Exam Routine Scheduling",
            desc: "Draft mid-term/final examinations datesheets, room distributions, and invigilator duties.",
            icon: FileText,
            path: "/routine/exam",
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4">
                <Title>Routine Dashboard</Title>
                <p className="text-sm text-gray-500 mt-1">
                    Manage all academic timetables, faculty work periods, and examination schedules.
                </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">Daily Periods</span>
                            <h3 className="text-2xl font-extrabold text-gray-800 mt-1">5 Periods</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <Clock className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">Active Teachers Workload</span>
                            <h3 className="text-2xl font-extrabold text-gray-800 mt-1">2 Faculty Members</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <Users className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">Upcoming Exams</span>
                            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">3 Papers</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                            <BookOpen className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Nav Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Card key={index} className="shadow-sm border-gray-200/60 hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between hover:shadow-md bg-white">
                            <CardHeader className="pb-3">
                                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-base font-bold text-gray-800">{card.title}</CardTitle>
                                <CardDescription className="text-xs text-gray-500 leading-relaxed pt-1">{card.desc}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 pb-4 px-6">
                                <Button asChild variant="ghost" size="sm" className="w-full text-xs font-semibold text-primary hover:text-primary/95 group-hover:bg-primary/5 justify-between px-2">
                                    <Link href={card.path}>
                                        Open Timetable <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
