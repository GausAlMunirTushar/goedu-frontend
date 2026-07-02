"use client";

import { AxiosAPI } from "@/apis/configs";
import { transportAssignmentDetailUrl, transportAssignmentsUrl } from "@/apis/endpoints/transport_apis";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import {
    useTransportAssignmentsQuery,
    useTransportRoutesQuery,
} from "@/apis/queries/transport_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { AssignmentForm } from "./TransportForms";
import type { TransportAssignmentData } from "./transportTypes";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleDateString() : "-";

export function TransportAssignmentListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<TransportAssignmentData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useTransportAssignmentsQuery();
    const { data: routesResponse } = useTransportRoutesQuery();
    const { data: studentsResponse } = useStudentProfilesQuery({ status: "Active" });

    const rows = React.useMemo(() => response?.data || [], [response]);
    const routes = React.useMemo(() => routesResponse?.data || [], [routesResponse]);
    const students = React.useMemo(() => studentsResponse?.data || [], [studentsResponse]);
    const filteredRows = React.useMemo(() => rows.filter((item: TransportAssignmentData) =>
        item.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        item.student?.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        item.route?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.stop?.name?.toLowerCase().includes(search.toLowerCase()),
    ), [rows, search]);

    const handleSubmit = async (formData: TransportAssignmentData) => {
        setIsSaving(true);
        try {
            const payload = {
                studentId: formData.studentId,
                routeId: formData.routeId,
                stopId: formData.stopId || undefined,
                pickupPoint: formData.pickupPoint || undefined,
                startDate: formData.startDate,
                endDate: formData.endDate || null,
                status: formData.status,
            };
            const res = formMode === "create"
                ? await AxiosAPI.post(transportAssignmentsUrl, payload)
                : await AxiosAPI.put(transportAssignmentDetailUrl(formData.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Student assigned" : "Assignment updated");
                mutate();
                setIsFormOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        openModal("confirm-delete", {
            title: "Remove assignment",
            description: "This student transport assignment will be marked inactive.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(transportAssignmentDetailUrl(id));
                    toast.success("Assignment removed");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<TransportAssignmentData>[] = [
        { header: "Student", cell: ({ row }) => row.original.student?.fullName || row.original.student?.name || "-" },
        { header: "Student ID", cell: ({ row }) => row.original.student?.studentId || row.original.student?.admissionNo || "-" },
        { header: "Class", cell: ({ row }) => row.original.student?.class?.name || "-" },
        { header: "Route", cell: ({ row }) => row.original.route?.name || "-" },
        { header: "Stop", cell: ({ row }) => row.original.stop?.name || row.original.pickupPoint || "-" },
        { header: "Start", cell: ({ row }) => formatDate(row.original.startDate) },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{row.original.status}</span>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <TableActions
                    onEdit={() => {
                        setFormMode("edit");
                        setEditingData({
                            ...row.original,
                            startDate: row.original.startDate?.slice(0, 10),
                            endDate: row.original.endDate ? row.original.endDate.slice(0, 10) : "",
                        });
                        setIsFormOpen(true);
                    }}
                    onDelete={() => handleDelete(row.original.id!)}
                />
            ),
        },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Transport Assignments</Title>
                            <p className="text-xs text-muted-foreground mt-1">Assign active students to routes and stops.</p>
                        </div>
                        <Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" /> Assign Student
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable columns={columns} data={filteredRows} searchKey="studentId" searchPlaceholder="Search students, routes, stops..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <AssignmentForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} students={students} routes={routes} />
        </div>
    );
}
