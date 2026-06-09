"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Pencil, Trash2, Search, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { examScheduleData } from "@/data/exam";

const statusStyle: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Ongoing: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Postponed: "bg-red-100 text-red-700",
};

export function ExamSchedulePage() {
  const [search, setSearch] = useState("");
  const filtered = examScheduleData.filter((e) =>
    e.examName.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Exam Schedule</Title>
          <p className="text-sm text-muted-foreground mt-1">Manage and view the timetable for all examinations.</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Create Schedule
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by exam or subject..."
          className="pl-9 h-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-base font-bold">Timetable</CardTitle>
          <CardDescription className="text-xs">Full schedule of upcoming and past examinations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Exam & Subject</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Class/Section</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Date & Time</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Venue</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                    <td className="py-3.5">
                      <div className="font-medium">{item.subject}</div>
                      <div className="text-xs text-muted-foreground">{item.examName}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-medium">{item.className}</div>
                      <div className="text-xs text-muted-foreground">Section {item.section}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.startTime} - {item.endTime}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {item.room}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[item.status] || ""}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
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
