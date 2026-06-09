"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ClipboardList,
  Calendar,
  BarChart3,
  CheckCircle2,
  Clock4,
  AlertCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { examList, examStats } from "@/data/exam";

const statusColorMap: Record<string, string> = {
  "Upcoming": "bg-primary/10 text-primary",
  "In Progress": "bg-amber-100 text-amber-700",
  "Completed": "bg-emerald-100 text-emerald-700",
};

export function ExamDashboardPage() {
  const stats = [
    { title: "Total Exams", value: String(examStats.totalExams), change: "+3 this month", icon: ClipboardList },
    { title: "Upcoming Exams", value: String(examStats.upcoming), change: "Next 30 days", icon: Calendar },
    { title: "Completed", value: String(examStats.completed), change: "58% of total", icon: CheckCircle2 },
    { title: "In Progress", value: String(examStats.inProgress), change: "Active now", icon: Clock4 },
    { title: "Results Published", value: String(examStats.resultsPublished), change: "86% published", icon: BarChart3 },
    { title: "Pending Review", value: String(examStats.pendingReview), change: "Needs attention", icon: AlertCircle },
  ];

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div>
        <Title>Exam Dashboard</Title>
        <p className="text-sm text-muted-foreground mt-1">Overview of examination statistics, schedules and performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="shadow-sm hover:shadow-md transition-all duration-300 group border-primary/10">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-primary" /> {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Exams Table */}
      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-base font-bold">Recent Examinations</CardTitle>
          <CardDescription className="text-xs">Latest exam schedules and their current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Exam Name</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Type</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Date</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Students</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {examList.map((exam) => (
                  <tr key={exam.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                    <td className="py-3.5 font-medium">{exam.name}</td>
                    <td className="py-3.5 text-muted-foreground">{exam.type}</td>
                    <td className="py-3.5 text-muted-foreground">{exam.date}</td>
                    <td className="py-3.5">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" /> {exam.students}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColorMap[exam.status] || "bg-gray-100 text-gray-700"}`}>
                        {exam.status}
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
  );
}
