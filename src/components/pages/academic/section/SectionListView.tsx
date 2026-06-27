"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { SectionForm, SectionData } from "./SectionForm";
import { useSectionsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { sectionsUrl, sectionDetailUrl } from "@/apis/endpoints/academic_apis";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { useModalStore } from "@/stores/modalStore";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";

export function SectionListView() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<SectionData | undefined>(undefined);

    // Fetch live sections data
    const { data: response, isLoading, mutate } = useSectionsQuery();

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawData = response?.data || [];
    const mappedData = React.useMemo(() => {
        return rawData.map((item: any) => ({
            id: item.id,
            name: item.name,
            classId: item.classId,
            className: item.class?.name || "N/A",
            capacity: item.capacity || 0,
            status: "Active", // Default mock status
        }));
    }, [rawData]);

    const filteredData = React.useMemo(() => {
        return mappedData.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
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

    const handleEdit = (item: SectionData) => {
        setFormMode("edit");
        setEditingData(item);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        openModal("confirm-delete", {
            title: t("delete_section"),
            description: t("delete_section_confirm"),
            onConfirm: async () => {
                try {
                    const res = await AxiosAPI.delete(sectionDetailUrl(id));
                    if (res.data?.success) {
                        toast.success(t("section_deleted_success"));
                        mutate();
                    } else {
                        toast.error(t("section_delete_failed"));
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || t("operation_failed"));
                }
            }
        });
    };

    const handleFormSubmit = async (formData: SectionData) => {
        const payload = {
            name: formData.name,
            capacity: formData.capacity,
            classId: formData.classId,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(sectionsUrl, payload);
            } else {
                res = await AxiosAPI.put(sectionDetailUrl(formData.id!), payload);
            }

            if (res.data?.success) {
                toast.success(t("section_saved_success"));
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(t("section_save_failed"));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("operation_failed"));
        }
    };

    const columns: ColumnDef<SectionData>[] = [
        { accessorKey: "name", header: t("section_name") },
        { accessorKey: "className", header: t("class") },
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
                            <Title>{t("Section")}</Title>
                            <p className="text-xs text-muted-foreground mt-1">Manage classes sections, groups, and capacities.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> {t("add_section")}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="name"
                        searchPlaceholder={t("search_section")}
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
            <SectionForm mode={formMode} initialData={editingData} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
        </div>
    );
}
