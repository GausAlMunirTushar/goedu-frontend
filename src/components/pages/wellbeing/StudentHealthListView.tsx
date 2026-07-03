"use client";

import { AxiosAPI } from "@/apis/configs";
import { healthRecordsUrl } from "@/apis/endpoints/wellbeing_apis";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { useHealthRecordsQuery } from "@/apis/queries/wellbeing_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { HealthRecordForm } from "./WellbeingForms";
import type { StudentHealthRecordData } from "./wellbeingTypes";
import { studentLabel } from "./wellbeingTypes";

export function StudentHealthListView() {
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [mode, setMode] = React.useState<"create" | "edit">("create");
    const [editing, setEditing] = React.useState<StudentHealthRecordData>();
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useHealthRecordsQuery();
    const { data: studentsResponse } = useStudentProfilesQuery({ status: "Active" });
    const rows = response?.data || [];
    const students = studentsResponse?.data || [];
    const filtered = rows.filter((r: StudentHealthRecordData) => `${studentLabel(r.student)} ${r.bloodGroup} ${r.allergies} ${r.emergencyContactPhone}`.toLowerCase().includes(search.toLowerCase()));
    const save = async (data: StudentHealthRecordData) => { setSaving(true); try { const res = await AxiosAPI.put(healthRecordsUrl, data); if (res.data?.success) { toast.success("Health profile saved"); mutate(); setOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const columns: ColumnDef<StudentHealthRecordData>[] = [{ accessorKey: "student", header: "Student", cell: ({ row }) => studentLabel(row.original.student) }, { accessorKey: "bloodGroup", header: "Blood Group" }, { accessorKey: "allergies", header: "Allergies" }, { accessorKey: "emergencyContactName", header: "Emergency Contact" }, { accessorKey: "emergencyContactPhone", header: "Phone" }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setMode("edit"); setEditing(row.original); setOpen(true); }} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Health Profiles</Title><p className="text-xs text-muted-foreground mt-1">Maintain allergy, medical note, and emergency contact records.</p></div><Button onClick={() => { setMode("create"); setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Profile</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="bloodGroup" searchPlaceholder="Search health profiles..." searchValue={search} onSearch={setSearch} /></CardContent></Card><HealthRecordForm mode={mode} initialData={editing} students={students} isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={save} /></div>;
}
