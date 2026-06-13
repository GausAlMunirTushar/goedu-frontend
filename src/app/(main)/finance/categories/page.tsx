"use client";

import React, { useState, useMemo } from "react";
import { useFeeCategoriesQuery } from "@/apis/queries/finance_queries";
import { financeCategoriesUrl, financeCategoryDetailUrl } from "@/apis/endpoints/finance_apis";
import axiosInstance from "@/apis/configs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import TableActions from "@/components/ui/table-actions";

export default function FeeCategoriesPage() {
    const { data: res, isLoading, mutate } = useFeeCategoriesQuery();
    const categories = res?.data || [];

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    
    // Pagination and Search state for DataTable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const pageCount = Math.ceil(categories.length / pageSize) || 1;
    const paginatedData = useMemo(() => {
      return categories.slice((page - 1) * pageSize, page * pageSize);
    }, [categories, page, pageSize]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post(financeCategoriesUrl, { name, description });
            toast.success("Category created");
            setName("");
            setDescription("");
            mutate();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Creation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if(!confirm("Delete this category?")) return;
        try {
            await axiosInstance.delete(financeCategoryDetailUrl(id));
            toast.success("Deleted");
            mutate();
        } catch (error: any) {
            toast.error("Deletion failed");
        }
    };

    const columns: ColumnDef<any>[] = [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "description", header: "Description" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TableActions
            onDelete={() => handleDelete(row.original.id)}
          />
        ),
      },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Fee Categories</h1>
                <p className="text-muted-foreground text-sm">Define tuition types, transport fees, library fines, etc.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Add New Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category Name</label>
                                <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Monthly Tuition" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional details" />
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="w-4 h-4 mr-2" /> Add Category
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Active Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={paginatedData}
                            searchKey="name"
                            searchValue={search}
                            onSearch={(val) => { setSearch(val); setPage(1); }}
                            searchPlaceholder="Search categories..."
                            isLoading={isLoading}
                            pagination={{
                                page,
                                pageCount,
                                pageSize,
                                totalCount: categories.length,
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
        </div>
    );
}
