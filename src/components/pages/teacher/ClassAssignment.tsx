"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Users, UserCheck, GraduationCap, ClipboardList } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { classes, sessions } from "@/data/academic";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export interface ClassAssignmentData {
    id?: string;
    teacherName: string;
    class: string;
    section: string;
    shift: string;
    session: string;
    status: string;
}

const mockClassAssignments: ClassAssignmentData[] = [
    { id: "1", teacherName: "Anisur Rahman", class: "Class 10", section: "Section A", shift: "Morning (Boys)", session: "2025-2026", status: "Active" },
    { id: "2", teacherName: "Farhana Yasmin", class: "Class 10", section: "Section B", shift: "Morning (Girls)", session: "2025-2026", status: "Active" },
    { id: "3", teacherName: "Jamil Chowdhury", class: "Class 9", section: "Section A", shift: "Day (Boys)", session: "2025-2026", status: "Active" },
    { id: "4", teacherName: "Shahana Chowdhury", class: "Class 8", section: "Section A", shift: "Day (Girls)", session: "2024-2025", status: "Active" },
];

const facultyList = [
    "Anisur Rahman",
    "Farhana Yasmin",
    "Jamil Chowdhury",
    "Rokeya Begum",
    "Imtiaz Ahmed",
    "Shahana Chowdhury"
];

