"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { examSetupData } from "@/data/exam";

const statusStyle: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Inactive: "bg-gray-100 text-gray-600",
  Draft: "bg-amber-100 text-amber-700",
};

export function ExamSetupPage() {
  const [search, setSearch] = useState("");
  const filtered = examSetupData.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Exam Setup</Title>
          <p className="text-sm text-muted-foreground mt-1">Create and manage examination configurations.</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Create Exam
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search exams..."
          className="pl-9 h-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-base font-bold">Exam List</CardTitle>
          <CardDescription className="text-xs">All configured examinations for current session.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Exam Name</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Type</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Session</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Total Marks</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Pass Marks</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exam) => (
                  <tr key={exam.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                    <td className="py-3.5 font-medium">{exam.name}</td>
                    <td className="py-3.5 text-muted-foreground">{exam.type}</td>
                    <td className="py-3.5 text-muted-foreground">{exam.session}</td>
                    <td className="py-3.5 font-semibold">{exam.totalMarks}</td>
                    <td className="py-3.5 font-semibold">{exam.passMarks}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[exam.status] || ""}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
