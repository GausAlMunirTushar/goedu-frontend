"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Save, History, Clock } from "lucide-react";
import { toast } from "sonner";
import { useEmployeeAttendanceQuery } from "@/apis/queries/attendance_queries";
import { saveEmployeeAttendanceBulk } from "@/apis/mutations/attendance_mutations";

export function TeacherAttendance() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    
    // For keeping track of local changes
    const [attendanceList, setAttendanceList] = useState<any[]>([]);

    const { data: attendanceData, isLoading, mutate } = useEmployeeAttendanceQuery({ date });
    
    const employees = attendanceData?.data || [];

    useEffect(() => {
        if (employees.length > 0) {
            setAttendanceList(
                employees.map((e: any) => ({
                    userId: e.userId,
                    status: e.status || "PRESENT",
                    inTime: e.inTime || "",
                    outTime: e.outTime || "",
                    remarks: e.remarks || "",
                }))
            );
        } else {
            setAttendanceList([]);
        }
    }, [employees]);

    const handleStatusChange = (userId: string, status: string) => {
        setAttendanceList(prev => prev.map(a => a.userId === userId ? { ...a, status } : a));
    };

    const handleTimeChange = (userId: string, field: 'inTime'|'outTime', value: string) => {
        setAttendanceList(prev => prev.map(a => a.userId === userId ? { ...a, [field]: value } : a));
    };

    const handleSave = async () => {
        if (!date) {
            toast.error("Please select a date.");
            return;
        }
        if (attendanceList.length === 0) {
            toast.error("No employees to save.");
            return;
        }

        try {
            await saveEmployeeAttendanceBulk({
                date,
                attendance: attendanceList,
            });
            toast.success("Teacher attendance saved successfully");
            mutate();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to save attendance");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Teacher Attendance</h1>
                    <p className="text-sm text-gray-500">Manage daily attendance for teachers</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <History className="w-4 h-4" /> Attendance Log
                    </Button>
                    <Button className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Bulk Check-in
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Select Date</label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[200px]" />
                        </div>
                        <div className="flex-1 max-w-sm space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Search Teacher</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="Name or Teacher ID" className="pl-9" />
                            </div>
                        </div>
                        <Button variant="secondary" onClick={() => mutate()} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Filter"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Attendance Sheet ({date})</CardTitle>
                    <Button variant="default" className="flex items-center gap-2" onClick={handleSave}>
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Teacher ID</TableHead>
                                <TableHead>Teacher Name</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead className="w-[120px]">In Time</TableHead>
                                <TableHead className="w-[120px]">Out Time</TableHead>
                                <TableHead className="text-center w-[200px]">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((teacher: any) => {
                                const localState = attendanceList.find(a => a.userId === teacher.userId);
                                const status = localState?.status || "PRESENT";
                                const inTime = localState?.inTime || "";
                                const outTime = localState?.outTime || "";

                                return (
                                    <TableRow key={teacher.userId}>
                                        <TableCell className="font-medium">{teacher.code}</TableCell>
                                        <TableCell>{teacher.name}</TableCell>
                                        <TableCell>{teacher.designation}</TableCell>
                                        <TableCell>
                                            <Input 
                                                type="time" 
                                                value={inTime} 
                                                onChange={(e) => handleTimeChange(teacher.userId, 'inTime', e.target.value)} 
                                                className="h-8 text-xs text-center" 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                type="time" 
                                                value={outTime} 
                                                onChange={(e) => handleTimeChange(teacher.userId, 'outTime', e.target.value)} 
                                                className="h-8 text-xs text-center" 
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-3">
                                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleStatusChange(teacher.userId, 'PRESENT')}>
                                                    <input type="radio" checked={status === 'PRESENT'} readOnly className="text-green-600 focus:ring-green-500 h-4 w-4" />
                                                    <label className="text-xs font-medium text-gray-700">P</label>
                                                </div>
                                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleStatusChange(teacher.userId, 'ABSENT')}>
                                                    <input type="radio" checked={status === 'ABSENT'} readOnly className="text-red-600 focus:ring-red-500 h-4 w-4" />
                                                    <label className="text-xs font-medium text-gray-700">A</label>
                                                </div>
                                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleStatusChange(teacher.userId, 'LEAVE')}>
                                                    <input type="radio" checked={status === 'LEAVE'} readOnly className="text-yellow-600 focus:ring-yellow-500 h-4 w-4" />
                                                    <label className="text-xs font-medium text-gray-700">L</label>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
