"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, TrendingUp, Repeat, FileText, ArrowRight, UserCheck, GraduationCap, ClipboardCheck } from "lucide-react";
import Link from "next/link";

export function StudentDashboard() {
    const cards = [
        {
            title: "All Students List",
            desc: "Search, filter, view and manage all student profiles enrolled in the system.",
            icon: Users,
            path: "/student",
            color: "text-teal-500",
            bg: "bg-teal-500/10",
        },
        {
            title: "Student Registration",
            desc: "Register new student profiles and assign them to specific classes and sections.",
            icon: UserPlus,
            path: "/student/registration",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Student Promotion",
            desc: "Promote students to next academic class, or process bulk class roll changes.",
            icon: TrendingUp,
            path: "/student/promotion",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Student Transfer",
            desc: "Process student certificates releases and migration to/from other institutions.",
            icon: Repeat,
            path: "/student/transfer",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "Student Documents",
            desc: "Manage uploaded admission files, birth certificates, and academic records.",
            icon: FileText,
            path: "/student/documents",
            color: "text-rose-500",
            bg: "bg-rose-500/10",
        },
    ];

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4">
                <Title>Student Dashboard</Title>
                <p className="text-sm text-gray-500 mt-1">
                    Manage student profiles, registrations, bulk promotions, and academic files.
                </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">Total Enrolled</span>
                            <h3 className="text-2xl font-extrabold text-gray-800 mt-1">1,250 Students</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">Active Status</span>
                            <h3 className="text-2xl font-extrabold text-gray-800 mt-1">1,210 Active</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <UserCheck className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">New Admissions (Session 2026)</span>
                            <h3 className="text-2xl font-extrabold text-blue-600 mt-1">84 Students</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <UserPlus className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        Manage Content <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
