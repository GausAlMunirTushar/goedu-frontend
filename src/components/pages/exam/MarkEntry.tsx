"use client";

import React, { useState, useEffect } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useExamMarksQuery,
  useExamsQuery,
} from "@/apis/queries/exam_queries";
import { saveExamMarks } from "@/apis/mutations/exam_mutations";
import { useClassesQuery, useSectionsQuery, useSubjectsQuery, useSessionsQuery } from "@/apis/queries/academic_queries";

const statusStyle: Record<string, string> = {
  Entered: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
};

export function MarkEntryPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [localMarks, setLocalMarks] = useState<any[]>([]);

  // Load selection lists
  const { data: sessionsRes } = useSessionsQuery();
  const sessionsList = sessionsRes?.data || [];

  const { data: classesRes } = useClassesQuery();
  const classesList = classesRes?.data || [];

  const { data: sectionsRes } = useSectionsQuery(selectedClassId);
  const sectionsList = sectionsRes?.data || [];

  const { data: subjectsRes } = useSubjectsQuery(selectedClassId);
  const subjectsList = subjectsRes?.data || [];

  const { data: examsRes } = useExamsQuery();
  const examsList = examsRes?.data || [];

  // Reset filters when selections change
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSectionId("");
    setSelectedSubjectId("");
  };

  // SWR query loads students and marks
  const { data: marksRes, isLoading, mutate } = useExamMarksQuery(activeFilters);
  const marksData = marksRes?.data || [];

  // Initialize local marks state when marksData loads
  useEffect(() => {
    if (marksData.length > 0) {
      setLocalMarks(
        marksData.map((m: any) => ({
          studentId: m.id,
          studentName: m.studentName,
          roll: m.roll,
          written: m.written,
          mcq: m.mcq,
          practical: m.practical,
          total: m.total,
          grade: m.grade,
          status: m.status,
        }))
      );
    } else {
      setLocalMarks([]);
    }
  }, [marksData]);

  const handleSearch = () => {
    if (selectedExamId && selectedClassId && selectedSectionId && selectedSubjectId) {
      setActiveFilters({
        examId: selectedExamId,
        classId: selectedClassId,
        sectionId: selectedSectionId,
        subjectId: selectedSubjectId,
        sessionId: selectedSessionId || undefined,
      });
    } else {
      toast.error("Please select all filter parameters");
    }
  };

  const handleInputChange = (studentId: string, field: "written" | "mcq" | "practical", value: string) => {
    const numericValue = value === "" ? null : parseFloat(value);
    
    setLocalMarks((prev) =>
      prev.map((m) => {
        if (m.studentId === studentId) {
          const updated = { ...m, [field]: numericValue };
          const total = (updated.written || 0) + (updated.mcq || 0) + (updated.practical || 0);
          return { ...updated, total };
        }
        return m;
      })
    );
  };

  const handleSaveAll = async () => {
    if (localMarks.length === 0 || !activeFilters) return;

    try {
      toast.loading("Saving student scorecards...", { id: "save-marks" });
      const payload = {
        examId: activeFilters.examId,
        subjectId: activeFilters.subjectId,
        marks: localMarks.map((m) => ({
          studentId: m.studentId,
          written: m.written,
          mcq: m.mcq,
          practical: m.practical,
        })),
      };

      await saveExamMarks(payload);
      toast.success("Marks saved and grades computed successfully", { id: "save-marks" });
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save marks", { id: "save-marks" });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Mark Entry</Title>
          <p className="text-sm text-muted-foreground mt-1">Enter and manage student marks for examinations.</p>
        </div>
        {activeFilters && localMarks.length > 0 && (
          <Button onClick={handleSaveAll} size="sm" className="gap-2">
            <Save className="w-4 h-4" /> Save All Marks
          </Button>
        )}
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam Setup *</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                <option value="">Select Exam</option>
                {examsList.map((e: any) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
              >
                <option value="">Select Session</option>
                {sessionsList.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class *</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
              >
                <option value="">Select Class</option>
                {classesList.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section *</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
              >
                <option value="">Select Section</option>
                {sectionsList.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject *</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjectsList.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <Button onClick={handleSearch} size="sm" className="h-9 gap-2">
              <Search className="w-4 h-4" /> Load Students
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeFilters && (
        <Card className="shadow-sm border-primary/10">
          <CardHeader>
            <CardTitle className="text-base font-bold">Student Marks Roster</CardTitle>
            <CardDescription className="text-xs">Enter score metrics. Values auto-sum to resolve final letter grades.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Fetching class marks registry...</div>
            ) : localMarks.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No students matched the active filter combinations.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Roll</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Student Name</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-24">Written</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-24">MCQ</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-24">Practical</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Total</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Grade</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localMarks.map((s) => (
                      <tr key={s.studentId} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                        <td className="py-3 font-medium">{s.roll}</td>
                        <td className="py-3 font-semibold">{s.studentName}</td>
                        <td className="py-3">
                          <Input
                            type="number"
                            min="0"
                            value={s.written ?? ""}
                            placeholder="-"
                            onChange={(e) => handleInputChange(s.studentId, "written", e.target.value)}
                            className="h-8 w-20 text-sm text-center"
                          />
                        </td>
                        <td className="py-3">
                          <Input
                            type="number"
                            min="0"
                            value={s.mcq ?? ""}
                            placeholder="-"
                            onChange={(e) => handleInputChange(s.studentId, "mcq", e.target.value)}
                            className="h-8 w-20 text-sm text-center"
                          />
                        </td>
                        <td className="py-3">
                          <Input
                            type="number"
                            min="0"
                            value={s.practical ?? ""}
                            placeholder="-"
                            onChange={(e) => handleInputChange(s.studentId, "practical", e.target.value)}
                            className="h-8 w-20 text-sm text-center"
                          />
                        </td>
                        <td className="py-3 font-bold text-primary">{s.total ?? "-"}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center justify-center w-9 h-7 rounded-lg text-xs font-bold ${s.grade === 'F' ? 'bg-red-100 text-red-600' : s.grade === '-' ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'}`}>
                            {s.grade}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[s.status] || "bg-gray-100"}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!activeFilters && (
        <Card className="shadow-sm border-primary/10">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Filter className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold">Select Filters</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Choose exam setup, class, section, and subject above to load student scorecard metrics.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
