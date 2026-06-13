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
  Briefcase, 
  ShieldCheck, 
  ClipboardList
} from "lucide-react";
import { useTeacherReportQuery } from "@/apis/queries/reports_queries";
import { useQuery } from "@/hooks/useQuery";
import { teacherDesignationsUrl, teacherDepartmentsUrl } from "@/apis/endpoints/staff_apis";
import type { TResponse } from "@/types/configs";

// Helper hooks for fetching dropdown data
const useDesignationsQuery = () => useQuery<TResponse<any>>(teacherDesignationsUrl);
const useDepartmentsQuery = () => useQuery<TResponse<any>>(teacherDepartmentsUrl);

export function TeacherReports() {
  const [selectedDesignation, setSelectedDesignation] = useState("All Designations");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: designationsData } = useDesignationsQuery();
  const designations = designationsData?.data || [];

  const { data: deptsData } = useDepartmentsQuery();
  const departments = deptsData?.data || [];

  const { data: reportData, isLoading } = useTeacherReportQuery({
    designationId: selectedDesignation,
    departmentId: selectedDept,
    status: selectedStatus,
    searchQuery,
  });

  const filteredData = reportData?.data || [];

  const totalCount = filteredData.length;
  const activeCount = filteredData.filter((t: any) => t.status === "Active").length;
  const uniqueDepts = new Set(filteredData.map((t: any) => t.department)).size;

  const handleExportCSV = () => {
    const headers = ["Name,Email,Contact,Designation,Department,Join Date,Status\n"];
    const rows = filteredData.map((t: any) => `${t.name},${t.email},${t.contact},${t.designation},${t.department},${t.joinDate},${t.status}\n`);
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `teacher_reports_${new Date().toISOString().slice(0,10)}.csv`);
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
          <Title>Teacher Reports</Title>
          <p className="text-sm text-muted-foreground mt-1">Generate lists, designation distributions, and faculty summaries.</p>
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
              <p className="text-xs text-muted-foreground">Total Filtered Teachers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active Faculty</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{uniqueDepts}</p>
              <p className="text-xs text-muted-foreground">Distinct Departments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="designation-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Designation</Label>
              <select
                id="designation-select"
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="All Designations">All Designations</option>
                {designations.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dept-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</Label>
              <select
                id="dept-select"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="All Departments">All Departments</option>
                {departments.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
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
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, contact..."
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
            <ClipboardList className="w-5 h-5 text-primary" /> Teacher Directory List
          </CardTitle>
          <CardDescription className="text-xs">Faculty details, department tags, and contact records.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-muted-foreground uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Teacher Name</th>
                  <th className="px-6 py-3 font-semibold">Designation</th>
                  <th className="px-6 py-3 font-semibold">Department</th>
                  <th className="px-6 py-3 font-semibold">Email Address</th>
                  <th className="px-6 py-3 font-semibold">Mobile No.</th>
                  <th className="px-6 py-3 font-semibold">Join Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-10">Loading...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-muted-foreground">
                      No teacher records found matching selected filters.
                    </td>
                  </tr>
                ) : filteredData.map((t: any) => (
                  <tr key={t.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{t.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{t.designation}</td>
                    <td className="px-6 py-4 text-muted-foreground">{t.department}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{t.email}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{t.contact}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{t.joinDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {t.status}
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
