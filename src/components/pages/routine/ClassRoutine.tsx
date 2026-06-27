"use client";

import React, { useState, useEffect } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Printer, Download, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
    useClassesQuery, 
    useSectionsQuery, 
    useAcademicYearsQuery, 
    useSubjectsQuery, 
    useRoutinesQuery 
} from "@/apis/queries/academic_queries";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { AxiosAPI } from "@/apis/configs";
import { routinesUrl, routineDetailUrl, exportRoutinePdfUrl, exportRoutineExcelUrl } from "@/apis/endpoints/academic_apis";

interface RoutinePeriod {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    roomId?: string | null;
    subjectId: string;
    subjectName?: string;
    sectionId: string;
    sectionName?: string;
    teacherId: string;
    teacherName?: string;
    academicYearId: string;
}

export function ClassRoutine() {
    const daysOfWeek = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

    // 1. Fetch academic structural data
    const { data: classesResponse, isLoading: loadingClasses } = useClassesQuery();
    const classesList = classesResponse?.data || [];

    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [selectedSectionId, setSelectedSectionId] = useState<string>("");

    // Set defaults when classes list is loaded
    useEffect(() => {
        if (classesList.length > 0 && !selectedClassId) {
            setSelectedClassId(classesList[0].id);
        }
    }, [classesList, selectedClassId]);

    // Fetch sections for the selected class
    const { data: sectionsResponse, isLoading: loadingSections } = useSectionsQuery(selectedClassId);
    const sectionsList = sectionsResponse?.data || [];

    // Set defaults when sections list is loaded
    useEffect(() => {
        if (sectionsList.length > 0) {
            // If active section is not in the list, set to first
            if (!sectionsList.some((s: any) => s.id === selectedSectionId)) {
                setSelectedSectionId(sectionsList[0].id);
            }
        } else {
            setSelectedSectionId("");
        }
    }, [sectionsList, selectedSectionId]);

    // Fetch academic years
    const { data: yearsResponse } = useAcademicYearsQuery();
    const yearsList = yearsResponse?.data || [];
    const activeYear = yearsList.find((y: any) => y.isActive) || yearsList[0];

    // Fetch subjects for the selected class
    const { data: subjectsResponse } = useSubjectsQuery(selectedClassId);
    const subjectsList = subjectsResponse?.data || [];

    // Fetch teachers (Users with role Teacher)
    const { data: teachersResponse } = useUsersQuery("Teacher");
    const teachersList = teachersResponse?.data || [];

    // Fetch class routines filtered by section
    const { data: routinesResponse, isLoading: loadingRoutines, mutate } = useRoutinesQuery({
        sectionId: selectedSectionId || undefined,
        academicYearId: activeYear?.id || undefined,
    });
    const routinesData = routinesResponse?.data || [];

    // Time slots configuration
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
        dayOfWeek: "SUNDAY",
        roomId: "",
        subjectId: "",
        teacherId: "",
        startTime: "09:00",
        endTime: "09:45",
        academicYearId: "",
    });

    // Populate dropdown defaults when dialog opens
    useEffect(() => {
        if (isDialogOpen && dialogMode === "add") {
            setCurrentPeriod(prev => ({
                ...prev,
                subjectId: subjectsList[0]?.id || "",
                teacherId: teachersList[0]?.id || "",
                academicYearId: activeYear?.id || "",
            }));
        }
    }, [isDialogOpen, dialogMode, subjectsList, teachersList, activeYear]);

    const handleSavePeriod = async () => {
        if (!currentPeriod.subjectId || !currentPeriod.teacherId || !currentPeriod.academicYearId || !selectedSectionId) {
            toast.error("Please ensure class, section, subject, teacher, and academic year are set");
            return;
        }

        const payload = {
            dayOfWeek: currentPeriod.dayOfWeek,
            startTime: currentPeriod.startTime,
            endTime: currentPeriod.endTime,
            roomId: currentPeriod.roomId || null,
            subjectId: currentPeriod.subjectId,
            sectionId: selectedSectionId,
            teacherId: currentPeriod.teacherId,
            academicYearId: currentPeriod.academicYearId,
        };

        try {
            let res;
            if (dialogMode === "add") {
                res = await AxiosAPI.post(routinesUrl, payload);
            } else {
                res = await AxiosAPI.put(routineDetailUrl(currentPeriod.id!), payload);
            }

            if (res.data?.success) {
                toast.success(res.data.message || "Period schedule saved successfully");
                mutate();
                setIsDialogOpen(false);
            } else {
                toast.error(res.data?.message || "Failed to save period schedule");
            }
        } catch (error: any) {
            // Displays overlapping routine conflict message returned by backend validation
            toast.error(error.response?.data?.message || "An error occurred while saving period schedule");
        }
    };

    const handleCellClick = (day: string, slot: typeof timeSlots[0]) => {
        const existing = routinesData.find((p: any) => p.dayOfWeek === day && p.startTime === slot.start);
        if (existing) {
            setCurrentPeriod({
                id: existing.id,
                dayOfWeek: existing.dayOfWeek,
                startTime: existing.startTime,
                endTime: existing.endTime,
                roomId: existing.roomId || "",
                subjectId: existing.subjectId,
                teacherId: existing.teacherId,
                academicYearId: existing.academicYearId,
            });
            setDialogMode("edit");
        } else {
            setCurrentPeriod({
                dayOfWeek: day,
                startTime: slot.start,
                endTime: slot.end,
                roomId: "",
                subjectId: subjectsList[0]?.id || "",
                teacherId: teachersList[0]?.id || "",
                academicYearId: activeYear?.id || "",
            });
            setDialogMode("add");
        }
        setIsDialogOpen(true);
    };

    const handleDeletePeriod = async (id: string) => {
        if (confirm("Are you sure you want to remove this period?")) {
            try {
                const res = await AxiosAPI.delete(routineDetailUrl(id));
                if (res.data?.success) {
                    toast.success(res.data.message || "Period removed from timetable");
                    mutate();
                    setIsDialogOpen(false);
                } else {
                    toast.error(res.data?.message || "Failed to remove period");
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || "An error occurred while deleting period");
            }
        }
    };

    const handleExportPdf = async () => {
        if (!selectedSectionId) {
            toast.error("Please select a section to export the routine");
            return;
        }
        try {
            toast.loading("Generating PDF routine...", { id: "export-pdf" });
            const res = await AxiosAPI.get(exportRoutinePdfUrl, {
                responseType: "blob",
                params: {
                    classId: selectedClassId,
                    sectionId: selectedSectionId,
                    academicYearId: activeYear?.id,
                }
            });
            
            const activeClass = classesList.find((c: any) => c.id === selectedClassId);
            const activeSection = sectionsList.find((s: any) => s.id === selectedSectionId);
            const classNameStr = activeClass ? activeClass.name.replace(/\s+/g, "_") : "Class";
            const sectionNameStr = activeSection ? activeSection.name.replace(/\s+/g, "_") : "Section";
            const filename = `Routine_${classNameStr}_${sectionNameStr}.pdf`;

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("PDF Routine exported successfully", { id: "export-pdf" });
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to export PDF routine", { id: "export-pdf" });
        }
    };

    const handleExportExcel = async () => {
        if (!selectedSectionId) {
            toast.error("Please select a section to export the routine");
            return;
        }
        try {
            toast.loading("Generating Excel routine...", { id: "export-excel" });
            const res = await AxiosAPI.get(exportRoutineExcelUrl, {
                responseType: "blob",
                params: {
                    classId: selectedClassId,
                    sectionId: selectedSectionId,
                    academicYearId: activeYear?.id,
                }
            });

            const activeClass = classesList.find((c: any) => c.id === selectedClassId);
            const activeSection = sectionsList.find((s: any) => s.id === selectedSectionId);
            const classNameStr = activeClass ? activeClass.name.replace(/\s+/g, "_") : "Class";
            const sectionNameStr = activeSection ? activeSection.name.replace(/\s+/g, "_") : "Section";
            const filename = `Routine_${classNameStr}_${sectionNameStr}.xlsx`;

            const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Excel Routine exported successfully", { id: "export-excel" });
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to export Excel routine", { id: "export-excel" });
        }
    };

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100 pb-3">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Class Routine Board</Title>
                            <p className="text-xs text-muted-foreground mt-1">Configure, build, and publish weekly timetables for student classes</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Select value={selectedClassId} onValueChange={setSelectedClassId} disabled={loadingClasses}>
                                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200 text-xs font-semibold">
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classesList.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedSectionId} onValueChange={setSelectedSectionId} disabled={loadingSections || sectionsList.length === 0}>
                                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200 text-xs font-semibold">
                                    <SelectValue placeholder="Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sectionsList.map((s: any) => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button onClick={handleExportPdf} variant="outline" className="flex items-center gap-1.5 text-xs h-9">
                                    <Download className="w-3.5 h-3.5" /> PDF
                                </Button>
                                <Button onClick={handleExportExcel} variant="outline" className="flex items-center gap-1.5 text-xs h-9">
                                    <Download className="w-3.5 h-3.5" /> Excel
                                </Button>
                                <Button onClick={() => {
                                    setCurrentPeriod({
                                        dayOfWeek: "SUNDAY",
                                        roomId: "",
                                        startTime: "09:00",
                                        endTime: "09:45",
                                        subjectId: subjectsList[0]?.id || "",
                                        teacherId: teachersList[0]?.id || "",
                                        academicYearId: activeYear?.id || "",
                                    });
                                    setDialogMode("add");
                                    setIsDialogOpen(true);
                                }} className="flex items-center gap-1 text-xs h-9 shadow-md">
                                    <Plus className="w-3.5 h-3.5" /> Add Period
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
                    <div className="overflow-x-auto border rounded-xl overflow-hidden">
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
                                            
                                            const match = routinesData.find((p: any) => p.dayOfWeek === day && p.startTime === slot.start);
                                            
                                            return (
                                                <td
                                                    key={sIdx}
                                                    onClick={() => handleCellClick(day, slot)}
                                                    className="px-3 py-4 border-l border-gray-200 cursor-pointer hover:bg-primary/5 transition-colors duration-150 group"
                                                >
                                                    {match ? (
                                                        <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-left space-y-1 relative shadow-sm group-hover:shadow transition-shadow">
                                                            <div className="font-bold text-primary flex items-center justify-between">
                                                                <span>{match.subject?.name}</span>
                                                            </div>
                                                            <div className="text-gray-600 font-medium">
                                                                {match.teacher?.firstName} {match.teacher?.lastName}
                                                            </div>
                                                            <div className="text-gray-400 text-[10px]">{match.roomId || "No room assigned"}</div>
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
                        <DialogDescription>Input class subject, teacher, classroom, and timings</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="dialog-day">Day</Label>
                                <select
                                    id="dialog-day"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentPeriod.dayOfWeek}
                                    onChange={(e) => setCurrentPeriod({ ...currentPeriod, dayOfWeek: e.target.value })}
                                >
                                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="dialog-room">Room / Location</Label>
                                <Input
                                    id="dialog-room"
                                    placeholder="E.g., Room 102"
                                    value={currentPeriod.roomId || ""}
                                    onChange={(e) => setCurrentPeriod({ ...currentPeriod, roomId: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="dialog-subj">Subject Name *</Label>
                                <select
                                    id="dialog-subj"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentPeriod.subjectId}
                                    onChange={(e) => setCurrentPeriod({ ...currentPeriod, subjectId: e.target.value })}
                                >
                                    {subjectsList.length === 0 && <option value="">No subjects found</option>}
                                    {subjectsList.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="dialog-teach">Teacher *</Label>
                                <select
                                    id="dialog-teach"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentPeriod.teacherId}
                                    onChange={(e) => setCurrentPeriod({ ...currentPeriod, teacherId: e.target.value })}
                                >
                                    {teachersList.length === 0 && <option value="">No teachers found</option>}
                                    {teachersList.map((t: any) => (
                                        <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.username})</option>
                                    ))}
                                </select>
                            </div>
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

                        <div className="space-y-1.5">
                            <Label htmlFor="dialog-year">Academic Year *</Label>
                            <select
                                id="dialog-year"
                                className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={currentPeriod.academicYearId}
                                onChange={(e) => setCurrentPeriod({ ...currentPeriod, academicYearId: e.target.value })}
                            >
                                {yearsList.map((y: any) => (
                                    <option key={y.id} value={y.id}>{y.title} {y.isActive ? "(Active)" : ""}</option>
                                ))}
                            </select>
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
