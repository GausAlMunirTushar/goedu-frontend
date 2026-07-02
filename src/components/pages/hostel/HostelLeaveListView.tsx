"use client";

import { AxiosAPI } from "@/apis/configs";
import { hostelLeavesUrl } from "@/apis/endpoints/hostel_apis";
import { useHostelAllocationsQuery, useHostelLeavesQuery } from "@/apis/queries/hostel_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { LeaveForm } from "./HostelForms";
import type { HostelLeaveData } from "./hostelTypes";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleDateString() : "-";

export function HostelLeaveListView() {
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useHostelLeavesQuery();
    const { data: allocationResponse } = useHostelAllocationsQuery();
    const rows = React.useMemo(() => response?.data || [], [response]);
    const allocations = React.useMemo(() => allocationResponse?.data || [], [allocationResponse]);
    const filteredRows = React.useMemo(() => rows.filter((item: HostelLeaveData) =>
        item.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        item.student?.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        item.hostel?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.reason?.toLowerCase().includes(search.toLowerCase()),
    ), [rows, search]);

    const handleSubmit = async (data: HostelLeaveData) => {
        setIsSaving(true);
        try {
            const res = await AxiosAPI.post(hostelLeavesUrl, {
                allocationId: data.allocationId,
                fromDate: data.fromDate,
                toDate: data.toDate,
                reason: data.reason,
                destination: data.destination || undefined,
                guardianPhone: data.guardianPhone || undefined,
                status: data.status,
            });
            if (res.data?.success) {
                toast.success("Hostel leave recorded");
                mutate();
                setIsFormOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSaving(false);
        }
    };

    const columns: ColumnDef<HostelLeaveData>[] = [
        { header: "Student", cell: ({ row }) => row.original.student?.fullName || row.original.student?.name || "-" },
        { header: "Student ID", cell: ({ row }) => row.original.student?.studentId || "-" },
        { header: "Hostel", cell: ({ row }) => row.original.hostel?.name || "-" },
        { header: "From", cell: ({ row }) => formatDate(row.original.fromDate) },
        { header: "To", cell: ({ row }) => formatDate(row.original.toDate) },
        { accessorKey: "reason", header: "Reason" },
        { accessorKey: "destination", header: "Destination" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Approved" ? "bg-green-100 text-green-700" : row.original.status === "Rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>{row.original.status}</span>,
        },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Hostel Leave Register</Title>
                            <p className="text-xs text-muted-foreground mt-1">Record approved, pending, or rejected leave-out entries for hostel residents.</p>
                        </div>
                        <Button onClick={() => setIsFormOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" /> Record Leave
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable columns={columns} data={filteredRows} searchKey="reason" searchPlaceholder="Search leave records..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <LeaveForm allocations={allocations} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />
        </div>
    );
}
