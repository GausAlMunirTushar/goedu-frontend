"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Calendar, 
  BookOpen, 
  ClipboardList, 
  Users2Icon, 
  SwatchBook, 
  Home, 
  UserPlus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export function AcademicPage() {
  const cards = [
    {
      title: "Academic Year",
      desc: "Manage academic years, start/end dates and active status.",
      icon: CalendarDays,
      path: "/academic/academic-year",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Session",
      desc: "Configure academic sessions and enrollment periods.",
      icon: Calendar,
      path: "/academic/session",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Class",
      desc: "Define academic classes, codes and student capacities.",
      icon: BookOpen,
      path: "/academic/class",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Section",
      desc: "Organize classes into sections and assign rooms.",
      icon: ClipboardList,
      path: "/academic/section",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Group",
      desc: "Manage academic groups like Science, Commerce, and Arts.",
      icon: Users2Icon,
      path: "/academic/group",
      color: "text-teal-600",
      bg: "bg-teal-50"
    },
    {
      title: "Shift",
      desc: "Configure school shifts, timings and availability.",
      icon: SwatchBook,
      path: "/academic/shift",
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
    {
      title: "Subject",
      desc: "Manage the list of subjects taught across different classes.",
      icon: BookOpen,
      path: "/academic/subject",
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    },
    {
      title: "Room",
      desc: "Manage physical rooms, buildings and their types.",
      icon: Home,
      path: "/academic/room",
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      title: "Admission",
      desc: "Track and manage student admission applications.",
      icon: UserPlus,
      path: "/academic/admission",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <Title>Academic Management</Title>
        <p className="text-sm text-muted-foreground mt-1">Configure and manage all academic structural data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="shadow-sm border-primary/10 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden">
              <div className={`h-1 ${card.bg.replace('bg-', 'bg-').replace('/5', '')}`} />
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-base font-bold">{card.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed pt-1">{card.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-6">
                <Button asChild variant="ghost" size="sm" className={`w-full text-xs font-semibold ${card.color} hover:${card.bg} justify-between px-2`}>
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
