"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/custom-ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { teachers } from "@/data/teachers";
import { TeacherForm, TeacherData } from "./TeacherForm";
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

export function TeacherListView() {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingData, setEditingData] = useState<TeacherData | undefined>(undefined);

  const [data, setData] = useState<TeacherData[]>(teachers);
  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.ceil(data.length / pageSize) || 1;
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  // view dialog state
  const [viewData, setViewData] = useState<TeacherData | undefined>(undefined);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCreate = () => {
    setFormMode("create");
    setEditingData(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: TeacherData) => {
    setFormMode("edit");
    setEditingData(item);
    setIsFormOpen(true);
  };

  const handleView = (item: TeacherData) => {
    setViewData(item);
    setIsViewOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      setData(data.filter((item) => item.id !== deleteId));
    }
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  const handleFormSubmit = (formData: TeacherData) => {
    if (formMode === "create") {
      const newId = (data.length + 1).toString();
      setData([...data, { ...formData, id: newId }]);
    } else {
      setData(data.map((item) => (item.id === formData.id ? { ...item, ...formData } : item)));
    }
  };

  const columns: ColumnDef<TeacherData>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActions
          onView={() => handleView(row.original)}
          onEdit={() => handleEdit(row.original)}
          onDelete={() => openDeleteDialog(row.original.id!)}
        />
      ),
    },
  ];

  const filteredData = paginatedData.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-2 space-y-4">
      <Card>
        <CardHeader className="bg-white border-b border-gray-100 pb-3">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <PageHeader title="Teachers" description="Manage teacher records, add new staff, and edit existing details." />
            <Button className="flex items-center gap-2" onClick={handleCreate}>
              <Plus className="w-4 h-4" /> Add Teacher
            </Button>
          </div>
        </CardHeader>
        <CardContent className="bg-white rounded-b-xl pt-3">
          <DataTable
            columns={columns}
            data={filteredData}
            searchKey="name"
            searchPlaceholder="Search teachers..."
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

      {/* View Dialog */}
      <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Teacher Details</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {viewData && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {viewData.name}</p>
                <p><strong>Designation:</strong> {viewData.designation}</p>
                <p><strong>Department:</strong> {viewData.department}</p>
                {viewData.email && <p><strong>Email:</strong> {viewData.email}</p>}
                {viewData.phone && <p><strong>Phone:</strong> {viewData.phone}</p>}
              </div>
            )}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this teacher?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Dialog */}
      <TeacherForm
        mode={formMode}
        initialData={editingData}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
