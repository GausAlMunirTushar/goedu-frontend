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
  Users, 
  UserCheck, 
  UserMinus,
  GraduationCap
} from "lucide-react";
import { useClassesQuery, useSessionsQuery } from "@/apis/queries/academic_queries";
import { useStudentReportQuery } from "@/apis/queries/reports_queries";

export function StudentReports() {
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSession, setSelectedSession] = useState("All Sessions");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: classesData } = useClassesQuery();
  const classes = classesData?.data || [];

  const { data: sessionsData } = useSessionsQuery();
  const sessions = sessionsData?.data || [];

  const { data: reportData, isLoading } = useStudentReportQuery({
    classId: selectedClass,
    sessionId: selectedSession,
    status: selectedStatus,
    searchQuery,
  });

  const filteredData = reportData?.data || [];

  const totalCount = filteredData.length;
  const activeCount = filteredData.filter((s: any) => s.status === "Active").length;
  const inactiveCount = filteredData.filter((s: any) => s.status !== "Active").length;

  const handleExportCSV = () => {
    const headers = ["Roll,Name,Class,Session,Gender,Status,Contact,Parent\n"];
    const rows = filteredData.map((s: any) => `${s.roll},${s.name},${s.class},${s.session},${s.gender},${s.status},${s.contact},${s.parent}\n`);
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `student_reports_${new Date().toISOString().slice(0,10)}.csv`);
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
          <Title>Student Reports</Title>
          <p className="text-sm text-muted-foreground mt-1">Generate lists, demographic summaries, and enrollment statistics.</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Total Filtered Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <UserMinus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{inactiveCount}</p>
              <p className="text-xs text-muted-foreground">Inactive / Transferred</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
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
              <Label htmlFor="session-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session</Label>
              <select
                id="session-select"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="All Sessions">All Sessions</option>
                {sessions.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Transferred">Transferred</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll..."
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
            <GraduationCap className="w-5 h-5 text-primary" /> Student Records List
          </CardTitle>
          <CardDescription className="text-xs">Filter and preview details before downloading reports.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-muted-foreground uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Roll</th>
                  <th className="px-6 py-3 font-semibold">Student Name</th>
                  <th className="px-6 py-3 font-semibold">Class</th>
                  <th className="px-6 py-3 font-semibold">Session</th>
                  <th className="px-6 py-3 font-semibold">Gender</th>
                  <th className="px-6 py-3 font-semibold">Parent Name</th>
                  <th className="px-6 py-3 font-semibold">Contact</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={8} className="text-center py-10">Loading...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground">
                      No student records match selected filters.
                    </td>
                  </tr>
                ) : filteredData.map((student: any) => (
                  <tr key={student.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold">{student.roll}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.class}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.session}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.gender}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.parent}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.contact}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        student.status === "Active" ? "bg-emerald-50 text-emerald-700" :
                        student.status === "Transferred" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {student.status}
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
