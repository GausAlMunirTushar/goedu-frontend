"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3 } from "lucide-react";
import { useStudentProfileQuery } from "@/apis/queries/student_queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function StudentProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");

  const { data: response, isLoading } = useStudentProfileQuery(studentId || "");
  const student = response?.data;

  if (!studentId) {
    return (
      <div className="p-6 text-center text-gray-500">
        No student ID provided. Please go back to the{" "}
        <Button variant="link" onClick={() => router.push("/student/list")}>
          Student List
        </Button>
        .
      </div>
    );
  }

  if (isLoading) return <div className="p-6">Loading student profile details...</div>;
  if (!student) return <div className="p-6 text-red-500">Student profile not found.</div>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Title>Student Profile Details</Title>
        </div>
        <Button onClick={() => router.push(`/student/registration?id=${student.id}`)} className="flex items-center gap-2">
          <Edit3 className="w-4 h-4" /> Edit Profile
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-white border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{`${student.firstName} ${student.lastName}`}</h2>
              <p className="text-sm text-gray-500">Student ID: {student.studentId}</p>
            </div>
            <Badge
              variant={student.status === "Active" ? "default" : "secondary"}
              className={student.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "border-none"}
            >
              {student.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="bg-white pt-6 space-y-6">
          {/* Academic Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-1.5">Academic Placement</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Class</span>
                <p className="text-sm font-medium text-gray-900">{student.class?.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Section</span>
                <p className="text-sm font-medium text-gray-900">{student.section?.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Roll Number</span>
                <p className="text-sm font-medium text-gray-900">{student.roll || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shift</span>
                <p className="text-sm font-medium text-gray-900">{student.shift?.name || "Not Assigned"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Academic Session</span>
                <p className="text-sm font-medium text-gray-900">{student.session?.name || "Not Assigned"}</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-1.5">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date of Birth</span>
                <p className="text-sm font-medium text-gray-900">
                  {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</span>
                <p className="text-sm font-medium text-gray-900">{student.gender || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Blood Group</span>
                <p className="text-sm font-medium text-gray-900">{student.bloodGroup || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Religion</span>
                <p className="text-sm font-medium text-gray-900">{student.religion || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* User Account Mapping */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-1.5">User Login Access</h3>
            {student.user ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</span>
                  <p className="text-sm font-medium text-gray-900">@{student.user.username}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Linked Phone</span>
                  <p className="text-sm font-medium text-gray-900">{student.user.phone || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Linked Email</span>
                  <p className="text-sm font-medium text-gray-900">{student.user.email || "N/A"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No user login credentials mapped for this student profile.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
