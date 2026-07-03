"use client";

import { AxiosAPI } from "@/apis/configs";
import { counselingNoteDetailUrl, counselingNotesUrl } from "@/apis/endpoints/wellbeing_apis";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { useCounselingNotesQuery } from "@/apis/queries/wellbeing_queries";
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
import { CounselingNoteForm } from "./WellbeingForms";
import type { CounselingNoteData } from "./wellbeingTypes";
import { formatDate, staffLabel, studentLabel } from "./wellbeingTypes";

export function CounselingNoteListView() {
    const openModal = useModalStore((s) => s.openModal);
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [mode, setMode] = React.useState<"create" | "edit">("create");
    const [editing, setEditing] = React.useState<CounselingNoteData>();
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useCounselingNotesQuery();
    const { data: studentsResponse } = useStudentProfilesQuery({ status: "Active" });
    const { data: usersResponse } = useUsersQuery();
    const rows = response?.data || [];
    const students = studentsResponse?.data || [];
    const staff = usersResponse?.data || [];
    const filtered = rows.filter((r: CounselingNoteData) => `${studentLabel(r.student)} ${r.concernType} ${r.status} ${staffLabel(r.counselor)}`.toLowerCase().includes(search.toLowerCase()));
    const save = async (data: CounselingNoteData) => { setSaving(true); try { const res = mode === "create" ? await AxiosAPI.post(counselingNotesUrl, data) : await AxiosAPI.put(counselingNoteDetailUrl(data.id!), data); if (res.data?.success) { toast.success("Counseling note saved"); mutate(); setOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const del = (id: string) => openModal("confirm-delete", { title: "Archive counseling note", description: "This restricted note will be archived.", onConfirm: async () => { try { await AxiosAPI.delete(counselingNoteDetailUrl(id)); toast.success("Counseling note archived"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Archive failed"); } } });
    const columns: ColumnDef<CounselingNoteData>[] = [{ accessorKey: "student", header: "Student", cell: ({ row }) => studentLabel(row.original.student) }, { accessorKey: "noteDate", header: "Date", cell: ({ row }) => formatDate(row.original.noteDate) }, { accessorKey: "concernType", header: "Concern" }, { accessorKey: "counselor", header: "Counselor", cell: ({ row }) => staffLabel(row.original.counselor) }, { accessorKey: "nextFollowUpDate", header: "Follow Up", cell: ({ row }) => formatDate(row.original.nextFollowUpDate) }, { accessorKey: "status", header: "Status" }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setMode("edit"); setEditing({ ...row.original, noteDate: row.original.noteDate?.slice(0, 10), nextFollowUpDate: row.original.nextFollowUpDate?.slice(0, 10) }); setOpen(true); }} onDelete={() => del(row.original.id!)} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Counseling Notes</Title><p className="text-xs text-muted-foreground mt-1">Restricted student support notes and follow-up tracking.</p></div><Button onClick={() => { setMode("create"); setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Note</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="concernType" searchPlaceholder="Search counseling notes..." searchValue={search} onSearch={setSearch} /></CardContent></Card><CounselingNoteForm mode={mode} initialData={editing} students={students} staff={staff} isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={save} /></div>;
}
