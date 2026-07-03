"use client";

import { useAuditLogsQuery } from "@/apis/queries/operations_queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { fmt } from "./operationTypes";

export function AuditLogListView() {
    const [search, setSearch] = React.useState("");
    const { data: response, isLoading } = useAuditLogsQuery();
    const rows = response?.data || [];
    const filtered = rows.filter((r: any) => `${r.module} ${r.action} ${r.actorName} ${r.path}`.toLowerCase().includes(search.toLowerCase()));
    const columns: ColumnDef<any>[] = [{ accessorKey: "createdAt", header: "Time", cell: ({ row }) => fmt(row.original.createdAt) }, { accessorKey: "actorName", header: "Actor" }, { accessorKey: "module", header: "Module" }, { accessorKey: "action", header: "Action" }, { accessorKey: "method", header: "Method" }, { accessorKey: "path", header: "Path" }, { accessorKey: "statusCode", header: "Status" }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b"><Title>Audit Logs</Title><p className="text-xs text-muted-foreground mt-1">Successful create, update, and delete actions across API modules.</p></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="module" searchPlaceholder="Search audit logs..." searchValue={search} onSearch={setSearch} /></CardContent></Card></div>;
}
