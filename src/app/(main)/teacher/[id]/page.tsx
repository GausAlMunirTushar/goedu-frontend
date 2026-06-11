// src/app/(main)/teacher/[id]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import Title from "@/components/ui/custom-ui/title"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit3 } from "lucide-react"
import { useTeacherProfileQuery } from "@/apis/queries/teacher_queries"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TeacherDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { data: response, isLoading } = useTeacherProfileQuery(id)
  const teacher = response?.data

  if (isLoading) return <div className="p-4">Loading teacher details...</div>
  if (!teacher) return <div className="p-4">Teacher profile not found.</div>

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Title>Teacher Profile</Title>
        </div>
        <Button onClick={() => router.push(`/teacher/edit/${teacher.id}`)} className="flex items-center gap-2">
          <Edit3 className="w-4 h-4" /> Edit Profile
        </Button>
      </div>

      <Card className="max-w-3xl">
        <CardHeader className="bg-white border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{`${teacher.firstName} ${teacher.lastName}`}</h2>
              <p className="text-sm text-gray-500">@{teacher.username}</p>
            </div>
            <Badge
              variant={teacher.isActive ? "default" : "secondary"}
              className={teacher.isActive ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "border-none"}
            >
              {teacher.isActive ? "Active Account" : "Inactive Account"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="bg-white pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Designation</span>
              <p className="text-sm font-medium text-gray-900">{teacher.designation?.title || "Not Assigned"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</span>
              <p className="text-sm font-medium text-gray-900">{teacher.department?.name || "Not Assigned"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
              <p className="text-sm font-medium text-gray-900">{teacher.email || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</span>
              <p className="text-sm font-medium text-gray-900">{teacher.phone || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined Date</span>
              <p className="text-sm font-medium text-gray-900">
                {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
