// src/app/(main)/teacher/edit/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { TeacherForm } from "@/components/pages/teacher/TeacherForm";
import Title from "@/components/ui/custom-ui/title";
import { AxiosAPI } from "@/apis/configs";
import { teacherProfileDetailUrl } from "@/apis/endpoints/teacher_apis";
import { useTeacherProfileQuery } from "@/apis/queries/teacher_queries";
import { toast } from "sonner";

export default function EditTeacherPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: response, isLoading } = useTeacherProfileQuery(id);
  const teacher = response?.data;

  const handleSubmit = async (updated: any) => {
    try {
      const res = await AxiosAPI.put(teacherProfileDetailUrl(id), updated);
      if (res.data?.success) {
        toast.success(res.data.message || "Teacher profile updated successfully");
        router.push("/teacher");
      } else {
        toast.error(res.data?.message || "Failed to update teacher profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred while updating teacher profile");
    }
  };

  if (isLoading) return <div className="p-4">Loading teacher details...</div>;
  if (!teacher) return <div className="p-4">Teacher profile not found.</div>;

  return (
    <div className="p-4 space-y-6">
      <Title>Edit Teacher</Title>
      <TeacherForm
        mode="edit"
        initialData={teacher}
        isOpen={true}
        onClose={() => router.back()}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
