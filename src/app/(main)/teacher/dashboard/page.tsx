// src/app/(main)/teacher/dashboard/page.tsx
"use client";

import TeacherDashboard from "@/components/pages/teacher/TeacherDashboard";
import Title from "@/components/ui/custom-ui/title";

export default function Page() {
  return (
    <div className="p-4 space-y-6">
      <Title>Teacher Dashboard</Title>
      <p className="text-gray-600">
        Overview of teacher statistics, departmental distribution, and designations.
      </p>
      <TeacherDashboard />
    </div>
  );
}
