// src/app/(main)/teacher/create/page.tsx
"use client";

import { TeacherForm } from "@/components/pages/teacher/TeacherForm";
import Title from "@/components/ui/custom-ui/title";
import { useRouter } from "next/navigation";
import { AxiosAPI } from "@/apis/configs";
import { teachersProfilesUrl } from "@/apis/endpoints/teacher_apis";
import { toast } from "sonner";

export default function CreateTeacherPage() {
  const router = useRouter();

  const handleSubmit = async (newTeacher: any) => {
    try {
      const res = await AxiosAPI.post(teachersProfilesUrl, newTeacher);
      if (res.data?.success) {
        toast.success(res.data.message || "Teacher profile created successfully");
        router.push("/teacher");
      } else {
        toast.error(res.data?.message || "Failed to create teacher profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred while creating teacher profile");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <Title>Create New Teacher</Title>
      <TeacherForm
        mode="create"
        inline={true}
        isOpen={true}
        onClose={() => router.back()}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
