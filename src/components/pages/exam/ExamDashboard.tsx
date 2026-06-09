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

export function ExamDashboardPage() {
  const stats = [
    { title: "Total Exams", value: "24", change: "+3 this month", icon: ClipboardList, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Upcoming Exams", value: "8", change: "Next 30 days", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Completed", value: "14", change: "58% of total", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "In Progress", value: "2", change: "Active now", icon: Clock4, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Results Published", value: "12", change: "86% published", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Pending Review", value: "3", change: "Needs attention", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  const recentExams = [
    { name: "Mid-Term Examination 2026", date: "Jun 15, 2026", status: "Upcoming", statusColor: "bg-blue-100 text-blue-700", students: 450 },
    { name: "Unit Test - Mathematics", date: "Jun 10, 2026", status: "In Progress", statusColor: "bg-amber-100 text-amber-700", students: 120 },
    { name: "Final Exam - Class 10", date: "May 28, 2026", status: "Completed", statusColor: "bg-emerald-100 text-emerald-700", students: 380 },
    { name: "Weekly Quiz - Science", date: "May 25, 2026", status: "Completed", statusColor: "bg-emerald-100 text-emerald-700", students: 95 },
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
            <Card key={i} className="shadow-sm hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Exams Table */}
      <Card className="shadow-sm">
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
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Date</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Students</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentExams.map((exam, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3.5 font-medium">{exam.name}</td>
                    <td className="py-3.5 text-muted-foreground">{exam.date}</td>
                    <td className="py-3.5">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" /> {exam.students}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${exam.statusColor}`}>
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
