"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Award, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";
import Link from "next/link";

export function ReportsPage() {
  const reportsList = [
    {
      id: "students",
      title: "Student Reports",
      description: "Generate student registers, enrollment statistics, gender distributions, and class rosters.",
      icon: GraduationCap,
      path: "/reports/student-reports",
      color: "text-emerald-600 bg-emerald-50",
      btnText: "Generate Student Reports"
    },
    {
      id: "teachers",
      title: "Teacher Reports",
      description: "Access teacher directories, designation spreads, department profiles, and joining logs.",
      icon: Users,
      path: "/reports/teacher-reports",
      color: "text-primary bg-primary/10",
      btnText: "Generate Faculty Reports"
    },
    {
      id: "attendance",
      title: "Attendance Reports",
      description: "Extract historical attendance percentages, monthly registers, present/absent logs, and anomalies.",
      icon: Calendar,
      path: "/reports/attendance-reports",
      color: "text-amber-600 bg-amber-50",
      btnText: "Generate Attendance Reports"
    },
    {
      id: "results",
      title: "Result Reports",
      description: "Analyze pass rates, class positions, exam-wise mark ledgers, subject toppers, and GPA distribution sheets.",
      icon: Award,
      path: "/reports/result-reports",
      color: "text-indigo-600 bg-indigo-50",
      btnText: "Generate Result Ledgers"
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Welcome & Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <Title>Reports Module</Title>
          <p className="text-sm text-muted-foreground mt-1">Select an analytics reports catalog below to query, preview, and download spreadsheets.</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full shadow-sm shrink-0">
          <FileSpreadsheet className="w-3.5 h-3.5" /> Analytical Dashboard Active
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((rep) => {
          const Icon = rep.icon;
          return (
            <Card key={rep.id} className="border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5">
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${rep.color} transition-transform group-hover:scale-105`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{rep.title}</CardTitle>
                  <CardDescription className="text-xs">Sub-module reports & analytics generator</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {rep.description}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-gray-50 mt-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" /> Multi-criteria filters enabled
                  </span>
                  <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/95 text-white" asChild>
                    <Link href={rep.path}>
                      {rep.btnText} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
