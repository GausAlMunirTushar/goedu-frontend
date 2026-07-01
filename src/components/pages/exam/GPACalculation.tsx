"use client";

import React, { useMemo, useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Search, Download, User, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useExamMarksheetQuery, useExamsQuery } from "@/apis/queries/exam_queries";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";

const resolveGrade = (percentage: number) => {
  if (percentage >= 80) return { grade: "A+", point: 5 };
  if (percentage >= 70) return { grade: "A", point: 4 };
  if (percentage >= 60) return { grade: "A-", point: 3.5 };
  if (percentage >= 50) return { grade: "B", point: 3 };
  if (percentage >= 40) return { grade: "C", point: 2 };
  if (percentage >= 33) return { grade: "D", point: 1 };
  return { grade: "F", point: 0 };
};

export function GPACalculationPage() {
  const [studentSearch, setStudentSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [activeLookup, setActiveLookup] = useState<{ examId: string; studentId: string } | null>(null);

  const { data: examsRes } = useExamsQuery();
  const examsList = examsRes?.data || [];

  const { data: studentsRes } = useStudentProfilesQuery(
    activeSearch ? { search: activeSearch } : undefined
  );
  const students = studentsRes?.data || [];

  const matchedStudent = useMemo(() => {
    if (!activeSearch) return null;
    return students.find((student: any) => {
      const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim().toLowerCase();
      const search = activeSearch.toLowerCase();
      return (
        student.id === activeSearch ||
        student.studentId?.toLowerCase() === search ||
        student.roll?.toLowerCase() === search ||
        fullName.includes(search)
      );
    });
  }, [activeSearch, students]);

  const { data: marksheetRes, isLoading } = useExamMarksheetQuery(activeLookup || undefined);
  const marksheet = marksheetRes?.data;
  const marks = marksheet?.marks || [];
  const result = marksheet?.result;

  const subjectRows = marks.map((mark: any) => {
    const total = Number(mark.total || 0);
    const maxMarks = Number(mark.maxMarks || marksheet?.exam?.totalMarks || 100);
    const percentage = maxMarks > 0 ? (total / maxMarks) * 100 : 0;
    const resolved = resolveGrade(percentage);

    return {
      id: mark.id,
      subject: mark.subject?.name || "Subject",
      obtainedMarks: total,
      totalMarks: maxMarks,
      grade: resolved.grade,
      gradePoint: resolved.point,
    };
  });

  const totalPoints = subjectRows.reduce((acc: number, curr: any) => acc + curr.gradePoint, 0);
  const averageGpa = subjectRows.length > 0 ? totalPoints / subjectRows.length : 0;
  const displayGpa = Number(result?.gpa ?? averageGpa);
  const displayGrade = result?.grade || resolveGrade(displayGpa * 20).grade;
  const displayStatus = result?.status || (subjectRows.some((item: any) => item.grade === "F") ? "Fail" : "Pass");

  const handleSearchStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSearch.trim()) {
      toast.error("Please enter a Student ID, roll, or name");
      return;
    }
    setActiveSearch(studentSearch.trim());
    setActiveLookup(null);
  };

  const handleCalculate = () => {
    if (!selectedExamId) {
      toast.error("Please select an exam");
      return;
    }
    if (!matchedStudent) {
      toast.error("Please verify a student first");
      return;
    }
    setActiveLookup({ examId: selectedExamId, studentId: matchedStudent.id });
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>GPA Calculation</Title>
          <p className="text-sm text-muted-foreground mt-1">
            Individual student GPA breakdown from processed exam marks.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Exam
              </label>
              <select
                className="w-full bg-white border border-gray-200 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                <option value="">Select Exam</option>
                {examsList.map((exam: any) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSearchStudent} className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Student ID / Roll / Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter Student ID or roll"
                  className="pl-9 pr-10 h-10 text-sm"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  aria-label="Search student"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <Button onClick={handleCalculate} size="sm" className="h-10 px-6 gap-2">
              <Calculator className="w-4 h-4" /> Calculate GPA
            </Button>
          </div>

          {matchedStudent ? (
            <div className="mt-4 rounded-lg border border-primary/10 bg-primary/5 p-3 text-xs">
              <span className="font-bold text-primary">Verified:</span>{" "}
              {matchedStudent.firstName} {matchedStudent.lastName} ({matchedStudent.studentId || matchedStudent.roll})
            </div>
          ) : activeSearch ? (
            <p className="mt-4 text-xs text-amber-600">No student found for "{activeSearch}".</p>
          ) : null}
        </CardContent>
      </Card>

      {activeLookup && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-bold">Subject Wise Breakdown</CardTitle>
                  <CardDescription className="text-xs">
                    Detailed marks and points for {marksheet?.student?.firstName || matchedStudent?.firstName}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Download className="w-3.5 h-3.5" /> Marksheet
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    Fetching marksheet...
                  </div>
                ) : subjectRows.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No subject marks found for this exam and student. Process results first if marks are already entered.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Subject</th>
                          <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Marks</th>
                          <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Grade</th>
                          <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Point</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjectRows.map((item: any) => (
                          <tr key={item.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                            <td className="py-3.5">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                                <span className="font-medium">{item.subject}</span>
                              </div>
                            </td>
                            <td className="py-3.5 text-center font-semibold">
                              {item.obtainedMarks}/{item.totalMarks}
                            </td>
                            <td className="py-3.5 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-7 rounded-lg text-xs font-bold ${item.grade === "F" ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"}`}>
                                {item.grade}
                              </span>
                            </td>
                            <td className="py-3.5 text-center font-bold text-primary">{item.gradePoint.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm border-primary/10 bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-widest mb-2">Final GPA</p>
                  <h2 className="text-6xl font-black mb-1">{displayGpa.toFixed(2)}</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mt-2">
                    GRADE: {displayGrade}
                  </div>
                </div>
                <div className="bg-black/10 p-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-[10px] text-primary-foreground/60 uppercase">Total Marks</p>
                    <p className="font-bold">
                      {result ? `${result.obtainedMarks}/${result.totalMarks}` : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-primary-foreground/60 uppercase">Position</p>
                    <p className="font-bold">{result?.position || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Calculation Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Subjects:</span>
                  <span className="font-semibold">{subjectRows.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Points:</span>
                  <span className="font-semibold">{totalPoints.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-semibold ${displayStatus === "Pass" ? "text-emerald-600" : "text-red-600"}`}>
                    {displayStatus.toUpperCase()}
                  </span>
                </div>
                <div className="pt-2 border-t text-[10px] text-muted-foreground italic leading-relaxed">
                  * Position is calculated from processed class/section results for the selected exam.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!activeLookup && (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Calculator className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No Result to Display</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Select an exam and verify a student to see the detailed GPA breakdown.
          </p>
        </div>
      )}
    </div>
  );
}
