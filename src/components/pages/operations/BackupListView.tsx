"use client";

import { AxiosAPI } from "@/apis/configs";
import { backupsUrl } from "@/apis/endpoints/operations_apis";
import { useBackupsQuery } from "@/apis/queries/operations_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Database } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import type { BackupData } from "./operationTypes";
import { fmt } from "./operationTypes";

export function BackupListView() {
    const [search, setSearch] = React.useState("");
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useBackupsQuery();
    const rows = response?.data || [];
    const filtered = rows.filter((r: BackupData) => `${r.status} ${r.format} ${r.scope}`.toLowerCase().includes(search.toLowerCase()));
    const requestBackup = async () => { setSaving(true); try { await AxiosAPI.post(backupsUrl, { format: "json", scope: "institution" }); toast.success("Backup export requested"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const columns: ColumnDef<BackupData>[] = [{ accessorKey: "createdAt", header: "Requested", cell: ({ row }) => fmt(row.original.createdAt) }, { accessorKey: "status", header: "Status" }, { accessorKey: "format", header: "Format" }, { accessorKey: "scope", header: "Scope" }, { accessorKey: "expiresAt", header: "Expires", cell: ({ row }) => fmt(row.original.expiresAt) }, { accessorKey: "fileUrl", header: "File" }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b"><div className="flex justify-between items-center gap-4"><div><Title>Backup Exports</Title><p className="text-xs text-muted-foreground mt-1">Request institution backup export jobs and track availability.</p></div><Button onClick={requestBackup} disabled={saving}><Database className="h-4 w-4 mr-2" /> Request Backup</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="status" searchPlaceholder="Search backup exports..." searchValue={search} onSearch={setSearch} /></CardContent></Card></div>;
}
