"use client";

import { AxiosAPI } from "@/apis/configs";
import { inventoryStockItemDetailUrl, inventoryStockItemsUrl, inventoryStockTransactionsUrl } from "@/apis/endpoints/inventory_apis";
import { useInventoryCategoriesQuery, useInventoryStockItemsQuery } from "@/apis/queries/inventory_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Repeat } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { StockItemForm, StockTransactionForm } from "./InventoryForms";
import type { StockItemData, StockTransactionData } from "./inventoryTypes";

export function InventoryStockListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isMoveOpen, setIsMoveOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<StockItemData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useInventoryStockItemsQuery();
    const { data: categoryResponse } = useInventoryCategoriesQuery();
    const rows = React.useMemo(() => response?.data || [], [response]);
    const categories = React.useMemo(() => categoryResponse?.data || [], [categoryResponse]);
    const filteredRows = React.useMemo(() => rows.filter((item: StockItemData) => item.name?.toLowerCase().includes(search.toLowerCase()) || item.sku?.toLowerCase().includes(search.toLowerCase())), [rows, search]);
    const handleSubmit = async (data: StockItemData) => {
        setIsSaving(true);
        try {
            const payload = { ...data, categoryId: data.categoryId || undefined, currentQuantity: Number(data.currentQuantity || 0), minQuantity: Number(data.minQuantity || 0) };
            const res = formMode === "create" ? await AxiosAPI.post(inventoryStockItemsUrl, payload) : await AxiosAPI.put(inventoryStockItemDetailUrl(data.id!), payload);
            if (res.data?.success) { toast.success(formMode === "create" ? "Stock item created" : "Stock item updated"); mutate(); setIsFormOpen(false); }
        } catch (error: any) { toast.error(error.response?.data?.message || "Operation failed"); } finally { setIsSaving(false); }
    };
    const handleMove = async (data: StockTransactionData) => {
        setIsSaving(true);
        try {
            const res = await AxiosAPI.post(inventoryStockTransactionsUrl, { ...data, quantity: Number(data.quantity) });
            if (res.data?.success) { toast.success("Stock movement recorded"); mutate(); setIsMoveOpen(false); }
        } catch (error: any) { toast.error(error.response?.data?.message || "Operation failed"); } finally { setIsSaving(false); }
    };
    const handleDelete = (id: string) => openModal("confirm-delete", { title: "Delete stock item", description: "This stock item will be removed from active inventory.", onConfirm: async () => { try { await AxiosAPI.delete(inventoryStockItemDetailUrl(id)); toast.success("Stock item deleted"); mutate(); } catch (error: any) { toast.error(error.response?.data?.message || "Delete failed"); } } });
    const columns: ColumnDef<StockItemData>[] = [
        { accessorKey: "name", header: "Item" },
        { accessorKey: "sku", header: "SKU" },
        { header: "Category", cell: ({ row }) => row.original.category?.name || "-" },
        { header: "Qty", cell: ({ row }) => `${row.original.currentQuantity ?? 0} ${row.original.unit}` },
        { accessorKey: "minQuantity", header: "Min" },
        { accessorKey: "status", header: "Status" },
        { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setFormMode("edit"); setEditingData(row.original); setIsFormOpen(true); }} onDelete={() => handleDelete(row.original.id!)} extraActions={[{ label: "Move Stock", icon: <Repeat size={16} />, onClick: () => setIsMoveOpen(true) }]} /> },
    ];
    if (isLoading) return <TableSkeleton />;
    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Stock Items</Title><p className="text-xs text-muted-foreground mt-1">Track consumable inventory quantities.</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => setIsMoveOpen(true)}><Repeat className="h-4 w-4 mr-2" /> Stock Movement</Button><Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Item</Button></div></div></CardHeader>
                <CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filteredRows} searchKey="name" searchPlaceholder="Search stock..." searchValue={search} onSearch={setSearch} /></CardContent>
            </Card>
            <StockItemForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} categories={categories} />
            <StockTransactionForm stockItems={rows} isOpen={isMoveOpen} isSubmitting={isSaving} onClose={() => setIsMoveOpen(false)} onSubmit={handleMove} />
        </div>
    );
}
