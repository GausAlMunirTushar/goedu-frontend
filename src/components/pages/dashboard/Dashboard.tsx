"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, UserCheck, Calendar, Activity, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DashboardPage() {
  const cards = [
    {
      title: "Institution Statistics",
      desc: "Overview of total schools, departments and facilities.",
      icon: Building,
      path: "/dashboard/institution",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Student Statistics",
      desc: "Total students, new admissions and graduation rates.",
      icon: Users,
      path: "/dashboard/student",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Teacher Statistics",
      desc: "Faculty count, active teachers and workload.",
      icon: UserCheck,
      path: "/dashboard/teacher",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Attendance Overview",
      desc: "Current attendance percentages and trends.",
      icon: Calendar,
      path: "/dashboard/attendance",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Recent Activities",
      desc: "Latest system events, logs and notifications.",
      icon: Activity,
      path: "/dashboard/activities",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Quick Actions",
      desc: "Common shortcuts to create or manage resources.",
      icon: Zap,
      path: "/dashboard/actions",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <Title>Dashboard</Title>
      <p className="text-sm text-gray-500">Key metrics and shortcuts for quick overview.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-base font-bold text-gray-800">{card.title}</CardTitle>
                <CardDescription className="text-xs text-gray-500 leading-relaxed pt-1">{card.desc}</CardDescription>
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
