"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, Printer, FileText, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { examSessions, examClasses, examSections, resultData, gpaCalculationSample } from "@/data/exam";

export function MarksheetPage() {
  const [studentId, setStudentId] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId) setShowResult(true);
  };

  const student = resultData.find(s => s.roll === studentId) || resultData[0];

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
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Roll / ID</label>
              <Input 
                placeholder="Enter Roll No" 
                className="h-9 text-sm" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm" className="h-9 gap-2">
              <Search className="w-4 h-4" /> View Marksheet
            </Button>
          </form>
        </CardContent>
      </Card>

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
              <p className="text-sm opacity-90 mt-1">Mid-Term Examination 2026</p>
            </div>
            
            <CardContent className="p-8">
              {/* Student Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b pb-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{student.studentName}</h3>
                      <p className="text-sm text-muted-foreground">Student ID: {student.roll}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Class:</span> <span className="font-semibold">{student.className}</span></div>
                    <div><span className="text-muted-foreground">Section:</span> <span className="font-semibold">{student.section}</span></div>
                    <div><span className="text-muted-foreground">Roll No:</span> <span className="font-semibold">{student.roll}</span></div>
                    <div><span className="text-muted-foreground">Session:</span> <span className="font-semibold">2025-2026</span></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-primary/5 rounded-2xl p-6 border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Grade Point Average</p>
                  <p className="text-5xl font-black text-primary">{student.gpa.toFixed(2)}</p>
                  <p className="text-sm font-bold mt-2">GRADE: {student.grade}</p>
                </div>
              </div>

              {/* Marksheet Table */}
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
                    {gpaCalculationSample.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-medium">{item.subject}</td>
                        <td className="py-3.5 px-4 text-center">100</td>
                        <td className="py-3.5 px-4 text-center font-bold">{item.obtainedMarks}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-primary">{item.gradePoint.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-7 rounded-lg text-xs font-bold ${item.grade === 'F' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                            {item.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-primary/5 font-bold">
                      <td className="py-4 px-4">Total</td>
                      <td className="py-4 px-4 text-center">{gpaCalculationSample.length * 100}</td>
                      <td className="py-4 px-4 text-center">{gpaCalculationSample.reduce((acc, curr) => acc + curr.obtainedMarks, 0)}</td>
                      <td className="py-4 px-4 text-center text-primary">{student.gpa.toFixed(2)} (GPA)</td>
                      <td className="py-4 px-4 text-center">{student.grade}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer Signatures */}
              <div className="grid grid-cols-3 gap-8 mt-20 text-center">
                <div className="space-y-2">
                  <div className="border-t-2 border-dotted border-gray-400 pt-2 text-xs font-semibold text-muted-foreground">Class Teacher</div>
                </div>
                <div className="space-y-2">
                  <div className="border-t-2 border-dotted border-gray-400 pt-2 text-xs font-semibold text-muted-foreground">Controller of Exams</div>
                </div>
                <div className="space-y-2">
                  <div className="border-t-2 border-dotted border-gray-400 pt-2 text-xs font-semibold text-muted-foreground">Headmaster</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!showResult && (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
          <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No Marksheet to Preview</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Select student details above to generate the academic transcript preview.
          </p>
        </div>
      )}
    </div>
  );
}
