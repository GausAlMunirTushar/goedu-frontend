"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { SubjectForm, SubjectData } from "./SubjectForm";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useSubjectsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { subjectsUrl, subjectDetailUrl } from "@/apis/endpoints/academic_apis";
import { toast } from "sonner";
import { useModalStore } from "@/stores/modalStore";

export function SubjectListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<SubjectData | undefined>(undefined);

    // Fetch subjects using SWR
    const { data: response, isLoading, mutate } = useSubjectsQuery();

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawData = response?.data || [];
    const mappedData = React.useMemo(() => {
        return rawData.map((item: any) => ({
            id: item.id,
            name: item.name,
            code: item.code,
            type: "Core", // Default type since backend doesn't store type yet
            classId: item.classId,
            className: item.class?.name || "N/A",
            status: "Active", // Mock status
        }));
    }, [rawData]);

    const filteredData = React.useMemo(() => {
        return mappedData.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.code.toLowerCase().includes(search.toLowerCase()) ||
            item.className.toLowerCase().includes(search.toLowerCase())
        );
    }, [mappedData, search]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        setIsFormOpen(true);
    };

    // View dialog state
    const [viewData, setViewData] = useState<SubjectData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Delete dialog managed by global modal store

    const handleEdit = (item: SubjectData) => {
        setFormMode("edit");
        setEditingData(item);
        setIsFormOpen(true);
    };

    const handleView = (item: SubjectData) => {
        setViewData(item);
        setIsViewOpen(true);
    };

    const openDeleteDialog = (id: string) => {
        openModal("confirm-delete", {
            title: "Delete Subject",
            description: "Are you sure you want to delete this subject?",
            onConfirm: async () => {
                try {
                    const res = await AxiosAPI.delete(subjectDetailUrl(id));
                    if (res.data?.success) {
                        toast.success(res.data.message || "Subject deleted successfully");
                        mutate();
                    } else {
                        toast.error(res.data?.message || "Failed to delete subject");
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "An error occurred while deleting subject");
                }
            }
        });
    };

    const handleFormSubmit = async (formData: SubjectData) => {
        const payload = {
            name: formData.name,
            code: formData.code,
            classId: formData.classId,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(subjectsUrl, payload);
            } else {
                res = await AxiosAPI.put(subjectDetailUrl(formData.id!), payload);
            }

            if (res.data?.success) {
                toast.success(res.data.message || `Subject ${formMode === "create" ? "created" : "updated"} successfully`);
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(res.data?.message || `Failed to ${formMode === "create" ? "create" : "update"} subject`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while saving subject");
        }
    };

    const columns: ColumnDef<SubjectData>[] = [
        { accessorKey: "name", header: "Subject Name" },
        { accessorKey: "code", header: "Subject Code" },
        { accessorKey: "type", header: "Type" },
        { accessorKey: "className", header: "Class" },
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
            <Card>
                <CardHeader className="bg-white border-b border-gray-100 pb-3">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Subjects</Title>
                            <p className="text-xs text-muted-foreground mt-1">Manage course subjects, codes, types, and class associations.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> Add Subject
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="name"
                        searchPlaceholder="Search subject..."
                        searchValue={search}
                        onSearch={setSearch}
                        isLoading={isLoading}
                        pagination={{
                          page,
                          pageCount,
                          pageSize,
                          totalCount: filteredData.length,
                          onPageChange: setPage,
                          onPageSizeChange: (size) => {
                            setPageSize(size);
                            setPage(1);
                          },
                        }}
                    />
                {/* View Dialog */}
                <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <AlertDialogContent className="bg-white rounded-xl shadow-lg border-none p-0 overflow-hidden sm:max-w-[450px]">
                        <AlertDialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                            <AlertDialogTitle className="text-base font-bold text-slate-800">View Subject</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription asChild>
                            {viewData && (
                                <div className="space-y-3 text-slate-600 px-6 py-4">
                                    <p><strong>Name:</strong> {viewData.name}</p>
                                    <p><strong>Code:</strong> {viewData.code}</p>
                                    <p><strong>Type:</strong> {viewData.type}</p>
                                    <p><strong>Class:</strong> {viewData.className}</p>
                                    <p><strong>Status:</strong> {viewData.status}</p>
                                </div>
                            )}
                        </AlertDialogDescription>
                        <AlertDialogFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                            <AlertDialogCancel className="text-slate-700 border-slate-200 mt-0">Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </CardContent>
            </Card>
            <SubjectForm mode={formMode} initialData={editingData} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
        </div>
    );
}
