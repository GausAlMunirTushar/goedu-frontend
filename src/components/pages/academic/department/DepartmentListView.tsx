"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { DepartmentForm } from "./DepartmentForm";
import { useDepartmentsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { departmentsUrl, departmentDetailUrl } from "@/apis/endpoints/academic_apis";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { useModalStore } from "@/stores/modalStore";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";

export interface DepartmentData {
    id?: string;
    name: string;
    code: string;
    status: string;
}

export function DepartmentListView() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<DepartmentData | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    const { data: response, isLoading, mutate } = useDepartmentsQuery();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawData = response?.data || [];
    const mappedData = React.useMemo(() => {
        return rawData.map((item: any) => ({
            id: item.id,
            name: item.name,
            code: item.code,
            status: item.status,
        }));
    }, [rawData]);

    const filteredData = React.useMemo(() => {
        return mappedData.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.code && item.code.toLowerCase().includes(search.toLowerCase()))
        );
    }, [mappedData, search]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (item: DepartmentData) => {
        setFormMode("edit");
        setEditingData(item);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        openModal("confirm-delete", {
            title: t("delete_department"),
            description: t("delete_department_confirm"),
            onConfirm: async () => {
                try {
                    const res = await AxiosAPI.delete(departmentDetailUrl(id));
                    if (res.data?.success) {
                        toast.success(t("department_deleted_success"));
                        mutate();
                    } else {
                        toast.error(t("department_delete_failed"));
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || t("operation_failed"));
                }
            },
        });
    };

    const handleFormSubmit = async (formData: DepartmentData) => {
        const payload = {
            name: formData.name,
            code: formData.code,
            status: formData.status,
        };

        setIsSaving(true);
        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(departmentsUrl, payload);
            } else {
                res = await AxiosAPI.put(departmentDetailUrl(formData.id!), payload);
            }

            if (res.data?.success) {
                toast.success(
                    res.data.message ||
                    (formMode === "create" ? t("department_created_success") : t("department_updated_success"))
                );
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(t("department_save_failed"));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("operation_failed"));
        } finally {
            setIsSaving(false);
        }
    };

    const columns: ColumnDef<DepartmentData>[] = [
        { accessorKey: "name", header: t("department_name") },
        { accessorKey: "code", header: t("code") },
        {
            accessorKey: "status",
            header: t("status"),
            cell: ({ row }) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                >
                    {row.original.status === "Active" ? t("active") : t("inactive")}
                </span>
            ),
        },
        {
            id: "actions",
            header: t("actions"),
            cell: ({ row }) => (
                <TableActions
                    onEdit={() => handleEdit(row.original)}
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
                            <Title>{t("departments")}</Title>
                            <p className="text-xs text-muted-foreground mt-1">Manage institution departments, faculties, and related organizational units.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button
                                className="w-full sm:w-auto flex items-center gap-2"
                                onClick={handleCreate}
                            >
                                <Plus className="w-4 h-4" /> {t("add_department")}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        searchKey="name"
                        searchPlaceholder={t("search_department")}
                        searchValue={search}
                        onSearch={setSearch}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            {/* Department Form Modal */}
            <DepartmentForm
                mode={formMode}
                initialData={editingData}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                isSubmitting={isSaving}
            />
        </div>
    );
}
