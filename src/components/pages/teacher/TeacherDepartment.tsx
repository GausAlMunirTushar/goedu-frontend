"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Users, UserCheck, ShieldCheck, ClipboardList } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useDepartmentsQuery, useTeachersProfilesQuery } from "@/apis/queries/teacher_queries";
import { AxiosAPI } from "@/apis/configs";
import { departmentsUrl, departmentDetailUrl } from "@/apis/endpoints/teacher_apis";

export interface DepartmentData {
    id?: string;
    code: string;
    name: string;
    headOfDept: string;
    headOfDeptId: string | null;
    teacherCount: number;
    status: string;
}

export function TeacherDepartment() {
    const { data: deptResponse, isLoading, mutate } = useDepartmentsQuery();
    const { data: teacherResponse } = useTeachersProfilesQuery();

    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<DepartmentData | undefined>(undefined);

    // Form inputs
    const [formCode, setFormCode] = useState("");
    const [formName, setFormName] = useState("");
    const [formHeadId, setFormHeadId] = useState<string>("unassigned");
    const [formStatus, setFormStatus] = useState("Active");

    // View dialog
    const [viewData, setViewData] = useState<DepartmentData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Delete dialog
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const facultyList = React.useMemo(() => {
        const teachers = teacherResponse?.data || [];
        return teachers.map((t: any) => ({
            id: t.id,
            name: `${t.firstName} ${t.lastName}`
        }));
    }, [teacherResponse]);

    const mappedData: DepartmentData[] = React.useMemo(() => {
        const rawDepts = deptResponse?.data || [];
        return rawDepts.map((d: any) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            headOfDept: d.headOfDept ? `${d.headOfDept.firstName} ${d.headOfDept.lastName}` : "Not Assigned",
            headOfDeptId: d.headOfDept?.id || null,
            teacherCount: d.users ? d.users.length : 0,
            status: d.status,
        }));
    }, [deptResponse]);

    const filteredData = mappedData.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase()) || 
               item.code.toLowerCase().includes(search.toLowerCase()) ||
               item.headOfDept.toLowerCase().includes(search.toLowerCase());
    });

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        setFormCode("");
        setFormName("");
        setFormHeadId("unassigned");
        setFormStatus("Active");
        setIsFormOpen(true);
    };

    const handleEdit = (item: DepartmentData) => {
        setFormMode("edit");
        setEditingData(item);
        setFormCode(item.code);
        setFormName(item.name);
        setFormHeadId(item.headOfDeptId || "unassigned");
        setFormStatus(item.status);
        setIsFormOpen(true);
    };

    const handleView = (item: DepartmentData) => {
        setViewData(item);
        setIsViewOpen(true);
    };

    const openDeleteDialog = (id: string) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            try {
                const res = await AxiosAPI.delete(departmentDetailUrl(deleteId));
                if (res.data?.success) {
                    toast.success("Department deleted successfully");
                    mutate();
                } else {
                    toast.error(res.data?.message || "Failed to delete department");
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || "An error occurred while deleting");
            }
        }
        setIsDeleteOpen(false);
        setDeleteId(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formCode || !formName) {
            toast.error("Please fill in all required fields");
            return;
        }

        const payload = {
            code: formCode,
            name: formName,
            headOfDeptId: formHeadId === "unassigned" ? null : formHeadId,
            status: formStatus,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(departmentsUrl, payload);
            } else {
                res = await AxiosAPI.put(departmentDetailUrl(editingData!.id!), payload);
            }

            if (res.data?.success) {
                toast.success(`Department ${formMode === "create" ? "created" : "updated"} successfully`);
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(res.data?.message || `Failed to ${formMode === "create" ? "create" : "update"} department`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while saving");
        }
    };

    const columns: ColumnDef<DepartmentData>[] = [
        { accessorKey: "code", header: "Code" },
        { accessorKey: "name", header: "Department Name" },
        { accessorKey: "headOfDept", header: "Head of Dept" },
        { accessorKey: "teacherCount", header: "Total Teachers" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    row.original.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>
                    {row.original.status}
                </span>
            ),
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

    const totalDepts = mappedData.length;
    const activeDepts = mappedData.filter(d => d.status === "Active").length;
    const totalTeachersMapped = mappedData.reduce((acc, curr) => acc + curr.teacherCount, 0);

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100 pb-3">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Teacher Departments</Title>
                            <p className="text-xs text-muted-foreground mt-1">Manage academic departments and assign department heads.</p>
                        </div>
                        <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                            <Plus className="w-4 h-4" /> Add Department
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        searchKey="name"
                        searchPlaceholder="Search departments..."
                        searchValue={search}
                        onSearch={setSearch}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            {/* Creation & Editing Modal Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{formMode === "create" ? "Add New Department" : "Edit Department"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
                        <div className="grid gap-2">
                            <Label htmlFor="form-code">Department Code</Label>
                            <Input id="form-code" value={formCode} onChange={(e) => setFormCode(e.target.value)} placeholder="e.g. SCI" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="form-name">Department Name</Label>
                            <Input id="form-name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Science" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="form-head">Head of Department</Label>
                            <Select onValueChange={setFormHeadId} value={formHeadId}>
                                <SelectTrigger id="form-head">
                                    <SelectValue placeholder="Select head of department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Not Assigned</SelectItem>
                                    {facultyList.map((f: any) => (
                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="form-status">Status</Label>
                            <Select onValueChange={setFormStatus} value={formStatus}>
                                <SelectTrigger id="form-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button type="submit">{formMode === "create" ? "Create" : "Save Changes"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>View Department Details</AlertDialogTitle>
                    </AlertDialogHeader>
                    {viewData && (
                        <div className="space-y-2 text-sm">
                            <p><strong>Code:</strong> {viewData.code}</p>
                            <p><strong>Name:</strong> {viewData.name}</p>
                            <p><strong>Head of Department:</strong> {viewData.headOfDept}</p>
                            <p><strong>Total Faculty Teachers:</strong> {viewData.teacherCount}</p>
                            <p><strong>Status:</strong> {viewData.status}</p>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this department?</AlertDialogDescription>
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
