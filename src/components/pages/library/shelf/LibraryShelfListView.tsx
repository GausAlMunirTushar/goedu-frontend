"use client";

import { AxiosAPI } from "@/apis/configs";
import { libraryShelvesUrl, libraryShelfDetailUrl } from "@/apis/endpoints/library_apis";
import { useLibraryShelvesQuery } from "@/apis/queries/library_queries";
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
import { LibraryShelfForm } from "./LibraryShelfForm";

export interface LibraryShelfData {
    id?: string;
    name: string;
    code?: string;
    location?: string;
    status: string;
}

export function LibraryShelfListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<LibraryShelfData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useLibraryShelvesQuery();

    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => {
        return rows.filter((item: LibraryShelfData) =>
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.code?.toLowerCase().includes(search.toLowerCase()) ||
            item.location?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [rows, search]);

    const handleSubmit = async (formData: LibraryShelfData) => {
        setIsSaving(true);
        try {
            const payload = {
                name: formData.name,
                code: formData.code || undefined,
                location: formData.location || undefined,
                status: formData.status,
            };
            const res = formMode === "create"
                ? await AxiosAPI.post(libraryShelvesUrl, payload)
                : await AxiosAPI.put(libraryShelfDetailUrl(formData.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Shelf created" : "Shelf updated");
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
            title: "Delete shelf",
            description: "This shelf will be removed from the active library list.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(libraryShelfDetailUrl(id));
                    toast.success("Shelf deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<LibraryShelfData>[] = [
        { accessorKey: "name", header: "Shelf" },
        { accessorKey: "code", header: "Code" },
        { accessorKey: "location", header: "Location" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {row.original.status}
                </span>
            ),
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
                            <Title>Library Shelves</Title>
                            <p className="text-xs text-muted-foreground mt-1">Manage shelf, rack, and location metadata for physical copies.</p>
                        </div>
                        <Button onClick={() => {
                            setFormMode("create");
                            setEditingData(undefined);
                            setIsFormOpen(true);
                        }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Shelf
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={filteredRows}
                        searchKey="name"
                        searchPlaceholder="Search shelves..."
                        searchValue={search}
                        onSearch={setSearch}
                    />
                </CardContent>
            </Card>
            <LibraryShelfForm
                mode={formMode}
                initialData={editingData}
                isOpen={isFormOpen}
                isSubmitting={isSaving}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
