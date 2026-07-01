"use client";

import { useLibraryIssuesQuery } from "@/apis/queries/library_queries";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, RotateCcw } from "lucide-react";
import React from "react";
import { IssueBookDialog } from "./IssueBookDialog";
import { ReturnBookDialog } from "./ReturnBookDialog";

const studentLabel = (student: any) => {
    const name = student?.user?.name || [student?.firstName, student?.lastName].filter(Boolean).join(" ") || student?.name || "Student";
    const roll = student?.rollNumber || student?.roll || student?.studentId;
    return roll ? `${name} (${roll})` : name;
};

const statusClass = (status: string) => {
    if (status === "Returned") return "bg-green-100 text-green-700";
    if (status === "Overdue") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
};

export function LibraryIssueListView() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [isIssueOpen, setIsIssueOpen] = React.useState(false);
    const [isReturnOpen, setIsReturnOpen] = React.useState(false);
    const [selectedIssue, setSelectedIssue] = React.useState<any>();
    const { data: response, isLoading, mutate } = useLibraryIssuesQuery({ status });

    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => {
        const keyword = search.toLowerCase();
        return rows.filter((item: any) =>
            item.copy?.book?.title?.toLowerCase().includes(keyword) ||
            item.copy?.accessionNumber?.toLowerCase().includes(keyword) ||
            studentLabel(item.student).toLowerCase().includes(keyword),
        );
    }, [rows, search]);

    const columns: ColumnDef<any>[] = [
        {
            header: "Book",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.copy?.book?.title || "-"}</p>
                    <p className="text-xs text-muted-foreground">Accession: {row.original.copy?.accessionNumber || "-"}</p>
                </div>
            ),
        },
        { header: "Student", cell: ({ row }) => studentLabel(row.original.student) },
        { header: "Issue Date", cell: ({ row }) => row.original.issueDate?.slice?.(0, 10) || "-" },
        { header: "Due Date", cell: ({ row }) => row.original.dueDate?.slice?.(0, 10) || "-" },
        { header: "Return Date", cell: ({ row }) => row.original.returnDate?.slice?.(0, 10) || "-" },
        { accessorKey: "fineAmount", header: "Fine" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(row.original.status)}`}>
                    {row.original.status}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const canReturn = row.original.status === "Issued" || row.original.status === "Overdue";
                return canReturn ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedIssue(row.original);
                            setIsReturnOpen(true);
                        }}
                    >
                        <RotateCcw className="h-4 w-4 mr-1" /> Return
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">Completed</span>
                );
            },
        },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                        <div>
                            <Title>Book Issues</Title>
                            <p className="text-xs text-muted-foreground mt-1">Issue accession copies to students and process returns.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                            <div className="w-full sm:w-48">
                                <SelectInput
                                    options={[
                                        { value: "", label: "All Statuses" },
                                        { value: "Issued", label: "Issued" },
                                        { value: "Overdue", label: "Overdue" },
                                        { value: "Returned", label: "Returned" },
                                    ]}
                                    value={status}
                                    onChange={setStatus}
                                    showNoneOption={false}
                                />
                            </div>
                            <Button onClick={() => setIsIssueOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Issue Book
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={filteredRows}
                        searchKey="book"
                        searchPlaceholder="Search issues..."
                        searchValue={search}
                        onSearch={setSearch}
                    />
                </CardContent>
            </Card>

            <IssueBookDialog
                isOpen={isIssueOpen}
                onClose={() => setIsIssueOpen(false)}
                onChanged={mutate}
            />
            <ReturnBookDialog
                issue={selectedIssue}
                isOpen={isReturnOpen}
                onClose={() => setIsReturnOpen(false)}
                onChanged={mutate}
            />
        </div>
    );
}
