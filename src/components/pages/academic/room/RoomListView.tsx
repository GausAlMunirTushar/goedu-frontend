"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { RoomForm, RoomData } from "./RoomForm";
import { useRoomsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { roomsUrl, roomDetailUrl } from "@/apis/endpoints/academic_apis";
import { toast } from "sonner";
import { useModalStore } from "@/stores/modalStore";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export function RoomListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<RoomData | undefined>(undefined);

    const { data: response, isLoading, mutate } = useRoomsQuery();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawData = response?.data || [];
    const mappedData = React.useMemo(() => {
        return rawData.map((item: any) => ({
            id: item.id,
            name: item.name,
            building: item.building,
            capacity: item.capacity.toString(),
            type: item.type,
            status: item.status,
        }));
    }, [rawData]);

    const filteredData = React.useMemo(() => {
        return mappedData.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.building.toLowerCase().includes(search.toLowerCase())
        );
    }, [mappedData, search]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); };
    const [viewData, setViewData] = useState<RoomData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);
    // Delete dialog managed by global modal store
    
    const handleEdit = (item: RoomData) => { setFormMode("edit"); setEditingData(item); setIsFormOpen(true); };
    const handleView = (item: RoomData) => { setViewData(item); setIsViewOpen(true); };
    const openDeleteDialog = (id: string) => {
        openModal("confirm-delete", {
            title: "Delete Room",
            description: "Are you sure you want to delete this room?",
            onConfirm: async () => {
                try {
                    const res = await AxiosAPI.delete(roomDetailUrl(id));
                    if (res.data?.success) {
                        toast.success(res.data.message || "Room deleted successfully");
                        mutate();
                    } else {
                        toast.error(res.data?.message || "Failed to delete room");
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "An error occurred while deleting");
                }
            }
        });
    };

    const handleFormSubmit = async (formData: RoomData) => {
        const payload = {
            name: formData.name,
            building: formData.building,
            capacity: parseInt(formData.capacity, 10),
            type: formData.type,
            status: formData.status,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(roomsUrl, payload);
            } else {
                res = await AxiosAPI.put(roomDetailUrl(formData.id!), payload);
            }

            if (res.data?.success) {
                toast.success(res.data.message || `Room ${formMode === "create" ? "created" : "updated"} successfully`);
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(res.data?.message || `Failed to ${formMode === "create" ? "create" : "update"} room`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while saving");
        }
    };

    const columns: ColumnDef<RoomData>[] = [
        { accessorKey: "name", header: "Room Name" },
        { accessorKey: "building", header: "Building" },
        { accessorKey: "capacity", header: "Capacity" },
        { accessorKey: "type", header: "Type" },
        {
            accessorKey: "status", header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {row.original.status}
                </span>
            ),
        },
        {
            id: "actions", header: "Actions",
            cell: ({ row }) => (
                <TableActions 
                    onView={() => handleView(row.original)}
                    onEdit={() => handleEdit(row.original)} 
                    onDelete={() => openDeleteDialog(row.original.id!)} 
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
                            <Title>Rooms</Title>
                            <p className="text-xs text-muted-foreground mt-1">Configure classrooms, laboratories, and physical spaces capacity.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> Add Room
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="name"
                        searchPlaceholder="Search room..."
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
                {/* View Dialog */}
                <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <AlertDialogContent className="bg-white rounded-xl shadow-lg border-none p-0 overflow-hidden sm:max-w-[450px]">
                        <AlertDialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                            <AlertDialogTitle className="text-base font-bold text-slate-800">View Room</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription asChild>
                            {viewData && (
                                <div className="space-y-3 text-slate-600 px-6 py-4">
                                    <p><strong>Name:</strong> {viewData.name}</p>
                                    <p><strong>Building:</strong> {viewData.building}</p>
                                    <p><strong>Capacity:</strong> {viewData.capacity}</p>
                                    <p><strong>Type:</strong> {viewData.type}</p>
                                    <p><strong>Status:</strong> {viewData.status}</p>
                                </div>
                            )}
                        </AlertDialogDescription>
                        <AlertDialogFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                            <AlertDialogCancel className="text-slate-700 border-slate-200 mt-0">Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </CardContent>
            </Card>
            <RoomForm mode={formMode} initialData={editingData} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
        </div>
    );
}
