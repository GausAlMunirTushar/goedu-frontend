"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/custom-ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { teachers } from "@/data/teachers";
import { TeacherData } from "./TeacherForm";
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
  const router = useRouter();


  const [data, setData] = useState<TeacherData[]>(teachers);
  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.ceil(data.length / pageSize) || 1;
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);



  // delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCreate = () => {
    router.push("/teacher/create");
  };

  const handleEdit = (item: TeacherData) => {
    router.push(`/teacher/edit/${item.id}`);
  };

  const handleView = (item: TeacherData) => {
    router.push(`/teacher/${item.id}`);
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

    </div>
  );
}
