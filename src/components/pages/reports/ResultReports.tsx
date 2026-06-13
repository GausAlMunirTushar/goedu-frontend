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
  Award, 
  Trophy, 
  CheckCircle2, 
  TrendingUp
} from "lucide-react";
import { useClassesQuery, useSessionsQuery } from "@/apis/queries/academic_queries";
import { useExamsQuery } from "@/apis/queries/exam_queries";
import { useResultReportQuery } from "@/apis/queries/reports_queries";

export function ResultReports() {
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSession, setSelectedSession] = useState("All Sessions");
  const [selectedExam, setSelectedExam] = useState("All Exams");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: classesData } = useClassesQuery();
  const classes = classesData?.data || [];

  const { data: sessionsData } = useSessionsQuery();
  const sessions = sessionsData?.data || [];

  const { data: examsData } = useExamsQuery();
  const examsList = examsData?.data || [];

  const { data: reportData, isLoading } = useResultReportQuery({
    examId: selectedExam,
    classId: selectedClass,
    sessionId: selectedSession,
    status: selectedStatus,
    searchQuery,
  });

  const filteredData = reportData?.data || [];

  const totalCandidates = filteredData.length;
  const passCount = filteredData.filter((r: any) => r.status === "Pass").length;
  const gpa5Count = filteredData.filter((r: any) => r.gpa === 5.00).length;
  const passRate = totalCandidates > 0 ? ((passCount / totalCandidates) * 100).toFixed(1) : "0.0";
  
  const avgMarks = totalCandidates > 0 
    ? Math.round(filteredData.reduce((acc: number, curr: any) => acc + curr.marks, 0) / totalCandidates) 
    : 0;

  const handleExportCSV = () => {
    const headers = ["Roll,Name,Class,Session,Exam,GPA,Marks,Grade,Position,Status\n"];
    const rows = filteredData.map((r: any) => `${r.roll},${r.name},${r.class},${r.session},${r.exam},${r.gpa},${r.marks},${r.grade},${r.position},${r.status}\n`);
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `result_reports.csv`);
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
          <Title>Result Reports</Title>
          <p className="text-sm text-muted-foreground mt-1">Generate comprehensive examination results, student rankings, and pass rate charts.</p>
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
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{passRate}%</p>
              <p className="text-xs text-muted-foreground">Passing Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{gpa5Count}</p>
              <p className="text-xs text-muted-foreground">GPA 5.00 Holders</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{avgMarks}</p>
              <p className="text-xs text-muted-foreground">Avg. Filtered Marks</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{totalCandidates}</p>
              <p className="text-xs text-muted-foreground">Total Candidates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="exam-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam</Label>
              <select
                id="exam-select"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="All Exams">All Exams</option>
                {examsList.map((ex: any) => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
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
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pass/Fail Status</Label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="All">All Results</option>
                <option value="Pass">Pass Only</option>
                <option value="Fail">Fail Only</option>
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
            <Trophy className="w-5 h-5 text-primary" /> Examination Marks & GPA Ledger
          </CardTitle>
          <CardDescription className="text-xs">Class-wise rank position, GPA grading, and overall passing status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-muted-foreground uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Roll</th>
                  <th className="px-6 py-3 font-semibold">Student Name</th>
                  <th className="px-6 py-3 font-semibold">Class</th>
                  <th className="px-6 py-3 font-semibold">Exam Type</th>
                  <th className="px-6 py-3 font-semibold">Total Marks</th>
                  <th className="px-6 py-3 font-semibold">GPA</th>
                  <th className="px-6 py-3 font-semibold">Grade</th>
                  <th className="px-6 py-3 font-semibold">Class Rank</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={9} className="text-center py-10">Loading...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-muted-foreground">
                      No examination results match selected filters.
                    </td>
                  </tr>
                ) : filteredData.map((res: any) => (
                  <tr key={res.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold">{res.roll}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{res.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{res.class}</td>
                    <td className="px-6 py-4 text-muted-foreground">{res.exam}</td>
                    <td className="px-6 py-4 font-semibold font-mono">{res.marks}</td>
                    <td className="px-6 py-4 font-bold text-primary font-mono">{res.gpa.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        res.grade === "A+" ? "bg-emerald-100 text-emerald-800" :
                        res.grade === "F" ? "bg-rose-100 text-rose-800" : "bg-primary/10 text-primary"
                      }`}>
                        {res.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">{res.position}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        res.status === "Pass" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {res.status}
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
