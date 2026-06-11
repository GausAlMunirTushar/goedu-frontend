"use client";

import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Title from "@/components/ui/custom-ui/title";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, GraduationCap, UserCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import TableActions from "@/components/ui/table-actions";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { useClassesQuery } from "@/apis/queries/academic_queries";
import { deleteStudentProfile } from "@/apis/mutations/student_mutations";
import { toast } from "sonner";
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

export function StudentListView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data: response, isLoading, mutate } = useStudentProfilesQuery({
    classId: classFilter === "all" ? undefined : classFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: search || undefined,
  });
  
  const { data: classesRes } = useClassesQuery();

  const students = response?.data || [];
  const classesList = classesRes?.data || [];

  const pageCount = Math.ceil(students.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    return students.slice((page - 1) * pageSize, page * pageSize);
  }, [students, page, pageSize]);

  const handleView = (id: string) => {
    router.push(`/student/profile?id=${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/student/registration?id=${id}`);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        const res = await deleteStudentProfile(deleteId);
        if (res.success) {
          toast.success(res.message || "Student profile deleted successfully");
          mutate();
        } else {
          toast.error(res.message || "Failed to delete student profile");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred while deleting student");
      }
    }
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: "studentId", header: "Student ID" },
    {
      header: "Name",
      accessorFn: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
      id: "name",
    },
    {
      header: "Class",
      accessorFn: (row) => row.class?.name || "N/A",
      id: "class",
    },
    {
      header: "Section",
      accessorFn: (row) => row.section?.name || "N/A",
      id: "section",
    },
    { accessorKey: "roll", header: "Roll" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as string;
        return (
          <Badge
            variant={status === "Active" ? "default" : "secondary"}
            className={status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "border-none"}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <TableActions
            onView={() => handleView(student.id)}
            onEdit={() => handleEdit(student.id)}
            onDelete={() => openDeleteDialog(student.id)}
          />
        );
      },
    },
  ];

  // Stats calculation
  const totalStudents = students.length;
  const activeStudents = students.filter((s: any) => s.status === "Active").length;
  const inactiveStudents = totalStudents - activeStudents;

  return (
    <div className="p-2 space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Total Enrolled</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{activeStudents}</p>
              <p className="text-xs text-muted-foreground">Active Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{inactiveStudents}</p>
              <p className="text-xs text-muted-foreground">Inactive / On Leave</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="bg-white border-b border-gray-100 pb-3">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <Title>Students</Title>
              <p className="text-sm text-gray-500">A comprehensive list of students enrolled.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Select value={classFilter} onValueChange={(val) => { setClassFilter(val); setPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classesList.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={() => router.push("/student/registration")}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-sm h-9"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Student
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white rounded-b-xl pt-3">
          <DataTable
            columns={columns}
            data={paginatedData}
            searchKey="name"
            searchValue={search}
            onSearch={(val) => { setSearch(val); setPage(1); }}
            searchPlaceholder="Search students by name, ID, roll..."
            isLoading={isLoading}
            pagination={{
              page,
              pageCount,
              pageSize,
              totalCount: students.length,
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
            <AlertDialogDescription>
              Are you sure you want to delete this student profile? Their corresponding user account login credentials will also be permanently deleted.
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
