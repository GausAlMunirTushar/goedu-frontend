"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Save, History, Clock } from "lucide-react";

export function TeacherAttendance() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const mockTeachers = [
        { id: 1, code: "T001", name: "Dr. Mahfuzur Rahman", designation: "Principal", inTime: "08:45 AM", outTime: "--", status: "Present" },
        { id: 2, code: "T002", name: "Farhana Yasmin", designation: "Senior Teacher", inTime: "09:00 AM", outTime: "--", status: "Present" },
        { id: 3, code: "T003", name: "Kamrul Hasan", designation: "Lecturer", inTime: "--", outTime: "--", status: "Absent" },
    ];

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
                        <Button variant="secondary">Filter</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Attendance Sheet ({date})</CardTitle>
                    <Button variant="default" className="flex items-center gap-2">
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
                                <TableHead>In Time</TableHead>
                                <TableHead>Out Time</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTeachers.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell className="font-medium">{teacher.code}</TableCell>
                                    <TableCell>{teacher.name}</TableCell>
                                    <TableCell>{teacher.designation}</TableCell>
                                    <TableCell>
                                        <Input type="text" defaultValue={teacher.inTime} className="w-24 h-8 text-xs text-center" />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="text" defaultValue={teacher.outTime} className="w-24 h-8 text-xs text-center" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                            teacher.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {teacher.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" className="text-xs text-blue-600">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
