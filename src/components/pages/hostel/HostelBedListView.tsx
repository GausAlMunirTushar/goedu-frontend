"use client";

import { AxiosAPI } from "@/apis/configs";
import { hostelBedDetailUrl, hostelBedsUrl } from "@/apis/endpoints/hostel_apis";
import { useHostelBedsQuery, useHostelRoomsQuery, useHostelsQuery } from "@/apis/queries/hostel_queries";
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
import { BedForm } from "./HostelForms";
import type { HostelBedData } from "./hostelTypes";

export function HostelBedListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<HostelBedData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useHostelBedsQuery();
    const { data: hostelResponse } = useHostelsQuery();
    const { data: roomResponse } = useHostelRoomsQuery();
    const rows = React.useMemo(() => response?.data || [], [response]);
    const hostels = React.useMemo(() => hostelResponse?.data || [], [hostelResponse]);
    const rooms = React.useMemo(() => roomResponse?.data || [], [roomResponse]);
    const filteredRows = React.useMemo(() => rows.filter((item: HostelBedData) =>
        item.bedNo?.toLowerCase().includes(search.toLowerCase()) ||
        item.room?.roomNo?.toLowerCase().includes(search.toLowerCase()) ||
        item.hostel?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.status?.toLowerCase().includes(search.toLowerCase()),
    ), [rows, search]);

    const handleSubmit = async (data: HostelBedData) => {
        setIsSaving(true);
        try {
            const payload = { hostelId: data.hostelId, roomId: data.roomId, bedNo: data.bedNo, status: data.status };
            const res = formMode === "create" ? await AxiosAPI.post(hostelBedsUrl, payload) : await AxiosAPI.put(hostelBedDetailUrl(data.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Bed created" : "Bed updated");
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
            title: "Delete bed",
            description: "Only available beds can be deleted.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(hostelBedDetailUrl(id));
                    toast.success("Bed deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<HostelBedData>[] = [
        { header: "Hostel", cell: ({ row }) => row.original.hostel?.name || "-" },
        { header: "Room", cell: ({ row }) => row.original.room?.roomNo || "-" },
        { accessorKey: "bedNo", header: "Bed" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const color = row.original.status === "Available" ? "bg-green-100 text-green-700" : row.original.status === "Occupied" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700";
                return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{row.original.status}</span>;
            },
        },
        { header: "Resident", cell: ({ row }) => row.original.allocations?.[0]?.student?.fullName || "-" },
        { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setFormMode("edit"); setEditingData(row.original); setIsFormOpen(true); }} onDelete={() => handleDelete(row.original.id!)} /> },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Hostel Beds</Title>
                            <p className="text-xs text-muted-foreground mt-1">Track individual beds and availability.</p>
                        </div>
                        <Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Bed
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable columns={columns} data={filteredRows} searchKey="bedNo" searchPlaceholder="Search beds..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <BedForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} hostels={hostels} rooms={rooms} />
        </div>
    );
}
