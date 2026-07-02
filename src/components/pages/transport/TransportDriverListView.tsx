"use client";

import { AxiosAPI } from "@/apis/configs";
import { transportDriverDetailUrl, transportDriversUrl } from "@/apis/endpoints/transport_apis";
import { useTransportDriversQuery } from "@/apis/queries/transport_queries";
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
import { DriverForm } from "./TransportForms";
import type { TransportDriverData } from "./transportTypes";

export function TransportDriverListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<TransportDriverData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useTransportDriversQuery();

    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => rows.filter((item: TransportDriverData) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.phone?.toLowerCase().includes(search.toLowerCase()) ||
        item.licenseNo?.toLowerCase().includes(search.toLowerCase()),
    ), [rows, search]);

    const handleSubmit = async (formData: TransportDriverData) => {
        setIsSaving(true);
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                licenseNo: formData.licenseNo || undefined,
                address: formData.address || undefined,
                status: formData.status,
            };
            const res = formMode === "create"
                ? await AxiosAPI.post(transportDriversUrl, payload)
                : await AxiosAPI.put(transportDriverDetailUrl(formData.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Driver created" : "Driver updated");
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
            title: "Delete driver",
            description: "This driver will be removed from active transport setup.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(transportDriverDetailUrl(id));
                    toast.success("Driver deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<TransportDriverData>[] = [
        { accessorKey: "name", header: "Driver" },
        { accessorKey: "phone", header: "Phone" },
        { accessorKey: "licenseNo", header: "License" },
        { accessorKey: "address", header: "Address" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{row.original.status}</span>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <TableActions
                    onEdit={() => {
                        setFormMode("edit");
                        setEditingData(row.original);
                        setIsFormOpen(true);
                    }}
                    onDelete={() => handleDelete(row.original.id!)}
                />
            ),
        },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Drivers</Title>
                            <p className="text-xs text-muted-foreground mt-1">Maintain driver contact and license information.</p>
                        </div>
                        <Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Driver
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable columns={columns} data={filteredRows} searchKey="name" searchPlaceholder="Search drivers..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <DriverForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />
        </div>
    );
}
