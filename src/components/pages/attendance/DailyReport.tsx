"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Printer, Filter } from "lucide-react";

export function DailyAttendanceReport() {
    const summary = [
        { label: "Total Students", value: 1250 },
        { label: "Present", value: 1180, color: "text-green-600" },
        { label: "Absent", value: 50, color: "text-red-600" },
        { label: "Leave", value: 20, color: "text-yellow-600" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Daily Attendance Report</h1>
                    <p className="text-sm text-gray-500">Summary of today's attendance across all classes</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Print
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {summary.map((item, idx) => (
                    <Card key={idx}>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                            <span className="text-xs font-semibold text-gray-500 uppercase">{item.label}</span>
                            <span className={`text-2xl font-bold ${item.color || "text-gray-900"}`}>{item.value}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Attendance by Class</CardTitle>
                    <div className="flex items-center gap-2">
                        <Input type="date" className="h-8 w-40 text-xs" defaultValue={new Date().toISOString().split('T')[0]} />
                        <Button variant="secondary" size="sm" className="h-8">
                            <Filter className="w-3.5 h-3.5 mr-2" /> Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead className="text-center">Total Students</TableHead>
                                <TableHead className="text-center text-green-600">Present</TableHead>
                                <TableHead className="text-center text-red-600">Absent</TableHead>
                                <TableHead className="text-center text-yellow-600">Leave</TableHead>
                                <TableHead className="text-center">Percentage</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                { class: "Class 6", section: "A", total: 50, p: 48, a: 1, l: 1, pct: "96%" },
                                { class: "Class 6", section: "B", total: 45, p: 40, a: 3, l: 2, pct: "88%" },
                                { class: "Class 7", section: "A", total: 60, p: 58, a: 2, l: 0, pct: "97%" },
                            ].map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{row.class}</TableCell>
                                    <TableCell>{row.section}</TableCell>
                                    <TableCell className="text-center">{row.total}</TableCell>
                                    <TableCell className="text-center font-bold text-green-600">{row.p}</TableCell>
                                    <TableCell className="text-center font-bold text-red-600">{row.a}</TableCell>
                                    <TableCell className="text-center font-bold text-yellow-600">{row.l}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500" style={{ width: row.pct }} />
                                            </div>
                                            <span className="text-xs font-bold">{row.pct}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                        </Button>
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
