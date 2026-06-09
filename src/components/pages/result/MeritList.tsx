"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, Printer, Trophy, Medal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { examSessions, examClasses, examSections, resultData } from "@/data/exam";

export function MeritListPage() {
  const [showList, setShowList] = useState(false);

  const handleSearch = () => setShowList(true);

  const meritList = [...resultData].sort((a, b) => b.obtainedMarks - a.obtainedMarks);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Merit List</Title>
          <p className="text-sm text-muted-foreground mt-1">Class-wise top performers and ranking based on marks.</p>
        </div>
        {showList && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" /> Print List
            </Button>
          </div>
        )}
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section</label>
              <Select defaultValue={examSections[0].shortName}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Section" /></SelectTrigger>
                <SelectContent>
                  {examSections.map((s) => (<SelectItem key={s.id} value={s.shortName}>{s.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} size="sm" className="h-9 gap-2">
              <Search className="w-4 h-4" /> Generate List
            </Button>
          </div>
        </CardContent>
      </Card>

      {showList && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meritList.slice(0, 3).map((student, index) => (
              <Card key={student.id} className={`shadow-md border-2 ${index === 0 ? 'border-yellow-400 bg-yellow-50/30' : index === 1 ? 'border-gray-300 bg-gray-50/30' : 'border-amber-600/30 bg-amber-50/20'}`}>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {index === 0 ? <Trophy className="w-12 h-12 text-yellow-500" /> : <Medal className={`w-12 h-12 ${index === 1 ? 'text-gray-400' : 'text-amber-700'}`} />}
                  </div>
                  <h3 className="text-lg font-bold truncate">{student.studentName}</h3>
                  <p className="text-sm text-muted-foreground">Roll: {student.roll} | Position: {index + 1}</p>
                  <div className="mt-4 pt-4 border-t border-black/5">
                    <p className="text-2xl font-black text-primary">{student.obtainedMarks}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Obtained Marks</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full List Table */}
          <Card className="shadow-sm border-primary/10">
            <CardHeader>
              <CardTitle className="text-base font-bold">Class Merit List</CardTitle>
              <CardDescription className="text-xs">Ranking based on total marks obtained across all subjects.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Rank</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Student Name</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Roll</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Marks</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">GPA</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meritList.map((res, i) => (
                      <tr key={res.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                        <td className="py-3.5">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${i < 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-3.5 font-bold">{res.studentName}</td>
                        <td className="py-3.5 text-muted-foreground">{res.roll}</td>
                        <td className="py-3.5 text-center font-black">{res.obtainedMarks}</td>
                        <td className="py-3.5 text-center font-bold text-primary">{res.gpa.toFixed(2)}</td>
                        <td className="py-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${res.grade === 'A+' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700'}`}>
                            {res.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!showList && (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Trophy className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No List Generated</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Choose the specific class and section to view the top performers.
          </p>
        </div>
      )}
    </div>
  );
}
