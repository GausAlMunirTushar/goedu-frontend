"use client";

import { AxiosAPI } from "@/apis/configs";
import { homeworkDetailUrl, homeworksUrl, homeworkSubmissionsUrl } from "@/apis/endpoints/lms_apis";
import { useClassesQuery, useSectionsQuery, useSubjectsQuery } from "@/apis/queries/academic_queries";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { useHomeworksQuery } from "@/apis/queries/lms_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Send } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { HomeworkForm, SubmissionForm } from "./LmsForms";
import type { HomeworkData, HomeworkSubmissionData } from "./lmsTypes";

export function HomeworkListView() {
    const openModal = useModalStore((s) => s.openModal);
    const [search, setSearch] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [submitOpen, setSubmitOpen] = React.useState(false);
    const [mode, setMode] = React.useState<"create" | "edit">("create");
    const [editing, setEditing] = React.useState<HomeworkData>();
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useHomeworksQuery();
    const { data: classesRes } = useClassesQuery(); const { data: sectionsRes } = useSectionsQuery(); const { data: subjectsRes } = useSubjectsQuery(); const { data: teachersRes } = useUsersQuery("Teacher");
    const rows = response?.data || []; const classes = classesRes?.data || []; const sections = sectionsRes?.data || []; const subjects = subjectsRes?.data || []; const teachers = teachersRes?.data || [];
    const filtered = rows.filter((r: HomeworkData) => r.title?.toLowerCase().includes(search.toLowerCase()) || r.subject?.name?.toLowerCase().includes(search.toLowerCase()));
    const save = async (data: HomeworkData) => { setSaving(true); try { const payload = { ...data, sectionId: data.sectionId || undefined, teacherId: data.teacherId || undefined, attachmentUrl: data.attachmentUrl || undefined }; const res = mode === "create" ? await AxiosAPI.post(homeworksUrl, payload) : await AxiosAPI.put(homeworkDetailUrl(data.id!), payload); if (res.data?.success) { toast.success("Homework saved"); mutate(); setIsOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const submit = async (data: HomeworkSubmissionData) => { setSaving(true); try { const res = await AxiosAPI.post(homeworkSubmissionsUrl, data); if (res.data?.success) { toast.success("Homework submitted"); setSubmitOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Submit failed"); } finally { setSaving(false); } };
    const del = (id: string) => openModal("confirm-delete", { title: "Delete homework", description: "This homework will be archived.", onConfirm: async () => { try { await AxiosAPI.delete(homeworkDetailUrl(id)); toast.success("Homework deleted"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Delete failed"); } } });
    const columns: ColumnDef<HomeworkData>[] = [{ accessorKey: "title", header: "Title" }, { header: "Class", cell: ({ row }) => row.original.class?.name || "-" }, { header: "Subject", cell: ({ row }) => row.original.subject?.name || "-" }, { header: "Due", cell: ({ row }) => row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : "-" }, { header: "Submissions", cell: ({ row }) => row.original._count?.submissions || 0 }, { accessorKey: "status", header: "Status" }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setMode("edit"); setEditing({ ...row.original, dueDate: row.original.dueDate?.slice(0, 10) }); setIsOpen(true); }} onDelete={() => del(row.original.id!)} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Homework</Title><p className="text-xs text-muted-foreground mt-1">Publish homework and accept student submissions.</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => setSubmitOpen(true)}><Send className="h-4 w-4 mr-2" /> Submit</Button><Button onClick={() => { setMode("create"); setEditing(undefined); setIsOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Homework</Button></div></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="title" searchPlaceholder="Search homework..." searchValue={search} onSearch={setSearch} /></CardContent></Card><HomeworkForm mode={mode} initialData={editing} isOpen={isOpen} isSubmitting={saving} onClose={() => setIsOpen(false)} onSubmit={save} classes={classes} sections={sections} subjects={subjects} teachers={teachers} /><SubmissionForm homeworks={rows} isOpen={submitOpen} isSubmitting={saving} onClose={() => setSubmitOpen(false)} onSubmit={submit} /></div>;
}
