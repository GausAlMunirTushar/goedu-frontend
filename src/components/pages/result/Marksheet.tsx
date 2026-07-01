"use client";

import React, { useMemo, useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, Printer, FileText, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExamsQuery, useExamMarksheetQuery } from "@/apis/queries/exam_queries";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { toast } from "sonner";

const resolveGrade = (percentage: number) => {
  if (percentage >= 80) return { grade: "A+", point: 5 };
  if (percentage >= 70) return { grade: "A", point: 4 };
  if (percentage >= 60) return { grade: "A-", point: 3.5 };
  if (percentage >= 50) return { grade: "B", point: 3 };
  if (percentage >= 40) return { grade: "C", point: 2 };
  if (percentage >= 33) return { grade: "D", point: 1 };
  return { grade: "F", point: 0 };
};

export function MarksheetPage() {
  const { data: examsData, isLoading: isLoadingExams } = useExamsQuery();
  const exams = examsData?.data || [];

  const [selectedExamId, setSelectedExamId] = useState("");
  const [studentInput, setStudentInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [searchParams, setSearchParams] = useState<{ examId: string; studentId: string } | undefined>();

  const { data: studentsRes } = useStudentProfilesQuery(
    activeSearch ? { search: activeSearch } : undefined
  );
  const students = studentsRes?.data || [];
  const matchedStudent = useMemo(() => {
    if (!activeSearch) return null;
    const search = activeSearch.toLowerCase();
    return students.find((student: any) => {
      const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim().toLowerCase();
      return (
        student.id === activeSearch ||
        student.studentId?.toLowerCase() === search ||
        student.roll?.toLowerCase() === search ||
        fullName.includes(search)
      );
    });
  }, [activeSearch, students]);

  const { data: marksheetData, isLoading: isLoadingMarksheet } = useExamMarksheetQuery(searchParams);
  const resultPayload = marksheetData?.data;
  const student = resultPayload?.student;
  const examResult = resultPayload?.result;
  const marks = resultPayload?.marks || [];

  const handleFindStudent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentInput.trim()) {
      toast.error("Please enter a Student ID, roll, or name");
      return;
    }
    setActiveSearch(studentInput.trim());
    setSearchParams(undefined);
  };

  const handleViewMarksheet = () => {
    if (!selectedExamId) {
      toast.error("Please select an exam");
      return;
    }
    if (!matchedStudent) {
      toast.error("Please verify a student first");
      return;
    }
    setSearchParams({ examId: selectedExamId, studentId: matchedStudent.id });
  };

  const showResult = !!resultPayload;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Marksheet</Title>
          <p className="text-sm text-muted-foreground mt-1">Generate and view individual student marksheets.</p>
        </div>
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam Name</label>
              <Select value={selectedExamId} onValueChange={setSelectedExamId} disabled={isLoadingExams}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={isLoadingExams ? "Loading..." : "Select Exam"} /></SelectTrigger>
                <SelectContent>
                  {exams.map((exam: any) => (
                    <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <form onSubmit={handleFindStudent} className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student ID / Roll / Name</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Student ID or roll"
                  className="h-9 text-sm"
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                />
                <Button type="submit" variant="outline" size="sm" className="h-9 gap-2">
                  <Search className="w-4 h-4" /> Verify
                </Button>
              </div>
            </form>
            <Button onClick={handleViewMarksheet} size="sm" className="h-9 gap-2">
              <FileText className="w-4 h-4" /> View Marksheet
            </Button>
          </div>
          {matchedStudent ? (
            <div className="mt-4 rounded-lg border border-primary/10 bg-primary/5 p-3 text-xs">
              <span className="font-bold text-primary">Verified:</span> {matchedStudent.firstName} {matchedStudent.lastName} ({matchedStudent.studentId || matchedStudent.roll})
            </div>
          ) : activeSearch ? (
            <p className="mt-4 text-xs text-amber-600">No student found for "{activeSearch}".</p>
          ) : null}
        </CardContent>
      </Card>

      {isLoadingMarksheet && (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading marksheet...</div>
      )}

      {showResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>

          <Card className="shadow-lg border-primary/20 overflow-hidden bg-white print:shadow-none print:border-0">
            <div className="bg-primary p-6 text-white text-center">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Academic Transcript</h2>
              <p className="text-sm opacity-90 mt-1">{resultPayload?.exam?.name || "Exam Marksheet"}</p>
            </div>

            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b pb-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{student?.firstName} {student?.lastName}</h3>
                      <p className="text-sm text-muted-foreground">Student ID: {student?.studentId || student?.roll}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Class:</span> <span className="font-semibold">{student?.class?.name || "-"}</span></div>
                    <div><span className="text-muted-foreground">Section:</span> <span className="font-semibold">{student?.section?.name || "-"}</span></div>
                    <div><span className="text-muted-foreground">Roll No:</span> <span className="font-semibold">{student?.roll || "-"}</span></div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="font-semibold">{examResult?.status || "-"}</span></div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-primary/5 rounded-2xl p-6 border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Grade Point Average</p>
                  <p className="text-5xl font-black text-primary">{Number(examResult?.gpa || 0).toFixed(2)}</p>
                  <p className="text-sm font-bold mt-2">GRADE: {examResult?.grade || "-"}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-y">
                      <th className="py-3 px-4 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">Subject Name</th>
                      <th className="py-3 px-4 text-center font-bold text-gray-700 uppercase tracking-wider text-xs">Full Marks</th>
                      <th className="py-3 px-4 text-center font-bold text-gray-700 uppercase tracking-wider text-xs">Obtained</th>
                      <th className="py-3 px-4 text-center font-bold text-gray-700 uppercase tracking-wider text-xs">Grade Point</th>
                      <th className="py-3 px-4 text-center font-bold text-gray-700 uppercase tracking-wider text-xs">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((item: any) => {
                      const fullMarks = Number(item.maxMarks || resultPayload?.exam?.totalMarks || 100);
                      const obtained = Number(item.total || 0);
                      const resolved = resolveGrade(fullMarks > 0 ? (obtained / fullMarks) * 100 : 0);
                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-medium">{item?.subject?.name || "Unknown Subject"}</td>
                          <td className="py-3.5 px-4 text-center">{fullMarks}</td>
                          <td className="py-3.5 px-4 text-center font-bold">{obtained}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-primary">{resolved.point.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-7 rounded-lg text-xs font-bold ${resolved.grade === "F" ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"}`}>
                              {resolved.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-primary/5 font-bold">
                      <td className="py-4 px-4">Total</td>
                      <td className="py-4 px-4 text-center">{examResult?.totalMarks || marks.length * 100}</td>
                      <td className="py-4 px-4 text-center">{examResult?.obtainedMarks || 0}</td>
                      <td className="py-4 px-4 text-center text-primary">{Number(examResult?.gpa || 0).toFixed(2)} (GPA)</td>
                      <td className="py-4 px-4 text-center">{examResult?.grade || "-"}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!showResult && !isLoadingMarksheet && (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
          <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No Marksheet to Preview</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Select an exam and verify a student to generate the academic transcript preview.
          </p>
        </div>
      )}
    </div>
  );
}
