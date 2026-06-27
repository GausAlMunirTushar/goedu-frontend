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
  ArrowRight,
  GraduationCap,
  Building2,
  BarChart3,
  Layers,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useAcademicOverviewQuery } from "@/apis/queries/academic_queries";
import { DashboardSkeleton } from "@/components/ui/custom-ui/dashboard-skeleton";

export function AcademicPage() {
  const { data: response, isLoading } = useAcademicOverviewQuery();
  
  const overviewData = response?.data || {
    stats: {
      totalStudents: 0,
      totalClasses: 0,
      totalSections: 0,
      totalSubjects: 0,
      totalRooms: 0,
      totalAdmissions: 0,
    },
    admissionsByStatus: [],
    classEnrollment: [],
    roomCapacity: [],
  };

  const { stats, admissionsByStatus, classEnrollment, roomCapacity } = overviewData;

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-50",
      borderColor: "border-green-100"
    },
    {
      title: "Total Sections",
      value: stats.totalSections,
      icon: ClipboardList,
      color: "text-amber-600",
      bg: "bg-amber-50",
      borderColor: "border-amber-100"
    },
    {
      title: "Total Subjects",
      value: stats.totalSubjects,
      icon: SwatchBook,
      color: "text-rose-600",
      bg: "bg-rose-50",
      borderColor: "border-rose-100"
    },
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      icon: Home,
      color: "text-orange-600",
      bg: "bg-orange-50",
      borderColor: "border-orange-100"
    },
    {
      title: "New Admissions",
      value: stats.totalAdmissions,
      icon: UserPlus,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "border-emerald-100"
    }
  ];

  const quickLinks = [
    {
      title: "Academic Year",
      desc: "Manage academic terms and dates.",
      icon: CalendarDays,
      path: "/academic/academic-year",
      color: "text-blue-600",
      bg: "bg-blue-50/50"
    },
    {
      title: "Department",
      desc: "Manage institutional departments.",
      icon: Building2,
      path: "/academic/department",
      color: "text-purple-600",
      bg: "bg-purple-50/50"
    },
    {
      title: "Session",
      desc: "Manage enrollment periods.",
      icon: Calendar,
      path: "/academic/session",
      color: "text-indigo-600",
      bg: "bg-indigo-50/50"
    },
    {
      title: "Group",
      desc: "Science, Commerce, Arts.",
      icon: Users2Icon,
      path: "/academic/group",
      color: "text-teal-600",
      bg: "bg-teal-50/50"
    },
    {
      title: "Shift",
      desc: "School shifts & timings.",
      icon: SwatchBook,
      path: "/academic/shift",
      color: "text-rose-600",
      bg: "bg-rose-50/50"
    },
    {
      title: "Subject Assignment",
      desc: "Assign subjects to classes.",
      icon: ClipboardList,
      path: "/academic/subject/assignment",
      color: "text-cyan-600",
      bg: "bg-cyan-50/50"
    },
    {
      title: "Teacher Mapping",
      desc: "Map teachers to subjects.",
      icon: Users2Icon,
      path: "/academic/subject/teacher-mapping",
      color: "text-emerald-600",
      bg: "bg-emerald-50/50"
    }
  ];

  // Calculate chart metrics
  const maxEnrollment = Math.max(...classEnrollment.map((c: any) => c.studentCount), 1);
  const maxRoomCapacity = Math.max(...roomCapacity.map((r: any) => r.capacity), 1);
  const totalAdmissionsCount = admissionsByStatus.reduce((acc: number, curr: any) => acc + curr.count, 0) || 1;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-2 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-white pb-4">
          <div>
            <Title>Academic</Title>
            <p className="text-xs text-muted-foreground mt-1">Real-time statistics, structure overview, and quick management actions.</p>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className={`shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300`}>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{card.value}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">{card.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Enrollment Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Class Enrollment
            </CardTitle>
            <CardDescription className="text-xs">Student distribution across top classes</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {classEnrollment.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                No class enrollment data available.
              </div>
            ) : (
              <div className="flex h-52 pt-6 relative">
                {/* Y-axis labels and lines */}
                <div className="absolute inset-y-0 left-0 w-10 pr-2.5 flex flex-col justify-between text-[10px] font-bold text-slate-400 select-none pb-7 text-right pointer-events-none">
                  <span>{maxEnrollment}</span>
                  <span>{Math.round(maxEnrollment * 0.75)}</span>
                  <span>{Math.round(maxEnrollment * 0.5)}</span>
                  <span>{Math.round(maxEnrollment * 0.25)}</span>
                  <span>0</span>
                </div>
                {/* Grid lines */}
                <div className="absolute inset-y-0 left-10 right-0 flex flex-col justify-between pointer-events-none pb-7">
                  <div className="w-full border-t border-dashed border-slate-100 h-0" />
                  <div className="w-full border-t border-dashed border-slate-100 h-0" />
                  <div className="w-full border-t border-dashed border-slate-100 h-0" />
                  <div className="w-full border-t border-dashed border-slate-100 h-0" />
                  <div className="w-full border-t border-slate-200 h-0" />
                </div>
                {/* Bars container */}
                <div className="flex-1 ml-10 flex items-end justify-around gap-6 h-full pb-7">
                  {classEnrollment.map((item: any, idx: number) => {
                    const heightPercent = (item.studentCount / maxEnrollment) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 group relative h-full justify-end">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-lg z-10 whitespace-nowrap pointer-events-none">
                          {item.studentCount} Students
                        </div>
                        <div 
                          className="w-full max-w-[40px] bg-gradient-to-t from-primary/70 via-primary/95 to-primary hover:from-primary hover:to-primary-hover shadow-sm hover:shadow-md hover:scale-x-105 transform transition-all duration-500 ease-out rounded-t-md cursor-pointer"
                          style={{ height: `${Math.max(heightPercent, 4)}%` }}
                        />
                        <span className="absolute top-full mt-2 text-[10px] font-semibold text-slate-500 truncate w-full text-center">
                          {item.className}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admissions & Room Capacity */}
        <div className="space-y-6">
          {/* Admissions Status Breakdowns */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                Admission Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {admissionsByStatus.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No admission applications.
                </div>
              ) : (
                <div className="space-y-2">
                  {admissionsByStatus.map((item: any, idx: number) => {
                    const percentage = Math.round((item.count / totalAdmissionsCount) * 100);
                    let barColor = "bg-gradient-to-r from-amber-400 to-amber-500";
                    let badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                    if (item.status === "Approved") {
                      barColor = "bg-gradient-to-r from-emerald-400 to-emerald-500";
                      badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                    } else if (item.status === "Rejected") {
                      barColor = "bg-gradient-to-r from-rose-400 to-rose-500";
                      badgeColor = "bg-rose-50 text-rose-700 border-rose-100";
                    }

                    return (
                      <div key={idx} className="space-y-1.5 p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${badgeColor}`}>{item.status}</span>
                          <span className="text-slate-500">{item.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full ${barColor} transition-all duration-700`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Room Capacity list */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Home className="w-4 h-4 text-orange-600" />
                Room Capacities
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {roomCapacity.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No room capacity data.
                </div>
              ) : (
                <div className="space-y-2">
                  {roomCapacity.slice(0, 4).map((item: any, idx: number) => {
                    const pct = (item.capacity / maxRoomCapacity) * 100;
                    let barColor = "bg-emerald-500";
                    if (pct > 80) barColor = "bg-rose-500";
                    else if (pct > 60) barColor = "bg-amber-500";

                    return (
                      <div key={idx} className="space-y-1.5 p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{item.roomName}</span>
                          <span className="text-slate-500">{item.capacity} seats</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`${barColor} h-full rounded-full transition-all duration-700`} 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Navigation Links */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Quick Setup & Configuration
          </CardTitle>
          <CardDescription className="text-xs">Direct access to configure specific academic submodules</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link key={i} href={link.path} className="group">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all duration-300 h-full">
                    <div className={`w-10 h-10 rounded-lg ${link.bg} ${link.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors truncate">{link.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{link.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
