"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Calendar, ClipboardCheck, Clock, MapPin, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ExamRoutineItem {
    id: string;
    examName: string;
    date: string;
    startTime: string;
    endTime: string;
    class: string;
    subject: string;
    room: string;
    invigilator: string;
}

export function ExamRoutine() {
    const [exams, setExams] = useState<ExamRoutineItem[]>([
        {
            id: "1",
            examName: "Half-Yearly Examination 2026",
            date: "2026-06-15",
            startTime: "10:00",
            endTime: "13:00",
            class: "Grade 6",
            subject: "English First Paper",
            room: "Room 102",
            invigilator: "Mr. Zaman"
        },
        {
            id: "2",
            examName: "Half-Yearly Examination 2026",
            date: "2026-06-16",
            startTime: "10:00",
            endTime: "13:00",
            class: "Grade 6",
            subject: "Mathematics",
            room: "Room 102",
            invigilator: "Ms. Rahman"
        },
        {
            id: "3",
            examName: "Half-Yearly Examination 2026",
            date: "2026-06-15",
            startTime: "10:00",
            endTime: "13:00",
            class: "Grade 7",
            subject: "Science",
            room: "Room 105",
            invigilator: "Dr. Kamal"
        }
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentItem, setCurrentItem] = useState<Partial<ExamRoutineItem>>({
        examName: "Half-Yearly Examination 2026",
        date: "",
        startTime: "10:00",
        endTime: "13:00",
        class: "Grade 6",
        subject: "",
        room: "",
        invigilator: ""
    });

    const handleSaveExam = () => {
        if (!currentItem.subject || !currentItem.date || !currentItem.room || !currentItem.invigilator) {
            toast.error("Please fill in all details");
            return;
        }

        if (dialogMode === "add") {
            setExams([
                ...exams,
                {
                    id: Date.now().toString(),
                    examName: currentItem.examName || "Term Examination",
                    date: currentItem.date,
                    startTime: currentItem.startTime || "10:00",
                    endTime: currentItem.endTime || "13:00",
                    class: currentItem.class || "Grade 6",
                    subject: currentItem.subject,
                    room: currentItem.room,
                    invigilator: currentItem.invigilator
                }
            ]);
            toast.success("Exam schedule created");
        } else {
            setExams(exams.map(e => e.id === currentItem.id ? (currentItem as ExamRoutineItem) : e));
            toast.success("Exam schedule updated");
        }
        setIsDialogOpen(false);
    };

    const handleEditExam = (item: ExamRoutineItem) => {
        setCurrentItem(item);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleDeleteExam = (id: string) => {
        setExams(exams.filter(e => e.id !== id));
        toast.success("Exam schedule removed");
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Exam Routine Management</Title>
                    <p className="text-sm text-gray-500 mt-1">Schedule exams, specify timings, room distributions, and supervisor allocations</p>
                </div>
                <Button onClick={() => { setCurrentItem({ examName: "Half-Yearly Examination 2026", date: "", startTime: "10:00", endTime: "13:00", class: "Grade 6", subject: "", room: "", invigilator: "" }); setDialogMode("add"); setIsDialogOpen(true); }} className="flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus className="w-4 h-4" /> Add Exam Schedule
                </Button>
            </div>

            {/* List Table */}
            <Card className="shadow-sm border-gray-200/60 overflow-hidden bg-white">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-primary" /> Examination Calendar
                    </CardTitle>
                    <CardDescription>Scheduled tests and assignments timelines</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/40 text-gray-500 border-b border-gray-100 text-xs uppercase font-semibold">
                                    <th className="px-6 py-4">Exam Details</th>
                                    <th className="px-6 py-4">Class & Subject</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Room & Invigilator</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {exams.length > 0 ? (
                                    exams.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/30 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">{item.examName}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">ID: {item.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                                    {item.class}
                                                </span>
                                                <div className="font-semibold text-gray-700 mt-1">{item.subject}</div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Calendar className="w-4 h-4 text-gray-400" /> {item.date}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" /> {item.startTime} - {item.endTime}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <MapPin className="w-4 h-4 text-gray-400" /> {item.room}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                    <UserCheck className="w-3.5 h-3.5 text-gray-400" /> {item.invigilator}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-600" onClick={() => handleEditExam(item)}>
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleDeleteExam(item.id)}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                            No exam routines scheduled.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog Form */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === "add" ? "Create Exam Schedule" : "Edit Exam Schedule"}</DialogTitle>
                        <DialogDescription>Setup test details, date, room and teacher supervisor allocation</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="exam-name">Exam Title Name</Label>
                            <Input
                                id="exam-name"
                                value={currentItem.examName}
                                onChange={(e) => setCurrentItem({ ...currentItem, examName: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-class">Target Class</Label>
                                <select
                                    id="exam-class"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentItem.class}
                                    onChange={(e) => setCurrentItem({ ...currentItem, class: e.target.value })}
                                >
                                    <option value="Grade 6">Grade 6</option>
                                    <option value="Grade 7">Grade 7</option>
                                    <option value="Grade 8">Grade 8</option>
                                    <option value="Grade 9">Grade 9</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-date">Date *</Label>
                                <Input
                                    id="exam-date"
                                    type="date"
                                    value={currentItem.date}
                                    onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="exam-subject">Subject *</Label>
                            <Input
                                id="exam-subject"
                                placeholder="E.g., Mathematics"
                                value={currentItem.subject}
                                onChange={(e) => setCurrentItem({ ...currentItem, subject: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-start">Start Time</Label>
                                <Input
                                    id="exam-start"
                                    type="time"
                                    value={currentItem.startTime}
                                    onChange={(e) => setCurrentItem({ ...currentItem, startTime: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-end">End Time</Label>
                                <Input
                                    id="exam-end"
                                    type="time"
                                    value={currentItem.endTime}
                                    onChange={(e) => setCurrentItem({ ...currentItem, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-room">Room Number *</Label>
                                <Input
                                    id="exam-room"
                                    placeholder="E.g., Room 102"
                                    value={currentItem.room}
                                    onChange={(e) => setCurrentItem({ ...currentItem, room: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-teach">Invigilator Teacher *</Label>
                                <Input
                                    id="exam-teach"
                                    placeholder="E.g., Mr. Zaman"
                                    value={currentItem.invigilator}
                                    onChange={(e) => setCurrentItem({ ...currentItem, invigilator: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveExam}>Save Exam</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
