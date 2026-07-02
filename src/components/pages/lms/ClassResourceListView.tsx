"use client";

import { AxiosAPI } from "@/apis/configs";
import { classResourceDetailUrl, classResourcesUrl } from "@/apis/endpoints/lms_apis";
import { useClassesQuery, useSectionsQuery, useSubjectsQuery } from "@/apis/queries/academic_queries";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { useClassResourcesQuery } from "@/apis/queries/lms_queries";
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
import { ResourceForm } from "./LmsForms";
import type { ClassResourceData } from "./lmsTypes";

export function ClassResourceListView() {
    const openModal = useModalStore((s) => s.openModal);
    const [search, setSearch] = React.useState(""); const [open, setOpen] = React.useState(false); const [mode, setMode] = React.useState<"create" | "edit">("create"); const [editing, setEditing] = React.useState<ClassResourceData>(); const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useClassResourcesQuery();
    const { data: classesRes } = useClassesQuery(); const { data: sectionsRes } = useSectionsQuery(); const { data: subjectsRes } = useSubjectsQuery(); const { data: teachersRes } = useUsersQuery("Teacher");
    const rows = response?.data || []; const classes = classesRes?.data || []; const sections = sectionsRes?.data || []; const subjects = subjectsRes?.data || []; const teachers = teachersRes?.data || [];
    const filtered = rows.filter((r: ClassResourceData) => r.title?.toLowerCase().includes(search.toLowerCase()) || r.type?.toLowerCase().includes(search.toLowerCase()));
    const save = async (data: ClassResourceData) => { setSaving(true); try { const payload = { ...data, sectionId: data.sectionId || undefined, subjectId: data.subjectId || undefined, teacherId: data.teacherId || undefined, fileUrl: data.fileUrl || undefined }; const res = mode === "create" ? await AxiosAPI.post(classResourcesUrl, payload) : await AxiosAPI.put(classResourceDetailUrl(data.id!), payload); if (res.data?.success) { toast.success("Resource saved"); mutate(); setOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const del = (id: string) => openModal("confirm-delete", { title: "Delete resource", description: "This resource will be archived.", onConfirm: async () => { try { await AxiosAPI.delete(classResourceDetailUrl(id)); toast.success("Resource deleted"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Delete failed"); } } });
    const columns: ColumnDef<ClassResourceData>[] = [{ accessorKey: "title", header: "Title" }, { accessorKey: "type", header: "Type" }, { header: "Class", cell: ({ row }) => row.original.class?.name || "-" }, { header: "Subject", cell: ({ row }) => row.original.subject?.name || "-" }, { accessorKey: "status", header: "Status" }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setMode("edit"); setEditing(row.original); setOpen(true); }} onDelete={() => del(row.original.id!)} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Class Resources</Title><p className="text-xs text-muted-foreground mt-1">Publish links, files, and video resources for classes.</p></div><Button onClick={() => { setMode("create"); setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Resource</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="title" searchPlaceholder="Search resources..." searchValue={search} onSearch={setSearch} /></CardContent></Card><ResourceForm mode={mode} initialData={editing} isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={save} classes={classes} sections={sections} subjects={subjects} teachers={teachers} /></div>;
}
