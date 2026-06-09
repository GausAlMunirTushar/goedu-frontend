"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Download, Eye, Calendar, BookOpen, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
    const [selectedTeacher, setSelectedTeacher] = useState("Mr. Zaman");

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    
    // Sample assigned classes database for teachers
    const teacherData: Record<string, AssignedPeriod[]> = {
        "Mr. Zaman": [
            { id: "1", day: "Sunday", class: "Grade 6", section: "Section A", subject: "Mathematics", room: "Room 102", startTime: "09:00", endTime: "09:45" },
            { id: "2", day: "Sunday", class: "Grade 7", section: "Section B", subject: "Mathematics", room: "Room 105", startTime: "10:45", endTime: "11:30" },
            { id: "3", day: "Monday", class: "Grade 6", section: "Section A", subject: "Mathematics", room: "Room 102", startTime: "09:45", endTime: "10:30" },
            { id: "4", day: "Monday", class: "Grade 8", section: "Section C", subject: "Mathematics", room: "Room 108", startTime: "11:30", endTime: "12:15" },
            { id: "5", day: "Tuesday", class: "Grade 6", section: "Section A", subject: "Mathematics", room: "Room 102", startTime: "09:45", endTime: "10:30" },
            { id: "6", day: "Wednesday", class: "Grade 7", section: "Section B", subject: "Mathematics", room: "Room 105", startTime: "09:00", endTime: "09:45" },
            { id: "7", day: "Thursday", class: "Grade 8", section: "Section C", subject: "Mathematics", room: "Room 108", startTime: "10:45", endTime: "11:30" }
        ],
        "Ms. Rahman": [
            { id: "10", day: "Sunday", class: "Grade 6", section: "Section A", subject: "English Literature", room: "Room 102", startTime: "09:45", endTime: "10:30" },
            { id: "11", day: "Sunday", class: "Grade 8", section: "Section A", subject: "English Grammar", room: "Room 107", startTime: "11:30", endTime: "12:15" },
            { id: "12", day: "Monday", class: "Grade 6", section: "Section A", subject: "English Grammar", room: "Room 102", startTime: "09:00", endTime: "09:45" },
            { id: "13", day: "Wednesday", class: "Grade 7", section: "Section A", subject: "English Literature", room: "Room 103", startTime: "09:45", endTime: "10:30" },
            { id: "14", day: "Thursday", class: "Grade 8", section: "Section A", subject: "English Grammar", room: "Room 107", startTime: "09:00", endTime: "09:45" }
        ]
    };

    const timeSlots = [
        { start: "09:00", end: "09:45", label: "1st Period" },
        { start: "09:45", end: "10:30", label: "2nd Period" },
        { start: "10:30", end: "10:45", label: "Tiffin Break", isBreak: true },
        { start: "10:45", end: "11:30", label: "3rd Period" },
        { start: "11:30", end: "12:15", label: "4th Period" }
    ];

    const currentTeacherPeriods = teacherData[selectedTeacher] || [];
    const totalPeriodsCount = currentTeacherPeriods.length;
    const busyDaysCount = new Set(currentTeacherPeriods.map(p => p.day)).size;

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
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                            >
                                <option value="Mr. Zaman">Mr. Zaman (Mathematics)</option>
                                <option value="Ms. Rahman">Ms. Rahman (English)</option>
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
                                        <td className="px-4 py-6 font-bold text-sm text-left bg-gray-50 text-gray-800">{day}</td>
                                        {timeSlots.map((slot, sIdx) => {
                                            if (slot.isBreak) {
                                                return (
                                                    <td key={sIdx} className="px-4 py-6 border-l border-gray-200 bg-gray-50/30 text-xs font-bold text-gray-400 uppercase tracking-widest italic select-none">
                                                        {slot.label}
                                                    </td>
                                                );
                                            }
                                            
                                            const match = currentTeacherPeriods.find(p => p.day === day && p.startTime === slot.start);
                                            
                                            return (
                                                <td key={sIdx} className="px-3 py-4 border-l border-gray-200 text-xs text-left">
                                                    {match ? (
                                                        <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/30 text-xs space-y-1 relative shadow-sm">
                                                            <div className="font-bold text-emerald-800 flex justify-between">
                                                                <span>{match.subject}</span>
                                                            </div>
                                                            <div className="text-gray-700 font-semibold">{match.class} ({match.section})</div>
                                                            <div className="text-gray-400 text-[10px]">{match.room}</div>
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
