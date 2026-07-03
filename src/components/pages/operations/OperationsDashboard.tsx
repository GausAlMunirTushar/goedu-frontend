"use client";

import { useOperationsDashboardQuery } from "@/apis/queries/operations_queries";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { Bell, ClipboardList, Database, FileSpreadsheet, ShieldCheck } from "lucide-react";

const stats = [{ key: "auditLogs", label: "Audit Logs", icon: ClipboardList }, { key: "pendingApprovals", label: "Pending Approvals", icon: ShieldCheck }, { key: "runningImports", label: "Running Imports", icon: FileSpreadsheet }, { key: "unreadNotifications", label: "Unread Notifications", icon: Bell }, { key: "backupExports", label: "Backup Exports", icon: Database }];

export function OperationsDashboard() {
    const { data: response, isLoading } = useOperationsDashboardQuery();
    const data = response?.data || {};
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><div><Title>Operations</Title><p className="text-xs text-muted-foreground mt-1">Traceability, approvals, import tracking, notifications, and backup requests.</p></div><div className="grid grid-cols-1 md:grid-cols-5 gap-4">{stats.map((stat) => { const Icon = stat.icon; return <Card key={stat.key}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-2xl font-semibold text-slate-900 mt-1">{data[stat.key] ?? 0}</p></div><div className="h-10 w-10 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center"><Icon className="h-5 w-5" /></div></CardContent></Card>; })}</div></div>;
}
