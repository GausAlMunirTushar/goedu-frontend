"use client";

import { AxiosAPI } from "@/apis/configs";
import { hostelDetailUrl, hostelsUrl } from "@/apis/endpoints/hostel_apis";
import { useHostelsQuery } from "@/apis/queries/hostel_queries";
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
import { HostelForm } from "./HostelForms";
import type { HostelData } from "./hostelTypes";

export function HostelListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<HostelData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useHostelsQuery();
    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => rows.filter((item: HostelData) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.code?.toLowerCase().includes(search.toLowerCase()) ||
        item.wardenName?.toLowerCase().includes(search.toLowerCase()),
    ), [rows, search]);

    const handleSubmit = async (data: HostelData) => {
        setIsSaving(true);
        try {
            const payload = { ...data, code: data.code || undefined, type: data.type || undefined, address: data.address || undefined, wardenName: data.wardenName || undefined, wardenPhone: data.wardenPhone || undefined };
            const res = formMode === "create" ? await AxiosAPI.post(hostelsUrl, payload) : await AxiosAPI.put(hostelDetailUrl(data.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Hostel created" : "Hostel updated");
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
            title: "Delete hostel",
            description: "This hostel will be removed from active hostel setup.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(hostelDetailUrl(id));
                    toast.success("Hostel deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<HostelData>[] = [
        { accessorKey: "name", header: "Hostel" },
        { accessorKey: "code", header: "Code" },
        { accessorKey: "type", header: "Type" },
        { header: "Rooms", cell: ({ row }) => row.original._count?.rooms || 0 },
        { header: "Beds", cell: ({ row }) => row.original._count?.beds || 0 },
        { accessorKey: "wardenName", header: "Warden" },
        { accessorKey: "wardenPhone", header: "Phone" },
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
                            <Title>Hostels</Title>
                            <p className="text-xs text-muted-foreground mt-1">Maintain hostel buildings and warden contacts.</p>
                        </div>
                        <Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Hostel
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable columns={columns} data={filteredRows} searchKey="name" searchPlaceholder="Search hostels..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <HostelForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />
        </div>
    );
}
