"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { sections } from "@/data/academic";
import { SectionForm, SectionData } from "./SectionForm";

export function SectionListView() {
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<SectionData | undefined>(undefined);

    const [data, setData] = useState<SectionData[]>(sections);
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageCount = Math.ceil(data.length / pageSize) || 1;
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); };
    const handleEdit = (item: SectionData) => { setFormMode("edit"); setEditingData(item); setIsFormOpen(true); };
    const handleDelete = (id: string) => { if (confirm("Are you sure?")) setData(data.filter((item) => item.id !== id)); };

    const handleFormSubmit = (formData: SectionData) => {
        if (formMode === "create") {
            setData([...data, { ...formData, id: (data.length + 1).toString() }]);
        } else {
            setData(data.map((item) => (item.id === formData.id ? { ...item, ...formData } : item)));
        }
    };

    const columns: ColumnDef<SectionData>[] = [
        { accessorKey: "name", header: "Section Name" },
        { accessorKey: "class", header: "Class" },
        { accessorKey: "room_number", header: "Room Number" },
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
                </CardContent>
            </Card>
            <SectionForm mode={formMode} initialData={editingData} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
        </div>
    );
}
