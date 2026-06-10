"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    useClassesQuery, 
    useSectionsQuery, 
    useShiftsQuery, 
    useSubjectsQuery, 
    useTeacherMappingsQuery 
} from "@/apis/queries/academic_queries";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { AxiosAPI } from "@/apis/configs";
import { teacherMappingsUrl, teacherMappingDetailUrl } from "@/apis/endpoints/academic_apis";

export interface TeacherMappingData {
    id?: string;
    teacherId: string;
    teacherName: string;
    classId: string;
    className?: string;
    sectionId: string;
    sectionName?: string;
    subjectId: string;
    subjectName?: string;
    shiftId: string;
    shiftName?: string;
}

export function SubjectTeacherMapping() {
    const [search, setSearch] = useState("");
    const [selectedClassFilter, setSelectedClassFilter] = useState("All Classes");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<TeacherMappingData | undefined>(undefined);

    // Backend Dynamic Option Queries
    const { data: classesResponse } = useClassesQuery();
    const { data: sectionsResponse } = useSectionsQuery();
    const { data: shiftsResponse } = useShiftsQuery();
    const { data: subjectsResponse } = useSubjectsQuery();
    const { data: teachersResponse } = useUsersQuery("Teacher");

    const classesList = classesResponse?.data || [];
    const sectionsList = sectionsResponse?.data || [];
    const shiftsList = shiftsResponse?.data || [];
    const subjectsList = subjectsResponse?.data || [];
    const teachersList = teachersResponse?.data || [];

    // Live Mappings List
    const { data: mappingsResponse, isLoading, mutate } = useTeacherMappingsQuery();

    // Form inputs
    const [formTeacherId, setFormTeacherId] = useState("");
    const [formClassId, setFormClassId] = useState("");
    const [formSectionId, setFormSectionId] = useState("");
    const [formSubjectId, setFormSubjectId] = useState("");
    const [formShiftId, setFormShiftId] = useState("");

    // View dialog
    const [viewData, setViewData] = useState<TeacherMappingData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Delete dialog
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawMappings = mappingsResponse?.data || [];
    const filteredData = React.useMemo(() => {
        return rawMappings.filter((item: TeacherMappingData) => {
            const matchesSearch = item.teacherName.toLowerCase().includes(search.toLowerCase()) || 
                                 (item.subjectName && item.subjectName.toLowerCase().includes(search.toLowerCase()));
            const matchesClass = selectedClassFilter === "All Classes" || item.classId === selectedClassFilter;
            return matchesSearch && matchesClass;
        });
    }, [rawMappings, search, selectedClassFilter]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    // Form select options helpers
    const classSections = React.useMemo(() => {
        return sectionsList.filter((s: any) => s.classId === formClassId);
    }, [sectionsList, formClassId]);

    const classSubjects = React.useMemo(() => {
        return subjectsList.filter((s: any) => s.classId === formClassId);
    }, [subjectsList, formClassId]);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        
        setFormTeacherId(teachersList[0]?.id || "");
        
        const firstClassId = classesList[0]?.id || "";
        setFormClassId(firstClassId);
        setFormSectionId("");
        setFormSubjectId("");
        setFormShiftId(shiftsList[0]?.id || "");
        setIsFormOpen(true);
    };

    const handleEdit = (item: TeacherMappingData) => {
        setFormMode("edit");
        setEditingData(item);
        setFormTeacherId(item.teacherId);
        setFormClassId(item.classId);
        setFormSectionId(item.sectionId);
        setFormSubjectId(item.subjectId);
        setFormShiftId(item.shiftId);
        setIsFormOpen(true);
    };

    const handleView = (item: TeacherMappingData) => {
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
                const res = await AxiosAPI.delete(teacherMappingDetailUrl(deleteId));
                if (res.data?.success) {
                    toast.success(res.data.message || "Teacher mapping deleted successfully");
                    mutate();
                } else {
                    toast.error(res.data?.message || "Failed to delete mapping");
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
        if (!formTeacherId || !formClassId || !formSectionId || !formSubjectId || !formShiftId) {
            toast.error("Please fill in all mapping fields");
            return;
        }

        const payload = {
            teacherId: formTeacherId,
            classId: formClassId,
            sectionId: formSectionId,
            subjectId: formSubjectId,
            shiftId: formShiftId,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(teacherMappingsUrl, payload);
            } else {
                res = await AxiosAPI.put(teacherMappingDetailUrl(editingData?.id!), payload);
            }

            if (res.data?.success) {
                toast.success(res.data.message || `Teacher mapping ${formMode === "create" ? "created" : "updated"} successfully`);
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(res.data?.message || `Failed to ${formMode === "create" ? "create" : "update"} mapping`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while saving");
        }
    };

    const columns: ColumnDef<TeacherMappingData>[] = [
        { accessorKey: "teacherName", header: "Teacher Name" },
        { accessorKey: "className", header: "Class" },
        { accessorKey: "sectionName", header: "Section" },
        { accessorKey: "subjectName", header: "Subject" },
        { accessorKey: "shiftName", header: "Shift" },
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

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100 pb-3">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Subject Teacher Mapping</Title>
                            <p className="text-xs text-muted-foreground mt-1">Map specific subject teachers to classes and sections.</p>
                        </div>
                        <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                            <Plus className="w-4 h-4" /> Map Teacher
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
                                    {classesList.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
                        <DialogTitle>{formMode === "create" ? "Map Teacher to Subject" : "Edit Teacher Mapping"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
                        <div className="space-y-1">
                            <Label htmlFor="form-teacher">Select Teacher</Label>
                            <select
                                id="form-teacher"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                value={formTeacherId}
                                onChange={(e) => setFormTeacherId(e.target.value)}
                            >
                                <option value="" disabled>Select teacher</option>
                                {teachersList.map((f: any) => {
                                    const name = `${f.firstName || ""} ${f.lastName || ""}`.trim() || f.username;
                                    return <option key={f.id} value={f.id}>{name}</option>;
                                })}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="form-class">Class</Label>
                                <select
                                    id="form-class"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    value={formClassId}
                                    onChange={(e) => {
                                        setFormClassId(e.target.value);
                                        setFormSectionId("");
                                        setFormSubjectId("");
                                    }}
                                >
                                    <option value="" disabled>Select class</option>
                                    {classesList.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="form-section">Section</Label>
                                <select
                                    id="form-section"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    value={formSectionId}
                                    onChange={(e) => setFormSectionId(e.target.value)}
                                >
                                    <option value="" disabled>Select section</option>
                                    {classSections.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="form-subject">Subject</Label>
                                <select
                                    id="form-subject"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    value={formSubjectId}
                                    onChange={(e) => setFormSubjectId(e.target.value)}
                                >
                                    <option value="" disabled>Select subject</option>
                                    {classSubjects.map((sub: any) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="form-shift">Shift</Label>
                                <select
                                    id="form-shift"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    value={formShiftId}
                                    onChange={(e) => setFormShiftId(e.target.value)}
                                >
                                    <option value="" disabled>Select shift</option>
                                    {shiftsList.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button type="submit">{formMode === "create" ? "Map" : "Save Changes"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>View Teacher Mapping</AlertDialogTitle>
                    </AlertDialogHeader>
                    {viewData && (
                        <div className="space-y-2 text-sm">
                            <p><strong>Teacher Name:</strong> {viewData.teacherName}</p>
                            <p><strong>Class:</strong> {viewData.className}</p>
                            <p><strong>Section:</strong> {viewData.sectionName}</p>
                            <p><strong>Subject:</strong> {viewData.subjectName}</p>
                            <p><strong>Shift:</strong> {viewData.shiftName}</p>
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
                        <AlertDialogDescription>Are you sure you want to delete this teacher subject mapping?</AlertDialogDescription>
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
