"use client";

import { AxiosAPI } from "@/apis/configs";
import { hrAttendanceUrl } from "@/apis/endpoints/hr_apis";
import { useHrAttendanceQuery } from "@/apis/queries/hr_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function HrAttendanceView() {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [search, setSearch] = useState("");
    const [attendanceList, setAttendanceList] = useState<any[]>([]);
    const { data, isLoading, mutate } = useHrAttendanceQuery(date);
    const staff = data?.data || [];

    useEffect(() => {
        setAttendanceList(staff.map((item: any) => ({
            userId: item.userId,
            status: item.status || "PRESENT",
            remarks: item.remarks || "",
            inTime: item.inTime || "",
            outTime: item.outTime || "",
        })));
    }, [staff]);

    const filtered = staff.filter((item: any) => {
        const keyword = search.toLowerCase();
        return item.name?.toLowerCase().includes(keyword) || item.code?.toLowerCase().includes(keyword);
    });

    const getLocal = (userId: string) => attendanceList.find((item) => item.userId === userId) || { userId, status: "PRESENT", remarks: "", inTime: "", outTime: "" };
    const patchLocal = (userId: string, patch: any) => setAttendanceList((prev) => prev.map((item) => item.userId === userId ? { ...item, ...patch } : item));

    const save = async () => {
        try {
            await AxiosAPI.post(hrAttendanceUrl, { date, attendance: attendanceList });
            toast.success("Attendance saved");
            mutate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Save failed");
        }
    };

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div><CardTitle className="text-lg">Staff Attendance</CardTitle><p className="text-xs text-muted-foreground mt-1">Mark daily employee attendance.</p></div>
                        <Button onClick={save} disabled={!staff.length}><Save className="h-4 w-4 mr-2" /> Save</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="sm:w-52" />
                        <div className="relative sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." className="pl-9" />
                        </div>
                    </div>
                    <Table>
                        <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Remarks</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {isLoading ? <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow> : filtered.map((item: any) => {
                                const local = getLocal(item.userId);
                                return (
                                    <TableRow key={item.userId}>
                                        <TableCell>{item.code}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.designation}</TableCell>
                                        <TableCell>
                                            <select value={local.status} onChange={(e) => patchLocal(item.userId, { status: e.target.value })} className="border rounded-md px-2 py-1 text-sm">
                                                <option value="PRESENT">Present</option>
                                                <option value="ABSENT">Absent</option>
                                                <option value="LATE">Late</option>
                                                <option value="LEAVE">Leave</option>
                                            </select>
                                        </TableCell>
                                        <TableCell><Input value={local.remarks} onChange={(e) => patchLocal(item.userId, { remarks: e.target.value })} className="h-8" /></TableCell>
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
