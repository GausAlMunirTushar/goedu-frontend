"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlusCircle, Users, UserCheck, UserX } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useTeachersProfilesQuery } from "@/apis/queries/teacher_queries";
import { AxiosAPI } from "@/apis/configs";
import { teacherProfileDetailUrl } from "@/apis/endpoints/teacher_apis";
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

export function TeacherListView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const router = useRouter();

  const { data: response, isLoading, mutate } = useTeachersProfilesQuery();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const rawData = response?.data || [];

  const filteredData = React.useMemo(() => {
    return rawData.filter((d: any) => {
      const fullName = `${d.firstName || ""} ${d.lastName || ""}`.toLowerCase();
      const designationTitle = (d.designation?.title || "").toLowerCase();
      const departmentName = (d.department?.name || "").toLowerCase();
      const email = (d.email || "").toLowerCase();
      const phone = (d.phone || "").toLowerCase();
      const username = (d.username || "").toLowerCase();

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        designationTitle.includes(search.toLowerCase()) ||
        departmentName.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase()) ||
        phone.includes(search.toLowerCase()) ||
        username.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && d.isActive) ||
        (statusFilter === "Inactive" && !d.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [rawData, search, statusFilter]);

  const handleCreate = () => {
    router.push("/teacher/create");
  };

  const handleEdit = (item: any) => {
    router.push(`/teacher/edit/${item.id}`);
  };

  const handleView = (item: any) => {
    router.push(`/teacher/${item.id}`);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        const res = await AxiosAPI.delete(teacherProfileDetailUrl(deleteId));
        if (res.data?.success) {
          toast.success(res.data.message || "Teacher deleted successfully");
          mutate();
        } else {
          toast.error(res.data?.message || "Failed to delete teacher");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred while deleting");
      }
    }
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Name",
      accessorFn: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
      id: "name",
    },
    {
      header: "Designation",
      accessorFn: (row) => row.designation?.title || "Not Assigned",
      id: "designation",
    },
    {
      header: "Department",
      accessorFn: (row) => row.department?.name || "Not Assigned",
      id: "department",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={isActive ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "border-none"}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
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

  // Stats calculation
  const totalTeachers = rawData.length;
  const activeTeachers = rawData.filter((t: any) => t.isActive).length;
  const inactiveTeachers = totalTeachers - activeTeachers;

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="p-2 space-y-4">
      <Card>
        <CardHeader className="bg-white border-b border-gray-100 pb-3">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <Title>Teachers</Title>
              <p className="text-xs text-muted-foreground mt-1">Manage teacher records, add new staff, and edit existing details.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                <PlusCircle className="w-4 h-4" /> Add Teacher
              </Button>
            </div>
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
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this teacher profile? All academic dependencies like department associations might be modified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
