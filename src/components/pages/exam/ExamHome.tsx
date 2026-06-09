"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, CalendarDays, FileSpreadsheet, Award, ChartLine, CalculatorIcon, LayoutTemplate, IdCardIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ExamHomePage() {
  const cards = [
    {
      title: "Exam Dashboard",
      desc: "Overview of exam statistics, upcoming schedules and performance insights.",
      icon: LayoutDashboard,
      path: "/exam/dashboard",
    },
    {
      title: "Exam Setup",
      desc: "Create and manage examination configurations and basic settings.",
      icon: Settings,
      path: "/exam/setup",
    },
    {
      title: "Exam Schedule",
      desc: "Manage and view the timetable for all upcoming examinations.",
      icon: CalendarDays,
      path: "/exam/schedule",
    },
    {
      title: "Mark Entry",
      desc: "Enter and manage student marks for various exam components.",
      icon: FileSpreadsheet,
      path: "/exam/mark-entry",
    },
    {
      title: "Grade Setup",
      desc: "Configure grading scales, points and marking systems.",
      icon: Award,
      path: "/exam/grade-setup",
    },
    {
      title: "Result Processing",
      desc: "Calculate final results, positions and publish performance data.",
      icon: ChartLine,
      path: "/exam/result-processing",
    },
    {
      title: "GPA Calculation",
      desc: "Individual student GPA breakdown and automated calculations.",
      icon: CalculatorIcon,
      path: "/exam/gpa-calculation",
    },
    {
      title: "Seat Plan",
      desc: "Create, manage and generate seating arrangements for examinations.",
      icon: LayoutTemplate,
      path: "/exam/seat-plan",
    },
    {
      title: "Admit Card",
      desc: "Generate, preview and distribute admit cards for enrolled students.",
      icon: IdCardIcon,
      path: "/exam/admit-card",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <Title>Examination</Title>
        <p className="text-sm text-muted-foreground mt-1">Manage examinations, seat plans, and admit cards.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="shadow-sm border-primary/10 hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-base font-bold">{card.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed pt-1">{card.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-6">
                <Button asChild variant="ghost" size="sm" className="w-full text-xs font-semibold text-primary hover:text-primary/95 group-hover:bg-primary/5 justify-between px-2">
                  <Link href={card.path}>
                    Open <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
