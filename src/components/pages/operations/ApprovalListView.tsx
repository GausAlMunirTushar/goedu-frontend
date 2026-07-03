"use client";

import { AxiosAPI } from "@/apis/configs";
import { approvalDetailUrl, approvalsUrl, approveRequestUrl, rejectRequestUrl } from "@/apis/endpoints/operations_apis";
import { useApprovalsQuery } from "@/apis/queries/operations_queries";
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
import { ApprovalForm } from "./OperationForms";
import type { ApprovalData } from "./operationTypes";
import { fmt } from "./operationTypes";

export function ApprovalListView() {
    const openModal = useModalStore((s) => s.openModal);
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useApprovalsQuery();
    const rows = response?.data || [];
    const filtered = rows.filter((r: ApprovalData) => `${r.title} ${r.module} ${r.status}`.toLowerCase().includes(search.toLowerCase()));
    const save = async (data: ApprovalData) => { setSaving(true); try { await AxiosAPI.post(approvalsUrl, data); toast.success("Approval request created"); mutate(); setOpen(false); } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const decide = (id: string, action: "approve" | "reject") => openModal("confirm-delete", { title: `${action === "approve" ? "Approve" : "Reject"} request`, description: "This decision will be recorded with your user account.", onConfirm: async () => { try { await AxiosAPI.post(action === "approve" ? approveRequestUrl(id) : rejectRequestUrl(id), {}); toast.success(action === "approve" ? "Request approved" : "Request rejected"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Decision failed"); } } });
    const archive = (id: string) => openModal("confirm-delete", { title: "Archive request", description: "This approval request will be archived.", onConfirm: async () => { try { await AxiosAPI.delete(approvalDetailUrl(id)); toast.success("Request archived"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Archive failed"); } } });
    const columns: ColumnDef<ApprovalData>[] = [{ accessorKey: "title", header: "Title" }, { accessorKey: "module", header: "Module" }, { accessorKey: "entityType", header: "Entity" }, { accessorKey: "status", header: "Status" }, { accessorKey: "requestedAt", header: "Requested", cell: ({ row }) => fmt(row.original.requestedAt) }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onDelete={() => archive(row.original.id!)} extraActions={[{ label: "Approve", onClick: () => decide(row.original.id!, "approve"), disabled: row.original.status !== "Pending" }, { label: "Reject", onClick: () => decide(row.original.id!, "reject"), destructive: true, disabled: row.original.status !== "Pending" }]} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b"><div className="flex justify-between items-center gap-4"><div><Title>Approval Inbox</Title><p className="text-xs text-muted-foreground mt-1">Manual approval requests for sensitive operational decisions.</p></div><Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> New Request</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="title" searchPlaceholder="Search approvals..." searchValue={search} onSearch={setSearch} /></CardContent></Card><ApprovalForm isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={save} /></div>;
}
