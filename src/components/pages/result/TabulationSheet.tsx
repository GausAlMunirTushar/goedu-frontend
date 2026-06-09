"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, Printer, Table as TableIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { examSessions, examClasses, examSections, resultData, examSubjects } from "@/data/exam";

export function TabulationSheetPage() {
  const [showTable, setShowTable] = useState(false);

  const handleSearch = () => setShowTable(true);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Tabulation Sheet</Title>
          <p className="text-sm text-muted-foreground mt-1">Full class-wise result breakdown for all subjects.</p>
        </div>
        {showTable && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
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
              <Search className="w-4 h-4" /> Load Sheet
            </Button>
          </div>
        </CardContent>
      </Card>

      {showTable && (
        <Card className="shadow-sm border-primary/10 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="text-base font-bold text-center">Tabulation Sheet — Mid-Term Examination 2026</CardTitle>
            <CardDescription className="text-xs text-center">Class: 10 | Section: A | Session: 2025-2026</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-gray-100/80 border-b">
                    <th className="py-3 px-2 border-r text-left font-bold min-w-[120px]">Student Name</th>
                    <th className="py-3 px-1 border-r text-center font-bold">Roll</th>
                    {examSubjects.slice(0, 6).map((sub) => (
                      <th key={sub.id} className="py-3 px-1 border-r text-center font-bold" colSpan={2}>{sub.name}</th>
                    ))}
                    <th className="py-3 px-1 border-r text-center font-bold">Total</th>
                    <th className="py-3 px-1 border-r text-center font-bold">GPA</th>
                    <th className="py-3 px-1 text-center font-bold">Grade</th>
                  </tr>
                  <tr className="bg-gray-50 border-b text-[9px] uppercase tracking-tighter">
                    <th className="border-r"></th>
                    <th className="border-r"></th>
                    {examSubjects.slice(0, 6).map((sub) => (
                      <React.Fragment key={`${sub.id}-header`}>
                        <th className="py-1 px-1 border-r text-center">Marks</th>
                        <th className="py-1 px-1 border-r text-center">GP</th>
                      </React.Fragment>
                    ))}
                    <th className="border-r"></th>
                    <th className="border-r"></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((res) => (
                    <tr key={res.id} className="border-b hover:bg-primary/5 transition-colors">
                      <td className="py-2 px-2 border-r font-medium truncate">{res.studentName}</td>
                      <td className="py-2 px-1 border-r text-center">{res.roll}</td>
                      {examSubjects.slice(0, 6).map((sub, i) => (
                        <React.Fragment key={`${res.id}-${sub.id}`}>
                          <td className="py-2 px-1 border-r text-center">{Math.floor(Math.random() * 40) + 60}</td>
                          <td className="py-2 px-1 border-r text-center font-semibold text-primary">{(Math.random() * 2 + 3).toFixed(2)}</td>
                        </React.Fragment>
                      ))}
                      <td className="py-2 px-1 border-r text-center font-bold">{res.obtainedMarks}</td>
                      <td className="py-2 px-1 border-r text-center font-black text-primary">{res.gpa.toFixed(2)}</td>
                      <td className="py-2 px-1 text-center font-bold">{res.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!showTable && (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
          <TableIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Select Parameters</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Choose session, class and section to load the tabulation sheet.
          </p>
        </div>
      )}
    </div>
  );
}
