"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Printer, Download, Eye, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface RoutinePeriod {
    id: string;
    day: string;
    subject: string;
    teacher: string;
    room: string;
    startTime: string;
    endTime: string;
}

export function ClassRoutine() {
    const [selectedClass, setSelectedClass] = useState("Grade 6");
    const [selectedSection, setSelectedSection] = useState("Section A");

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    
    // Sample periods
    const [routineData, setRoutineData] = useState<RoutinePeriod[]>([
        // Sunday
        { id: "1", day: "Sunday", subject: "Mathematics", teacher: "Mr. Zaman", room: "Room 102", startTime: "09:00", endTime: "09:45" },
        { id: "2", day: "Sunday", subject: "English Literature", teacher: "Ms. Rahman", room: "Room 102", startTime: "09:45", endTime: "10:30" },
        { id: "3", day: "Sunday", subject: "General Science", teacher: "Dr. Kamal", room: "Lab B", startTime: "10:45", endTime: "11:30" },
        { id: "4", day: "Sunday", subject: "History", teacher: "Mrs. Begum", room: "Room 102", startTime: "11:30", endTime: "12:15" },
        
        // Monday
        { id: "5", day: "Monday", subject: "English Grammar", teacher: "Ms. Rahman", room: "Room 102", startTime: "09:00", endTime: "09:45" },
        { id: "6", day: "Monday", subject: "Mathematics", teacher: "Mr. Zaman", room: "Room 102", startTime: "09:45", endTime: "10:30" },
        { id: "7", day: "Monday", subject: "Geography", teacher: "Mrs. Begum", room: "Room 102", startTime: "10:45", endTime: "11:30" },
        { id: "8", day: "Monday", subject: "Physical Education", teacher: "Mr. Rana", room: "Playground", startTime: "11:30", endTime: "12:15" },

        // Tuesday
        { id: "9", day: "Tuesday", subject: "General Science", teacher: "Dr. Kamal", room: "Lab B", startTime: "09:00", endTime: "09:45" },
        { id: "10", day: "Tuesday", subject: "Mathematics", teacher: "Mr. Zaman", room: "Room 102", startTime: "09:45", endTime: "10:30" },
        { id: "11", day: "Tuesday", subject: "ICT", teacher: "Mr. Islam", room: "Computer Lab", startTime: "10:45", endTime: "11:30" },
        { id: "12", day: "Tuesday", subject: "Bangla", teacher: "Mr. Haque", room: "Room 102", startTime: "11:30", endTime: "12:15" }
    ]);

    // Time slots
    const timeSlots = [
        { start: "09:00", end: "09:45", label: "1st Period" },
        { start: "09:45", end: "10:30", label: "2nd Period" },
        { start: "10:30", end: "10:45", label: "Tiffin Break", isBreak: true },
        { start: "10:45", end: "11:30", label: "3rd Period" },
        { start: "11:30", end: "12:15", label: "4th Period" }
    ];

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentPeriod, setCurrentPeriod] = useState<Partial<RoutinePeriod>>({
        day: "Sunday",
        subject: "",
        teacher: "",
        room: "",
        startTime: "09:00",
        endTime: "09:45"
    });

    const handleSavePeriod = () => {
        if (!currentPeriod.subject || !currentPeriod.teacher || !currentPeriod.room) {
            toast.error("Please fill in all details");
            return;
        }

        if (dialogMode === "add") {
            setRoutineData([
                ...routineData,
                {
                    id: Date.now().toString(),
                    day: currentPeriod.day || "Sunday",
                    subject: currentPeriod.subject,
                    teacher: currentPeriod.teacher,
                    room: currentPeriod.room,
                    startTime: currentPeriod.startTime || "09:00",
                    endTime: currentPeriod.endTime || "09:45"
                }
            ]);
            toast.success("Period added to schedule");
        } else {
            setRoutineData(routineData.map(p => p.id === currentPeriod.id ? (currentPeriod as RoutinePeriod) : p));
            toast.success("Period details updated");
        }
        setIsDialogOpen(false);
    };

    const handleCellClick = (day: string, slot: typeof timeSlots[0]) => {
        const existing = routineData.find(p => p.day === day && p.startTime === slot.start);
        if (existing) {
            setCurrentPeriod(existing);
            setDialogMode("edit");
        } else {
            setCurrentPeriod({
                day: day,
                subject: "",
                teacher: "",
                room: "",
                startTime: slot.start,
                endTime: slot.end
            });
            setDialogMode("add");
        }
        setIsDialogOpen(true);
    };

    const handleDeletePeriod = (id: string) => {
        setRoutineData(routineData.filter(p => p.id !== id));
        setIsDialogOpen(false);
        toast.success("Period removed from timetable");
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Class Routine Board</Title>
                    <p className="text-sm text-gray-500 mt-1">Configure, build, and publish weekly timetables for student classes</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2"><Printer className="w-4 h-4" /> Print</Button>
                    <Button variant="outline" className="flex items-center gap-2"><Download className="w-4 h-4" /> Export PDF</Button>
                    <Button onClick={() => { setCurrentPeriod({ day: "Sunday", subject: "", teacher: "", room: "", startTime: "09:00", endTime: "09:45" }); setDialogMode("add"); setIsDialogOpen(true); }} className="flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-300">
                        <Plus className="w-4 h-4" /> Add Period
                    </Button>
                </div>
            </div>

            {/* Selection bar */}
            <Card className="shadow-sm border-gray-200/60 bg-gray-50/50">
                <CardContent className="p-4 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="class-select" className="text-sm font-semibold text-gray-700">Class:</Label>
                        <select
                            id="class-select"
                            className="bg-white border border-gray-200 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="Grade 6">Grade 6</option>
                            <option value="Grade 7">Grade 7</option>
                            <option value="Grade 8">Grade 8</option>
                            <option value="Grade 9">Grade 9</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="sec-select" className="text-sm font-semibold text-gray-700">Section:</Label>
                        <select
                            id="sec-select"
                            className="bg-white border border-gray-200 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            <option value="Section A">Section A</option>
                            <option value="Section B">Section B</option>
                            <option value="Section C">Section C</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

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
                                            
                                            const match = routineData.find(p => p.day === day && p.startTime === slot.start);
                                            
                                            return (
                                                <td
                                                    key={sIdx}
                                                    onClick={() => handleCellClick(day, slot)}
                                                    className="px-3 py-4 border-l border-gray-200 cursor-pointer hover:bg-primary/5 transition-colors duration-150 group"
                                                >
                                                    {match ? (
                                                        <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-left space-y-1 relative shadow-sm group-hover:shadow transition-shadow">
                                                            <div className="font-bold text-primary flex items-center justify-between">
                                                                <span>{match.subject}</span>
                                                                <Edit2 className="w-3 h-3 text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                            <div className="text-gray-600 font-medium">{match.teacher}</div>
                                                            <div className="text-gray-400 text-[10px]">{match.room}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-300 font-medium uppercase group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all">+ Add Period</span>
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

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === "add" ? "Add Period Schedule" : "Edit Period Details"}</DialogTitle>
                        <DialogDescription>Input class subject, teacher name, classroom, and timings</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="dialog-day">Day</Label>
                                <select
                                    id="dialog-day"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentPeriod.day}
                                    onChange={(e) => setCurrentPeriod({ ...currentPeriod, day: e.target.value })}
                                >
                                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="dialog-room">Room / Location *</Label>
                                <Input
                                    id="dialog-room"
                                    placeholder="E.g., Room 102"
                                    value={currentPeriod.room}
                                    onChange={(e) => setCurrentPeriod({ ...currentPeriod, room: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dialog-subj">Subject Name *</Label>
                            <Input
                                id="dialog-subj"
                                placeholder="E.g., Mathematics"
                                value={currentPeriod.subject}
                                onChange={(e) => setCurrentPeriod({ ...currentPeriod, subject: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dialog-teach">Teacher Name *</Label>
                            <Input
                                id="dialog-teach"
                                placeholder="E.g., Mr. Zaman"
                                value={currentPeriod.teacher}
                                onChange={(e) => setCurrentPeriod({ ...currentPeriod, teacher: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="dialog-start">Start Time *</Label>
                                <Input
                                    id="dialog-start"
                                    type="time"
                                    value={currentPeriod.startTime}
                                    onChange={(e) => setCurrentPeriod({ ...currentPeriod, startTime: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="dialog-end">End Time *</Label>
                                <Input
                                    id="dialog-end"
                                    type="time"
                                    value={currentPeriod.endTime}
                                    onChange={(e) => setCurrentPeriod({ ...currentPeriod, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between items-center w-full">
                        {dialogMode === "edit" ? (
                            <Button variant="destructive" className="mr-auto" onClick={() => handleDeletePeriod(currentPeriod.id!)}>
                                <Trash2 className="w-4 h-4 mr-1" /> Delete Period
                            </Button>
                        ) : <div />}
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSavePeriod}>Save Period</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
