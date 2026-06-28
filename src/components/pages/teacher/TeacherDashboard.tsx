// src/components/pages/teacher/TeacherDashboard.tsx
"use client";

import React, { useMemo } from "react";
import { Users, UserCheck, Award, Building2, GraduationCap } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import ChartCard from "@/components/charts/ChartCard";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/custom-ui/dashboard-skeleton";
import { 
  useTeachersProfilesQuery, 
  useDepartmentsQuery, 
  useDesignationsQuery, 
  useClassAssignmentsQuery 
} from "@/apis/queries/teacher_queries";

export default function TeacherDashboard() {
  // Live queries
  const { data: teachersRes, isLoading: loadingTeachers } = useTeachersProfilesQuery();
  const { data: deptsRes, isLoading: loadingDepts } = useDepartmentsQuery();
  const { data: designationsRes, isLoading: loadingDesignations } = useDesignationsQuery();
  const { data: assignmentsRes, isLoading: loadingAssignments } = useClassAssignmentsQuery();

  const isLoading = loadingTeachers || loadingDepts || loadingDesignations || loadingAssignments;

  const teachers = teachersRes?.data || [];
  const departmentsList = deptsRes?.data || [];
  const designationsList = designationsRes?.data || [];
  const assignmentsList = assignmentsRes?.data || [];

  // Metrics
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t: any) => t.isActive).length;
  const totalDepartments = departmentsList.length;
  const totalDesignations = designationsList.length;
  const totalAssignments = assignmentsList.length;

  const departmentCounts = useMemo(() => {
    return departmentsList.map((dep: any) => {
      const count = teachers.filter((t: any) => t.departmentId === dep.id).length;
      return {
        name: dep.name,
        count,
      };
    });
  }, [departmentsList, teachers]);

  const designationCounts = useMemo(() => {
    return designationsList.map((des: any) => {
      const count = teachers.filter((t: any) => t.designationId === des.id).length;
      return {
        name: des.title,
        value: count,
      };
    }).filter((d: any) => d.value > 0);
  }, [designationsList, teachers]);

  const statCards = [
    {
      title: "Total Teachers",
      value: totalTeachers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      title: "Active Staff",
      value: activeTeachers,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    {
      title: "Departments",
      value: totalDepartments,
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50",
      borderColor: "border-purple-100"
    },
    {
      title: "Designations",
      value: totalDesignations,
      icon: Award,
      color: "text-orange-600",
      bg: "bg-orange-50",
      borderColor: "border-orange-100"
    },
    {
      title: "Class Assigns",
      value: totalAssignments,
      icon: GraduationCap,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      borderColor: "border-indigo-100"
    }
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-2 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-white pb-4">
          <div>
            <Title>Teachers</Title>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time statistics, department distribution, and quick analytical insights.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Teachers per Department" subtitle="Distribution across departments">
          {departmentCounts.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-xs text-muted-foreground">No department data found</div>
          ) : (
            <BarChart
              data={departmentCounts}
              dataKey="name"
              valueKey="count"
              color="#3b82f6"
              height={300}
            />
          )}
        </ChartCard>

        <ChartCard title="Monthly Growth (Mock)" subtitle="Illustrative growth data">
          <LineChart
            data={[
              { month: "Jan", count: totalTeachers - 4 > 0 ? totalTeachers - 4 : 1 },
              { month: "Feb", count: totalTeachers - 3 > 0 ? totalTeachers - 3 : 1 },
              { month: "Mar", count: totalTeachers - 2 > 0 ? totalTeachers - 2 : 2 },
              { month: "Apr", count: totalTeachers - 1 > 0 ? totalTeachers - 1 : 2 },
              { month: "May", count: totalTeachers },
              { month: "Jun", count: totalTeachers },
            ]}
            dataKey="month"
            valueKey="count"
            color="#10b981"
            height={300}
          />
        </ChartCard>
      </div>

      {/* Pie Chart Card */}
      <ChartCard title="Designation Share" subtitle="Proportion of each designation">
        {designationCounts.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-xs text-muted-foreground">No designation data found</div>
        ) : (
          <PieChart
            data={designationCounts}
            dataKey="value"
            nameKey="name"
            height={300}
          />
        )}
      </ChartCard>
    </div>
  );
}
