"use client";

import { AxiosAPI } from "@/apis/configs";
import { hostelRoomDetailUrl, hostelRoomsUrl } from "@/apis/endpoints/hostel_apis";
import { useHostelRoomsQuery, useHostelsQuery } from "@/apis/queries/hostel_queries";
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
import { RoomForm } from "./HostelForms";
import type { HostelRoomData } from "./hostelTypes";

export function HostelRoomListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<HostelRoomData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useHostelRoomsQuery();
    const { data: hostelResponse } = useHostelsQuery();
    const rows = React.useMemo(() => response?.data || [], [response]);
    const hostels = React.useMemo(() => hostelResponse?.data || [], [hostelResponse]);
    const filteredRows = React.useMemo(() => rows.filter((item: HostelRoomData) =>
        item.roomNo?.toLowerCase().includes(search.toLowerCase()) ||
        item.floor?.toLowerCase().includes(search.toLowerCase()) ||
        item.hostel?.name?.toLowerCase().includes(search.toLowerCase()),
    ), [rows, search]);

    const handleSubmit = async (data: HostelRoomData) => {
        setIsSaving(true);
        try {
            const payload = { hostelId: data.hostelId, roomNo: data.roomNo, floor: data.floor || undefined, capacity: Number(data.capacity), status: data.status };
            const res = formMode === "create" ? await AxiosAPI.post(hostelRoomsUrl, payload) : await AxiosAPI.put(hostelRoomDetailUrl(data.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Room created" : "Room updated");
                mutate();
                setIsFormOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        openModal("confirm-delete", {
            title: "Delete room",
            description: "This room and its inactive bed setup will be removed from active hostel setup.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(hostelRoomDetailUrl(id));
                    toast.success("Room deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<HostelRoomData>[] = [
        { header: "Hostel", cell: ({ row }) => row.original.hostel?.name || "-" },
        { accessorKey: "roomNo", header: "Room" },
        { accessorKey: "floor", header: "Floor" },
        { accessorKey: "capacity", header: "Capacity" },
        { header: "Beds", cell: ({ row }) => row.original.beds?.length || 0 },
        { header: "Allocations", cell: ({ row }) => row.original._count?.allocations || 0 },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{row.original.status}</span>,
        },
        { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setFormMode("edit"); setEditingData(row.original); setIsFormOpen(true); }} onDelete={() => handleDelete(row.original.id!)} /> },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Hostel Rooms</Title>
                            <p className="text-xs text-muted-foreground mt-1">Create rooms under hostels and define capacity.</p>
                        </div>
                        <Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Room
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable columns={columns} data={filteredRows} searchKey="roomNo" searchPlaceholder="Search rooms..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <RoomForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} hostels={hostels} />
        </div>
    );
}
