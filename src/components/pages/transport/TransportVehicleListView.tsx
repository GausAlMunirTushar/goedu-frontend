"use client";

import { AxiosAPI } from "@/apis/configs";
import { transportVehicleDetailUrl, transportVehiclesUrl } from "@/apis/endpoints/transport_apis";
import { useTransportVehiclesQuery } from "@/apis/queries/transport_queries";
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
import { VehicleForm } from "./TransportForms";
import type { TransportVehicleData } from "./transportTypes";

export function TransportVehicleListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<TransportVehicleData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useTransportVehiclesQuery();

    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => rows.filter((item: TransportVehicleData) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.registrationNo?.toLowerCase().includes(search.toLowerCase()),
    ), [rows, search]);

    const handleSubmit = async (formData: TransportVehicleData) => {
        setIsSaving(true);
        try {
            const payload = {
                name: formData.name,
                registrationNo: formData.registrationNo,
                type: formData.type || undefined,
                capacity: Number(formData.capacity),
                status: formData.status,
            };
            const res = formMode === "create"
                ? await AxiosAPI.post(transportVehiclesUrl, payload)
                : await AxiosAPI.put(transportVehicleDetailUrl(formData.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Vehicle created" : "Vehicle updated");
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
            title: "Delete vehicle",
            description: "This vehicle will be removed from active transport setup.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(transportVehicleDetailUrl(id));
                    toast.success("Vehicle deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<TransportVehicleData>[] = [
        { accessorKey: "name", header: "Vehicle" },
        { accessorKey: "registrationNo", header: "Registration" },
        { accessorKey: "type", header: "Type" },
        { accessorKey: "capacity", header: "Capacity" },
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
                            <Title>Vehicles</Title>
                            <p className="text-xs text-muted-foreground mt-1">Maintain transport vehicles and capacity.</p>
                        </div>
                        <Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Vehicle
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable columns={columns} data={filteredRows} searchKey="name" searchPlaceholder="Search vehicles..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <VehicleForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />
        </div>
    );
}
