"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStudentProfileQuery } from "@/apis/queries/student_queries";
import { useClassesQuery, useSectionsQuery, useShiftsQuery, useSessionsQuery } from "@/apis/queries/academic_queries";
import { createStudentProfile, updateStudentProfile } from "@/apis/mutations/student_mutations";
import { toast } from "sonner";
import Title from "@/components/ui/custom-ui/title";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";

export function StudentRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");
  const isEditMode = !!studentId;

  // React Hook Form
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<any>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "none",
      bloodGroup: "none",
      religion: "",
      classId: "none",
      sectionId: "none",
      shiftId: "none",
      sessionId: "none",
      roll: "",
      status: "Active",
      username: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  // Watch classId to query sections dynamically
  const formClassId = watch("classId");

  // Dynamic SWR queries
  const { data: studentRes, isLoading: isStudentLoading } = useStudentProfileQuery(studentId || "");
  const { data: classesRes } = useClassesQuery();
  const { data: sectionsRes } = useSectionsQuery(formClassId && formClassId !== "none" ? formClassId : undefined);
  const { data: shiftsRes } = useShiftsQuery();
  const { data: sessionsRes } = useSessionsQuery();

  const student = studentRes?.data;
  const classesList = classesRes?.data || [];
  const sectionsList = sectionsRes?.data || [];
  const shiftsList = shiftsRes?.data || [];
  const sessionsList = sessionsRes?.data || [];

  // Prepopulate form on edit mode
  useEffect(() => {
    if (isEditMode && student) {
      reset({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        dob: student.dob ? new Date(student.dob).toISOString().split("T")[0] : "",
        gender: student.gender || "none",
        bloodGroup: student.bloodGroup || "none",
        religion: student.religion || "",
        classId: student.classId || "none",
        sectionId: student.sectionId || "none",
        shiftId: student.shiftId || "none",
        sessionId: student.sessionId || "none",
        roll: student.roll || "",
        status: student.status || "Active",
        username: student.user?.username || "",
        phone: student.user?.phone || "",
        email: student.user?.email || "",
        password: "",
      });
    }
  }, [isEditMode, student, reset]);

  const submit = async (formData: any) => {
    // Basic checks
    if (formData.classId === "none" || formData.sectionId === "none") {
      toast.error("Class and Section are required academic fields");
      return;
    }

    const payload: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob ? new Date(formData.dob).toISOString() : null,
      gender: formData.gender === "none" ? null : formData.gender,
      bloodGroup: formData.bloodGroup === "none" ? null : formData.bloodGroup,
      religion: formData.religion || null,
      roll: formData.roll,
      classId: formData.classId,
      sectionId: formData.sectionId,
      shiftId: formData.shiftId === "none" ? null : formData.shiftId,
      sessionId: formData.sessionId === "none" ? null : formData.sessionId,
      status: formData.status,
    };

    // Include login credentials if username or phone are provided
    if (formData.username || formData.phone) {
      payload.username = formData.username || null;
      payload.phone = formData.phone || null;
      payload.email = formData.email || null;
      if (formData.password) {
        payload.password = formData.password;
      }
    }

    try {
      let res;
      if (isEditMode) {
        res = await updateStudentProfile(studentId!, payload);
      } else {
        res = await createStudentProfile(payload);
      }

      if (res.success) {
        toast.success(res.message || `Student ${isEditMode ? "updated" : "registered"} successfully`);
        router.push("/student/list");
      } else {
        toast.error(res.message || "Failed to save student profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred while saving student");
    }
  };

  if (isEditMode && isStudentLoading) {
    return <TableSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="p-2 space-y-6">
      <Card>
        <CardHeader className="bg-white pb-4">
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <Title>{isEditMode ? "Edit Student Profile" : "Student Registration"}</Title>
              <p className="text-xs text-muted-foreground mt-1">
                {isEditMode ? "Modify details of the student." : "Register a new student into the system."}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card className="shadow-sm border-none ring-1 ring-gray-200">
        <CardHeader className="bg-gray-50/50 rounded-t-xl py-3">
          <CardTitle className="text-base font-bold">Personal Information</CardTitle>
          <CardDescription className="text-xs">Enter the basic details of the student.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="e.g. John"
                className="bg-white"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="e.g. Doe"
                className="bg-white"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                className="bg-white"
                {...register("dob")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("gender")}
              >
                <option value="none">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <select
                id="bloodGroup"
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("bloodGroup")}
              >
                <option value="none">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Input
                id="religion"
                placeholder="e.g. Islam"
                className="bg-white"
                {...register("religion")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card className="shadow-sm border-none ring-1 ring-gray-200">
        <CardHeader className="bg-gray-50/50 rounded-t-xl py-3">
          <CardTitle className="text-base font-bold">Academic Information</CardTitle>
          <CardDescription className="text-xs">Select the class, section, shift and session for enrollment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="classId">Class</Label>
              <select
                id="classId"
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("classId", { required: "Class is required" })}
              >
                <option value="none">Select class</option>
                {classesList.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.classId && <p className="text-xs text-red-500">Class is required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectionId">Section</Label>
              <select
                id="sectionId"
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("sectionId", { required: "Section is required" })}
                disabled={!formClassId || formClassId === "none"}
              >
                <option value="none">
                  {!formClassId || formClassId === "none" ? "Select class first" : "Select section"}
                </option>
                {sectionsList.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {errors.sectionId && <p className="text-xs text-red-500">Section is required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="roll">Roll Number</Label>
              <Input
                id="roll"
                placeholder="e.g. 01"
                className="bg-white"
                {...register("roll", { required: "Roll is required" })}
              />
              {errors.roll && <p className="text-xs text-red-500">{errors.roll.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shiftId">Shift</Label>
              <select
                id="shiftId"
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("shiftId")}
              >
                <option value="none">Select shift</option>
                {shiftsList.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionId">Session</Label>
              <select
                id="sessionId"
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("sessionId")}
              >
                <option value="none">Select session</option>
                {sessionsList.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("status")}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Transferred">Transferred</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Credentials */}
      <Card className="shadow-sm border-none ring-1 ring-gray-200">
        <CardHeader className="bg-gray-50/50 rounded-t-xl py-3">
          <CardTitle className="text-base font-bold">User Login Mapping (Optional)</CardTitle>
          <CardDescription className="text-xs">Provide credentials if student needs login access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="e.g. jdoe10"
                className="bg-white"
                {...register("username")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="e.g. 01700000000"
                className="bg-white"
                {...register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. john@example.com"
                className="bg-white"
                {...register("email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isEditMode ? "Leave empty to keep current" : "Minimum 6 characters"}
                className="bg-white"
                {...register("password")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 pb-12">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          {isEditMode ? "Save Changes" : "Save Registration"}
        </Button>
      </div>
    </form>
  );
}
