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

export function SectionListView() {
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
        if (confirm("Are you sure you want to delete this section?")) {
            try {
                const res = await AxiosAPI.delete(sectionDetailUrl(id));
                if (res.data?.success) {
                    toast.success(res.data.message || "Section deleted successfully");
                    mutate();
                } else {
                    toast.error(res.data?.message || "Failed to delete section");
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || "An error occurred while deleting section");
            }
        }
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
                toast.success(res.data.message || `Section ${formMode === "create" ? "created" : "updated"} successfully`);
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(res.data?.message || `Failed to ${formMode === "create" ? "create" : "update"} section`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while saving section");
        }
    };

    const columns: ColumnDef<SectionData>[] = [
        { accessorKey: "name", header: "Section Name" },
        { accessorKey: "className", header: "Class" },
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
                            <Title>Section</Title>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> Add Section
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="name"
                        searchPlaceholder="Search section..."
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