export function ClassAssignment() {
    const [data, setData] = useState<ClassAssignmentData[]>(mockClassAssignments);
    const [search, setSearch] = useState("");
    const [selectedClassFilter, setSelectedClassFilter] = useState("All Classes");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<ClassAssignmentData | undefined>(undefined);

    // Form inputs
    const [formTeacher, setFormTeacher] = useState(facultyList[0]);
    const [formClass, setFormClass] = useState(classes[2].name);
    const [formSection, setFormSection] = useState("Section A");
    const [formShift, setFormShift] = useState("Morning (Boys)");
    const [formSession, setFormSession] = useState(sessions[4]?.name || "2025-2026");
    const [formStatus, setFormStatus] = useState("Active");

    // View dialog
    const [viewData, setViewData] = useState<ClassAssignmentData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Delete dialog
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredData = data.filter((item) => {
        const matchesSearch = item.teacherName.toLowerCase().includes(search.toLowerCase()) || 
                             item.section.toLowerCase().includes(search.toLowerCase());
        const matchesClass = selectedClassFilter === "All Classes" || item.class === selectedClassFilter;
        return matchesSearch && matchesClass;
    });

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        setFormTeacher(facultyList[0]);
        setFormClass(classes[2].name);
        setFormSection("Section A");
        setFormShift("Morning (Boys)");
        setFormSession(sessions[4]?.name || "2025-2026");
        setFormStatus("Active");
        setIsFormOpen(true);
    };

    const handleEdit = (item: ClassAssignmentData) => {
        setFormMode("edit");
        setEditingData(item);
        setFormTeacher(item.teacherName);
        setFormClass(item.class);
        setFormSection(item.section);
        setFormShift(item.shift);
        setFormSession(item.session);
        setFormStatus(item.status);
        setIsFormOpen(true);
    };

    const handleView = (item: ClassAssignmentData) => {
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
            toast.success("Class assignment deleted successfully");
        }
        setIsDeleteOpen(false);
        setDeleteId(null);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: ClassAssignmentData = {
            teacherName: formTeacher,
            class: formClass,
            section: formSection,
            shift: formShift,
            session: formSession,
            status: formStatus,
        };

        if (formMode === "create") {
            setData([...data, { ...payload, id: (data.length + 1).toString() }]);
            toast.success("Class teacher assigned successfully");
        } else {
            setData(data.map((item) => (item.id === editingData?.id ? { ...item, ...payload } : item)));
            toast.success("Class teacher assignment updated successfully");
        }
        setIsFormOpen(false);
    };

    const columns: ColumnDef<ClassAssignmentData>[] = [
        { accessorKey: "teacherName", header: "Class Teacher" },
        { accessorKey: "class", header: "Class" },
        { accessorKey: "section", header: "Section" },
        { accessorKey: "shift", header: "Shift" },
        { accessorKey: "session", header: "Session" },
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

    const totalAssigned = data.length;
    const activeAssignments = data.filter(a => a.status === "Active").length;
    const uniqueTeachers = new Set(data.map(a => a.teacherName)).size;

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
                            <p className="text-2xl font-black text-gray-900">{totalAssigned}</p>
                            <p className="text-xs text-muted-foreground">Classes Assigned</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-primary/10">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{activeAssignments}</p>
                            <p className="text-xs text-muted-foreground">Active Class Teachers</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-primary/10">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{uniqueTeachers}</p>
                            <p className="text-xs text-muted-foreground">Unique Class Teachers</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="bg-white border-b border-gray-100 pb-3">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Class Assignments</Title>
                            <p className="text-xs text-muted-foreground mt-1">Assign teachers to be the dedicated Class Teacher of a class & section.</p>
                        </div>
                        <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                            <Plus className="w-4 h-4" /> Assign Class Teacher
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
                    {/* Toolbar Filters */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-48">
                            <Select onValueChange={setSelectedClassFilter} value={selectedClassFilter}>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Filter by class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Classes">All Classes</SelectItem>
                                    {classes.map((c) => (
                                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="teacherName"
                        searchPlaceholder="Search mappings..."
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
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{formMode === "create" ? "Assign Class Teacher" : "Edit Class Assignment"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
                        <div className="space-y-1">
                            <Label htmlFor="form-teacher">Select Teacher</Label>
                            <Select onValueChange={setFormTeacher} value={formTeacher}>
                                <SelectTrigger id="form-teacher">
                                    <SelectValue placeholder="Select teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    {facultyList.map((f, idx) => (
                                        <SelectItem key={idx} value={f}>{f}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="form-class">Class</Label>
                                <Select onValueChange={setFormClass} value={formClass}>
                                    <SelectTrigger id="form-class">
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((c) => (
                                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="form-section">Section</Label>
                                <Select onValueChange={setFormSection} value={formSection}>
                                    <SelectTrigger id="form-section">
                                        <SelectValue placeholder="Select section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Section A">Section A</SelectItem>
                                        <SelectItem value="Section B">Section B</SelectItem>
                                        <SelectItem value="Section C">Section C</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="form-shift">Shift</Label>
                                <Select onValueChange={setFormShift} value={formShift}>
                                    <SelectTrigger id="form-shift">
                                        <SelectValue placeholder="Select shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Morning (Boys)">Morning (Boys)</SelectItem>
                                        <SelectItem value="Morning (Girls)">Morning (Girls)</SelectItem>
                                        <SelectItem value="Day (Boys)">Day (Boys)</SelectItem>
                                        <SelectItem value="Day (Girls)">Day (Girls)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="form-session">Session</Label>
                                <Select onValueChange={setFormSession} value={formSession}>
                                    <SelectTrigger id="form-session">
                                        <SelectValue placeholder="Select session" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sessions.map((s) => (
                                            <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1">
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
                            <Button type="submit">{formMode === "create" ? "Assign" : "Save Changes"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>View Class Assignment</AlertDialogTitle>
                    </AlertDialogHeader>
                    {viewData && (
                        <div className="space-y-2 text-sm">
                            <p><strong>Class Teacher:</strong> {viewData.teacherName}</p>
                            <p><strong>Class:</strong> {viewData.class}</p>
                            <p><strong>Section:</strong> {viewData.section}</p>
                            <p><strong>Shift:</strong> {viewData.shift}</p>
                            <p><strong>Session:</strong> {viewData.session}</p>
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
                        <AlertDialogDescription>Are you sure you want to delete this class teacher assignment?</AlertDialogDescription>
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
