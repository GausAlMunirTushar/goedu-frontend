"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import TableActions from "@/components/ui/table-actions";

export type Student = {
    id: string;
    studentId: string;
    name: string;
    class: string;
    section: string;
    roll: string;
    status: string;
};

const columns: ColumnDef<Student>[] = [
    { accessorKey: "studentId", header: "Student ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "class", header: "Class" },
    { accessorKey: "section", header: "Section" },
    { accessorKey: "roll", header: "Roll" },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant={status === "Active" ? "default" : "secondary"}
                    className={status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "border-none"}
                >
                    {status}
                </Badge>
            );
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const student = row.original;
            return (
                <TableActions
                    onView={() => console.log("View", student.id)}
                    onEdit={() => console.log("Edit", student.id)}
                    onDelete={() => console.log("Delete", student.id)}
                />
            );
        }
    }
];

const mockData: Student[] = [
    { id: "1", studentId: "STU001", name: "John Doe", class: "Class 10", section: "A", roll: "01", status: "Active" },
    { id: "2", studentId: "STU002", name: "Jane Smith", class: "Class 10", section: "B", roll: "12", status: "Active" },
    { id: "3", studentId: "STU003", name: "Michael Johnson", class: "Class 9", section: "A", roll: "05", status: "Inactive" },
    { id: "4", studentId: "STU004", name: "Emily Davis", class: "Class 8", section: "C", roll: "22", status: "Active" },
    { id: "5", studentId: "STU005", name: "Chris Brown", class: "Class 10", section: "A", roll: "15", status: "Active" },
];

export function StudentListView() {
    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredData = mockData.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
        const matchesClass = classFilter === "all" || d.class === classFilter;
        const matchesStatus = statusFilter === "all" || d.status === statusFilter;
        return matchesSearch && matchesClass && matchesStatus;
    });

    return (
        <div className="p-4 space-y-6">
            <Card className="">
                <CardHeader className="bg-white border-b border-gray-100 pb-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">All Students</CardTitle>
                            <CardDescription>A comprehensive list of students enrolled.</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    <SelectItem value="Class 8">Class 8</SelectItem>
                                    <SelectItem value="Class 9">Class 9</SelectItem>
                                    <SelectItem value="Class 10">Class 10</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            <Link href="/student/registration" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm h-9">
                                    <PlusCircle className="w-4 h-4" />
                                    Add New Student
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        searchKey="name"
                        searchValue={search}
                        onSearch={setSearch}
                        searchPlaceholder="Search students by name..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}
