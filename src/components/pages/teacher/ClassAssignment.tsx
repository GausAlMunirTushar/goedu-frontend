"use client";

import React, { useState, useEffect, useMemo } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Users, UserCheck, GraduationCap } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useClassAssignmentsQuery, useTeachersProfilesQuery } from "@/apis/queries/teacher_queries";
import { useClassesQuery, useSectionsQuery, useShiftsQuery, useSessionsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { classAssignmentsUrl, classAssignmentDetailUrl } from "@/apis/endpoints/teacher_apis";

export function ClassAssignment() {
    const { data: assignmentsRes, isLoading, mutate } = useClassAssignmentsQuery();
    const { data: teachersRes } = useTeachersProfilesQuery();
    const { data: classesRes } = useClassesQuery();
    const { data: shiftsRes } = useShiftsQuery();
    const { data: sessionsRes } = useSessionsQuery();

    const [search, setSearch] = useState("");
    const [selectedClassFilter, setSelectedClassFilter] = useState("All");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<any | undefined>(undefined);

    // Form inputs
    const [formTeacherId, setFormTeacherId] = useState("");
    const [formClassId, setFormClassId] = useState("");
    const [formSectionId, setFormSectionId] = useState("");
    const [formShiftId, setFormShiftId] = useState("");
    const [formSessionId, setFormSessionId] = useState("");
    const [formStatus, setFormStatus] = useState("Active");

    // Dynamic sections query dependent on selected class in form
    const { data: sectionsRes } = useSectionsQuery(formClassId && formClassId !== "none" ? formClassId : undefined);

    // View dialog
    const [viewData, setViewData] = useState<any | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Delete dialog
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const assignments = assignmentsRes?.data || [];
    const teachers = teachersRes?.data || [];
    const classesList = classesRes?.data || [];
    const shifts = shiftsRes?.data || [];
    const sessions = sessionsRes?.data || [];
    const sections = sectionsRes?.data || [];

    const activeTeachers = useMemo(() => {
        return teachers.filter((t: any) => t.isActive || t.id === editingData?.teacher?.id);
    }, [teachers, editingData]);

    const filteredData = useMemo(() => {
        return assignments.filter((item: any) => {
            const teacherName = `${item.teacher?.firstName || ""} ${item.teacher?.lastName || ""}`.toLowerCase();
            const sectionName = (item.section?.name || "").toLowerCase();
            const className = (item.class?.name || "").toLowerCase();
            const matchesSearch = teacherName.includes(search.toLowerCase()) || 
                                 sectionName.includes(search.toLowerCase()) ||
                                 className.includes(search.toLowerCase());

            const matchesClass = selectedClassFilter === "All" || item.class?.id === selectedClassFilter;
            return matchesSearch && matchesClass;
        });
    }, [assignments, search, selectedClassFilter]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    // Reset section selection when class changes
    useEffect(() => {
        if (formClassId && formMode === "create") {
            setFormSectionId("");
        }
    }, [formClassId, formMode]);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        setFormTeacherId("");
        setFormClassId("");
        setFormSectionId("");
        setFormShiftId("");
        setFormSessionId("");
        setFormStatus("Active");
        setIsFormOpen(true);
    };

    const handleEdit = (item: any) => {
        setFormMode("edit");
        setEditingData(item);
        setFormTeacherId(item.teacher?.id || "");
        setFormClassId(item.class?.id || "");
        setFormSectionId(item.section?.id || "");
        setFormShiftId(item.shift?.id || "");
        setFormSessionId(item.session?.id || "");
        setFormStatus(item.status);
        setIsFormOpen(true);
    };

    const handleView = (item: any) => {
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
                const res = await AxiosAPI.delete(classAssignmentDetailUrl(deleteId));
                if (res.data?.success) {
                    toast.success(res.data.message || "Class assignment deleted successfully");
                    mutate();
                } else {
                    toast.error(res.data?.message || "Failed to delete class assignment");
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
        
        if (!formTeacherId || formTeacherId === "none" ||
            !formClassId || formClassId === "none" ||
            !formSectionId || formSectionId === "none" ||
            !formShiftId || formShiftId === "none" ||
            !formSessionId || formSessionId === "none") {
            toast.error("Please fill in all fields");
            return;
        }

        const payload = {
            teacherId: formTeacherId,
            classId: formClassId,
            sectionId: formSectionId,
            shiftId: formShiftId,
            sessionId: formSessionId,
            status: formStatus,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(classAssignmentsUrl, payload);
            } else {
                res = await AxiosAPI.put(classAssignmentDetailUrl(editingData.id), payload);
            }

            if (res.data?.success) {
                toast.success(res.data.message || `Class teacher ${formMode === "create" ? "assigned" : "updated"} successfully`);
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(res.data?.message || `Failed to save class assignment`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while saving class assignment");
        }
    };

    const columns: ColumnDef<any>[] = [
        { 
            header: "Class Teacher",
            accessorFn: (row) => row.teacher ? `${row.teacher.firstName} ${row.teacher.lastName}` : "Not Assigned",
            id: "teacherName"
        },
        { 
            header: "Class",
            accessorFn: (row) => row.class?.name || "N/A",
            id: "class"
        },
        { 
            header: "Section",
            accessorFn: (row) => row.section?.name || "N/A",
            id: "section" 
        },
        { 
            header: "Shift",
            accessorFn: (row) => row.shift?.name || "N/A",
            id: "shift" 
        },
        { 
            header: "Session",
            accessorFn: (row) => row.session?.name || "N/A",
            id: "session" 
        },
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

    const totalAssigned = assignments.length;
    const activeAssignments = assignments.filter((a: any) => a.status === "Active").length;
    const uniqueTeachers = new Set(assignments.map((a: any) => a.teacher?.id).filter(Boolean)).size;

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
                            <select 
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={(e) => setSelectedClassFilter(e.target.value)} 
                                value={selectedClassFilter}
                            >
                                <option value="All">All Classes</option>
                                {classesList.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="teacherName"
                        searchPlaceholder="Search mappings..."
                        searchValue={search}
                        onSearch={setSearch}
                        isLoading={isLoading}
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
                            <select 
                                id="form-teacher"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onChange={(e) => setFormTeacherId(e.target.value)} 
                                value={formTeacherId}
                            >
                                <option value="none">Choose a teacher</option>
                                {activeTeachers.map((f: any) => (
                                    <option key={f.id} value={f.id}>{`${f.firstName} ${f.lastName} (${f.username})`}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="form-class">Class</Label>
                                <select 
                                    id="form-class"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onChange={(e) => setFormClassId(e.target.value)} 
                                    value={formClassId}
                                >
                                    <option value="none">Choose class</option>
                                    {classesList.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="form-section">Section</Label>
                                <select 
                                    id="form-section"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onChange={(e) => setFormSectionId(e.target.value)} 
                                    value={formSectionId}
                                    disabled={!formClassId || formClassId === "none"}
                                >
                                    <option value="none">
                                        {!formClassId || formClassId === "none" ? "Select class first" : "Choose section"}
                                    </option>
                                    {sections.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="form-shift">Shift</Label>
                                <select 
                                    id="form-shift"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onChange={(e) => setFormShiftId(e.target.value)} 
                                    value={formShiftId}
                                >
                                    <option value="none">Choose shift</option>
                                    {shifts.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="form-session">Session</Label>
                                <select 
                                    id="form-session"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onChange={(e) => setFormSessionId(e.target.value)} 
                                    value={formSessionId}
                                >
                                    <option value="none">Choose session</option>
                                    {sessions.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="form-status">Status</Label>
                            <select 
                                id="form-status"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onChange={(e) => setFormStatus(e.target.value)} 
                                value={formStatus}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
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
                        <AlertDialogTitle>View Class Assignment Details</AlertDialogTitle>
                    </AlertDialogHeader>
                    {viewData && (
                        <div className="space-y-2 text-sm">
                            <p><strong>Class Teacher:</strong> {viewData.teacher ? `${viewData.teacher.firstName} ${viewData.teacher.lastName}` : "Not Assigned"}</p>
                            <p><strong>Class:</strong> {viewData.class?.name || "N/A"}</p>
                            <p><strong>Section:</strong> {viewData.section?.name || "N/A"}</p>
                            <p><strong>Shift:</strong> {viewData.shift?.name || "N/A"}</p>
                            <p><strong>Session:</strong> {viewData.session?.name || "N/A"}</p>
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
