"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { BranchForm } from "./BranchForm";
import { useBranchesQuery, useDepartmentsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { branchesUrl, branchDetailUrl } from "@/apis/endpoints/academic_apis";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { useModalStore } from "@/stores/modalStore";

export interface BranchData {
    id?: string;
    name: string;
    code: string;
    address: string;
    departmentId: string;
    departmentName?: string;
    status: string;
}

export function BranchListView() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<BranchData | undefined>(undefined);

    const { data: response, isLoading, mutate } = useBranchesQuery();
    const { data: deptResponse } = useDepartmentsQuery();

    const departmentMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        (deptResponse?.data || []).forEach((dept: any) => {
            map[dept.id] = dept.name;
        });
        return map;
    }, [deptResponse]);

    const rawData = response?.data || [];
    const mappedData = React.useMemo(() => {
        return rawData.map((item: any) => ({
            id: item.id,
            name: item.name,
            code: item.code || "",
            address: item.address || "",
            departmentId: item.departmentId || "",
            departmentName: item.departmentId ? departmentMap[item.departmentId] || "" : "",
            status: item.status ?? "Active",
        }));
    }, [rawData, departmentMap]);

    const filteredData = React.useMemo(() => {
        return mappedData.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [mappedData, search]);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (item: BranchData) => {
        setFormMode("edit");
        setEditingData(item);
        setIsFormOpen(true);
    };

    const openDeleteDialog = (id: string) => {
        openModal("confirm-delete", {
            title: t("delete_branch"),
            description: t("delete_branch_confirm"),
            onConfirm: async () => {
                try {
                    const res = await AxiosAPI.delete(branchDetailUrl(id));
                    if (res.data?.success) {
                        toast.success(t("branch_deleted_success"));
                        mutate();
                    } else {
                        toast.error(t("branch_delete_failed"));
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || t("operation_failed"));
                }
            },
        });
    };

    const handleFormSubmit = async (formData: BranchData) => {
        const payload = {
            name: formData.name,
            code: formData.code || null,
            address: formData.address || null,
            departmentId: formData.departmentId || null,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(branchesUrl, payload);
            } else {
                res = await AxiosAPI.put(branchDetailUrl(formData.id!), payload);
            }

            if (res.data?.success) {
                toast.success(t(formMode === "create" ? "branch_created_success" : "branch_updated_success"));
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(t("branch_save_failed"));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("operation_failed"));
        }
    };

    const columns: ColumnDef<BranchData>[] = [
        { accessorKey: "name", header: t("branch_name") },
        { accessorKey: "code", header: t("code") },
        { accessorKey: "address", header: t("address") },
        { accessorKey: "departmentName", header: t("department") },
        {
            accessorKey: "status", header: t("status"),
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
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
                    onDelete={() => openDeleteDialog(row.original.id!)}
                />
            ),
        },
    ];

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>{t("Branches")}</Title>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> {t("add_branch")}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        searchKey="name"
                        searchPlaceholder={t("search_branch")}
                        searchValue={search}
                        onSearch={setSearch}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            {/* Branch Form Modal */}
            <BranchForm
                mode={formMode}
                initialData={editingData}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}
