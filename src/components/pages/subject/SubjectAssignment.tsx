"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, BookOpen, Trash2, Pencil, Search, SlidersHorizontal } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { classes, subjects, sections } from "@/data/academic";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export interface AssignmentData {
    id?: string;
    class: string;
    section: string;
    shift: string;
    assignedSubjects: string[];
}

const mockAssignments: AssignmentData[] = [
    { id: "1", class: "Class 10", section: "Section A", shift: "Morning (Boys)", assignedSubjects: ["Mathematics", "Physics", "Chemistry", "English"] },
    { id: "2", class: "Class 10", section: "Section B", shift: "Morning (Girls)", assignedSubjects: ["Mathematics", "English", "Biology"] },
    { id: "3", class: "Class 9", section: "Section A", shift: "Day (Boys)", assignedSubjects: ["History", "Geography", "English", "Mathematics"] },
    { id: "4", class: "Class 8", section: "Section A", shift: "Day (Girls)", assignedSubjects: ["Mathematics", "English", "Bangla"] },
];

export function SubjectAssignment() {
    const [data, setData] = useState<AssignmentData[]>(mockAssignments);
    const [search, setSearch] = useState("");
    const [selectedClassFilter, setSelectedClassFilter] = useState("All Classes");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<AssignmentData | undefined>(undefined);

    // Form inputs
    const [formClass, setFormClass] = useState(classes[2].name); // Class 10
    const [formSection, setFormSection] = useState("Section A");
    const [formShift, setFormShift] = useState("Morning (Boys)");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    // View dialog
    const [viewData, setViewData] = useState<AssignmentData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Delete dialog
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredData = data.filter((item) => {
        const matchesSearch = item.class.toLowerCase().includes(search.toLowerCase()) || 
                             item.section.toLowerCase().includes(search.toLowerCase());
        const matchesClass = selectedClassFilter === "All Classes" || item.class === selectedClassFilter;
        return matchesSearch && matchesClass;
    });

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => {
        setFormMode("create");
        setEditingData(undefined);
        setFormClass(classes[2].name);
        setFormSection("Section A");
        setFormShift("Morning (Boys)");
        setSelectedSubjects([]);
        setIsFormOpen(true);
    };

    const handleEdit = (item: AssignmentData) => {
        setFormMode("edit");
        setEditingData(item);
        setFormClass(item.class);
        setFormSection(item.section);
        setFormShift(item.shift);
        setSelectedSubjects(item.assignedSubjects);
        setIsFormOpen(true);
    };

    const handleView = (item: AssignmentData) => {
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
            toast.success("Assignment mapping deleted successfully");
        }
        setIsDeleteOpen(false);
        setDeleteId(null);
    };

    const handleSubjectToggle = (subjectName: string) => {
        setSelectedSubjects((prev) => 
            prev.includes(subjectName) 
                ? prev.filter((s) => s !== subjectName) 
                : [...prev, subjectName]
        );
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSubjects.length === 0) {
            toast.error("Please select at least one subject to assign");
            return;
        }

        const payload: AssignmentData = {
            class: formClass,
            section: formSection,
            shift: formShift,
            assignedSubjects: selectedSubjects,
        };

        if (formMode === "create") {
            setData([...data, { ...payload, id: (data.length + 1).toString() }]);
            toast.success("Subject assignment created successfully");
        } else {
            setData(data.map((item) => (item.id === editingData?.id ? { ...item, ...payload } : item)));
            toast.success("Subject assignment updated successfully");
        }
        setIsFormOpen(false);
    };

    const columns: ColumnDef<AssignmentData>[] = [
        { accessorKey: "class", header: "Class" },
        { accessorKey: "section", header: "Section" },
        { accessorKey: "shift", header: "Shift" },
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
                            <Title>Subject Assignment</Title>
                            <p className="text-xs text-muted-foreground mt-1">Assign multiple subjects to classes and sections.</p>
                        </div>
                        <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                            <Plus className="w-4 h-4" /> Assign Subjects
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
                        searchKey="class"
                        searchPlaceholder="Search assignments..."
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{formMode === "create" ? "Assign Subjects to Class" : "Edit Assigned Subjects"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
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

                        {/* Subject Checkbox List */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Select Subjects to Assign</Label>
                            <div className="border border-gray-100 rounded-lg p-3 max-h-48 overflow-y-auto grid grid-cols-2 gap-2">
                                {subjects.map((sub) => (
                                    <div key={sub.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`sub-${sub.id}`}
                                            checked={selectedSubjects.includes(sub.name)}
                                            onCheckedChange={() => handleSubjectToggle(sub.name)}
                                        />
                                        <label htmlFor={`sub-${sub.id}`} className="text-xs font-medium text-gray-700 cursor-pointer select-none">
                                            {sub.name} <span className="text-gray-400 font-mono text-[10px]">({sub.code})</span>
                                        </label>
                                    </div>
                                ))}
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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>View Subject Assignment</AlertDialogTitle>
                    </AlertDialogHeader>
                    {viewData && (
                        <div className="space-y-3 text-sm">
                            <p><strong>Class:</strong> {viewData.class}</p>
                            <p><strong>Section:</strong> {viewData.section}</p>
                            <p><strong>Shift:</strong> {viewData.shift}</p>
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
                        <AlertDialogDescription>Are you sure you want to delete this class subject assignment?</AlertDialogDescription>
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
