"use client";

import { AxiosAPI } from "@/apis/configs";
import { homeworkSubmissionReviewUrl } from "@/apis/endpoints/lms_apis";
import { useHomeworkSubmissionsQuery } from "@/apis/queries/lms_queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { toast } from "sonner";
import { ReviewForm } from "./LmsForms";
import type { HomeworkSubmissionData } from "./lmsTypes";

export function HomeworkSubmissionListView() {
    const [search, setSearch] = React.useState("");
    const [selected, setSelected] = React.useState<HomeworkSubmissionData>();
    const [open, setOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useHomeworkSubmissionsQuery();
    const rows = response?.data || [];
    const filtered = rows.filter((r: HomeworkSubmissionData) => r.homework?.title?.toLowerCase().includes(search.toLowerCase()) || r.student?.studentId?.toLowerCase().includes(search.toLowerCase()));
    const review = async (data: HomeworkSubmissionData) => { if (!selected?.id) return; setSaving(true); try { const res = await AxiosAPI.put(homeworkSubmissionReviewUrl(selected.id), data); if (res.data?.success) { toast.success("Submission reviewed"); mutate(); setOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Review failed"); } finally { setSaving(false); } };
    const columns: ColumnDef<HomeworkSubmissionData>[] = [{ header: "Homework", cell: ({ row }) => row.original.homework?.title || "-" }, { header: "Student", cell: ({ row }) => row.original.student?.fullName || row.original.student?.studentId || "-" }, { header: "Submitted", cell: ({ row }) => row.original.status || "-" }, { accessorKey: "marks", header: "Marks" }, { accessorKey: "grade", header: "Grade" }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setSelected(row.original); setOpen(true); }} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><div><Title>Homework Submissions</Title><p className="text-xs text-muted-foreground mt-1">Review, grade, and comment on submissions.</p></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="homework" searchPlaceholder="Search submissions..." searchValue={search} onSearch={setSearch} /></CardContent></Card><ReviewForm submission={selected} isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={review} /></div>;
}
