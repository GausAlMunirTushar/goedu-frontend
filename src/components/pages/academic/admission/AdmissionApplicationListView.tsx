"use client";

import { AxiosAPI } from "@/apis/configs";
import {
    admissionApplicationConvertUrl,
    admissionApplicationDecisionUrl,
} from "@/apis/endpoints/academic_apis";
import { useAdmissionApplicationsQuery, useSectionsQuery, useSessionsQuery, useShiftsQuery } from "@/apis/queries/academic_queries";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, GraduationCap } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const statuses = ["Submitted", "Under Review", "Selected", "Rejected", "Admitted"];

function statusClass(status: string) {
    if (status === "Admitted" || status === "Selected") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    if (status === "Under Review") return "bg-blue-100 text-blue-700";
    return "bg-amber-100 text-amber-700";
}

function DecisionDialog({ application, isOpen, onClose, onChanged }: any) {
    const [saving, setSaving] = React.useState(false);
    const { control, handleSubmit, register, reset } = useForm({ defaultValues: { status: "Under Review", note: "" } });

    React.useEffect(() => {
        if (isOpen) reset({ status: application?.status || "Under Review", note: "" });
    }, [application?.status, isOpen, reset]);

    const onSubmit = async (data: any) => {
        setSaving(true);
        try {
            await AxiosAPI.post(admissionApplicationDecisionUrl(application.id), data);
            toast.success("Decision saved");
            onChanged();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Decision failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[520px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">Review Application</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <SelectInput
                                label="Status"
                                showNoneOption={false}
                                options={statuses.map((status) => ({ value: status, label: status }))}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <FormInput id="note" label="Review Note" placeholder="Optional decision note" {...register("note")} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Decision"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ConvertDialog({ application, isOpen, onClose, onChanged }: any) {
    const [saving, setSaving] = React.useState(false);
    const { data: sectionsResponse } = useSectionsQuery(application?.classId);
    const { data: sessionsResponse } = useSessionsQuery();
    const { data: shiftsResponse } = useShiftsQuery();
    const { control, handleSubmit, register, reset } = useForm({
        defaultValues: { roll: "", sectionId: "", sessionId: "", shiftId: "", createUserAccount: false, username: "", phone: "", email: "", password: "" },
    });

    React.useEffect(() => {
        if (isOpen) reset({ roll: "", sectionId: "", sessionId: "", shiftId: "", createUserAccount: false, username: "", phone: application?.guardianPhone || "", email: "", password: "" });
    }, [application?.guardianPhone, isOpen, reset]);

    const onSubmit = async (data: any) => {
        setSaving(true);
        try {
            await AxiosAPI.post(admissionApplicationConvertUrl(application.id), data);
            toast.success("Applicant admitted as student");
            onChanged();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Conversion failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[680px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">Convert To Student</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="roll" label="Roll" required {...register("roll", { required: true })} />
                        <Controller control={control} name="sectionId" render={({ field }) => (
                            <SelectInput label="Section" required options={(sectionsResponse?.data || []).map((item: any) => ({ value: item.id, label: item.name }))} value={field.value} onChange={field.onChange} />
                        )} />
                        <Controller control={control} name="sessionId" render={({ field }) => (
                            <SelectInput label="Session" options={(sessionsResponse?.data || []).map((item: any) => ({ value: item.id, label: item.name }))} value={field.value} onChange={field.onChange} />
                        )} />
                        <Controller control={control} name="shiftId" render={({ field }) => (
                            <SelectInput label="Shift" options={(shiftsResponse?.data || []).map((item: any) => ({ value: item.id, label: item.name }))} value={field.value} onChange={field.onChange} />
                        )} />
                        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" {...register("createUserAccount")} /> Create student login</label>
                        <FormInput id="phone" label="Phone" {...register("phone")} />
                        <FormInput id="username" label="Username" {...register("username")} />
                        <FormInput id="password" type="password" label="Password" placeholder="Default: student123" {...register("password")} />
                    </div>
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Converting..." : "Admit Student"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function AdmissionApplicationListView() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [decisionOpen, setDecisionOpen] = React.useState(false);
    const [convertOpen, setConvertOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<any>();
    const { data: response, isLoading, mutate } = useAdmissionApplicationsQuery({ status });

    const rows = React.useMemo(() => response?.data || [], [response]);
    const filtered = React.useMemo(() => {
        const keyword = search.toLowerCase();
        return rows.filter((item: any) =>
            item.applicationNo?.toLowerCase().includes(keyword) ||
            item.applicantName?.toLowerCase().includes(keyword) ||
            item.guardianPhone?.toLowerCase().includes(keyword),
        );
    }, [rows, search]);

    const columns: ColumnDef<any>[] = [
        {
            header: "Applicant",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.applicantName}</p>
                    <p className="text-xs text-muted-foreground">{row.original.applicationNo}</p>
                </div>
            ),
        },
        { header: "Class", cell: ({ row }) => row.original.class?.name || "-" },
        { accessorKey: "guardianName", header: "Guardian" },
        { accessorKey: "guardianPhone", header: "Phone" },
        { header: "Date", cell: ({ row }) => row.original.createdAt?.slice?.(0, 10) || "-" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(row.original.status)}`}>{row.original.status}</span>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setSelected(row.original); setDecisionOpen(true); }}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Review
                    </Button>
                    <Button variant="outline" size="sm" disabled={row.original.status === "Admitted"} onClick={() => { setSelected(row.original); setConvertOpen(true); }}>
                        <GraduationCap className="h-4 w-4 mr-1" /> Admit
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                        <div>
                            <Title>Admission Applicants</Title>
                            <p className="text-xs text-muted-foreground mt-1">Review online applications, select candidates, and convert admitted applicants into student profiles.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                            <div className="w-full sm:w-48">
                                <SelectInput
                                    options={[{ value: "", label: "All Statuses" }, ...statuses.map((item) => ({ value: item, label: item }))]}
                                    value={status}
                                    onChange={setStatus}
                                    showNoneOption={false}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable columns={columns} data={filtered} searchKey="applicantName" searchPlaceholder="Search applicants..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
            <DecisionDialog application={selected} isOpen={decisionOpen} onClose={() => setDecisionOpen(false)} onChanged={mutate} />
            <ConvertDialog application={selected} isOpen={convertOpen} onClose={() => setConvertOpen(false)} onChanged={mutate} />
        </div>
    );
}
