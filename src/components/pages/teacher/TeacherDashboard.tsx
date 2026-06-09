// src/components/pages/teacher/TeacherDashboard.tsx
"use client";

import React from "react";
import StatCard from "@/components/charts/StatCard";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import ChartCard from "@/components/charts/ChartCard";
import { teachers } from "@/data/teachers";

// Derive statistics
const totalTeachers = teachers.length;
const seniorTeachers = teachers.filter(t =>
  t.designation?.toLowerCase().includes("headmaster") ||
  t.designation?.toLowerCase().includes("senior")
).length;
const departments = Array.from(new Set(teachers.map(t => t.department)));
const departmentCounts = departments.map(dep => ({
  name: dep,
  count: teachers.filter(t => t.department === dep).length,
}));

export default function TeacherDashboard() {
  return (
    <div className="p-4 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Teachers" value={totalTeachers} subtitle="All teachers" color="blue" />
        <StatCard title="Senior Staff" value={seniorTeachers} subtitle="Headmasters & senior assistants" color="green" />
        <StatCard title="Departments" value={departments.length} subtitle="Unique departments" color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartCard title="Teachers per Department" subtitle="Distribution across departments">
          <BarChart
            data={departmentCounts}
            dataKey="name"
            valueKey="count"
            color="#3b82f6"
            height={300}
          />
        </ChartCard>

        <ChartCard title="Monthly Growth (Mock)" subtitle="Illustrative growth data">
          <LineChart
            data={[
              { month: "Jan", count: 10 },
              { month: "Feb", count: 12 },
              { month: "Mar", count: 14 },
              { month: "Apr", count: 15 },
              { month: "May", count: 18 },
              { month: "Jun", count: 20 },
            ]}
            dataKey="month"
            valueKey="count"
            color="#10b981"
            height={300}
          />
        </ChartCard>
      </div>

      {/* Pie chart */}
      <ChartCard title="Designation Share" subtitle="Proportion of each designation" className="mt-4">
        <PieChart
          data={teachers.reduce((acc, cur) => {
            const key = cur.designation || "Other";
            const existing = acc.find(d => d.name === key);
            if (existing) existing.value++;
            else acc.push({ name: key, value: 1 });
            return acc;
          }, [] as { name: string; value: number }[])}
          dataKey="value"
          nameKey="name"
          height={300}
        />
      </ChartCard>
    </div>
  );
}
