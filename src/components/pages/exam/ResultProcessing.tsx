"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, Search, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resultData, examSessions, examClasses, examSections } from "@/data/exam";

export function ResultProcessingPage() {
  const [session, setSession] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Result Processing</Title>
          <p className="text-sm text-muted-foreground mt-1">Calculate and publish student performance results.</p>
        </div>
        {showResults && (
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export Result Sheet
          </Button>
        )}
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session</label>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Session" /></SelectTrigger>
                <SelectContent>
                  {examSessions.map((s) => (<SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Class" /></SelectTrigger>
                <SelectContent>
                  {examClasses.map((c) => (<SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section</label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Section" /></SelectTrigger>
                <SelectContent>
                  {examSections.map((s) => (<SelectItem key={s.id} value={s.shortName}>{s.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleProcess} 
              disabled={!session || !selectedClass || isProcessing}
              size="sm" 
              className="h-9 gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Processing
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <Card className="shadow-sm border-primary/10">
          <CardHeader>
            <CardTitle className="text-base font-bold">Processed Results</CardTitle>
            <CardDescription className="text-xs">{selectedClass} | Session {session}</CardDescription>
          </CardHeader>
          <CardContent>
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
                  {resultData.map((res) => (
                    <tr key={res.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                      <td className="py-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${res.position <= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                          {res.position}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">{res.roll}</td>
                      <td className="py-3 font-semibold">{res.studentName}</td>
                      <td className="py-3 font-bold text-primary">{res.gpa.toFixed(2)}</td>
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
          </CardContent>
        </Card>
      )}

      {!showResults && !isProcessing && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl bg-muted/30">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <Play className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold">Ready to Process</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center">
            Select the session and class parameters above to begin the result calculation process for students.
          </p>
        </div>
      )}
    </div>
  );
}
