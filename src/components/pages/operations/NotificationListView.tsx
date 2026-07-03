"use client";

import { AxiosAPI } from "@/apis/configs";
import { notificationReadUrl, notificationsUrl } from "@/apis/endpoints/operations_apis";
import { useNotificationsQuery } from "@/apis/queries/operations_queries";
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
import { NotificationForm } from "./OperationForms";
import type { NotificationData } from "./operationTypes";
import { fmt } from "./operationTypes";

export function NotificationListView() {
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useNotificationsQuery();
    const rows = response?.data || [];
    const filtered = rows.filter((r: NotificationData) => `${r.title} ${r.body} ${r.type} ${r.status}`.toLowerCase().includes(search.toLowerCase()));
    const save = async (data: NotificationData) => { setSaving(true); try { await AxiosAPI.post(notificationsUrl, data); toast.success("Notification created"); mutate(); setOpen(false); } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const markRead = async (id: string) => { try { await AxiosAPI.post(notificationReadUrl(id), {}); toast.success("Notification marked read"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } };
    const columns: ColumnDef<NotificationData>[] = [{ accessorKey: "title", header: "Title" }, { accessorKey: "type", header: "Type" }, { accessorKey: "status", header: "Status" }, { accessorKey: "body", header: "Message" }, { accessorKey: "createdAt", header: "Created", cell: ({ row }) => fmt(row.original.createdAt) }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions extraActions={[{ label: "Mark Read", onClick: () => markRead(row.original.id!), disabled: row.original.status === "Read" }]} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b"><div className="flex justify-between items-center gap-4"><div><Title>Notifications</Title><p className="text-xs text-muted-foreground mt-1">Operational messages for users and institution admins.</p></div><Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> New Notification</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="title" searchPlaceholder="Search notifications..." searchValue={search} onSearch={setSearch} /></CardContent></Card><NotificationForm isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={save} /></div>;
}
