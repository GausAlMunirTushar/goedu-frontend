"use client";

import React, { useState, useRef } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IdCard, Download, Printer, Search, Eye, User2, Calendar, BookOpen } from "lucide-react";
import { admitCardData, examSessions, examYears, examClasses, examSections, type AdmitCardEntry } from "@/data/exam";

export function AdmitCardPage() {
  const [session, setSession] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (session && year && selectedClass && section) {
      setShowResults(true);
    }
  };

  const handlePrintCard = (card: AdmitCardEntry) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Admit Card - ${card.studentName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', sans-serif; padding: 32px; color: #1a1a1a; }
            .card { border: 2px solid hsl(var(--primary, 221 83% 53%)); border-radius: 12px; max-width: 600px; margin: 0 auto; overflow: hidden; }
            .card-header { background: hsl(var(--primary, 221 83% 53%)); color: white; padding: 16px 24px; text-align: center; }
            .card-header h2 { font-size: 18px; margin-bottom: 4px; }
            .card-header p { font-size: 12px; opacity: 0.9; }
            .card-body { padding: 24px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
            .info-item label { font-size: 10px; text-transform: uppercase; color: #888; font-weight: 600; letter-spacing: 0.5px; }
            .info-item p { font-size: 14px; font-weight: 600; margin-top: 2px; }
            .subjects-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .subjects-table th { background: hsl(var(--primary, 221 83% 53%)); color: white; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
            .subjects-table td { padding: 8px 12px; font-size: 13px; border-bottom: 1px solid #eee; }
            .subjects-table tr:last-child td { border-bottom: none; }
            .footer { margin-top: 32px; display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px dashed #ccc; }
            .footer .sign { text-align: center; }
            .footer .sign .line { width: 140px; border-top: 1px solid #333; margin-bottom: 4px; }
            .footer .sign p { font-size: 11px; color: #666; }
            .photo-box { width: 80px; height: 100px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #aaa; border-radius: 6px; }
            .top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="card-header">
              <h2>ePathshala</h2>
              <p>${card.examName} - ${card.examYear}</p>
            </div>
            <div class="card-body">
              <div class="top-row">
                <div style="flex:1">
                  <h3 style="font-size:16px; margin-bottom:12px;">ADMIT CARD</h3>
                  <div class="info-grid">
                    <div class="info-item"><label>Student Name</label><p>${card.studentName}</p></div>
                    <div class="info-item"><label>Roll No</label><p>${card.roll}</p></div>
                    <div class="info-item"><label>Registration No</label><p>${card.registrationNo}</p></div>
                    <div class="info-item"><label>Class &amp; Section</label><p>${card.className} - ${card.section}</p></div>
                    <div class="info-item"><label>Father's Name</label><p>${card.fatherName}</p></div>
                    <div class="info-item"><label>Mother's Name</label><p>${card.motherName}</p></div>
                    <div class="info-item"><label>Session</label><p>${card.session}</p></div>
                    <div class="info-item"><label>Date of Birth</label><p>${card.dob}</p></div>
                  </div>
                </div>
                <div class="photo-box">Photo</div>
              </div>
              <h4 style="font-size:13px; font-weight:600; margin-bottom:8px;">Exam Schedule</h4>
              <table class="subjects-table">
                <thead><tr><th>Subject</th><th>Date</th><th>Time</th></tr></thead>
                <tbody>
                  ${card.subjects.map(s => `<tr><td>${s.name}</td><td>${s.date}</td><td>${s.time}</td></tr>`).join("")}
                </tbody>
              </table>
              <div class="footer">
                <div class="sign"><div class="line"></div><p>Student Signature</p></div>
                <div class="sign"><div class="line"></div><p>Principal Signature</p></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintAll = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Admit Cards - All</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', sans-serif; color: #1a1a1a; }
            .card { border: 2px solid #3b82f6; border-radius: 12px; max-width: 600px; margin: 24px auto; overflow: hidden; page-break-after: always; }
            .card:last-child { page-break-after: auto; }
            .card-header { background: #3b82f6; color: white; padding: 14px 24px; text-align: center; }
            .card-header h2 { font-size: 16px; margin-bottom: 2px; }
            .card-header p { font-size: 11px; opacity: 0.9; }
            .card-body { padding: 20px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
            .info-item label { font-size: 9px; text-transform: uppercase; color: #888; font-weight: 600; }
            .info-item p { font-size: 13px; font-weight: 600; margin-top: 1px; }
            .subjects-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            .subjects-table th { background: #3b82f6; color: white; padding: 6px 10px; font-size: 10px; text-transform: uppercase; text-align: left; }
            .subjects-table td { padding: 6px 10px; font-size: 12px; border-bottom: 1px solid #eee; }
            .footer { margin-top: 24px; display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px dashed #ccc; }
            .footer .sign { text-align: center; }
            .footer .sign .line { width: 120px; border-top: 1px solid #333; margin-bottom: 4px; }
            .footer .sign p { font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          ${admitCardData.map(card => `
            <div class="card">
              <div class="card-header">
                <h2>ePathshala</h2>
                <p>${card.examName} - ${card.examYear}</p>
              </div>
              <div class="card-body">
                <h3 style="font-size:14px; margin-bottom:10px;">ADMIT CARD</h3>
                <div class="info-grid">
                  <div class="info-item"><label>Student Name</label><p>${card.studentName}</p></div>
                  <div class="info-item"><label>Roll No</label><p>${card.roll}</p></div>
                  <div class="info-item"><label>Registration No</label><p>${card.registrationNo}</p></div>
                  <div class="info-item"><label>Class &amp; Section</label><p>${card.className} - ${card.section}</p></div>
                  <div class="info-item"><label>Father's Name</label><p>${card.fatherName}</p></div>
                  <div class="info-item"><label>Mother's Name</label><p>${card.motherName}</p></div>
                  <div class="info-item"><label>Session</label><p>${card.session}</p></div>
                  <div class="info-item"><label>Date of Birth</label><p>${card.dob}</p></div>
                </div>
                <h4 style="font-size:12px; font-weight:600; margin-bottom:6px;">Exam Schedule</h4>
                <table class="subjects-table">
                  <thead><tr><th>Subject</th><th>Date</th><th>Time</th></tr></thead>
                  <tbody>${card.subjects.map(s => `<tr><td>${s.name}</td><td>${s.date}</td><td>${s.time}</td></tr>`).join("")}</tbody>
                </table>
                <div class="footer">
                  <div class="sign"><div class="line"></div><p>Student Signature</p></div>
                  <div class="sign"><div class="line"></div><p>Principal Signature</p></div>
                </div>
              </div>
            </div>
          `).join("")}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    let csv = "Student Name,Roll,Registration No,Class,Section,Father,Mother,DOB,Session,Exam\n";
    admitCardData.forEach((c) => {
      csv += `${c.studentName},${c.roll},${c.registrationNo},${c.className},${c.section},${c.fatherName},${c.motherName},${c.dob},${c.session},${c.examName}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admit-cards-${selectedClass}-${section}-${session}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session</label>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  {examSessions.map((s) => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Year</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {examYears.map((y) => (
                    <SelectItem key={y.id} value={y.year}>{y.year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {examClasses.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section</label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {examSections.map((s) => (
                    <SelectItem key={s.id} value={s.shortName}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} size="sm" className="h-9 gap-2">
              <Search className="w-4 h-4" /> Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults ? (
        <>
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {selectedClass} — Section {section} | Session {session}
              </span>
              <span className="text-xs text-muted-foreground ml-2">({admitCardData.length} cards)</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
                <Download className="w-4 h-4" /> Download CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handlePrintAll}>
                <Printer className="w-4 h-4" /> Print All
              </Button>
            </div>
          </div>

          {/* Admit Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {admitCardData.map((card) => (
              <Card key={card.id} className="shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-primary/10">
                {/* Card Header */}
                <div className="bg-primary text-primary-foreground px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">ePathshala</p>
                    <p className="text-[11px] opacity-85">{card.examName} — {card.examYear}</p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80 bg-white/15 px-2.5 py-1 rounded-full">
                    Admit Card
                  </span>
                </div>

                <CardContent className="p-5 space-y-4">
                  {/* Student Info */}
                  <div className="flex gap-4">
                    {/* Photo Placeholder */}
                    <div className="w-[72px] h-[88px] rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center flex-shrink-0 bg-primary/5">
                      <User2 className="w-7 h-7 text-primary/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1 min-w-0">
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Name</p>
                        <p className="text-sm font-bold truncate">{card.studentName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Roll</p>
                        <p className="text-sm font-bold">{card.roll}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Registration</p>
                        <p className="text-sm font-semibold text-primary">{card.registrationNo}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Class & Section</p>
                        <p className="text-sm font-bold">{card.className} — {card.section}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Father</p>
                        <p className="text-sm font-medium truncate">{card.fatherName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Session</p>
                        <p className="text-sm font-medium">{card.session}</p>
                      </div>
                    </div>
                  </div>

                  {/* Exam Schedule */}
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
                          {card.subjects.map((sub, idx) => (
                            <tr key={idx} className="border-t border-primary/5">
                              <td className="py-1.5 px-3 font-medium">{sub.name}</td>
                              <td className="py-1.5 px-3 text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {sub.date}
                              </td>
                              <td className="py-1.5 px-3 text-muted-foreground">{sub.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-1">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => handlePrintCard(card)}>
                      <Printer className="w-3.5 h-3.5" /> Print
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => handlePrintCard(card)}>
                      <Download className="w-3.5 h-3.5" /> Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="shadow-sm border-primary/10">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <IdCard className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold">Generate Admit Cards</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Select a session, year, class and section above, then click &quot;Generate&quot; to preview and print admit cards.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
