"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Save, History } from "lucide-react";

export function StaffAttendance() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const mockStaff = [
        { id: 1, code: "S001", name: "Abdur Rahim", role: "Accountant", status: "Present" },
        { id: 2, code: "S002", name: "Jesmin Ara", role: "Librarian", status: "Present" },
        { id: 3, code: "S003", name: "Mukul Hossain", role: "Office Assistant", status: "Absent" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Staff Attendance</h1>
                    <p className="text-sm text-gray-500">Mark daily attendance for non-teaching staff</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <History className="w-4 h-4" /> View History
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Select Date</label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[200px]" />
                        </div>
                        <div className="flex-1 max-w-sm space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Search Staff</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="Name or Staff ID" className="pl-9" />
                            </div>
                        </div>
                        <Button variant="secondary">Filter</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Staff List</CardTitle>
                    <Button variant="default" className="flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Attendance
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff ID</TableHead>
                                <TableHead>Staff Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-center">Attendance</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockStaff.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium">{staff.code}</TableCell>
                                    <TableCell>{staff.name}</TableCell>
                                    <TableCell>{staff.role}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <input type="radio" name={`staff-att-${staff.id}`} id={`sp-${staff.id}`} defaultChecked={staff.status === 'Present'} className="text-green-600 h-4 w-4" />
                                                <label htmlFor={`sp-${staff.id}`} className="text-sm font-medium">P</label>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <input type="radio" name={`staff-att-${staff.id}`} id={`sa-${staff.id}`} defaultChecked={staff.status === 'Absent'} className="text-red-600 h-4 w-4" />
                                                <label htmlFor={`sa-${staff.id}`} className="text-sm font-medium">A</label>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input placeholder="Note..." className="h-8 text-xs" />
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
