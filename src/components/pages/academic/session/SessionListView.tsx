"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { sessions } from "@/data/academic";
import { SessionForm, SessionData } from "./SessionForm";

export function SessionListView() {
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<SessionData | undefined>(undefined);

    const [data, setData] = useState<SessionData[]>(sessions);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (item: SessionData) => {
        setFormMode("edit");
        setEditingData(item);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this session?")) {
            setData(data.filter((item) => item.id !== id));
        }
    };

    const handleFormSubmit = (formData: SessionData) => {
        if (formMode === "create") {
            const newId = (data.length + 1).toString();
            setData([...data, { ...formData, id: newId }]);
        } else {
            setData(data.map((item) => (item.id === formData.id ? { ...item, ...formData } : item)));
        }
    };

    const columns: ColumnDef<SessionData>[] = [
        { accessorKey: "name", header: "Session Name" },
        { accessorKey: "start_month", header: "Start Month" },
        { accessorKey: "end_month", header: "End Month" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>
                        {status}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
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
                            <Title>Session</Title>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> Add Session
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
                    <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search session..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <SessionForm mode={formMode} initialData={editingData} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
        </div>
    );
}
