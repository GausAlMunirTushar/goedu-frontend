"use client";

import React, { useState } from "react";
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
import { Grid3X3, Download, Printer, Search, Eye, User2 } from "lucide-react";
import { seatPlanData, examSessions, examYears, examClasses, examSections } from "@/data/exam";

export function SeatPlanPage() {
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

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Seat Plan - ${selectedClass} ${section}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 24px; color: #1a1a1a; }
            h2 { text-align: center; margin-bottom: 4px; }
            .subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 24px; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
            .seat-card { border: 2px solid #3b82f6; border-radius: 8px; padding: 16px; text-align: center; }
            .seat-no { font-size: 18px; font-weight: 700; color: #3b82f6; margin-bottom: 8px; }
            .student-name { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
            .info { font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h2>Seat Plan</h2>
          <p class="subtitle">Session: ${session} | Year: ${year} | ${selectedClass} - Section ${section}</p>
          <div class="grid">
            ${seatPlanData.map(s => `
              <div class="seat-card">
                <div class="seat-no">${s.seatNo}</div>
                <div class="student-name">${s.studentName}</div>
                <div class="info">Roll: ${s.roll}</div>
              </div>
            `).join("")}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    let csv = "Seat No,Student Name,Roll,Class,Section\n";
    seatPlanData.forEach((s) => {
      csv += `${s.seatNo},${s.studentName},${s.roll},${s.className},${s.section}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seat-plan-${selectedClass}-${section}-${session}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <Title>Seat Plan</Title>
        <p className="text-sm text-muted-foreground mt-1">
          Select filters to generate and view seating arrangements.
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
              <span className="text-xs text-muted-foreground ml-2">({seatPlanData.length} seats)</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
                <Download className="w-4 h-4" /> Download CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                <Printer className="w-4 h-4" /> Print
              </Button>
            </div>
          </div>

          {/* Seat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {seatPlanData.map((seat, i) => (
              <Card
                key={i}
                className="shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden border-primary/10"
              >
                <div className="bg-primary h-1.5 group-hover:h-2 transition-all duration-300" />
                <CardContent className="p-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg font-bold">{seat.seatNo}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold truncate">{seat.studentName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Roll: {seat.roll}</p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <User2 className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{seat.className} • Sec {seat.section}</span>
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
