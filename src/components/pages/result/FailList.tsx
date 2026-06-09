"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, Printer, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { examSessions, examClasses, examSections, resultData } from "@/data/exam";

export function FailListPage() {
  const [showList, setShowList] = useState(false);

  const handleSearch = () => setShowList(true);

  const failList = resultData.filter((s) => s.status === "Fail");

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Fail List</Title>
          <p className="text-sm text-muted-foreground mt-1">List of students who were unsuccessful in the examination.</p>
        </div>
        {showList && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
        )}
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session</label>
              <Select defaultValue={examSessions[0].name}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Session" /></SelectTrigger>
                <SelectContent>
                  {examSessions.map((s) => (<SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</label>
              <Select defaultValue={examClasses[0].name}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Class" /></SelectTrigger>
                <SelectContent>
                  {examClasses.map((c) => (<SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section</label>
              <Select defaultValue={examSections[0].shortName}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Section" /></SelectTrigger>
                <SelectContent>
                  {examSections.map((s) => (<SelectItem key={s.id} value={s.shortName}>{s.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} size="sm" className="h-9 gap-2">
              <Search className="w-4 h-4" /> Filter Students
            </Button>
          </div>
        </CardContent>
      </Card>

      {showList && (
        <Card className="shadow-sm border-red-100 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-red-50/50">
            <div>
              <CardTitle className="text-base font-bold text-red-700">Unsuccessful Students</CardTitle>
              <CardDescription className="text-xs text-red-600/70">Total Failed: {failList.length}</CardDescription>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left bg-gray-50/50">
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Roll</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Student Name</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Marks</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">GPA</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {failList.length > 0 ? (
                    failList.map((res) => (
                      <tr key={res.id} className="border-b last:border-0 hover:bg-red-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-medium">{res.roll}</td>
                        <td className="py-3.5 px-4 font-bold">{res.studentName}</td>
                        <td className="py-3.5 px-4 text-center font-semibold">{res.obtainedMarks}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-red-600">{res.gpa.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            FAILED
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground italic">
                        No students failed in this class/section. Excellent result!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!showList && (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
          <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Select Filters</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Load the fail list by selecting the specific class and section above.
          </p>
        </div>
      )}
    </div>
  );
}
