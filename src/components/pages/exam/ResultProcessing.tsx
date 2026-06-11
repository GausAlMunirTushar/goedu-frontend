"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, Search, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useExamResultsQuery, useExamsQuery } from "@/apis/queries/exam_queries";
import { processExamResults } from "@/apis/mutations/exam_mutations";
import { useClassesQuery, useSectionsQuery, useSessionsQuery } from "@/apis/queries/academic_queries";

export function ResultProcessingPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load selection lists
  const { data: sessionsRes } = useSessionsQuery();
  const sessionsList = sessionsRes?.data || [];

  const { data: classesRes } = useClassesQuery();
  const classesList = classesRes?.data || [];

  const { data: sectionsRes } = useSectionsQuery(selectedClassId);
  const sectionsList = sectionsRes?.data || [];

  const { data: examsRes } = useExamsQuery();
  const examsList = examsRes?.data || [];

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSectionId("");
  };

  // SWR query fetches computed results
  const { data: resultsRes, isLoading, mutate } = useExamResultsQuery(activeFilters);
  const resultsData = resultsRes?.data || [];

  const handleProcess = async () => {
    if (!selectedExamId || !selectedClassId || !selectedSectionId) {
      toast.error("Please select all required parameters");
      return;
    }

    setIsProcessing(true);
    toast.loading("Compiling subject marks, GPA, and ranks...", { id: "process-results" });

    try {
      const payload = {
        examId: selectedExamId,
        classId: selectedClassId,
        sectionId: selectedSectionId,
      };

      await processExamResults(payload);
      toast.success("Results processed and ranked successfully", { id: "process-results" });
      
      setActiveFilters(payload);
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process results", { id: "process-results" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = () => {
    if (selectedExamId && selectedClassId && selectedSectionId) {
      setActiveFilters({
        examId: selectedExamId,
        classId: selectedClassId,
        sectionId: selectedSectionId,
      });
    } else {
      toast.error("Please select all required parameters to search");
    }
  };

  const handleExport = () => {
    if (resultsData.length === 0) return;
    
    let csv = "Rank,Roll,Student Name,GPA,Grade,Obtained Marks,Total Marks,Percentage,Status\n";
    resultsData.forEach((r: any) => {
      const studentName = `${r.student?.firstName || ""} ${r.student?.lastName || ""}`.trim();
      csv += `${r.position},${r.student?.roll || ""},"${studentName}",${Number(r.gpa).toFixed(2)},${r.grade},${r.obtainedMarks},${r.totalMarks},${r.percentage}%,${r.status}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Results_Class_${selectedClassId}_Sec_${selectedSectionId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Result spreadsheet sheet downloaded successfully");
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Result Processing</Title>
          <p className="text-sm text-muted-foreground mt-1">Calculate and publish student performance results.</p>
        </div>
        {activeFilters && resultsData.length > 0 && (
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export Result Sheet
          </Button>
        )}
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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

            <div className="flex gap-2">
              <Button 
                onClick={handleSearch} 
                disabled={!selectedExamId || !selectedClassId || !selectedSectionId}
                variant="outline"
                size="sm" 
                className="h-9 gap-2 flex-1"
              >
                <Search className="w-4 h-4" /> Load
              </Button>
              <Button 
                onClick={handleProcess} 
                disabled={!selectedExamId || !selectedClassId || !selectedSectionId || isProcessing}
                size="sm" 
                className="h-9 gap-2 flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {isProcessing ? "Processing..." : "Process"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeFilters && (
        <Card className="shadow-sm border-primary/10">
          <CardHeader>
            <CardTitle className="text-base font-bold">Processed Results</CardTitle>
            <CardDescription className="text-xs">Class standings and compiled marks averages.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Fetching results registry...</div>
            ) : resultsData.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No processed results found. Click "Process" to compile scores.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Rank</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Roll</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Student Name</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">GPA</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Grade</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Marks</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsData.map((res: any) => (
                      <tr key={res.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                        <td className="py-3">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${res.position <= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                            {res.position}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground">{res.student?.roll}</td>
                        <td className="py-3 font-semibold">{res.student?.firstName} {res.student?.lastName}</td>
                        <td className="py-3 font-bold text-primary">{Number(res.gpa).toFixed(2)}</td>
                        <td className="py-3 font-bold">{res.grade}</td>
                        <td className="py-3">
                          <div className="text-xs">
                            <span className="font-semibold text-foreground">{res.obtainedMarks}</span>
                            <span className="text-muted-foreground">/{res.totalMarks}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{res.percentage}%</div>
                        </td>
                        <td className="py-3">
                          {res.status === "Pass" ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-red-600 font-medium text-xs">
                              <XCircle className="w-3.5 h-3.5" /> Fail
                            </div>
                          )}
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

      {!activeFilters && !isProcessing && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl bg-muted/30">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <Play className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold">Ready to Process</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center">
            Select the session, class, and section parameters above to begin the result calculation process for students.
          </p>
        </div>
      )}
    </div>
  );
}
