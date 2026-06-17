"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3X3, Download, Printer, Search, Eye, User2 } from "lucide-react";
import { toast } from "sonner";
import { useExamSeatPlansQuery, useExamsQuery } from "@/apis/queries/exam_queries";
import { generateSeatPlan } from "@/apis/mutations/exam_mutations";
import { useClassesQuery, useSectionsQuery, useSessionsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { exportSeatPlansPdfUrl } from "@/apis/endpoints/exam_apis";

export function SeatPlanPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // SWR query fetches generated seat plans
  const { data: seatPlansRes, isLoading, mutate } = useExamSeatPlansQuery(activeFilters);
  const seatPlans = seatPlansRes?.data || [];

  const handleSearch = () => {
    if (selectedExamId && selectedClassId && selectedSectionId) {
      setActiveFilters({
        examId: selectedExamId,
        classId: selectedClassId,
        sectionId: selectedSectionId,
      });
    } else {
      toast.error("Please select all required parameters");
    }
  };

  const handleGenerate = async () => {
    if (!selectedExamId || !selectedClassId || !selectedSectionId) {
      toast.error("Please select all required parameters to generate seat plan");
      return;
    }

    setIsGenerating(true);
    toast.loading("Generating seating configurations...", { id: "generate-seats" });

    try {
      const payload = {
        examId: selectedExamId,
        classId: selectedClassId,
        sectionId: selectedSectionId,
        seatPrefix: "S",
      };

      await generateSeatPlan(payload);
      toast.success("Seat plan generated successfully", { id: "generate-seats" });
      
      setActiveFilters(payload);
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate seat plans", { id: "generate-seats" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (seatPlans.length === 0) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const activeClass = classesList.find((c: any) => c.id === selectedClassId);
    const activeSection = sectionsList.find((s: any) => s.id === selectedSectionId);
    const activeExam = examsList.find((e: any) => e.id === selectedExamId);

    printWindow.document.write(`
      <html>
        <head>
          <title>Seat Plan - ${activeClass?.name || ""} ${activeSection?.name || ""}</title>
          <style>
            @page { margin: 15mm; }
            body { font-family: 'Segoe UI', sans-serif; padding: 0; margin: 0; color: #1a1a1a; }
            .header { background: #1e3a8a; color: white; padding: 16px 24px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 20px; letter-spacing: 1px; }
            .header p { margin: 4px 0 0; font-size: 12px; color: #93c5fd; }
            .info-bar { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 10px 20px; display: flex; justify-content: space-between; font-size: 12px; color: #334155; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; padding: 20px; }
            .seat-card { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
            .card-accent { height: 4px; }
            .card-body { padding: 14px; text-align: center; }
            .seat-badge { display: inline-block; background: #3b82f6; color: white; padding: 4px 14px; border-radius: 6px; font-size: 14px; font-weight: 700; margin-bottom: 8px; }
            .student-name { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
            .info-row { font-size: 11px; color: #475569; margin-bottom: 3px; }
            .info-muted { font-size: 10px; color: #94a3b8; }
            .footer { text-align: center; font-size: 10px; color: #94a3b8; padding: 12px; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EXAMINATION SEAT PLAN</h1>
            <p>${activeExam?.name || "Exam"} | Class: ${activeClass?.name} - Section ${activeSection?.name}</p>
          </div>
          <div class="info-bar">
            <span><strong>Exam:</strong> ${activeExam?.name || ""} (${activeExam?.type || ""})</span>
            <span><strong>Total Students:</strong> ${seatPlans.length}</span>
            <span><strong>Date:</strong> ${new Date().toLocaleDateString()}</span>
          </div>
          <div class="grid">
            ${seatPlans.map((s: any, i: number) => {
              const name = `${s.student?.firstName || ""} ${s.student?.lastName || ""}`.trim();
              const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
              const color = colors[i % colors.length];
              return `
                <div class="seat-card">
                  <div class="card-accent" style="background: ${color};"></div>
                  <div class="card-body">
                    <div class="seat-badge" style="background: ${color};">${s.seatNo}</div>
                    <div class="student-name">${name}</div>
                    <div class="info-row">Roll: ${s.student?.roll || ""} ${s.student?.gender ? "| " + s.student.gender : ""}</div>
                    <div class="info-muted">ID: ${s.student?.studentId || ""}</div>
                    ${s.roomName ? '<div class="info-muted">Room: ' + s.roomName + '</div>' : ''}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
          <div class="footer">ePathshala Education Management System</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    if (seatPlans.length === 0) return;

    const activeClass = classesList.find((c: any) => c.id === selectedClassId);
    const activeSection = sectionsList.find((s: any) => s.id === selectedSectionId);

    let csv = "Seat No,Student Name,Student ID,Roll,Gender,Class,Section,Room\n";
    seatPlans.forEach((s: any) => {
      const name = `${s.student?.firstName || ""} ${s.student?.lastName || ""}`.trim();
      csv += `${s.seatNo},"${name}",${s.student?.studentId || ""},${s.student?.roll || ""},${s.student?.gender || ""},${s.student?.class?.name || ""},${s.student?.section?.name || ""},${s.roomName || ""}\n`;
    });
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seat-plan-${activeClass?.name || "class"}-${activeSection?.name || "section"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV seat plan sheet downloaded successfully");
  };

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (seatPlans.length === 0) return;
    setIsDownloadingPdf(true);
    toast.loading("Generating PDF Seat Plan...", { id: "download-seatplan-pdf" });
    try {
      const activeClass = classesList.find((c: any) => c.id === selectedClassId);
      const activeSection = sectionsList.find((s: any) => s.id === selectedSectionId);

      const res = await AxiosAPI.get(exportSeatPlansPdfUrl, {
        params: {
          examId: selectedExamId,
          classId: selectedClassId,
          sectionId: selectedSectionId,
        },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Seat_Plan_${activeClass?.name || "Class"}_${activeSection?.name || "Section"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF Seat Plan downloaded successfully", { id: "download-seatplan-pdf" });
    } catch (err) {
      toast.error("Failed to download PDF Seat Plan", { id: "download-seatplan-pdf" });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Accent colors for card variety
  const accentColors = [
    "from-blue-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-teal-600",
    "from-emerald-500 to-green-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-red-600",
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <Title>Seat Plan</Title>
        <p className="text-sm text-muted-foreground mt-1">
          Select filters to generate and view seating arrangements.
        </p>
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
              <Button onClick={handleSearch} variant="outline" size="sm" className="h-9 gap-2 flex-1">
                <Search className="w-4 h-4" /> Load
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={!selectedExamId || !selectedClassId || !selectedSectionId || isGenerating}
                size="sm" 
                className="h-9 gap-2 flex-1 bg-primary text-white"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeFilters && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Seating Arrangements Registry
              </span>
              <span className="text-xs text-muted-foreground ml-2">({seatPlans.length} seats mapped)</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
                <Download className="w-4 h-4" /> Download CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadPdf} disabled={isDownloadingPdf}>
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                <Printer className="w-4 h-4" /> Print
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading seating cards...</div>
          ) : seatPlans.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No seat cards mapped yet. Click &quot;Generate&quot; to construct the seat plan.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {seatPlans.map((seat: any, i: number) => {
                const studentName = `${seat.student?.firstName || ""} ${seat.student?.lastName || ""}`.trim();
                const accent = accentColors[i % accentColors.length];
                const activeExam = examsList.find((e: any) => e.id === selectedExamId);
                return (
                  <Card
                    key={i}
                    className="shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden border-slate-200/80 hover:border-primary/30"
                  >
                    {/* Top gradient accent */}
                    <div className={`h-1.5 bg-gradient-to-r ${accent} group-hover:h-2 transition-all duration-300`} />
                    <CardContent className="p-4 space-y-3">
                      {/* Seat badge + Exam name */}
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                          <span className="text-sm font-bold">{seat.seatNo}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                            {activeExam?.name || "Exam"}
                          </span>
                        </div>
                      </div>

                      {/* Student name */}
                      <div>
                        <p className="text-sm font-bold text-slate-800 truncate">{studentName}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">ID: {seat.student?.studentId || "N/A"}</p>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">Roll:</span>
                          <span className="text-[11px] font-semibold text-slate-700">{seat.student?.roll || "-"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">Gender:</span>
                          <span className="text-[11px] font-semibold text-slate-700">{seat.student?.gender || "-"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">Class:</span>
                          <span className="text-[11px] font-semibold text-slate-700">{seat.student?.class?.name || "-"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">Section:</span>
                          <span className="text-[11px] font-semibold text-slate-700">{seat.student?.section?.name || "-"}</span>
                        </div>
                      </div>

                      {/* Shift / Session / Room */}
                      {(seat.student?.shift || seat.student?.session || seat.roomName) && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {seat.student?.shift && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                              {seat.student.shift.name}
                            </span>
                          )}
                          {seat.student?.session && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-medium">
                              {seat.student.session.name}
                            </span>
                          )}
                          {seat.roomName && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-medium">
                              Room: {seat.roomName}
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {!activeFilters && (
        <Card className="shadow-sm border-primary/10">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Grid3X3 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold">Generate Seat Plan</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Select a session, year, class and section above, then click &quot;Generate&quot; to view the seating arrangement.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
