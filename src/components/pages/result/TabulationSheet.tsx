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
import { useExamTabulationSheetQuery, useExamsQuery } from "@/apis/queries/exam_queries";
import { useClassesQuery, useSectionsQuery } from "@/apis/queries/academic_queries";
import { toast } from "sonner";

export function TabulationSheetPage() {
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [activeFilters, setActiveFilters] = useState<{
    examId: string;
    classId: string;
    sectionId: string;
  } | null>(null);

  const { data: examsRes } = useExamsQuery();
  const { data: classesRes } = useClassesQuery();
  const { data: sectionsRes } = useSectionsQuery(selectedClassId);
  const { data: tabulationRes, isLoading } = useExamTabulationSheetQuery(activeFilters || undefined);

  const exams = examsRes?.data || [];
  const classes = classesRes?.data || [];
  const sections = sectionsRes?.data || [];
  const subjects = tabulationRes?.data?.subjects || [];
  const rows = tabulationRes?.data?.tabulation || [];

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSectionId("");
    setActiveFilters(null);
  };

  const handleSearch = () => {
    if (!selectedExamId || !selectedClassId || !selectedSectionId) {
      toast.error("Please select exam, class, and section");
      return;
    }
    setActiveFilters({
      examId: selectedExamId,
      classId: selectedClassId,
      sectionId: selectedSectionId,
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Tabulation Sheet</Title>
          <p className="text-sm text-muted-foreground mt-1">Full class-wise result breakdown for all subjects.</p>
        </div>
        {activeFilters && (
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
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam</label>
              <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Exam" /></SelectTrigger>
                <SelectContent>
                  {exams.map((exam: any) => (<SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</label>
              <Select value={selectedClassId} onValueChange={handleClassChange}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((classItem: any) => (<SelectItem key={classItem.id} value={classItem.id}>{classItem.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section</label>
              <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Section" /></SelectTrigger>
                <SelectContent>
                  {sections.map((section: any) => (<SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} size="sm" className="h-9 gap-2">
              <Search className="w-4 h-4" /> Load Sheet
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeFilters ? (
        <Card className="shadow-sm border-primary/10 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="text-base font-bold text-center">Tabulation Sheet</CardTitle>
            <CardDescription className="text-xs text-center">Processed subject marks for the selected exam, class and section.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-16 text-center text-sm text-muted-foreground">Loading tabulation sheet...</div>
            ) : rows.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">No tabulation records found for this selection.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-gray-100/80 border-b">
                      <th className="py-3 px-2 border-r text-left font-bold min-w-[120px]">Student Name</th>
                      <th className="py-3 px-1 border-r text-center font-bold">Roll</th>
                      {subjects.map((subject: any) => (
                        <th key={subject.id} className="py-3 px-1 border-r text-center font-bold">{subject.name}</th>
                      ))}
                      <th className="py-3 px-1 border-r text-center font-bold">Total</th>
                      <th className="py-3 px-1 border-r text-center font-bold">GPA</th>
                      <th className="py-3 px-1 text-center font-bold">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row: any) => {
                      const studentName = `${row.student?.firstName || ""} ${row.student?.lastName || ""}`.trim();
                      return (
                        <tr key={row.student?.id} className="border-b hover:bg-primary/5 transition-colors">
                          <td className="py-2 px-2 border-r font-medium truncate">{studentName || "Student"}</td>
                          <td className="py-2 px-1 border-r text-center">{row.student?.roll || "-"}</td>
                          {subjects.map((subject: any) => {
                            const mark = row.subjectMarks?.[subject.id];
                            return (
                              <td key={`${row.student?.id}-${subject.id}`} className="py-2 px-1 border-r text-center">
                                {mark?.total ?? "-"}
                              </td>
                            );
                          })}
                          <td className="py-2 px-1 border-r text-center font-bold">{row.result?.obtainedMarks ?? "-"}</td>
                          <td className="py-2 px-1 border-r text-center font-black text-primary">
                            {row.result?.gpa !== undefined ? Number(row.result.gpa).toFixed(2) : "-"}
                          </td>
                          <td className="py-2 px-1 text-center font-bold">{row.result?.grade || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
          <TableIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Select Parameters</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Choose exam, class and section to load the tabulation sheet.
          </p>
        </div>
      )}
    </div>
  );
}
