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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export interface DepartmentData {
    id?: string;
    code: string;
    name: string;
    headOfDept: string;
    teacherCount: number;
    status: string;
}

const mockDepartments: DepartmentData[] = [
    { id: "1", code: "SCI", name: "Science", headOfDept: "Anisur Rahman", teacherCount: 8, status: "Active" },
    { id: "2", code: "ENG", name: "English", headOfDept: "Farhana Yasmin", teacherCount: 5, status: "Active" },
    { id: "3", code: "MAT", name: "Mathematics", headOfDept: "Jamil Chowdhury", teacherCount: 6, status: "Active" },
    { id: "4", code: "BAN", name: "Bangla", headOfDept: "Shahana Chowdhury", teacherCount: 4, status: "Active" },
    { id: "5", code: "HUM", name: "Humanities / Arts", headOfDept: "Imtiaz Ahmed", teacherCount: 3, status: "Active" },
    { id: "6", code: "COM", name: "Commerce", headOfDept: "Not Assigned", teacherCount: 0, status: "Inactive" },
];

const facultyList = [
    "Not Assigned",
    "Anisur Rahman",
    "Farhana Yasmin",
    "Jamil Chowdhury",
    "Rokeya Begum",
    "Imtiaz Ahmed",
    "Shahana Chowdhury"
];

export function TeacherDepartment() {
    const [data, setData] = useState<DepartmentData[]>(mockDepartments);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<DepartmentData | undefined>(undefined);

    // Form inputs
    const [formCode, setFormCode] = useState("");
    const [formName, setFormName] = useState("");
    const [formHead, setFormHead] = useState("Not Assigned");
    const [formStatus, setFormStatus] = useState("Active");

    // View dialog
    const [viewData, setViewData] = useState<DepartmentData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Delete dialog
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredData = data.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase()) || 
               item.code.toLowerCase().includes(search.toLowerCase()) ||
               item.headOfDept.toLowerCase().includes(search.toLowerCase());
    });

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        setFormCode("");
        setFormName("");
        setFormHead("Not Assigned");
        setFormStatus("Active");
        setIsFormOpen(true);
    };

    const handleEdit = (item: DepartmentData) => {
        setFormMode("edit");
        setEditingData(item);
        setFormCode(item.code);
        setFormName(item.name);
        setFormHead(item.headOfDept);
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

    const handleDeleteConfirm = () => {
        if (deleteId) {
            setData(data.filter((item) => item.id !== deleteId));
            toast.success("Department deleted successfully");
        }
        setIsDeleteOpen(false);
        setDeleteId(null);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formCode || !formName) {
            toast.error("Please fill in all required fields");
            return;
        }

        const payload: DepartmentData = {
            code: formCode,
            name: formName,
            headOfDept: formHead,
            teacherCount: formMode === "create" ? 0 : editingData?.teacherCount || 0,
            status: formStatus,
        };

        if (formMode === "create") {
            setData([...data, { ...payload, id: (data.length + 1).toString() }]);
            toast.success("Department created successfully");
        } else {
            setData(data.map((item) => (item.id === editingData?.id ? { ...item, ...payload } : item)));
            toast.success("Department updated successfully");
        }
        setIsFormOpen(false);
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

    const totalDepts = data.length;
    const activeDepts = data.filter(d => d.status === "Active").length;
    const totalTeachersMapped = data.reduce((acc, curr) => acc + curr.teacherCount, 0);

    return (
        <div className="p-2 space-y-4">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="shadow-sm border-primary/10">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{totalDepts}</p>
                            <p className="text-xs text-muted-foreground">Total Departments</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-primary/10">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{activeDepts}</p>
                            <p className="text-xs text-muted-foreground">Active Departments</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-primary/10">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{totalTeachersMapped}</p>
                            <p className="text-xs text-muted-foreground">Faculty Staff Count</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                        data={paginatedData}
                        searchKey="name"
                        searchPlaceholder="Search departments..."
                        searchValue={search}
                        onSearch={setSearch}
                        pagination={{
                            page,
                            pageCount,
                            pageSize,
                            totalCount: filteredData.length,
                            onPageChange: setPage,
                            onPageSizeChange: (size) => {
                                setPageSize(size);
                                setPage(1);
                            },
                        }}
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
                            <Select onValueChange={setFormHead} value={formHead}>
                                <SelectTrigger id="form-head">
                                    <SelectValue placeholder="Select head of department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {facultyList.map((f, idx) => (
                                        <SelectItem key={idx} value={f}>{f}</SelectItem>
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
