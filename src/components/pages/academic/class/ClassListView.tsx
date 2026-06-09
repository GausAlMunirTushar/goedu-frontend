"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { classes } from "@/data/academic";
import { ClassForm, ClassData } from "./ClassForm";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export function ClassListView() {
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<ClassData | undefined>(undefined);

    const [data, setData] = useState<ClassData[]>(classes);
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageCount = Math.ceil(data.length / pageSize) || 1;
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); };
    // View dialog state
    const [viewData, setViewData] = useState<ClassData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);
    // Delete confirmation dialog state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleEdit = (item: ClassData) => { setFormMode("edit"); setEditingData(item); setIsFormOpen(true); };
    const handleView = (item: ClassData) => { setViewData(item); setIsViewOpen(true); };
    const openDeleteDialog = (id: string) => { setDeleteId(id); setIsDeleteOpen(true); };
    const handleDeleteConfirm = () => {
        if (deleteId) {
            setData(data.filter((item) => item.id !== deleteId));
        }
        setIsDeleteOpen(false);
        setDeleteId(null);
    };

    const handleFormSubmit = (formData: ClassData) => {
        if (formMode === "create") {
            setData([...data, { ...formData, id: (data.length + 1).toString() }]);
        } else {
            setData(data.map((item) => (item.id === formData.id ? { ...item, ...formData } : item)));
        }
    };

    const columns: ColumnDef<ClassData>[] = [
        { accessorKey: "name", header: "Class Name" },
        { accessorKey: "code", header: "Class Code" },
        { accessorKey: "capacity", header: "Capacity" },
        {
            accessorKey: "status", header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {row.original.status}
                </span>
            ),
        },
        {
            id: "actions", header: "Actions",
            cell: ({ row }) => (
                <TableActions 
                    onView={() => handleView(row.original)}
                    onEdit={() => handleEdit(row.original)} 
                    onDelete={() => openDeleteDialog(row.original.id!)} 
                />
            ),
        },
    ];

    return (
        <div className="p-2 space-y-4">
            <Card className="">
                <CardHeader className="bg-white border-b border-gray-100 pb-3">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Class</Title>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> Add Class
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="name"
                        searchPlaceholder="Search class..."
                        searchValue={search}
                        onSearch={setSearch}
                        pagination={{
                          page,
                          pageCount,
                          pageSize,
                          totalCount: data.length,
                          onPageChange: setPage,
                          onPageSizeChange: (size) => {
                            setPageSize(size);
                            setPage(1);
                          },
                        }}
                    />
                {/* View Dialog */}
                <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>View Class</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                            {viewData && (
                                <div className="space-y-2">
                                    <p><strong>Name:</strong> {viewData.name}</p>
                                    <p><strong>Code:</strong> {viewData.code}</p>
                                    <p><strong>Capacity:</strong> {viewData.capacity}</p>
                                    <p><strong>Status:</strong> {viewData.status}</p>
                                </div>
                            )}
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>Are you sure you want to delete this class?</AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </CardContent>
            </Card>
            <ClassForm mode={formMode} initialData={editingData} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
        </div>
    );
}
