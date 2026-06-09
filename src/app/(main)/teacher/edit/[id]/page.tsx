// src/app/(main)/teacher/edit/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { TeacherForm } from "@/components/pages/teacher/TeacherForm";
import Title from "@/components/ui/custom-ui/title";
import { teachers } from "@/data/teachers";
import { useState, useEffect } from "react";

export default function EditTeacherPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    const found = teachers.find((t) => t.id === id);
    if (found) setTeacher(found);
    else router.replace("/teacher");
  }, [id, router]);

  const handleSubmit = (updated: any) => {
    // In a real app, would call API. Here we just navigate back.
    router.push("/teacher");
  };

  if (!teacher) return null;

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
