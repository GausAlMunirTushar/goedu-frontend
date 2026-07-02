"use client";

import { AxiosAPI } from "@/apis/configs";
import { inventoryAssetDetailUrl, inventoryAssetsUrl } from "@/apis/endpoints/inventory_apis";
import { useInventoryAssetsQuery, useInventoryCategoriesQuery } from "@/apis/queries/inventory_queries";
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
import { AssetForm } from "./InventoryForms";
import type { AssetItemData } from "./inventoryTypes";

export function InventoryAssetListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<AssetItemData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useInventoryAssetsQuery();
    const { data: categoryResponse } = useInventoryCategoriesQuery();
    const rows = React.useMemo(() => response?.data || [], [response]);
    const categories = React.useMemo(() => categoryResponse?.data || [], [categoryResponse]);
    const filteredRows = React.useMemo(() => rows.filter((item: AssetItemData) => item.name?.toLowerCase().includes(search.toLowerCase()) || item.assetTag?.toLowerCase().includes(search.toLowerCase()) || item.serialNo?.toLowerCase().includes(search.toLowerCase())), [rows, search]);
    const handleSubmit = async (data: AssetItemData) => {
        setIsSaving(true);
        try {
            const payload = { ...data, categoryId: data.categoryId || undefined, serialNo: data.serialNo || undefined, purchaseDate: data.purchaseDate || null, purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : undefined, condition: data.condition || undefined };
            const res = formMode === "create" ? await AxiosAPI.post(inventoryAssetsUrl, payload) : await AxiosAPI.put(inventoryAssetDetailUrl(data.id!), payload);
            if (res.data?.success) { toast.success(formMode === "create" ? "Asset created" : "Asset updated"); mutate(); setIsFormOpen(false); }
        } catch (error: any) { toast.error(error.response?.data?.message || "Operation failed"); } finally { setIsSaving(false); }
    };
    const handleDelete = (id: string) => openModal("confirm-delete", { title: "Delete asset", description: "Assigned assets cannot be deleted.", onConfirm: async () => { try { await AxiosAPI.delete(inventoryAssetDetailUrl(id)); toast.success("Asset deleted"); mutate(); } catch (error: any) { toast.error(error.response?.data?.message || "Delete failed"); } } });
    const columns: ColumnDef<AssetItemData>[] = [
        { accessorKey: "name", header: "Asset" },
        { accessorKey: "assetTag", header: "Tag" },
        { header: "Category", cell: ({ row }) => row.original.category?.name || "-" },
        { accessorKey: "serialNo", header: "Serial" },
        { accessorKey: "status", header: "Status" },
        { header: "Assigned", cell: ({ row }) => row.original.assignedTo ? row.original.assignedTo.username : row.original.room?.name || "-" },
        { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setFormMode("edit"); setEditingData({ ...row.original, purchaseDate: row.original.purchaseDate ? row.original.purchaseDate.slice(0, 10) : "" }); setIsFormOpen(true); }} onDelete={() => handleDelete(row.original.id!)} /> },
    ];
    if (isLoading) return <TableSkeleton />;
    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Assets</Title><p className="text-xs text-muted-foreground mt-1">Track tagged assets and lifecycle status.</p></div><Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Asset</Button></div></CardHeader>
                <CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filteredRows} searchKey="name" searchPlaceholder="Search assets..." searchValue={search} onSearch={setSearch} /></CardContent>
            </Card>
            <AssetForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} categories={categories} />
        </div>
    );
}
