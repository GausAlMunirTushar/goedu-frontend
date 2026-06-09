"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { markEntryStudents, examSubjects, examSessions, examClasses, examSections } from "@/data/exam";

const statusStyle: Record<string, string> = {
  Entered: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
};

export function MarkEntryPage() {
  const [session, setSession] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [showTable, setShowTable] = useState(false);

  const handleSearch = () => {
    if (session && selectedClass && section && subject) {
      setShowTable(true);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Mark Entry</Title>
          <p className="text-sm text-muted-foreground mt-1">Enter and manage student marks for examinations.</p>
        </div>
        {showTable && (
          <Button size="sm" className="gap-2">
            <Save className="w-4 h-4" /> Save All Marks
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                <SelectContent>
                  {examSubjects.map((s) => (<SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} size="sm" className="h-9 gap-2">
              <Search className="w-4 h-4" /> Load Students
            </Button>
          </div>
        </CardContent>
      </Card>

      {showTable && (
        <Card className="shadow-sm border-primary/10">
          <CardHeader>
            <CardTitle className="text-base font-bold">Student Marks — {subject}</CardTitle>
            <CardDescription className="text-xs">{selectedClass} - Section {section} | Session {session}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Roll</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Student Name</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-24">Written</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-24">MCQ</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-24">Practical</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Total</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Grade</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {markEntryStudents.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                      <td className="py-3 font-medium">{s.roll}</td>
                      <td className="py-3 font-semibold">{s.studentName}</td>
                      <td className="py-3">
                        <Input
                          type="number"
                          defaultValue={s.written ?? ""}
                          placeholder="-"
                          className="h-8 w-20 text-sm text-center"
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          defaultValue={s.mcq ?? ""}
                          placeholder="-"
                          className="h-8 w-20 text-sm text-center"
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          defaultValue={s.practical ?? ""}
                          placeholder="-"
                          className="h-8 w-20 text-sm text-center"
                        />
                      </td>
                      <td className="py-3 font-bold text-primary">{s.total ?? "-"}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center justify-center w-9 h-7 rounded-lg text-xs font-bold ${s.grade === 'F' ? 'bg-red-100 text-red-600' : s.grade === '-' ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'}`}>
                          {s.grade}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[s.status]}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!showTable && (
        <Card className="shadow-sm border-primary/10">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Filter className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold">Select Filters</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Choose session, class, section and subject above to load students for mark entry.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
