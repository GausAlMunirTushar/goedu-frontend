"use client";

import { AxiosAPI } from "@/apis/configs";
import { inventoryAssignmentsUrl, inventoryAssignmentReturnUrl } from "@/apis/endpoints/inventory_apis";
import { useRoomsQuery } from "@/apis/queries/academic_queries";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { useInventoryAssignmentsQuery, useInventoryAssetsQuery } from "@/apis/queries/inventory_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { RotateCcw, Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { AssignmentForm } from "./InventoryForms";
import type { AssetAssignmentData } from "./inventoryTypes";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleDateString() : "-";

export function InventoryAssignmentListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useInventoryAssignmentsQuery();
    const { data: assetsResponse, mutate: mutateAssets } = useInventoryAssetsQuery();
    const { data: usersResponse } = useUsersQuery();
    const { data: roomsResponse } = useRoomsQuery();
    const rows = React.useMemo(() => response?.data || [], [response]);
    const assets = React.useMemo(() => assetsResponse?.data || [], [assetsResponse]);
    const users = React.useMemo(() => usersResponse?.data || [], [usersResponse]);
    const rooms = React.useMemo(() => roomsResponse?.data || [], [roomsResponse]);
    const filteredRows = React.useMemo(() => rows.filter((item: AssetAssignmentData) => item.asset?.name?.toLowerCase().includes(search.toLowerCase()) || item.asset?.assetTag?.toLowerCase().includes(search.toLowerCase()) || item.assignedTo?.username?.toLowerCase().includes(search.toLowerCase()) || item.room?.name?.toLowerCase().includes(search.toLowerCase())), [rows, search]);

    const handleSubmit = async (data: AssetAssignmentData) => {
        setIsSaving(true);
        try {
            const res = await AxiosAPI.post(inventoryAssignmentsUrl, { assetId: data.assetId, assignedToId: data.assignedToId || undefined, roomId: data.roomId || undefined, issueDate: data.issueDate, remarks: data.remarks || undefined });
            if (res.data?.success) { toast.success("Asset assigned"); mutate(); mutateAssets(); setIsFormOpen(false); }
        } catch (error: any) { toast.error(error.response?.data?.message || "Operation failed"); } finally { setIsSaving(false); }
    };

    const handleReturn = (id: string) => openModal("confirm-delete", { title: "Return asset", description: "This will close the assignment and mark the asset available.", onConfirm: async () => { try { await AxiosAPI.post(inventoryAssignmentReturnUrl(id), {}); toast.success("Asset returned"); mutate(); mutateAssets(); } catch (error: any) { toast.error(error.response?.data?.message || "Return failed"); } } });

    const columns: ColumnDef<AssetAssignmentData>[] = [
        { header: "Asset", cell: ({ row }) => row.original.asset?.name || "-" },
        { header: "Tag", cell: ({ row }) => row.original.asset?.assetTag || "-" },
        { header: "Assigned To", cell: ({ row }) => row.original.assignedTo?.username || row.original.room?.name || "-" },
        { header: "Issue Date", cell: ({ row }) => formatDate(row.original.issueDate) },
        { header: "Return Date", cell: ({ row }) => formatDate(row.original.returnDate) },
        { accessorKey: "status", header: "Status" },
        { id: "actions", header: "Actions", cell: ({ row }) => <TableActions extraActions={[{ label: "Return", icon: <RotateCcw size={16} />, disabled: row.original.status !== "Active", onClick: () => handleReturn(row.original.id!) }]} /> },
    ];

    if (isLoading) return <TableSkeleton />;
    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Asset Assignments</Title><p className="text-xs text-muted-foreground mt-1">Assign available assets to staff or rooms.</p></div><Button onClick={() => setIsFormOpen(true)}><Plus className="h-4 w-4 mr-2" /> Assign Asset</Button></div></CardHeader>
                <CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filteredRows} searchKey="asset" searchPlaceholder="Search assignments..." searchValue={search} onSearch={setSearch} /></CardContent>
            </Card>
            <AssignmentForm assets={assets} users={users} rooms={rooms} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />
        </div>
    );
}
