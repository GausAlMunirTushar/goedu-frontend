"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Pencil, Trash2, Search, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useExamSchedulesQuery, useExamsQuery } from "@/apis/queries/exam_queries";
import { createExamSchedule, updateExamSchedule, deleteExamSchedule } from "@/apis/mutations/exam_mutations";
import { useClassesQuery, useSectionsQuery, useSubjectsQuery, useRoomsQuery } from "@/apis/queries/academic_queries";

const statusStyle: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Ongoing: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Postponed: "bg-red-100 text-red-700",
};

export function ExamSchedulePage() {
  const { data: response, mutate, isLoading } = useExamSchedulesQuery();
  const schedules = response?.data || [];

  const { data: examsRes } = useExamsQuery();
  const examsList = examsRes?.data || [];

  const { data: classesRes } = useClassesQuery();
  const classesList = classesRes?.data || [];

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    examId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    date: "",
    startTime: "10:00",
    endTime: "13:00",
    roomId: "" as string | null,
    status: "Scheduled" as "Scheduled" | "Ongoing" | "Completed" | "Postponed",
  });

  // Load nested options
  const { data: sectionsRes } = useSectionsQuery(formData.classId);
  const sectionsList = sectionsRes?.data || [];

  const { data: subjectsRes } = useSubjectsQuery(formData.classId);
  const subjectsList = subjectsRes?.data || [];

  const { data: roomsRes } = useRoomsQuery();
  const roomsList = roomsRes?.data || [];

  // Reset dependent fields when class changes
  const handleClassChange = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      classId,
      sectionId: "",
      subjectId: "",
    }));
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      examId: examsList[0]?.id || "",
      classId: classesList[0]?.id || "",
      sectionId: "",
      subjectId: "",
      date: "",
      startTime: "10:00",
      endTime: "13:00",
      roomId: "",
      status: "Scheduled",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (sched: any) => {
    setEditingId(sched.id);
    setFormData({
      examId: sched.examId,
      classId: sched.classId,
      sectionId: sched.sectionId,
      subjectId: sched.subjectId,
      date: sched.date ? new Date(sched.date).toISOString().split('T')[0] : "",
      startTime: sched.startTime,
      endTime: sched.endTime,
      roomId: sched.roomId || "",
      status: sched.status,
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.examId || !formData.classId || !formData.sectionId || !formData.subjectId || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      ...formData,
      roomId: formData.roomId || null,
    };

    try {
      if (editingId) {
        await updateExamSchedule(editingId, payload);
        toast.success("Schedule updated successfully");
      } else {
        await createExamSchedule(payload);
        toast.success("Schedule created successfully");
      }
      mutate();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save schedule");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      try {
        await deleteExamSchedule(id);
        toast.success("Schedule deleted");
        mutate();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete schedule");
      }
    }
  };

  const filtered = schedules.filter((e: any) =>
    (e.exam?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.subject?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Exam Schedule</Title>
          <p className="text-sm text-muted-foreground mt-1">Manage and view the timetable for all examinations.</p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Create Schedule
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by exam or subject..."
          className="pl-9 h-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-base font-bold">Timetable</CardTitle>
          <CardDescription className="text-xs">Full schedule of upcoming and past examinations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading schedules...</div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No exam schedules created yet. Click "Create Schedule" to get started.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Exam & Subject</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Class/Section</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Date & Time</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Venue</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item: any) => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                      <td className="py-3.5">
                        <div className="font-medium">{item.subject?.name}</div>
                        <div className="text-xs text-muted-foreground">{item.exam?.name}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-medium">{item.class?.name}</div>
                        <div className="text-xs text-muted-foreground">Section {item.section?.name}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {item.date ? new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "-"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.startTime} - {item.endTime}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          {item.room ? `${item.room.name} (${item.room.building})` : (item.roomId || "No Room Assigned")}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[item.status] || ""}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex gap-1">
                          <Button onClick={() => handleOpenEdit(item)} variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button onClick={() => handleDelete(item.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Exam Schedule" : "Create Exam Schedule"}</DialogTitle>
            <DialogDescription>Link exams to classes, sections, subjects, dates, and venues.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="sched-exam">Exam Title *</Label>
              <select
                id="sched-exam"
                className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={formData.examId}
                onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
              >
                <option value="">Select Exam</option>
                {examsList.map((e: any) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sched-class">Class Name *</Label>
                <select
                  id="sched-class"
                  className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={formData.classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                >
                  <option value="">Select Class</option>
                  {classesList.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sched-sec">Section *</Label>
                <select
                  id="sched-sec"
                  className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={formData.sectionId}
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                >
                  <option value="">Select Section</option>
                  {sectionsList.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sched-subj">Subject *</Label>
                <select
                  id="sched-subj"
                  className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {subjectsList.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sched-room">Room / Venue</Label>
                <select
                  id="sched-room"
                  className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={formData.roomId || ""}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value || null })}
                >
                  <option value="">No Room / TBD</option>
                  {roomsList.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.building})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sched-date">Date *</Label>
              <Input
                id="sched-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sched-start">Start Time *</Label>
                <Input
                  id="sched-start"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sched-end">End Time *</Label>
                <Input
                  id="sched-end"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sched-status">Status</Label>
              <select
                id="sched-status"
                className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Postponed">Postponed</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
