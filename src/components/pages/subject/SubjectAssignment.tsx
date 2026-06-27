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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useModalStore } from "@/stores/modalStore";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { 
    useClassesQuery, 
    useSectionsQuery, 
    useShiftsQuery, 
    useSubjectsQuery, 
    useSubjectAssignmentsQuery 
} from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { subjectAssignmentsUrl, subjectAssignmentDetailUrl } from "@/apis/endpoints/academic_apis";

export interface AssignmentData {
    id: string; // key "classId-sectionId-shiftId"
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
    shiftId: string;
    shiftName: string;
    assignedSubjects: string[];
    assignedSubjectIds: string[];
}

export function SubjectAssignment() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = useState("");
    const [selectedClassFilter, setSelectedClassFilter] = useState("All Classes");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<AssignmentData | undefined>(undefined);

    // Dynamic Options Queries
    const { data: classesResponse } = useClassesQuery();
    const { data: sectionsResponse } = useSectionsQuery();
    const { data: shiftsResponse } = useShiftsQuery();
    const { data: subjectsResponse } = useSubjectsQuery();

    const classesList = classesResponse?.data || [];
    const sectionsList = sectionsResponse?.data || [];
    const shiftsList = shiftsResponse?.data || [];
    const subjectsList = subjectsResponse?.data || [];

    // Live Assignments List
    const { data: assignmentsResponse, isLoading, mutate } = useSubjectAssignmentsQuery();

    // Form inputs
    const [formClassId, setFormClassId] = useState("");
    const [formSectionId, setFormSectionId] = useState("");
    const [formShiftId, setFormShiftId] = useState("");
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

    // View dialog
    const [viewData, setViewData] = useState<AssignmentData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Delete dialog managed by global modal store

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawAssignments = assignmentsResponse?.data || [];
    const filteredData = React.useMemo(() => {
        return rawAssignments.filter((item: AssignmentData) => {
            const matchesSearch = item.className.toLowerCase().includes(search.toLowerCase()) || 
                                 item.sectionName.toLowerCase().includes(search.toLowerCase()) ||
                                 item.shiftName.toLowerCase().includes(search.toLowerCase());
            const matchesClass = selectedClassFilter === "All Classes" || item.classId === selectedClassFilter;
            return matchesSearch && matchesClass;
        });
    }, [rawAssignments, search, selectedClassFilter]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    // Sync form sections based on selected class
    const classSections = React.useMemo(() => {
        return sectionsList.filter((s: any) => s.classId === formClassId);
    }, [sectionsList, formClassId]);

    // Sync form subjects based on selected class
    const classSubjects = React.useMemo(() => {
        return subjectsList.filter((s: any) => s.classId === formClassId);
    }, [subjectsList, formClassId]);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        
        const firstClassId = classesList[0]?.id || "";
        setFormClassId(firstClassId);
        setFormSectionId("");
        setFormShiftId(shiftsList[0]?.id || "");
        setSelectedSubjectIds([]);
        setIsFormOpen(true);
    };

    const handleEdit = (item: AssignmentData) => {
        setFormMode("edit");
        setEditingData(item);
        setFormClassId(item.classId);
        setFormSectionId(item.sectionId);
        setFormShiftId(item.shiftId);
        setSelectedSubjectIds(item.assignedSubjectIds);
        setIsFormOpen(true);
    };

    const handleView = (item: AssignmentData) => {
        setViewData(item);
        setIsViewOpen(true);
    };

    const openDeleteDialog = (item: AssignmentData) => {
        openModal("confirm-delete", {
            title: "Delete Subject Assignment",
            description: "Are you sure you want to delete this class subject assignment?",
            onConfirm: async () => {
                try {
                    const res = await AxiosAPI.delete(
                        subjectAssignmentDetailUrl(item.classId, item.sectionId, item.shiftId)
                    );
                    if (res.data?.success) {
                        toast.success(res.data.message || "Assignment mapping deleted successfully");
                        mutate();
                    } else {
                        toast.error(res.data?.message || "Failed to delete assignment");
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "An error occurred while deleting");
                }
            }
        });
    };

    const handleSubjectToggle = (subjectId: string) => {
        setSelectedSubjectIds((prev) => 
            prev.includes(subjectId) 
                ? prev.filter((id) => id !== subjectId) 
                : [...prev, subjectId]
        );
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formClassId || !formSectionId || !formShiftId) {
            toast.error("Please select a Class, Section, and Shift");
            return;
        }
        if (selectedSubjectIds.length === 0) {
            toast.error("Please select at least one subject to assign");
            return;
        }

        const payload = {
            classId: formClassId,
            sectionId: formSectionId,
            shiftId: formShiftId,
            subjectIds: selectedSubjectIds,
        };

        try {
            const res = await AxiosAPI.post(subjectAssignmentsUrl, payload);
            if (res.data?.success) {
                toast.success(res.data.message || "Subject assignments updated successfully");
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(res.data?.message || "Failed to update assignments");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while saving");
        }
    };

    const columns: ColumnDef<AssignmentData>[] = [
        { accessorKey: "className", header: "Class" },
        { accessorKey: "sectionName", header: "Section" },
        { accessorKey: "shiftName", header: "Shift" },
        {
            accessorKey: "assignedSubjects",
            header: "Assigned Subjects",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1 max-w-md">
                    {row.original.assignedSubjects.map((s, idx) => (
                        <span key={idx} className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {s}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <TableActions 
                    onView={() => handleView(row.original)}
                    onEdit={() => handleEdit(row.original)} 
                    onDelete={() => openDeleteDialog(row.original)} 
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
                            <Title>Subject Assignment</Title>
                            <p className="text-xs text-muted-foreground mt-1">Assign multiple subjects to classes and sections.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <div className="w-full sm:w-48">
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
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> Assign Subjects
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">

                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="className"
                        searchPlaceholder="Search assignments..."
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{formMode === "create" ? "Assign Subjects to Class" : "Edit Assigned Subjects"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
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
                                    }}
                                    disabled={formMode === "edit"}
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
                                    disabled={formMode === "edit"}
                                >
                                    <option value="" disabled>Select section</option>
                                    {classSections.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="form-shift">Shift</Label>
                            <select
                                id="form-shift"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                value={formShiftId}
                                onChange={(e) => setFormShiftId(e.target.value)}
                                disabled={formMode === "edit"}
                            >
                                <option value="" disabled>Select shift</option>
                                {shiftsList.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Checkbox List */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Select Subjects to Assign</Label>
                            <div className="border border-gray-100 rounded-lg p-3 max-h-48 overflow-y-auto grid grid-cols-2 gap-2">
                                {classSubjects.length === 0 ? (
                                    <p className="text-xs text-muted-foreground col-span-2 py-4 text-center">
                                        {!formClassId ? "Please select a Class first" : "No subjects defined for this Class"}
                                    </p>
                                ) : (
                                    classSubjects.map((sub: any) => (
                                        <div key={sub.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`sub-${sub.id}`}
                                                checked={selectedSubjectIds.includes(sub.id)}
                                                onCheckedChange={() => handleSubjectToggle(sub.id)}
                                            />
                                            <label htmlFor={`sub-${sub.id}`} className="text-xs font-medium text-gray-700 cursor-pointer select-none">
                                                {sub.name} <span className="text-gray-400 font-mono text-[10px]">({sub.code})</span>
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
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
                <AlertDialogContent className="bg-white rounded-xl shadow-lg border-none p-0 overflow-hidden sm:max-w-[450px]">
                    <AlertDialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                        <AlertDialogTitle className="text-base font-bold text-slate-800">View Subject Assignment</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription asChild>
                        {viewData && (
                            <div className="space-y-3 text-slate-600 px-6 py-4">
                                <p><strong>Class:</strong> {viewData.className}</p>
                                <p><strong>Section:</strong> {viewData.sectionName}</p>
                                <p><strong>Shift:</strong> {viewData.shiftName}</p>
                                <div>
                                    <strong>Assigned Subjects:</strong>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {viewData.assignedSubjects.map((s, idx) => (
                                            <span key={idx} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </AlertDialogDescription>
                    <AlertDialogFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <AlertDialogCancel className="text-slate-700 border-slate-200 mt-0">Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
