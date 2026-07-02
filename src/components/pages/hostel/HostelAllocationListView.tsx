"use client";

import { AxiosAPI } from "@/apis/configs";
import {
    hostelAllocationCheckoutUrl,
    hostelAllocationDetailUrl,
    hostelAllocationsUrl,
} from "@/apis/endpoints/hostel_apis";
import { useHostelAllocationsQuery, useHostelBedsQuery, useHostelRoomsQuery, useHostelsQuery } from "@/apis/queries/hostel_queries";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { LogOut, Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { AllocationForm } from "./HostelForms";
import type { HostelAllocationData } from "./hostelTypes";

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleDateString() : "-";

export function HostelAllocationListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<HostelAllocationData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useHostelAllocationsQuery();
    const { data: hostelResponse } = useHostelsQuery();
    const { data: roomResponse } = useHostelRoomsQuery();
    const { data: bedResponse, mutate: mutateBeds } = useHostelBedsQuery();
    const { data: studentsResponse } = useStudentProfilesQuery({ status: "Active" });
    const rows = React.useMemo(() => response?.data || [], [response]);
    const hostels = React.useMemo(() => hostelResponse?.data || [], [hostelResponse]);
    const rooms = React.useMemo(() => roomResponse?.data || [], [roomResponse]);
    const beds = React.useMemo(() => bedResponse?.data || [], [bedResponse]);
    const students = React.useMemo(() => studentsResponse?.data || [], [studentsResponse]);
    const filteredRows = React.useMemo(() => rows.filter((item: HostelAllocationData) =>
        item.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        item.student?.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        item.hostel?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.room?.roomNo?.toLowerCase().includes(search.toLowerCase()) ||
        item.bed?.bedNo?.toLowerCase().includes(search.toLowerCase()),
    ), [rows, search]);

    const handleSubmit = async (data: HostelAllocationData) => {
        setIsSaving(true);
        try {
            const payload = {
                studentId: data.studentId,
                hostelId: data.hostelId,
                roomId: data.roomId,
                bedId: data.bedId,
                startDate: data.startDate,
                endDate: data.endDate || null,
                status: data.status,
                remarks: data.remarks || undefined,
            };
            const res = formMode === "create" ? await AxiosAPI.post(hostelAllocationsUrl, payload) : await AxiosAPI.put(hostelAllocationDetailUrl(data.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Student allocated" : "Allocation updated");
                mutate();
                mutateBeds();
                setIsFormOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCheckout = (item: HostelAllocationData) => {
        openModal("confirm-delete", {
            title: "Checkout resident",
            description: "This will complete the allocation and make the bed available.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.post(hostelAllocationCheckoutUrl(item.id!), {});
                    toast.success("Resident checked out");
                    mutate();
                    mutateBeds();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Checkout failed");
                }
            },
        });
    };

    const handleDelete = (id: string) => {
        openModal("confirm-delete", {
            title: "Cancel allocation",
            description: "This allocation will be cancelled and the bed will be released if active.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(hostelAllocationDetailUrl(id));
                    toast.success("Allocation cancelled");
                    mutate();
                    mutateBeds();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<HostelAllocationData>[] = [
        { header: "Student", cell: ({ row }) => row.original.student?.fullName || row.original.student?.name || "-" },
        { header: "Student ID", cell: ({ row }) => row.original.student?.studentId || "-" },
        { header: "Class", cell: ({ row }) => row.original.student?.class?.name || "-" },
        { header: "Hostel", cell: ({ row }) => row.original.hostel?.name || "-" },
        { header: "Room/Bed", cell: ({ row }) => `${row.original.room?.roomNo || "-"} / ${row.original.bed?.bedNo || "-"}` },
        { header: "Start", cell: ({ row }) => formatDate(row.original.startDate) },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>{row.original.status}</span>,
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
                    extraActions={[{
                        label: "Checkout",
                        icon: <LogOut size={16} />,
                        disabled: row.original.status !== "Active",
                        onClick: () => handleCheckout(row.original),
                    }]}
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
                            <Title>Hostel Allocations</Title>
                            <p className="text-xs text-muted-foreground mt-1">Assign active students to available hostel beds and checkout residents.</p>
                        </div>
                        <Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" /> Allocate Student
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable columns={columns} data={filteredRows} searchKey="studentId" searchPlaceholder="Search residents..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <AllocationForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} students={students} hostels={hostels} rooms={rooms} beds={beds} />
        </div>
    );
}
