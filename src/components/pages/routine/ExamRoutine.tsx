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
import { AxiosAPI } from "@/apis/configs";
import { examSchedulesUrl, examScheduleDetailUrl } from "@/apis/endpoints/exam_apis";
import { useExamsQuery, useExamSchedulesQuery } from "@/apis/queries/exam_queries";
import { useClassesQuery, useSectionsQuery, useSubjectsQuery, useRoomsQuery } from "@/apis/queries/academic_queries";

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
    // Data fetching
    const { data: schedulesRes, mutate } = useExamSchedulesQuery();
    const schedulesList = schedulesRes?.data || [];

    const { data: examsRes } = useExamsQuery();
    const examsList = examsRes?.data || [];

    const { data: classesRes } = useClassesQuery();
    const classesList = classesRes?.data || [];

    const { data: roomsRes } = useRoomsQuery();
    const roomsList = roomsRes?.data || [];

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentItem, setCurrentItem] = useState<any>({
        examId: "",
        date: "",
        startTime: "10:00",
        endTime: "13:00",
        classId: "",
        sectionId: "",
        subjectId: "",
        roomId: "",
    });

    const { data: sectionsRes } = useSectionsQuery(currentItem.classId || undefined);
    const sectionsList = sectionsRes?.data || [];

    const { data: subjectsRes } = useSubjectsQuery(currentItem.classId || undefined);
    const subjectsList = subjectsRes?.data || [];

    const handleSaveExam = async () => {
        if (!currentItem.examId || !currentItem.subjectId || !currentItem.date || !currentItem.classId || !currentItem.sectionId) {
            toast.error("Please fill in all required details");
            return;
        }

        const payload = {
            examId: currentItem.examId,
            date: currentItem.date,
            startTime: currentItem.startTime,
            endTime: currentItem.endTime,
            classId: currentItem.classId,
            sectionId: currentItem.sectionId,
            subjectId: currentItem.subjectId,
            roomId: currentItem.roomId || null,
        };

        try {
            if (dialogMode === "add") {
                await AxiosAPI.post(examSchedulesUrl, payload);
                toast.success("Exam schedule created");
            } else {
                await AxiosAPI.put(examScheduleDetailUrl(currentItem.id), payload);
                toast.success("Exam schedule updated");
            }
            mutate();
            setIsDialogOpen(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save exam schedule");
        }
    };

    const handleEditExam = (item: any) => {
        setCurrentItem({
            id: item.id,
            examId: item.examId,
            date: new Date(item.date).toISOString().split("T")[0],
            startTime: item.startTime,
            endTime: item.endTime,
            classId: item.classId,
            sectionId: item.sectionId,
            subjectId: item.subjectId,
            roomId: item.roomId || "",
        });
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleDeleteExam = async (id: string) => {
        if (!confirm("Are you sure you want to remove this exam schedule?")) return;
        try {
            await AxiosAPI.delete(examScheduleDetailUrl(id));
            toast.success("Exam schedule removed");
            mutate();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete exam schedule");
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Exam Routine Management</Title>
                    <p className="text-sm text-gray-500 mt-1">Schedule exams, specify timings, room distributions, and supervisor allocations</p>
                </div>
                <Button onClick={() => { setCurrentItem({ examId: examsList[0]?.id || "", date: "", startTime: "10:00", endTime: "13:00", classId: classesList[0]?.id || "", sectionId: "", subjectId: "", roomId: "" }); setDialogMode("add"); setIsDialogOpen(true); }} className="flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-300">
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
                                {schedulesList.length > 0 ? (
                                    schedulesList.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-gray-50/30 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">{item.exam?.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                                    {item.class?.name} ({item.section?.name})
                                                </span>
                                                <div className="font-semibold text-gray-700 mt-1">{item.subject?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Calendar className="w-4 h-4 text-gray-400" /> {new Date(item.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" /> {item.startTime} - {item.endTime}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <MapPin className="w-4 h-4 text-gray-400" /> {item.room?.name || "No room assigned"}
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
                            <Label htmlFor="exam-name">Exam Name *</Label>
                            <select
                                id="exam-name"
                                className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={currentItem.examId}
                                onChange={(e) => setCurrentItem({ ...currentItem, examId: e.target.value })}
                            >
                                <option value="">Select Exam</option>
                                {examsList.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-class">Target Class *</Label>
                                <select
                                    id="exam-class"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentItem.classId}
                                    onChange={(e) => {
                                        setCurrentItem({ ...currentItem, classId: e.target.value, sectionId: "", subjectId: "" });
                                    }}
                                >
                                    <option value="">Select Class</option>
                                    {classesList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-sec">Target Section *</Label>
                                <select
                                    id="exam-sec"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentItem.sectionId}
                                    onChange={(e) => setCurrentItem({ ...currentItem, sectionId: e.target.value })}
                                >
                                    <option value="">Select Section</option>
                                    {sectionsList.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-subject">Subject *</Label>
                                <select
                                    id="exam-subject"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentItem.subjectId}
                                    onChange={(e) => setCurrentItem({ ...currentItem, subjectId: e.target.value })}
                                >
                                    <option value="">Select Subject</option>
                                    {subjectsList.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
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
                                <Label htmlFor="exam-room">Room / Location</Label>
                                <select
                                    id="exam-room"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentItem.roomId}
                                    onChange={(e) => setCurrentItem({ ...currentItem, roomId: e.target.value })}
                                >
                                    <option value="">Select Room</option>
                                    {roomsList.map((r: any) => <option key={r.id} value={r.id}>{r.name} ({r.capacity} Seats)</option>)}
                                </select>
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
