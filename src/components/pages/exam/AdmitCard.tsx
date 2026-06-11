"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IdCard, Download, Printer, Search, Eye, User2, Calendar, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useExamsQuery, useExamSchedulesQuery } from "@/apis/queries/exam_queries";
import { useClassesQuery, useSectionsQuery, useSessionsQuery } from "@/apis/queries/academic_queries";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { AxiosAPI } from "@/apis/configs";
import { exportAdmitCardsPdfUrl } from "@/apis/endpoints/exam_apis";

export function AdmitCardPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const [activeFilters, setActiveFilters] = useState<any>(null);

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

  // SWR queries for students and schedules
  const { data: studentsRes, isLoading: loadingStudents } = useStudentProfilesQuery(
    activeFilters ? {
      classId: activeFilters.classId,
      sectionId: activeFilters.sectionId,
      sessionId: activeFilters.sessionId || undefined,
      status: "Active"
    } : undefined
  );
  const students = studentsRes?.data || [];

  const { data: schedulesRes, isLoading: loadingSchedules } = useExamSchedulesQuery(
    activeFilters ? {
      examId: activeFilters.examId,
      classId: activeFilters.classId,
      sectionId: activeFilters.sectionId,
    } : undefined
  );
  const schedules = schedulesRes?.data || [];

  const handleSearch = () => {
    if (selectedExamId && selectedClassId && selectedSectionId) {
      setActiveFilters({
        examId: selectedExamId,
        classId: selectedClassId,
        sectionId: selectedSectionId,
        sessionId: selectedSessionId || undefined,
      });
    } else {
      toast.error("Please select all required parameters");
    }
  };

  const activeExam = examsList.find((e: any) => e.id === selectedExamId);
  const activeClass = classesList.find((c: any) => c.id === selectedClassId);
  const activeSection = sectionsList.find((s: any) => s.id === selectedSectionId);

  const getAdmitCardHTML = (student: any) => {
    const studentName = `${student.firstName} ${student.lastName}`;
    const examName = activeExam ? activeExam.name : "Exam";
    const examYear = activeExam?.academicYear?.title || "";
    
    return `
      <div class="card" style="border: 2px solid #3b82f6; border-radius: 12px; max-width: 600px; margin: 24px auto; overflow: hidden; page-break-after: always; font-family: 'Segoe UI', sans-serif;">
        <div class="card-header" style="background: #3b82f6; color: white; padding: 14px 24px; text-align: center;">
          <h2 style="font-size: 16px; margin-bottom: 2px;">ePathshala</h2>
          <p style="font-size: 11px; opacity: 0.9;">${examName} ${examYear ? `— ${examYear}` : ""}</p>
        </div>
        <div class="card-body" style="padding: 20px;">
          <h3 style="font-size:14px; margin-bottom:10px; font-weight: bold; color: #1e3a8a;">ADMIT CARD</h3>
          <div class="info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
            <div class="info-item"><label style="font-size: 9px; text-transform: uppercase; color: #888; font-weight: 600;">Student Name</label><p style="font-size: 13px; font-weight: 600; margin-top: 1px;">${studentName}</p></div>
            <div class="info-item"><label style="font-size: 9px; text-transform: uppercase; color: #888; font-weight: 600;">Roll No</label><p style="font-size: 13px; font-weight: 600; margin-top: 1px;">${student.roll}</p></div>
            <div class="info-item"><label style="font-size: 9px; text-transform: uppercase; color: #888; font-weight: 600;">Student ID</label><p style="font-size: 13px; font-weight: 600; margin-top: 1px; color:#3b82f6;">${student.studentId}</p></div>
            <div class="info-item"><label style="font-size: 9px; text-transform: uppercase; color: #888; font-weight: 600;">Class &amp; Section</label><p style="font-size: 13px; font-weight: 600; margin-top: 1px;">${activeClass?.name} - ${activeSection?.name}</p></div>
            <div class="info-item"><label style="font-size: 9px; text-transform: uppercase; color: #888; font-weight: 600;">Gender</label><p style="font-size: 13px; font-weight: 600; margin-top: 1px;">${student.gender || "-"}</p></div>
            <div class="info-item"><label style="font-size: 9px; text-transform: uppercase; color: #888; font-weight: 600;">Blood Group</label><p style="font-size: 13px; font-weight: 600; margin-top: 1px;">${student.bloodGroup || "-"}</p></div>
          </div>
          <h4 style="font-size:12px; font-weight:600; margin-bottom:6px; color: #1e3a8a;">Exam Schedule</h4>
          <table class="subjects-table" style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <thead>
              <tr style="background: #3b82f6; color: white;">
                <th style="padding: 6px 10px; font-size: 10px; text-transform: uppercase; text-align: left;">Subject</th>
                <th style="padding: 6px 10px; font-size: 10px; text-transform: uppercase; text-align: left;">Date</th>
                <th style="padding: 6px 10px; font-size: 10px; text-transform: uppercase; text-align: left;">Time</th>
              </tr>
            </thead>
            <tbody>
              ${schedules.length === 0 ? `<tr><td colspan="3" style="padding: 10px; text-align: center; color: #888;">No exam schedule mapped yet.</td></tr>` : schedules.map((s: any) => `
                <tr>
                  <td style="padding: 6px 10px; font-size: 12px; border-bottom: 1px solid #eee;">${s.subject?.name}</td>
                  <td style="padding: 6px 10px; font-size: 12px; border-bottom: 1px solid #eee;">${new Date(s.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                  <td style="padding: 6px 10px; font-size: 12px; border-bottom: 1px solid #eee;">${s.startTime} - ${s.endTime}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer" style="margin-top: 24px; display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px dashed #ccc;">
            <div class="sign" style="text-align: center;"><div class="line" style="width: 120px; border-top: 1px solid #333; margin-bottom: 4px;"></div><p style="font-size: 10px; color: #666;">Student Signature</p></div>
            <div class="sign" style="text-align: center;"><div class="line" style="width: 120px; border-top: 1px solid #333; margin-bottom: 4px;"></div><p style="font-size: 10px; color: #666;">Principal Signature</p></div>
          </div>
        </div>
      </div>
    `;
  };

  const handlePrintCard = (student: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Admit Card - ${student.firstName} ${student.lastName}</title>
        </head>
        <body style="padding: 24px;">
          ${getAdmitCardHTML(student)}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintAll = () => {
    if (students.length === 0) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Admit Cards - All</title>
        </head>
        <body style="padding: 24px;">
          ${students.map((s: any) => getAdmitCardHTML(s)).join("")}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (students.length === 0) return;
    setIsDownloadingPdf(true);
    toast.loading("Generating PDF Admit Cards...", { id: "download-pdf" });
    try {
      const res = await AxiosAPI.get(exportAdmitCardsPdfUrl, {
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
      a.download = `Admit_Cards_${activeClass?.name || "Class"}_${activeSection?.name || "Section"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF Admit Cards downloaded successfully", { id: "download-pdf" });
    } catch (err) {
      toast.error("Failed to download PDF Admit Cards", { id: "download-pdf" });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadSinglePdf = async (student: any) => {
    toast.loading(`Generating PDF Admit Card for ${student.firstName}...`, { id: "download-single-pdf" });
    try {
      const res = await AxiosAPI.get(exportAdmitCardsPdfUrl, {
        params: {
          examId: selectedExamId,
          classId: selectedClassId,
          sectionId: selectedSectionId,
          studentId: student.id,
        },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Admit_Card_${student.firstName}_${student.lastName}_Roll_${student.roll}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF Admit Card downloaded successfully", { id: "download-single-pdf" });
    } catch (err) {
      toast.error("Failed to download PDF Admit Card", { id: "download-single-pdf" });
    }
  };

  const handleDownload = () => {
    if (students.length === 0) return;
    let csv = "Student Name,Roll,Student ID,Class,Section,Gender,Blood Group\n";
    students.forEach((c: any) => {
      const name = `${c.firstName} ${c.lastName}`;
      csv += `"${name}",${c.roll},${c.studentId},${activeClass?.name},${activeSection?.name},${c.gender || "-"},${c.bloodGroup || "-"}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admit-cards-class-${selectedClassId}-sec-${selectedSectionId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV admit cards downloaded successfully");
  };

  const isLoadingData = loadingStudents || loadingSchedules;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <Title>Admit Card</Title>
        <p className="text-sm text-muted-foreground mt-1">
          Select filters to generate and preview admit cards for students.
        </p>
      </div>

      {/* Filters */}
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

            <Button onClick={handleSearch} size="sm" className="h-9 gap-2">
              <Search className="w-4 h-4" /> Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {activeFilters && (
        <>
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Admit Cards Preview
              </span>
              <span className="text-xs text-muted-foreground ml-2">({students.length} cards matched)</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
                <Download className="w-4 h-4" /> Download CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadPdf} disabled={isDownloadingPdf}>
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handlePrintAll}>
                <Printer className="w-4 h-4" /> Print All
              </Button>
            </div>
          </div>

          {/* Admit Cards List */}
          {isLoadingData ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading preview cards...</div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No student profiles found for this configuration.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {students.map((student: any) => {
                const name = `${student.firstName} ${student.lastName}`;
                return (
                  <Card key={student.id} className="shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-primary/10">
                    <div className="bg-primary text-primary-foreground px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">ePathshala</p>
                        <p className="text-[11px] opacity-85">{activeExam?.name} {activeExam?.academicYear?.title ? `— ${activeExam.academicYear.title}` : ""}</p>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80 bg-white/15 px-2.5 py-1 rounded-full">
                        Admit Card
                      </span>
                    </div>

                    <CardContent className="p-5 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-[72px] h-[88px] rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center flex-shrink-0 bg-primary/5">
                          <User2 className="w-7 h-7 text-primary/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1 min-w-0">
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Name</p>
                            <p className="text-sm font-bold truncate">{name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Roll</p>
                            <p className="text-sm font-bold">{student.roll}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Student ID</p>
                            <p className="text-sm font-semibold text-primary">{student.studentId}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Class & Section</p>
                            <p className="text-sm font-bold">{activeClass?.name} — {activeSection?.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Gender</p>
                            <p className="text-sm font-medium">{student.gender || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Blood Group</p>
                            <p className="text-sm font-medium">{student.bloodGroup || "-"}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-primary" /> Exam Schedule
                        </p>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-primary/5">
                                <th className="text-left py-2 px-3 font-semibold text-primary uppercase tracking-wider text-[10px]">Subject</th>
                                <th className="text-left py-2 px-3 font-semibold text-primary uppercase tracking-wider text-[10px]">Date</th>
                                <th className="text-left py-2 px-3 font-semibold text-primary uppercase tracking-wider text-[10px]">Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {schedules.length === 0 ? (
                                <tr>
                                  <td colSpan={3} className="py-3 text-center text-muted-foreground">No schedules mapped yet.</td>
                                </tr>
                              ) : schedules.map((sub: any, idx: number) => (
                                <tr key={idx} className="border-t border-primary/5">
                                  <td className="py-1.5 px-3 font-medium">{sub.subject?.name}</td>
                                  <td className="py-1.5 px-3 text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {new Date(sub.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                  </td>
                                  <td className="py-1.5 px-3 text-muted-foreground">{sub.startTime} - {sub.endTime}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => handleDownloadSinglePdf(student)}>
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => handlePrintCard(student)}>
                          <Printer className="w-3.5 h-3.5" /> Print
                        </Button>
                      </div>
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
                <IdCard className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold">Generate Admit Cards</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Select exam, session, class and section above, then click &quot;Generate&quot; to preview and print admit cards.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
