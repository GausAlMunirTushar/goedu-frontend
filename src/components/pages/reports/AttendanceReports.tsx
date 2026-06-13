"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileSpreadsheet, 
  Printer, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity
} from "lucide-react";
import { useClassesQuery } from "@/apis/queries/academic_queries";
import { useAttendanceReportQuery } from "@/apis/queries/reports_queries";

export function AttendanceReports() {
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: classesData } = useClassesQuery();
  const classes = classesData?.data || [];

  const { data: reportData, isLoading } = useAttendanceReportQuery({
    startDate,
    endDate,
    classId: selectedClass,
    status: selectedStatus,
    searchQuery,
  });

  const filteredData = reportData?.data || [];

  const totalRecords = filteredData.length;
  const presentCount = filteredData.filter((r: any) => r.status === "Present" || r.status === "Late").length;
  const absentCount = filteredData.filter((r: any) => r.status === "Absent").length;
  const lateCount = filteredData.filter((r: any) => r.status === "Late").length;
  
  const attendancePercentage = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : "0.0";

  const handleExportCSV = () => {
    const headers = ["Date,Roll,Name,Class,In-Time,Out-Time,Status\n"];
    const rows = filteredData.map((r: any) => `${r.date},${r.roll},${r.name},${r.class},${r.inTime},${r.outTime},${r.status}\n`);
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `attendance_reports_${startDate}_to_${endDate}.csv`);
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Attendance Reports</Title>
          <p className="text-sm text-muted-foreground mt-1">Generate lists and metrics for student and staff attendance history.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 border-primary/20 text-primary hover:bg-primary/5">
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-2 bg-primary hover:bg-primary/95 text-white">
            <Printer className="w-4 h-4" /> Print Report
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{attendancePercentage}%</p>
              <p className="text-xs text-muted-foreground">Attendance Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{presentCount}</p>
              <p className="text-xs text-muted-foreground">Present Records</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{absentCount}</p>
              <p className="text-xs text-muted-foreground">Absent Records</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{lateCount}</p>
              <p className="text-xs text-muted-foreground">Late Submissions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="start-date" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end-date" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="class-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</Label>
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="All Classes">All Classes</option>
                {classes.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</Label>
              <select
                id="status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="All Status">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Leave">Leave</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border-primary/10 overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" /> Attendance Log
          </CardTitle>
          <CardDescription className="text-xs">Detailed records matching selected dates and filters.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-muted-foreground uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Roll No.</th>
                  <th className="px-6 py-3 font-semibold">Student Name</th>
                  <th className="px-6 py-3 font-semibold">Class</th>
                  <th className="px-6 py-3 font-semibold">In Time</th>
                  <th className="px-6 py-3 font-semibold">Out Time</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-10">Loading...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-muted-foreground">
                      No attendance logs found matching selected filters.
                    </td>
                  </tr>
                ) : filteredData.map((record: any) => (
                  <tr key={record.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-muted-foreground">{record.date}</td>
                    <td className="px-6 py-4 font-mono font-semibold">{record.roll}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{record.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{record.class}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{record.inTime}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{record.outTime}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        record.status === "Present" ? "bg-emerald-50 text-emerald-700" :
                        record.status === "Late" ? "bg-amber-50 text-amber-700" :
                        record.status === "Leave" ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
