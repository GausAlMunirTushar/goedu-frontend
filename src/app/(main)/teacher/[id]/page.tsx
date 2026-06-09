// src/app/(main)/teacher/[id]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import Title from "@/components/ui/custom-ui/title"
import { teachers } from "@/data/teachers"
import { useEffect, useState } from "react"

export default function TeacherDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)

  useEffect(() => {
    const found = teachers.find((t) => t.id === id)
    if (found) setTeacher(found)
    else router.replace("/teacher")
  }, [id, router])

  if (!teacher) return null

  return (
    <div className="p-4 space-y-6">
      <Title>Teacher Details</Title>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p><strong>Name:</strong> {teacher.name}</p>
        <p><strong>Designation:</strong> {teacher.designation}</p>
        {teacher.department && (
          <p><strong>Department:</strong> {teacher.department}</p>
        )}
        {teacher.email && (
          <p><strong>Email:</strong> {teacher.email}</p>
        )}
        {teacher.phone && (
          <p><strong>Phone:</strong> {teacher.phone}</p>
        )}
      </div>
    </div>
  )
}
