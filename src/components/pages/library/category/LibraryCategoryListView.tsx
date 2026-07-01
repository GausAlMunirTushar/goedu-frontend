"use client";

import { AxiosAPI } from "@/apis/configs";
import { libraryCategoriesUrl, libraryCategoryDetailUrl } from "@/apis/endpoints/library_apis";
import { useLibraryCategoriesQuery } from "@/apis/queries/library_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { LibraryCategoryForm } from "./LibraryCategoryForm";

export interface LibraryCategoryData {
    id?: string;
    name: string;
    code?: string;
    status: string;
}

export function LibraryCategoryListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<LibraryCategoryData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useLibraryCategoriesQuery();

    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => {
        return rows.filter((item: LibraryCategoryData) =>
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.code?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [rows, search]);

    const handleSubmit = async (formData: LibraryCategoryData) => {
        setIsSaving(true);
        try {
            const payload = { name: formData.name, code: formData.code || undefined, status: formData.status };
            const res = formMode === "create"
                ? await AxiosAPI.post(libraryCategoriesUrl, payload)
                : await AxiosAPI.put(libraryCategoryDetailUrl(formData.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Category created" : "Category updated");
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
            title: "Delete category",
            description: "This category will be removed from the active library list.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(libraryCategoryDetailUrl(id));
                    toast.success("Category deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<LibraryCategoryData>[] = [
        { accessorKey: "name", header: "Category" },
        { accessorKey: "code", header: "Code" },
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
                            <Title>Library Categories</Title>
                            <p className="text-xs text-muted-foreground mt-1">Group books by subject area or circulation type.</p>
                        </div>
                        <Button onClick={() => {
                            setFormMode("create");
                            setEditingData(undefined);
                            setIsFormOpen(true);
                        }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Category
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={filteredRows}
                        searchKey="name"
                        searchPlaceholder="Search categories..."
                        searchValue={search}
                        onSearch={setSearch}
                    />
                </CardContent>
            </Card>
            <LibraryCategoryForm
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
