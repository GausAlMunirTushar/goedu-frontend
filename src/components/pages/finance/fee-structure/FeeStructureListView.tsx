"use client";

import React, { useMemo, useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosAPI } from "@/apis/configs";
import { financeStructureDetailUrl, financeStructuresUrl } from "@/apis/endpoints/finance_apis";
import { useFeeCategoriesQuery, useFeeStructuresQuery } from "@/apis/queries/finance_queries";
import { useClassesQuery } from "@/apis/queries/academic_queries";
import { toast } from "sonner";
import { useModalStore } from "@/stores/modalStore";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import { FeeStructureData, FeeStructureForm } from "./FeeStructureForm";

export function FeeStructureListView() {
  const openModal = useModalStore((state) => state.openModal);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingData, setEditingData] = useState<FeeStructureData | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const { data: response, isLoading, mutate } = useFeeStructuresQuery();
  const { data: classRes } = useClassesQuery();
  const { data: categoryRes } = useFeeCategoriesQuery();

  const classes = classRes?.data || [];
  const categories = categoryRes?.data || [];
  const rawData = response?.data || [];

  const mappedData = useMemo(() => {
    return rawData.map((item: any) => ({
      id: item.id,
      name: item.name,
      classId: item.classId,
      sectionId: item.sectionId || "",
      categoryId: item.categoryId,
      amount: item.amount,
      frequency: item.frequency,
      lateFineType: item.lateFineType,
      lateFineValue: item.lateFineValue,
      status: item.status,
      className: item.class?.name,
      sectionName: item.section?.name,
      categoryName: item.category?.name,
    }));
  }, [rawData]);

  const filteredData = useMemo(() => {
    const query = search.toLowerCase();
    return mappedData.filter(
      (item: any) =>
        item.name.toLowerCase().includes(query) ||
        item.className?.toLowerCase().includes(query) ||
        item.categoryName?.toLowerCase().includes(query),
    );
  }, [mappedData, search]);

  const handleCreate = () => {
    setFormMode("create");
    setEditingData(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setFormMode("edit");
    setEditingData(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    openModal("confirm-delete", {
      title: "Delete fee structure",
      description: "This will deactivate the fee structure. Existing invoices remain unchanged.",
      onConfirm: async () => {
        try {
          await AxiosAPI.delete(financeStructureDetailUrl(id));
          toast.success("Fee structure deleted");
          mutate();
        } catch (error: any) {
          toast.error(error.response?.data?.error || "Delete failed");
        }
      },
    });
  };

  const handleFormSubmit = async (formData: FeeStructureData) => {
    const payload = {
      name: formData.name,
      classId: formData.classId,
      sectionId: formData.sectionId || undefined,
      categoryId: formData.categoryId,
      amount: Number(formData.amount),
      frequency: formData.frequency,
      lateFineType: formData.lateFineType,
      lateFineValue: Number(formData.lateFineValue || 0),
      status: formData.status,
    };

    setIsSaving(true);
    try {
      if (formMode === "create") {
        await AxiosAPI.post(financeStructuresUrl, payload);
      } else {
        await AxiosAPI.put(financeStructureDetailUrl(formData.id!), payload);
      }
      toast.success(formMode === "create" ? "Fee structure created" : "Fee structure updated");
      mutate();
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: "name", header: "Name" },
    {
      header: "Class / Section",
      accessorFn: (row) => `${row.className || "N/A"} - ${row.sectionName || "All"}`,
      id: "classInfo",
    },
    { accessorKey: "categoryName", header: "Category" },
    {
      header: "Amount",
      accessorFn: (row) => `${Number(row.amount || 0).toLocaleString()} BDT`,
      id: "amount",
    },
    { accessorKey: "frequency", header: "Frequency" },
    {
      header: "Late Fine",
      accessorFn: (row) =>
        row.lateFineType === "None" ? "None" : `${row.lateFineType}: ${row.lateFineValue}`,
      id: "lateFine",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "Active" ? "success" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActions
          onEdit={() => handleEdit(row.original)}
          onDelete={() => handleDelete(row.original.id)}
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
              <Title>Fee Structures</Title>
              <p className="text-xs text-muted-foreground mt-1">
                Configure class-wise fee rules, recurring amounts, and late fine policy.
              </p>
            </div>
            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
              <Plus className="w-4 h-4" /> Add Structure
            </Button>
          </div>
        </CardHeader>
        <CardContent className="bg-white rounded-b-xl">
          <DataTable
            columns={columns}
            data={filteredData}
            searchKey="name"
            searchPlaceholder="Search fee structures..."
            searchValue={search}
            onSearch={setSearch}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <FeeStructureForm
        mode={formMode}
        initialData={editingData}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        classes={classes}
        categories={categories}
      />
    </div>
  );
}
