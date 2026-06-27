"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { ClassForm, ClassData } from "./ClassForm";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useClassesQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { classesUrl, classDetailUrl } from "@/apis/endpoints/academic_apis";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { useModalStore } from "@/stores/modalStore";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";

export function ClassListView() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<ClassData | undefined>(undefined);

    // Fetch classes using SWR
    const { data: response, isLoading, mutate } = useClassesQuery();

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawData = response?.data || [];
    const mappedData = React.useMemo(() => {
        return rawData.map((item: any) => {
            // Aggregate section capacities
            const totalCapacity = item.sections?.reduce((sum: number, sec: any) => sum + (sec.capacity || 0), 0) || 0;
            return {
                id: item.id,
                name: item.name,
                code: item.code || "",
                capacity: totalCapacity.toString(),
                status: "Active", // Fallback status
            };
        });
    }, [rawData]);

    const filteredData = React.useMemo(() => {
        return mappedData.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase())
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
    const [viewData, setViewData] = useState<ClassData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const handleEdit = (item: ClassData) => {
        setFormMode("edit");
        setEditingData(item);
        setIsFormOpen(true);
    };

    const handleView = (item: ClassData) => {
        setViewData(item);
        setIsViewOpen(true);
    };

    const openDeleteDialog = (id: string) => {
        openModal("confirm-delete", {
            title: t("delete_class"),
            description: t("delete_class_confirm"),
            onConfirm: async () => {
                try {
                    const res = await AxiosAPI.delete(classDetailUrl(id));
                    if (res.data?.success) {
                        toast.success(t("class_deleted_success"));
                        mutate();
                    } else {
                        toast.error(t("class_delete_failed"));
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || t("operation_failed"));
                }
            }
        });
    };

    const handleFormSubmit = async (formData: ClassData) => {
        const payload = {
            name: formData.name,
            code: formData.code || null,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(classesUrl, payload);
            } else {
                res = await AxiosAPI.put(classDetailUrl(formData.id!), payload);
            }

            if (res.data?.success) {
                toast.success(t("class_saved_success"));
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(t("class_save_failed"));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("operation_failed"));
        }
    };

    const columns: ColumnDef<ClassData>[] = [
        { accessorKey: "name", header: t("class_name") },
        { accessorKey: "code", header: t("class_code") },
        { accessorKey: "capacity", header: t("capacity") },
        {
            accessorKey: "status", header: t("status"),
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {row.original.status === "Active" ? t("active") : t("inactive")}
                </span>
            ),
        },
        {
            id: "actions", header: t("actions"),
            cell: ({ row }) => (
                <TableActions 
                    onView={() => handleView(row.original)}
                    onEdit={() => handleEdit(row.original)} 
                    onDelete={() => openDeleteDialog(row.original.id!)} 
                />
            ),
        },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card className="">
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>{t("Class")}</Title>
                            <p className="text-xs text-muted-foreground mt-1">Configure classes, grade levels, and their configuration parameters.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> {t("add_class")}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="name"
                        searchPlaceholder={t("search_class")}
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
                            <AlertDialogTitle className="text-base font-bold text-slate-800">{t("view_class")}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription asChild>
                            {viewData && (
                                <div className="space-y-3 text-slate-600 px-6 py-4">
                                    <p><strong>{t("class_name")}:</strong> {viewData.name}</p>
                                    <p><strong>{t("class_code")}:</strong> {viewData.code}</p>
                                    <p><strong>{t("capacity")}:</strong> {viewData.capacity}</p>
                                    <p><strong>{t("status")}:</strong> {viewData.status === "Active" ? t("active") : t("inactive")}</p>
                                </div>
                            )}
                        </AlertDialogDescription>
                        <AlertDialogFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                            <AlertDialogCancel className="text-slate-700 border-slate-200 mt-0">{t("cancel")}</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </CardContent>
            </Card>
            <ClassForm mode={formMode} initialData={editingData} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
        </div>
    );
}
