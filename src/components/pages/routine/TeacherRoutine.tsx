"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Download, Eye, Calendar, BookOpen, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { useRoutinesQuery } from "@/apis/queries/academic_queries";
import { useEffect } from "react";

interface AssignedPeriod {
    id: string;
    day: string;
    class: string;
    section: string;
    subject: string;
    room: string;
    startTime: string;
    endTime: string;
}

export function TeacherRoutine() {
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

    const daysOfWeek = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

    // Fetch teachers
    const { data: teachersResponse, isLoading: loadingTeachers } = useUsersQuery("Teacher");
    const teachersList = teachersResponse?.data || [];

    // Set default teacher
    useEffect(() => {
        if (teachersList.length > 0 && !selectedTeacherId) {
            setSelectedTeacherId(teachersList[0].id);
        }
    }, [teachersList, selectedTeacherId]);

    // Fetch teacher's routines
    const { data: routinesResponse, isLoading: loadingRoutines } = useRoutinesQuery({
        teacherId: selectedTeacherId || undefined
    });
    const currentTeacherPeriods = routinesResponse?.data || [];

    const timeSlots = [
        { start: "09:00", end: "09:45", label: "1st Period" },
        { start: "09:45", end: "10:30", label: "2nd Period" },
        { start: "10:30", end: "10:45", label: "Tiffin Break", isBreak: true },
        { start: "10:45", end: "11:30", label: "3rd Period" },
        { start: "11:30", end: "12:15", label: "4th Period" }
    ];

    const totalPeriodsCount = currentTeacherPeriods.length;
    const busyDaysCount = new Set(currentTeacherPeriods.map((p: any) => p.dayOfWeek)).size;

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Teacher Routine Planner</Title>
                    <p className="text-sm text-gray-500 mt-1">Review scheduled classroom periods and timings for individual faculty members</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2"><Printer className="w-4 h-4" /> Print</Button>
                    <Button variant="outline" className="flex items-center gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
                </div>
            </div>

            {/* Selection Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm border-gray-200/60 flex flex-col justify-center bg-gray-50/20">
                    <CardContent className="p-4 space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="teach-select" className="text-sm font-semibold text-gray-700">Select Teacher:</Label>
                            <select
                                id="teach-select"
                                className="w-full bg-white border border-gray-200 rounded-md p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={selectedTeacherId}
                                onChange={(e) => setSelectedTeacherId(e.target.value)}
                                disabled={loadingTeachers}
                            >
                                {loadingTeachers && <option>Loading...</option>}
                                {teachersList.length === 0 && !loadingTeachers && <option value="">No teachers found</option>}
                                {teachersList.map((t: any) => (
                                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* mini stats */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 font-medium">Assigned Periods / Week</span>
                                <h3 className="text-xl font-extrabold text-gray-800 mt-0.5">{totalPeriodsCount}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 font-medium">Work Days</span>
                                <h3 className="text-xl font-extrabold text-gray-800 mt-0.5">{busyDaysCount} / 5 Days</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Timetable Grid */}
            <Card className="shadow-sm border-gray-200/60 overflow-hidden bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-center">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                                    <th className="px-4 py-4 font-bold text-sm text-left w-28 bg-gray-100">Day \ Period</th>
                                    {timeSlots.map((slot, index) => (
                                        <th key={index} className="px-4 py-3 border-l border-gray-200">
                                            <div className="text-xs font-semibold uppercase tracking-wider text-primary">{slot.label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{slot.start} - {slot.end}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {daysOfWeek.map((day) => (
                                    <tr key={day} className="hover:bg-gray-50/10">
                                        <td className="px-4 py-6 font-bold text-xs text-left bg-gray-50 text-gray-800 uppercase tracking-wider">{day.toLowerCase()}</td>
                                        {timeSlots.map((slot, sIdx) => {
                                            if (slot.isBreak) {
                                                return (
                                                    <td key={sIdx} className="px-4 py-6 border-l border-gray-200 bg-gray-50/30 text-xs font-bold text-gray-400 uppercase tracking-widest italic select-none">
                                                        {slot.label}
                                                    </td>
                                                );
                                            }
                                            
                                            const match = currentTeacherPeriods.find((p: any) => p.dayOfWeek === day && p.startTime === slot.start);
                                            
                                            return (
                                                <td key={sIdx} className="px-3 py-4 border-l border-gray-200 text-xs text-left">
                                                    {match ? (
                                                        <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/30 text-xs space-y-1 relative shadow-sm">
                                                            <div className="font-bold text-emerald-800 flex justify-between">
                                                                <span>{match.subject?.name}</span>
                                                            </div>
                                                            <div className="text-gray-700 font-semibold">{match.class?.name} ({match.section?.name})</div>
                                                            <div className="text-gray-400 text-[10px]">{match.roomId || "No room assigned"}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-300 italic">No assigned classes</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
