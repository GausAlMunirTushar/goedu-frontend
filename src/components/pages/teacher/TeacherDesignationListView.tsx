"use client";

import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { TeacherDesignationForm } from "./TeacherDesignationForm";
import { Badge } from "@/components/ui/badge";
import { useDesignationsQuery } from "@/apis/queries/teacher_queries";
import { AxiosAPI } from "@/apis/configs";
import { designationsUrl, designationDetailUrl } from "@/apis/endpoints/teacher_apis";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { TeacherDesignationData } from "@/data/teacherDesignations";

export function TeacherDesignationListView() {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingData, setEditingData] = useState<TeacherDesignationData | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const { data: response, isLoading, mutate } = useDesignationsQuery();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const rawData = response?.data || [];
  const mappedData = React.useMemo(() => {
    return rawData.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      status: item.status,
    }));
  }, [rawData]);

  const filteredData = React.useMemo(() => {
    return mappedData.filter((item: any) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [mappedData, search, statusFilter]);

  const handleCreate = () => {
    setFormMode("create");
    setEditingData(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: TeacherDesignationData) => {
    setFormMode("edit");
    setEditingData(item);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        const res = await AxiosAPI.delete(designationDetailUrl(deleteId));
        if (res.data?.success) {
          toast.success(res.data.message || "Designation deleted successfully");
          mutate();
        } else {
          toast.error(res.data?.message || "Failed to delete designation");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred while deleting");
      }
    }
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  const handleFormSubmit = async (formData: TeacherDesignationData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
    };

    try {
      let res;
      if (formMode === "create") {
        res = await AxiosAPI.post(designationsUrl, payload);
      } else {
        res = await AxiosAPI.put(designationDetailUrl(formData.id!), payload);
      }

      if (res.data?.success) {
        toast.success(res.data.message || `Designation ${formMode === "create" ? "created" : "updated"} successfully`);
        mutate();
        setIsFormOpen(false);
      } else {
        toast.error(res.data?.message || `Failed to ${formMode === "create" ? "create" : "update"} designation`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred while saving");
    }
  };

  const columns: ColumnDef<TeacherDesignationData>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "Active" ? "default" : "secondary"} className={status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "border-none"}>
            {status}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActions
          onEdit={() => handleEdit(row.original)}
          onDelete={() => openDeleteDialog(row.original.id!)}
        />
      ),
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="p-2 space-y-4">
      <Card>
        <CardHeader className="bg-white border-b border-gray-100 pb-3">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <Title>Teacher Designations</Title>
              <p className="text-xs text-muted-foreground mt-1">Manage teacher roles and titles.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                <PlusCircle className="w-4 h-4" /> Add Designation
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white rounded-b-xl pt-3">
          <DataTable
            columns={columns}
            data={filteredData}
            searchKey="title"
            searchPlaceholder="Search designations..."
            searchValue={search}
            onSearch={setSearch}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this designation?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Dialog */}
      <TeacherDesignationForm
        mode={formMode}
        initialData={editingData}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
