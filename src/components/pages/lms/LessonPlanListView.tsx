"use client";

import { AxiosAPI } from "@/apis/configs";
import { lessonPlanDetailUrl, lessonPlansUrl } from "@/apis/endpoints/lms_apis";
import { useClassesQuery, useSectionsQuery, useSubjectsQuery } from "@/apis/queries/academic_queries";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { useLessonPlansQuery } from "@/apis/queries/lms_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { LessonPlanForm } from "./LmsForms";
import type { LessonPlanData } from "./lmsTypes";

export function LessonPlanListView() {
    const openModal = useModalStore((s) => s.openModal);
    const [search, setSearch] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [mode, setMode] = React.useState<"create" | "edit">("create");
    const [editing, setEditing] = React.useState<LessonPlanData>();
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useLessonPlansQuery();
    const { data: classesRes } = useClassesQuery(); const { data: sectionsRes } = useSectionsQuery(); const { data: subjectsRes } = useSubjectsQuery(); const { data: teachersRes } = useUsersQuery("Teacher");
    const rows = response?.data || []; const classes = classesRes?.data || []; const sections = sectionsRes?.data || []; const subjects = subjectsRes?.data || []; const teachers = teachersRes?.data || [];
    const filtered = rows.filter((r: LessonPlanData) => r.title?.toLowerCase().includes(search.toLowerCase()) || r.subject?.name?.toLowerCase().includes(search.toLowerCase()));
    const submit = async (data: LessonPlanData) => { setSaving(true); try { const payload = { ...data, sectionId: data.sectionId || undefined, teacherId: data.teacherId || undefined }; const res = mode === "create" ? await AxiosAPI.post(lessonPlansUrl, payload) : await AxiosAPI.put(lessonPlanDetailUrl(data.id!), payload); if (res.data?.success) { toast.success("Lesson plan saved"); mutate(); setIsOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const del = (id: string) => openModal("confirm-delete", { title: "Delete lesson plan", description: "This lesson plan will be archived.", onConfirm: async () => { try { await AxiosAPI.delete(lessonPlanDetailUrl(id)); toast.success("Lesson plan deleted"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Delete failed"); } } });
    const columns: ColumnDef<LessonPlanData>[] = [{ accessorKey: "title", header: "Title" }, { header: "Class", cell: ({ row }) => row.original.class?.name || "-" }, { header: "Section", cell: ({ row }) => row.original.section?.name || "-" }, { header: "Subject", cell: ({ row }) => row.original.subject?.name || "-" }, { header: "Date", cell: ({ row }) => row.original.planDate ? new Date(row.original.planDate).toLocaleDateString() : "-" }, { accessorKey: "status", header: "Status" }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setMode("edit"); setEditing({ ...row.original, planDate: row.original.planDate?.slice(0, 10) }); setIsOpen(true); }} onDelete={() => del(row.original.id!)} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Lesson Plans</Title><p className="text-xs text-muted-foreground mt-1">Plan objectives, activities, materials, and homework notes.</p></div><Button onClick={() => { setMode("create"); setEditing(undefined); setIsOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Plan</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="title" searchPlaceholder="Search plans..." searchValue={search} onSearch={setSearch} /></CardContent></Card><LessonPlanForm mode={mode} initialData={editing} isOpen={isOpen} isSubmitting={saving} onClose={() => setIsOpen(false)} onSubmit={submit} classes={classes} sections={sections} subjects={subjects} teachers={teachers} /></div>;
}
