"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, Search, Calendar } from "lucide-react";

export function MonthlyAttendanceReport() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = months[new Date().getMonth()];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Monthly Attendance Report</h1>
                    <p className="text-sm text-gray-500">Detailed monthly attendance analysis for students</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Download Report
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Select Month</label>
                            <Select defaultValue={currentMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600">Academic Year</label>
                            <Select defaultValue="2025">
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                </SelectContent>
                            </Select>
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
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <Button className="flex items-center gap-2 w-full md:w-auto">
                                <Search className="w-4 h-4" /> Generate Report
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" /> 
                        Monthly Attendance Details - {currentMonth} 2025
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Roll</TableHead>
                                    <TableHead className="min-w-[150px]">Student Name</TableHead>
                                    {/* Simplified view: instead of 31 days, show summary stats */}
                                    <TableHead className="text-center">Working Days</TableHead>
                                    <TableHead className="text-center text-green-600">Present</TableHead>
                                    <TableHead className="text-center text-red-600">Absent</TableHead>
                                    <TableHead className="text-center text-yellow-600">Leave</TableHead>
                                    <TableHead className="text-center">Pct (%)</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { roll: "101", name: "Tanvir Ahmed", total: 22, p: 20, a: 1, l: 1, pct: "90.9%" },
                                    { roll: "102", name: "Sadiya Islam", total: 22, p: 22, a: 0, l: 0, pct: "100%" },
                                    { roll: "103", name: "Rafiqul Islam", total: 22, p: 18, a: 3, l: 1, pct: "81.8%" },
                                ].map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{row.roll}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell className="text-center">{row.total}</TableCell>
                                        <TableCell className="text-center font-bold text-green-600">{row.p}</TableCell>
                                        <TableCell className="text-center font-bold text-red-600">{row.a}</TableCell>
                                        <TableCell className="text-center font-bold text-yellow-600">{row.l}</TableCell>
                                        <TableCell className="text-center font-bold">{row.pct}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-blue-600">View Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
