"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Search, Download, User, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { gpaCalculationSample } from "@/data/exam";

export function GPACalculationPage() {
  const [studentId, setStudentId] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId) {
      setShowResult(true);
    }
  };

  const totalPoints = gpaCalculationSample.reduce((acc, curr) => acc + curr.gradePoint, 0);
  const averageGpa = totalPoints / gpaCalculationSample.length;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>GPA Calculation</Title>
          <p className="text-sm text-muted-foreground mt-1">Individual student GPA breakdown and calculation.</p>
        </div>
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <form onSubmit={handleCalculate} className="flex flex-col sm:flex-row gap-4 items-end max-w-2xl">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student ID / Roll No</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Enter Student ID (e.g. 101)" 
                  className="pl-9 h-10 text-sm" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" size="sm" className="h-10 px-6 gap-2">
              <Calculator className="w-4 h-4" /> Calculate GPA
            </Button>
          </form>
        </CardContent>
      </Card>

      {showResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-bold">Subject Wise Breakdown</CardTitle>
                  <CardDescription className="text-xs">Detailed marks and points for student {studentId}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Download className="w-3.5 h-3.5" /> Marksheet
                </Button>
              </CardHeader>
              <CardContent>
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
                      {gpaCalculationSample.map((item, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                              <span className="font-medium">{item.subject}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-center font-semibold">{item.obtainedMarks}</td>
                          <td className="py-3.5 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-7 rounded-lg text-xs font-bold ${item.grade === 'F' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                              {item.grade}
                            </span>
                          </td>
                          <td className="py-3.5 text-center font-bold text-primary">{item.gradePoint.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm border-primary/10 bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-widest mb-2">Final GPA</p>
                  <h2 className="text-6xl font-black mb-1">{averageGpa.toFixed(2)}</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mt-2">
                    GRADE: A
                  </div>
                </div>
                <div className="bg-black/10 p-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-[10px] text-primary-foreground/60 uppercase">Total Marks</p>
                    <p className="font-bold">535/700</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-primary-foreground/60 uppercase">Position</p>
                    <p className="font-bold">12th</p>
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
                  <span className="font-semibold">{gpaCalculationSample.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Points:</span>
                  <span className="font-semibold">{totalPoints.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-emerald-600">PASSED</span>
                </div>
                <div className="pt-2 border-t text-[10px] text-muted-foreground italic leading-relaxed">
                  * Position is calculated based on total marks obtained across all subjects in the same class/section.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!showResult && (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Calculator className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No Result to Display</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Enter a student ID or Roll number above to see the detailed GPA breakdown.
          </p>
        </div>
      )}
    </div>
  );
}
