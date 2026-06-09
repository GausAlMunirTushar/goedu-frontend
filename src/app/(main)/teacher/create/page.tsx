// src/app/(main)/teacher/create/page.tsx
"use client";

import { TeacherForm } from "@/components/pages/teacher/TeacherForm";
import Title from "@/components/ui/custom-ui/title";
import { useState } from "react";
import { teachers } from "@/data/teachers";
import { useRouter } from "next/navigation";

export default function CreateTeacherPage() {
  const router = useRouter();
  const [data, setData] = useState(teachers);

  const handleSubmit = (newTeacher: any) => {
    // In a real app this would call an API; here we just push to the local array.
    const newId = (data.length + 1).toString();
    setData([...data, { ...newTeacher, id: newId }]);
    router.push("/teacher");
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
