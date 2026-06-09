"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Save, History } from "lucide-react";

export function StudentAttendance() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const mockStudents = [
        { id: 1, roll: "101", name: "Tanvir Ahmed", present: true },
        { id: 2, roll: "102", name: "Sadiya Islam", present: true },
        { id: 3, roll: "103", name: "Rafiqul Islam", present: false },
        { id: 4, roll: "104", name: "Nusrat Jahan", present: true },
        { id: 5, roll: "105", name: "Abir Hossain", present: true },
    ];

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Select Date</label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Class</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="6">Class 6</SelectItem>
                                    <SelectItem value="7">Class 7</SelectItem>
                                    <SelectItem value="8">Class 8</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Section</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Section A</SelectItem>
                                    <SelectItem value="B">Section B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Shift</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="morning">Morning</SelectItem>
                                    <SelectItem value="day">Day</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="flex items-center gap-2 w-full">
                            <Search className="w-4 h-4" /> Fetch Students
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Student List (Class 6 - A)</CardTitle>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Checkbox id="markAll" />
                            <label htmlFor="markAll" className="cursor-pointer">Mark All Present</label>
                        </div>
                        <Button variant="default" className="flex items-center gap-2">
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
                                <TableHead className="text-center w-[150px]">Attendance</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.roll}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <input type="radio" name={`att-${student.id}`} id={`p-${student.id}`} defaultChecked={student.present} className="text-green-600 focus:ring-green-500 h-4 w-4" />
                                                <label htmlFor={`p-${student.id}`} className="text-sm font-medium text-gray-700">P</label>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <input type="radio" name={`att-${student.id}`} id={`a-${student.id}`} defaultChecked={!student.present} className="text-red-600 focus:ring-red-500 h-4 w-4" />
                                                <label htmlFor={`a-${student.id}`} className="text-sm font-medium text-gray-700">A</label>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <input type="radio" name={`att-${student.id}`} id={`l-${student.id}`} className="text-yellow-600 focus:ring-yellow-500 h-4 w-4" />
                                                <label htmlFor={`l-${student.id}`} className="text-sm font-medium text-gray-700">L</label>
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
