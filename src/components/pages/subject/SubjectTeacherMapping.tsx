"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Users, UserCheck, ShieldCheck, ClipboardList, BookOpen } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { classes, subjects } from "@/data/academic";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export interface TeacherMappingData {
    id?: string;
    teacherName: string;
    class: string;
    section: string;
    subject: string;
    shift: string;
}

const mockMappings: TeacherMappingData[] = [
    { id: "1", teacherName: "Anisur Rahman", class: "Class 10", section: "Section A", subject: "Physics", shift: "Morning (Boys)" },
    { id: "2", teacherName: "Jamil Chowdhury", class: "Class 10", section: "Section A", subject: "Mathematics", shift: "Morning (Boys)" },
    { id: "3", teacherName: "Farhana Yasmin", class: "Class 10", section: "Section B", subject: "English", shift: "Morning (Girls)" },
    { id: "4", teacherName: "Rokeya Begum", class: "Class 9", section: "Section A", subject: "Chemistry", shift: "Day (Boys)" },
];

const facultyList = [
    "Anisur Rahman",
    "Farhana Yasmin",
    "Jamil Chowdhury",
    "Rokeya Begum",
    "Imtiaz Ahmed",
    "Shahana Chowdhury"
];

export function SubjectTeacherMapping() {
    const [data, setData] = useState<TeacherMappingData[]>(mockMappings);
    const [search, setSearch] = useState("");
    const [selectedClassFilter, setSelectedClassFilter] = useState("All Classes");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<TeacherMappingData | undefined>(undefined);

    // Form inputs
    const [formTeacher, setFormTeacher] = useState(facultyList[0]);
    const [formClass, setFormClass] = useState(classes[2].name);
    const [formSection, setFormSection] = useState("Section A");
    const [formSubject, setFormSubject] = useState(subjects[0].name);
    const [formShift, setFormShift] = useState("Morning (Boys)");

    // View dialog
    const [viewData, setViewData] = useState<TeacherMappingData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Delete dialog
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredData = data.filter((item) => {
        const matchesSearch = item.teacherName.toLowerCase().includes(search.toLowerCase()) || 
                             item.subject.toLowerCase().includes(search.toLowerCase());
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
        setFormSubject(subjects[0].name);
        setFormShift("Morning (Boys)");
        setIsFormOpen(true);
    };

    const handleEdit = (item: TeacherMappingData) => {
        setFormMode("edit");
        setEditingData(item);
        setFormTeacher(item.teacherName);
        setFormClass(item.class);
        setFormSection(item.section);
        setFormSubject(item.subject);
        setFormShift(item.shift);
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

    const handleDeleteConfirm = () => {
        if (deleteId) {
            setData(data.filter((item) => item.id !== deleteId));
            toast.success("Teacher mapping deleted successfully");
        }
        setIsDeleteOpen(false);
        setDeleteId(null);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: TeacherMappingData = {
            teacherName: formTeacher,
            class: formClass,
            section: formSection,
            subject: formSubject,
            shift: formShift,
        };

        if (formMode === "create") {
            setData([...data, { ...payload, id: (data.length + 1).toString() }]);
            toast.success("Teacher mapping created successfully");
        } else {
            setData(data.map((item) => (item.id === editingData?.id ? { ...item, ...payload } : item)));
            toast.success("Teacher mapping updated successfully");
        }
        setIsFormOpen(false);
    };

    const columns: ColumnDef<TeacherMappingData>[] = [
        { accessorKey: "teacherName", header: "Teacher Name" },
        { accessorKey: "class", header: "Class" },
        { accessorKey: "section", header: "Section" },
        { accessorKey: "subject", header: "Subject" },
        { accessorKey: "shift", header: "Shift" },
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
                        <DialogTitle>{formMode === "create" ? "Map Teacher to Subject" : "Edit Teacher Mapping"}</DialogTitle>
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
                                <Label htmlFor="form-subject">Subject</Label>
                                <Select onValueChange={setFormSubject} value={formSubject}>
                                    <SelectTrigger id="form-subject">
                                        <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((sub) => (
                                            <SelectItem key={sub.id} value={sub.name}>{sub.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                            <p><strong>Class:</strong> {viewData.class}</p>
                            <p><strong>Section:</strong> {viewData.section}</p>
                            <p><strong>Subject:</strong> {viewData.subject}</p>
                            <p><strong>Shift:</strong> {viewData.shift}</p>
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
