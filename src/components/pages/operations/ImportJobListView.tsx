"use client";

import { AxiosAPI } from "@/apis/configs";
import { importJobDetailUrl, importJobsUrl } from "@/apis/endpoints/operations_apis";
import { useImportJobsQuery } from "@/apis/queries/operations_queries";
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
import { ImportJobForm } from "./OperationForms";
import type { ImportJobData } from "./operationTypes";
import { fmt } from "./operationTypes";

export function ImportJobListView() {
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [mode, setMode] = React.useState<"create" | "edit">("create");
    const [editing, setEditing] = React.useState<ImportJobData>();
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useImportJobsQuery();
    const rows = response?.data || [];
    const filtered = rows.filter((r: ImportJobData) => `${r.module} ${r.fileName} ${r.status}`.toLowerCase().includes(search.toLowerCase()));
    const save = async (data: ImportJobData) => { setSaving(true); try { mode === "create" ? await AxiosAPI.post(importJobsUrl, data) : await AxiosAPI.put(importJobDetailUrl(data.id!), data); toast.success("Import job saved"); mutate(); setOpen(false); } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const columns: ColumnDef<ImportJobData>[] = [{ accessorKey: "module", header: "Module" }, { accessorKey: "fileName", header: "File" }, { accessorKey: "status", header: "Status" }, { accessorKey: "processedRows", header: "Processed" }, { accessorKey: "successRows", header: "Success" }, { accessorKey: "failedRows", header: "Failed" }, { accessorKey: "createdAt", header: "Created", cell: ({ row }) => fmt(row.original.createdAt) }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setMode("edit"); setEditing(row.original); setOpen(true); }} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b"><div className="flex justify-between items-center gap-4"><div><Title>Import Jobs</Title><p className="text-xs text-muted-foreground mt-1">Track import progress, row counts, and failure summaries.</p></div><Button onClick={() => { setMode("create"); setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Job</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="module" searchPlaceholder="Search import jobs..." searchValue={search} onSearch={setSearch} /></CardContent></Card><ImportJobForm mode={mode} initialData={editing} isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={save} /></div>;
}
