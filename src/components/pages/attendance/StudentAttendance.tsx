"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Save, History, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useClassesQuery, useSectionsQuery } from "@/apis/queries/academic_queries";
import { useStudentAttendanceQuery } from "@/apis/queries/attendance_queries";
import { saveStudentAttendanceBulk } from "@/apis/mutations/attendance_mutations";
import { SmsPreviewDialog } from "@/components/pages/settings/sms/SmsPreviewDialog";
import type { SmsSendPayload } from "@/apis/types/sms_type";

export function StudentAttendance() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState("");
    const [smsStatusFilter, setSmsStatusFilter] = useState("all");
    const [smsPayload, setSmsPayload] = useState<SmsSendPayload | null>(null);
    const [isSmsPreviewOpen, setIsSmsPreviewOpen] = useState(false);

    // For keeping track of local changes
    const [attendanceList, setAttendanceList] = useState<any[]>([]);

    const { data: classesData, isLoading: isLoadingClasses } = useClassesQuery();
    const classes = classesData?.data || [];

    const { data: sectionsData, isLoading: isLoadingSections } = useSectionsQuery(selectedClassId);
    const sections = sectionsData?.data || [];

    const {
        data: attendanceData,
        isLoading: isLoadingAttendance,
        mutate,
    } = useStudentAttendanceQuery({
        date,
        classId: selectedClassId,
        sectionId: selectedSectionId,
    });

    const students = attendanceData?.data || [];

    useEffect(() => {
        if (students.length > 0) {
            setAttendanceList(
                students.map((s: any) => ({
                    studentId: s.studentId,
                    status: s.status || "PRESENT",
                    remarks: s.remarks || "",
                })),
            );
        } else {
            setAttendanceList([]);
        }
    }, [students]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceList((prev) =>
            prev.map((a) => (a.studentId === studentId ? { ...a, status } : a)),
        );
    };

    const handleRemarksChange = (studentId: string, remarks: string) => {
        setAttendanceList((prev) =>
            prev.map((a) => (a.studentId === studentId ? { ...a, remarks } : a)),
        );
    };

    const handleMarkAllPresent = (checked: boolean) => {
        setAttendanceList((prev) =>
            prev.map((a) => ({ ...a, status: checked ? "PRESENT" : "ABSENT" })),
        );
    };

    const handleSave = async () => {
        if (!selectedClassId || !selectedSectionId || !date) {
            toast.error("Please select date, class, and section.");
            return;
        }
        if (attendanceList.length === 0) {
            toast.error("No students to save.");
            return;
        }

        try {
            await saveStudentAttendanceBulk({
                date,
                classId: selectedClassId,
                sectionId: selectedSectionId,
                attendance: attendanceList,
            });
            toast.success("Attendance saved successfully");
            mutate();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to save attendance");
        }
    };

    const handleOpenSmsPreview = () => {
        if (!selectedClassId || !selectedSectionId || !date) {
            toast.error("Please select date, class, and section before sending SMS.");
            return;
        }

        setSmsPayload({
            sourceType: "attendance",
            message:
                "Dear {{studentName}}, your attendance for {{date}} is {{status}}. - {{institutionName}}",
            filters: {
                date,
                classId: selectedClassId,
                sectionId: selectedSectionId,
                status: smsStatusFilter,
            },
        });
        setIsSmsPreviewOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Attendance</h1>
                    <p className="text-sm text-gray-500">Mark daily attendance for students</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <History className="w-4 h-4" /> View History
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">
                                Select Date
                            </label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Class</label>
                            <Select
                                value={selectedClassId}
                                onValueChange={setSelectedClassId}
                                disabled={isLoadingClasses}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Section</label>
                            <Select
                                value={selectedSectionId}
                                onValueChange={setSelectedSectionId}
                                disabled={!selectedClassId || isLoadingSections}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sections.map((s: any) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className="flex items-center gap-2 w-full"
                            onClick={() => mutate()}
                            disabled={isLoadingAttendance}
                        >
                            <Search className="w-4 h-4" />{" "}
                            {isLoadingAttendance ? "Loading..." : "Fetch Students"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {students.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Student List</CardTitle>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Checkbox id="markAll" onCheckedChange={handleMarkAllPresent} />
                                <label htmlFor="markAll" className="cursor-pointer">
                                    Mark All Present
                                </label>
                            </div>
                            <Select value={smsStatusFilter} onValueChange={setSmsStatusFilter}>
                                <SelectTrigger className="h-9 w-36">
                                    <SelectValue placeholder="SMS filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="ABSENT">Absent only</SelectItem>
                                    <SelectItem value="LATE">Late only</SelectItem>
                                    <SelectItem value="PRESENT">Present only</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={handleOpenSmsPreview}
                            >
                                <MessageSquare className="w-4 h-4" /> Send SMS
                            </Button>
                            <Button
                                variant="default"
                                className="flex items-center gap-2"
                                onClick={handleSave}
                            >
                                <Save className="w-4 h-4" /> Save Attendance
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Roll</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="text-center w-[250px]">
                                        Attendance
                                    </TableHead>
                                    <TableHead>Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student: any) => {
                                    const localState = attendanceList.find(
                                        (a) => a.studentId === student.studentId,
                                    );
                                    const status = localState?.status || "PRESENT";
                                    const remarks = localState?.remarks || "";

                                    return (
                                        <TableRow key={student.studentId}>
                                            <TableCell className="font-medium">
                                                {student.roll}
                                            </TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-4">
                                                    <div
                                                        className="flex items-center gap-1.5 cursor-pointer"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                student.studentId,
                                                                "PRESENT",
                                                            )
                                                        }
                                                    >
                                                        <input
                                                            type="radio"
                                                            checked={status === "PRESENT"}
                                                            readOnly
                                                            className="text-green-600 focus:ring-green-500 h-4 w-4 cursor-pointer"
                                                        />
                                                        <label className="text-sm font-medium text-gray-700 cursor-pointer">
                                                            P
                                                        </label>
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-1.5 cursor-pointer"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                student.studentId,
                                                                "ABSENT",
                                                            )
                                                        }
                                                    >
                                                        <input
                                                            type="radio"
                                                            checked={status === "ABSENT"}
                                                            readOnly
                                                            className="text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                                                        />
                                                        <label className="text-sm font-medium text-gray-700 cursor-pointer">
                                                            A
                                                        </label>
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-1.5 cursor-pointer"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                student.studentId,
                                                                "LATE",
                                                            )
                                                        }
                                                    >
                                                        <input
                                                            type="radio"
                                                            checked={status === "LATE"}
                                                            readOnly
                                                            className="text-yellow-600 focus:ring-yellow-500 h-4 w-4 cursor-pointer"
                                                        />
                                                        <label className="text-sm font-medium text-gray-700 cursor-pointer">
                                                            L
                                                        </label>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    placeholder="Note..."
                                                    className="h-8 text-xs"
                                                    value={remarks}
                                                    onChange={(e) =>
                                                        handleRemarksChange(
                                                            student.studentId,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
            {smsPayload && (
                <SmsPreviewDialog
                    open={isSmsPreviewOpen}
                    payload={smsPayload}
                    onOpenChange={setIsSmsPreviewOpen}
                />
            )}
        </div>
    );
}
