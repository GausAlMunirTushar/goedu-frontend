"use client";

import { AxiosAPI } from "@/apis/configs";
import { disciplineIncidentDetailUrl, disciplineIncidentResolveUrl, disciplineIncidentsUrl } from "@/apis/endpoints/wellbeing_apis";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { useDisciplineIncidentsQuery } from "@/apis/queries/wellbeing_queries";
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
import { DisciplineIncidentForm } from "./WellbeingForms";
import type { DisciplineIncidentData } from "./wellbeingTypes";
import { formatDate, studentLabel } from "./wellbeingTypes";

export function DisciplineIncidentListView() {
    const openModal = useModalStore((s) => s.openModal);
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [mode, setMode] = React.useState<"create" | "edit">("create");
    const [editing, setEditing] = React.useState<DisciplineIncidentData>();
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useDisciplineIncidentsQuery();
    const { data: studentsResponse } = useStudentProfilesQuery({ status: "Active" });
    const { data: usersResponse } = useUsersQuery();
    const rows = response?.data || [];
    const students = studentsResponse?.data || [];
    const staff = usersResponse?.data || [];
    const filtered = rows.filter((r: DisciplineIncidentData) => `${studentLabel(r.student)} ${r.category} ${r.severity} ${r.status}`.toLowerCase().includes(search.toLowerCase()));
    const save = async (data: DisciplineIncidentData) => { setSaving(true); try { const res = mode === "create" ? await AxiosAPI.post(disciplineIncidentsUrl, data) : await AxiosAPI.put(disciplineIncidentDetailUrl(data.id!), data); if (res.data?.success) { toast.success("Incident saved"); mutate(); setOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const resolve = (id: string) => openModal("confirm-delete", { title: "Resolve incident", description: "This incident will be marked resolved.", onConfirm: async () => { try { await AxiosAPI.post(disciplineIncidentResolveUrl(id), {}); toast.success("Incident resolved"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Resolve failed"); } } });
    const del = (id: string) => openModal("confirm-delete", { title: "Archive incident", description: "This incident will be archived.", onConfirm: async () => { try { await AxiosAPI.delete(disciplineIncidentDetailUrl(id)); toast.success("Incident archived"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Archive failed"); } } });
    const columns: ColumnDef<DisciplineIncidentData>[] = [{ accessorKey: "student", header: "Student", cell: ({ row }) => studentLabel(row.original.student) }, { accessorKey: "incidentDate", header: "Date", cell: ({ row }) => formatDate(row.original.incidentDate) }, { accessorKey: "category", header: "Category" }, { accessorKey: "severity", header: "Severity" }, { accessorKey: "status", header: "Status" }, { id: "actions", header: "Actions", cell: ({ row }) => <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => resolve(row.original.id!)} disabled={row.original.status === "Resolved"}>Resolve</Button><TableActions onEdit={() => { setMode("edit"); setEditing({ ...row.original, incidentDate: row.original.incidentDate?.slice(0, 10) }); setOpen(true); }} onDelete={() => del(row.original.id!)} /></div> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Discipline Incidents</Title><p className="text-xs text-muted-foreground mt-1">Register incidents, actions, and resolution status.</p></div><Button onClick={() => { setMode("create"); setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Incident</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="category" searchPlaceholder="Search incidents..." searchValue={search} onSearch={setSearch} /></CardContent></Card><DisciplineIncidentForm mode={mode} initialData={editing} students={students} staff={staff} isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={save} /></div>;
}
