"use client";

import { AxiosAPI } from "@/apis/configs";
import { inventoryCategoriesUrl, inventoryCategoryDetailUrl } from "@/apis/endpoints/inventory_apis";
import { useInventoryCategoriesQuery } from "@/apis/queries/inventory_queries";
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
import { CategoryForm } from "./InventoryForms";
import type { AssetCategoryData } from "./inventoryTypes";

export function InventoryCategoryListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<AssetCategoryData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useInventoryCategoriesQuery();
    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => rows.filter((item: AssetCategoryData) => item.name?.toLowerCase().includes(search.toLowerCase()) || item.code?.toLowerCase().includes(search.toLowerCase())), [rows, search]);

    const handleSubmit = async (data: AssetCategoryData) => {
        setIsSaving(true);
        try {
            const payload = { name: data.name, code: data.code || undefined, type: data.type, status: data.status };
            const res = formMode === "create" ? await AxiosAPI.post(inventoryCategoriesUrl, payload) : await AxiosAPI.put(inventoryCategoryDetailUrl(data.id!), payload);
            if (res.data?.success) { toast.success(formMode === "create" ? "Category created" : "Category updated"); mutate(); setIsFormOpen(false); }
        } catch (error: any) { toast.error(error.response?.data?.message || "Operation failed"); } finally { setIsSaving(false); }
    };

    const handleDelete = (id: string) => openModal("confirm-delete", { title: "Delete category", description: "This category will be removed from active inventory setup.", onConfirm: async () => { try { await AxiosAPI.delete(inventoryCategoryDetailUrl(id)); toast.success("Category deleted"); mutate(); } catch (error: any) { toast.error(error.response?.data?.message || "Delete failed"); } } });

    const columns: ColumnDef<AssetCategoryData>[] = [
        { accessorKey: "name", header: "Category" },
        { accessorKey: "code", header: "Code" },
        { accessorKey: "type", header: "Type" },
        { accessorKey: "status", header: "Status" },
        { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setFormMode("edit"); setEditingData(row.original); setIsFormOpen(true); }} onDelete={() => handleDelete(row.original.id!)} /> },
    ];

    if (isLoading) return <TableSkeleton />;
    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Inventory Categories</Title><p className="text-xs text-muted-foreground mt-1">Classify assets and stock items.</p></div><Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Category</Button></div></CardHeader>
                <CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filteredRows} searchKey="name" searchPlaceholder="Search categories..." searchValue={search} onSearch={setSearch} /></CardContent>
            </Card>
            <CategoryForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />
        </div>
    );
}
