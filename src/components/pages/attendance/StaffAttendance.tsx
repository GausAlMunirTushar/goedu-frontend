"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Save, History } from "lucide-react";
import { toast } from "sonner";
import { useEmployeeAttendanceQuery } from "@/apis/queries/attendance_queries";
import { saveEmployeeAttendanceBulk } from "@/apis/mutations/attendance_mutations";

export function StaffAttendance() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [search, setSearch] = useState("");
    const [attendanceList, setAttendanceList] = useState<any[]>([]);

    const { data, isLoading, mutate } = useEmployeeAttendanceQuery({ date });
    const staff = data?.data || [];

    useEffect(() => {
        setAttendanceList(
            staff.map((item: any) => ({
                userId: item.userId,
                status: item.status || "PRESENT",
                remarks: item.remarks || "",
                inTime: item.inTime || "",
                outTime: item.outTime || "",
            }))
        );
    }, [staff]);

    const filteredStaff = staff.filter((item: any) => {
        const query = search.toLowerCase();
        return item.name?.toLowerCase().includes(query) || item.code?.toLowerCase().includes(query);
    });

    const getLocalState = (userId: string, defaultStatus?: string) =>
        attendanceList.find((item) => item.userId === userId) || {
            userId,
            status: defaultStatus || "PRESENT",
            remarks: "",
            inTime: "",
            outTime: "",
        };

    const updateLocalState = (userId: string, patch: any, defaultStatus?: string) => {
        setAttendanceList((prev) => {
            const current = prev.find((item) => item.userId === userId);
            if (current) return prev.map((item) => (item.userId === userId ? { ...item, ...patch } : item));
            return [...prev, { ...getLocalState(userId, defaultStatus), ...patch }];
        });
    };

    const handleSave = async () => {
        try {
            const attendance = staff.map((item: any) => {
                const local = getLocalState(item.userId, item.status || "PRESENT");
                return {
                    userId: item.userId,
                    status: local.status,
                    inTime: local.inTime || null,
                    outTime: local.outTime || null,
                    remarks: local.remarks || "",
                };
            });

            await saveEmployeeAttendanceBulk({ date, attendance });
            toast.success("Staff attendance saved successfully");
            mutate();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to save staff attendance");
        }
    };

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
                                <Input placeholder="Name or Staff ID" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>
                        <Button variant="secondary">Filter</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Staff List</CardTitle>
                    <Button variant="default" className="flex items-center gap-2" onClick={handleSave} disabled={staff.length === 0}>
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
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">Loading staff...</TableCell>
                                </TableRow>
                            ) : filteredStaff.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">No staff found.</TableCell>
                                </TableRow>
                            ) : filteredStaff.map((staff) => {
                                const local = getLocalState(staff.userId, staff.status || "PRESENT");

                                return (
                                <TableRow key={staff.userId}>
                                    <TableCell className="font-medium">{staff.code}</TableCell>
                                    <TableCell>{staff.name}</TableCell>
                                    <TableCell>{staff.designation}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <input type="radio" name={`staff-att-${staff.userId}`} id={`sp-${staff.userId}`} checked={local.status === 'PRESENT'} onChange={() => updateLocalState(staff.userId, { status: "PRESENT" }, staff.status)} className="text-green-600 h-4 w-4" />
                                                <label htmlFor={`sp-${staff.userId}`} className="text-sm font-medium">P</label>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <input type="radio" name={`staff-att-${staff.userId}`} id={`sa-${staff.userId}`} checked={local.status === 'ABSENT'} onChange={() => updateLocalState(staff.userId, { status: "ABSENT" }, staff.status)} className="text-red-600 h-4 w-4" />
                                                <label htmlFor={`sa-${staff.userId}`} className="text-sm font-medium">A</label>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input placeholder="Note..." className="h-8 text-xs" value={local.remarks || ""} onChange={(e) => updateLocalState(staff.userId, { remarks: e.target.value }, staff.status)} />
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
