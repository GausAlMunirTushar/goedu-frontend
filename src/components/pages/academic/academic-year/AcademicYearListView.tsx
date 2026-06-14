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

export function AcademicYearListView() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [search, setSearch] = useState("");
    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);

    // Fetch live academic years from backend
    const { data: response, isLoading, mutate } = useAcademicYearsQuery();

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawData = response?.data || [];
    const mappedData = React.useMemo(() => {
        return rawData.map((item: any) => ({
            id: item.id,
            year: item.title,
            start_date: new Date(item.startDate).toISOString().split("T")[0],
            end_date: new Date(item.endDate).toISOString().split("T")[0],
            status: item.isActive ? "Active" : "Inactive",
        }));
    }, [rawData]);

    const filteredData = React.useMemo(() => {
        return mappedData.filter((item: any) =>
            item.year.toLowerCase().includes(search.toLowerCase())
        );
    }, [mappedData, search]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleFormSubmit = async (formData: AcademicYearData) => {
        const payload = {
            title: formData.year,
            startDate: new Date(formData.start_date).toISOString(),
            endDate: new Date(formData.end_date).toISOString(),
            isActive: formData.status === "Active",
        };

        const res = formData.id
            ? await AxiosAPI.put(academicYearDetailUrl(formData.id), payload)
            : await AxiosAPI.post(academicYearsUrl, payload);

        if (res.data?.success) {
            toast.success(t("academic_year_saved_success"));
            mutate();
            closeModal();
        } else {
            toast.error(t("academic_year_save_failed"));
            throw new Error(res.data?.message || "Failed to save academic year");
        }
    };

    const handleCreate = () => {
        openModal("academic-year", {
            mode: "create",
            initialData: undefined,
            onSubmit: handleFormSubmit,
        });
    };

    const handleEdit = (item: AcademicYearData) => {
        openModal("academic-year", {
            mode: "edit",
            initialData: item,
            onSubmit: handleFormSubmit,
        });
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
        {
            accessorKey: "year",
            header: t("year_name"),
        },
        {
            accessorKey: "start_date",
            header: t("start_date"),
        },
        {
            accessorKey: "end_date",
            header: t("end_date"),
        },
        {
            accessorKey: "status",
            header: t("status"),
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
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

    return (
        <div className="p-2 space-y-4">
            <Card className="">
                <CardHeader className="bg-white border-b border-gray-100 pb-3">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>{t("Academic Year")}</Title>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> {t("add_academic_year")}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
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
