"use client";

import { AxiosAPI } from "@/apis/configs";
import { certificateTemplateDetailUrl, certificateTemplatesUrl } from "@/apis/endpoints/certificate_apis";
import { useCertificateTemplatesQuery } from "@/apis/queries/certificate_queries";
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
import { CertificateTemplateForm } from "./CertificateForms";
import type { CertificateTemplateData } from "./certificateTypes";

export function CertificateTemplateListView() {
    const openModal = useModalStore((s) => s.openModal);
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [mode, setMode] = React.useState<"create" | "edit">("create");
    const [editing, setEditing] = React.useState<CertificateTemplateData>();
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useCertificateTemplatesQuery();
    const rows = response?.data || [];
    const filtered = rows.filter((r: CertificateTemplateData) => r.name?.toLowerCase().includes(search.toLowerCase()) || r.type?.toLowerCase().includes(search.toLowerCase()));
    const save = async (data: CertificateTemplateData) => { setSaving(true); try { const res = mode === "create" ? await AxiosAPI.post(certificateTemplatesUrl, data) : await AxiosAPI.put(certificateTemplateDetailUrl(data.id!), data); if (res.data?.success) { toast.success("Template saved"); mutate(); setOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Operation failed"); } finally { setSaving(false); } };
    const del = (id: string) => openModal("confirm-delete", { title: "Delete template", description: "This template will be marked inactive.", onConfirm: async () => { try { await AxiosAPI.delete(certificateTemplateDetailUrl(id)); toast.success("Template deleted"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Delete failed"); } } });
    const columns: ColumnDef<CertificateTemplateData>[] = [{ accessorKey: "name", header: "Template" }, { accessorKey: "type", header: "Type" }, { accessorKey: "title", header: "Title" }, { accessorKey: "status", header: "Status" }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setMode("edit"); setEditing(row.original); setOpen(true); }} onDelete={() => del(row.original.id!)} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Certificate Templates</Title><p className="text-xs text-muted-foreground mt-1">Create reusable certificate text with placeholders.</p></div><Button onClick={() => { setMode("create"); setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Template</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="name" searchPlaceholder="Search templates..." searchValue={search} onSearch={setSearch} /></CardContent></Card><CertificateTemplateForm mode={mode} initialData={editing} isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={save} /></div>;
}
