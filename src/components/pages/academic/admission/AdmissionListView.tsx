"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { AdmissionForm, AdmissionData } from "./AdmissionForm";
import { useAdmissionsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { admissionsUrl, admissionDetailUrl } from "@/apis/endpoints/academic_apis";
import { toast } from "sonner";
import { useModalStore } from "@/stores/modalStore";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export function AdmissionListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingData, setEditingData] = useState<AdmissionData | undefined>(undefined);

    const { data: response, isLoading, mutate } = useAdmissionsQuery();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const rawData = response?.data || [];
    const mappedData = React.useMemo(() => {
        return rawData.map((item: any) => ({
            id: item.id,
            applicant_name: item.applicantName,
            classId: item.classId,
            className: item.class?.name || "",
            mobile: item.mobile,
            application_date: item.applicationDate ? new Date(item.applicationDate).toISOString().split('T')[0] : "",
            status: item.status,
        }));
    }, [rawData]);

    const filteredData = React.useMemo(() => {
        return mappedData.filter((item: any) =>
            item.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
            item.className.toLowerCase().includes(search.toLowerCase()) ||
            item.mobile.includes(search)
        );
    }, [mappedData, search]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleCreate = () => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); };
    const [viewData, setViewData] = useState<AdmissionData | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);
    // Delete dialog managed by global modal store
    
    const handleEdit = (item: AdmissionData) => { setFormMode("edit"); setEditingData(item); setIsFormOpen(true); };
    const handleView = (item: AdmissionData) => { setViewData(item); setIsViewOpen(true); };
    const openDeleteDialog = (id: string) => {
        openModal("confirm-delete", {
            title: "Delete Admission Application",
            description: "Are you sure you want to delete this application?",
            onConfirm: async () => {
                try {
                    const res = await AxiosAPI.delete(admissionDetailUrl(id));
                    if (res.data?.success) {
                        toast.success(res.data.message || "Admission application deleted successfully");
                        mutate();
                    } else {
                        toast.error(res.data?.message || "Failed to delete admission application");
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "An error occurred while deleting");
                }
            }
        });
    };

    const handleFormSubmit = async (formData: AdmissionData) => {
        const payload = {
            applicantName: formData.applicant_name,
            classId: formData.classId,
            mobile: formData.mobile,
            status: formData.status,
        };

        try {
            let res;
            if (formMode === "create") {
                res = await AxiosAPI.post(admissionsUrl, payload);
            } else {
                res = await AxiosAPI.put(admissionDetailUrl(formData.id!), payload);
            }

            if (res.data?.success) {
                toast.success(res.data.message || `Admission application ${formMode === "create" ? "created" : "updated"} successfully`);
                mutate();
                setIsFormOpen(false);
            } else {
                toast.error(res.data?.message || `Failed to ${formMode === "create" ? "create" : "update"} admission application`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while saving");
        }
    };

    const columns: ColumnDef<AdmissionData>[] = [
        { accessorKey: "applicant_name", header: "Applicant Name" },
        { accessorKey: "className", header: "Class" },
        { accessorKey: "mobile", header: "Mobile" },
        { accessorKey: "application_date", header: "Date" },
        {
            accessorKey: "status", header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.original.status === "Approved" ? "bg-green-100 text-green-700" : 
                    row.original.status === "Pending" ? "bg-yellow-100 text-yellow-700" : 
                    "bg-red-100 text-red-600"
                }`}>
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

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100 pb-3">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Admissions</Title>
                            <p className="text-xs text-muted-foreground mt-1">Track, view, and process student admission applications.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <Button className="w-full sm:w-auto flex items-center gap-2" onClick={handleCreate}>
                                <Plus className="w-4 h-4" /> Add Application
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl pt-3">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="applicant_name"
                        searchPlaceholder="Search applicant..."
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
                            <AlertDialogTitle className="text-base font-bold text-slate-800">View Admission Application</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription asChild>
                            {viewData && (
                                <div className="space-y-3 text-slate-600 px-6 py-4">
                                    <p><strong>Applicant Name:</strong> {viewData.applicant_name}</p>
                                    <p><strong>Class:</strong> {viewData.className}</p>
                                    <p><strong>Mobile:</strong> {viewData.mobile}</p>
                                    <p><strong>Application Date:</strong> {viewData.application_date}</p>
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
            <AdmissionForm mode={formMode} initialData={editingData} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
        </div>
    );
}
