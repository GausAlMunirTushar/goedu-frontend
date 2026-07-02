"use client";

import { AxiosAPI } from "@/apis/configs";
import {
    studentGuardianDetailUrl,
    studentGuardianLinkStudentUrl,
    studentGuardianUnlinkStudentUrl,
    studentGuardiansUrl,
} from "@/apis/endpoints/student_apis";
import { useStudentGuardiansQuery, useStudentProfilesQuery } from "@/apis/queries/student_queries";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { Link2, Plus, X } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { GuardianForm } from "./GuardianForm";

export interface GuardianData {
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    relationType: string;
    occupation?: string;
    address?: string;
    status: string;
    createUserAccount?: boolean;
    username?: string;
    password?: string;
    students?: any[];
    user?: any;
}

interface LinkFormData {
    studentId: string;
    relationship: string;
    isPrimary: boolean;
    canPickup: boolean;
    emergencyContact: boolean;
}

const guardianName = (item: GuardianData) => `${item.firstName} ${item.lastName}`;
const studentName = (student: any) => `${student.firstName} ${student.lastName} (${student.roll || student.studentId})`;

function LinkStudentDialog({ guardian, isOpen, onClose, onChanged }: {
    guardian?: GuardianData;
    isOpen: boolean;
    onClose: () => void;
    onChanged: () => void;
}) {
    const [saving, setSaving] = React.useState(false);
    const { data: studentsResponse } = useStudentProfilesQuery({ status: "Active" });
    const { control, handleSubmit, register, reset } = useForm<LinkFormData>({
        defaultValues: { studentId: "", relationship: "Guardian", isPrimary: false, canPickup: false, emergencyContact: false },
    });

    React.useEffect(() => {
        if (isOpen) reset({ studentId: "", relationship: guardian?.relationType || "Guardian", isPrimary: false, canPickup: false, emergencyContact: false });
    }, [guardian?.relationType, isOpen, reset]);

    const onSubmit = async (data: LinkFormData) => {
        if (!guardian?.id) return;
        setSaving(true);
        try {
            await AxiosAPI.post(studentGuardianLinkStudentUrl(guardian.id), data);
            toast.success("Student linked");
            onChanged();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Link failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[560px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        Link Student: {guardian ? guardianName(guardian) : ""}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller
                        control={control}
                        name="studentId"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <SelectInput
                                label="Student"
                                searchable
                                required
                                options={(studentsResponse?.data || []).map((student: any) => ({ value: student.id, label: studentName(student) }))}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <FormInput id="relationship" label="Relationship" required {...register("relationship", { required: true })} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <label className="flex items-center gap-2"><input type="checkbox" {...register("isPrimary")} /> Primary</label>
                        <label className="flex items-center gap-2"><input type="checkbox" {...register("canPickup")} /> Can pickup</label>
                        <label className="flex items-center gap-2"><input type="checkbox" {...register("emergencyContact")} /> Emergency</label>
                    </div>
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Linking..." : "Link Student"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function GuardianListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isLinkOpen, setIsLinkOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<GuardianData>();
    const [selectedGuardian, setSelectedGuardian] = React.useState<GuardianData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useStudentGuardiansQuery();

    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => {
        const keyword = search.toLowerCase();
        return rows.filter((item: GuardianData) =>
            guardianName(item).toLowerCase().includes(keyword) ||
            item.phone?.toLowerCase().includes(keyword) ||
            item.email?.toLowerCase().includes(keyword),
        );
    }, [rows, search]);

    const handleSubmit = async (data: GuardianData) => {
        setIsSaving(true);
        try {
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email || undefined,
                relationType: data.relationType,
                occupation: data.occupation || undefined,
                address: data.address || undefined,
                status: data.status,
                createUserAccount: !!data.createUserAccount,
                username: data.username || undefined,
                password: data.password || undefined,
            };
            const res = formMode === "create"
                ? await AxiosAPI.post(studentGuardiansUrl, payload)
                : await AxiosAPI.put(studentGuardianDetailUrl(data.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Guardian created" : "Guardian updated");
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
            title: "Delete guardian",
            description: "This guardian will be deactivated and removed from active lists.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(studentGuardianDetailUrl(id));
                    toast.success("Guardian deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const handleUnlink = async (guardianId: string, studentId: string) => {
        try {
            await AxiosAPI.delete(studentGuardianUnlinkStudentUrl(guardianId, studentId));
            toast.success("Student unlinked");
            mutate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Unlink failed");
        }
    };

    const columns: ColumnDef<GuardianData>[] = [
        {
            header: "Guardian",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{guardianName(row.original)}</p>
                    <p className="text-xs text-muted-foreground">{row.original.relationType}</p>
                </div>
            ),
        },
        { accessorKey: "phone", header: "Phone" },
        { accessorKey: "email", header: "Email" },
        {
            header: "Linked Students",
            cell: ({ row }) => (
                <div className="space-y-1">
                    {(row.original.students || []).map((link: any) => (
                        <div key={link.id} className="flex items-center gap-2 text-xs">
                            <span className="rounded bg-slate-100 px-2 py-1">{studentName(link.student)}</span>
                            <button onClick={() => handleUnlink(row.original.id!, link.studentId)} className="text-red-600">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {!row.original.students?.length && <span className="text-xs text-muted-foreground">No student linked</span>}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {row.original.status}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                        setSelectedGuardian(row.original);
                        setIsLinkOpen(true);
                    }}>
                        <Link2 className="h-4 w-4 mr-1" /> Link
                    </Button>
                    <TableActions
                        onEdit={() => {
                            setFormMode("edit");
                            setEditingData(row.original);
                            setIsFormOpen(true);
                        }}
                        onDelete={() => handleDelete(row.original.id!)}
                    />
                </div>
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
                            <Title>Guardians</Title>
                            <p className="text-xs text-muted-foreground mt-1">Manage parent and guardian contacts linked to student profiles.</p>
                        </div>
                        <Button onClick={() => {
                            setFormMode("create");
                            setEditingData(undefined);
                            setIsFormOpen(true);
                        }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Guardian
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={filteredRows}
                        searchKey="firstName"
                        searchPlaceholder="Search guardians..."
                        searchValue={search}
                        onSearch={setSearch}
                    />
                </CardContent>
            </Card>
            <GuardianForm
                mode={formMode}
                initialData={editingData}
                isOpen={isFormOpen}
                isSubmitting={isSaving}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
            />
            <LinkStudentDialog
                guardian={selectedGuardian}
                isOpen={isLinkOpen}
                onClose={() => setIsLinkOpen(false)}
                onChanged={mutate}
            />
        </div>
    );
}
