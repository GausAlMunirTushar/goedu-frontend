"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { AcademicYearData } from "./AcademicYearForm";
import { useAcademicYearsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { academicYearsUrl, academicYearDetailUrl } from "@/apis/endpoints/academic_apis";
import { useModalStore } from "@/stores/modalStore";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";

export function AcademicYearListView() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<AcademicYearData | undefined>(undefined);

    // Fetch live academic years from backend
    const { data: response, isLoading, mutate } = useAcademicYearsQuery();

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawData = response?.data || [];
    const mappedData = React.useMemo(() => {
        return rawData.map((item: any) => ({
            id: item.id,
            title: item.title,
            startDate: item.startDate,
            endDate: item.endDate,
            isActive: item.isActive,
        }));
    }, [rawData]);

    const filteredData = React.useMemo(() => {
        return mappedData.filter((item: any) =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [mappedData, search]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); };
    const handleEdit = (item: AcademicYearData) => { setFormMode("edit"); setEditingData(item); setIsFormOpen(true); };

    const handleFormSubmit = async (formData: AcademicYearData) => {
        const payload = {
            title: formData.title,
            startDate: formData.startDate,
            endDate: formData.endDate,
            isActive: formData.isActive,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(academicYearsUrl, payload);
            } else {
                res = await AxiosAPI.put(academicYearDetailUrl(formData.id!), payload);
            }

            if (res.data?.success) {
                toast.success(res.data.message || `Academic year ${formMode === "create" ? "created" : "updated"} successfully`);
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(res.data?.message || `Failed to ${formMode === "create" ? "create" : "update"} academic year`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while saving");
        }
    };

    const handleDelete = async (id: string) => {
        openModal("confirm-delete", {
            title: t("delete_academic_year"),
            description: t("delete_academic_year_confirm"),
            onConfirm: async () => {
                const res = await AxiosAPI.delete(academicYearDetailUrl(id));
                if (res.data?.success) {
                    toast.success(t("academic_year_deleted_success"));
                    mutate();
                } else {
                    toast.error(t("academic_year_delete_failed"));
                }
            }
        });
    };

    const columns: ColumnDef<AcademicYearData>[] = [
        { accessorKey: "title", header: t("title") },
        {
            accessorKey: "startDate", header: t("start_date"),
            cell: ({ row }) => row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : "",
        },
        {
            accessorKey: "endDate", header: t("end_date"),
            cell: ({ row }) => row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "",
        },
        {
            accessorKey: "isActive", header: t("status"),
            cell: ({ row }) => {
                const status = row.original.isActive === "Active" ? "Active" : "Inactive";
                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                            }`}
                    >
                        {status === "Active" ? t("active") : t("inactive")}
                    </span>
                );
            },
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
            <Card className="">
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>{t("Academic Year")}</Title>
                            <p className="text-xs text-muted-foreground mt-1">Configure and manage active academic years for scheduling and admissions.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> {t("add_academic_year")}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="year"
                        searchPlaceholder={t("search_year")}
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
                </CardContent>
            </Card>
        </div>
    );
}
