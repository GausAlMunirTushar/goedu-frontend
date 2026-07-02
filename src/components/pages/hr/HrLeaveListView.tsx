"use client";

import { AxiosAPI } from "@/apis/configs";
import { hrLeaveDecisionUrl, hrLeavesUrl } from "@/apis/endpoints/hr_apis";
import { useHrLeavesQuery, useHrLeaveTypesQuery, useHrStaffQuery } from "@/apis/queries/hr_queries";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Plus, X } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

function staffName(user: any) {
    return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "Staff";
}

function statusClass(status: string) {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
}

function ApplyLeaveDialog({ open, onClose, onSaved }: any) {
    const [saving, setSaving] = React.useState(false);
    const { data: staffResponse } = useHrStaffQuery();
    const { data: typesResponse } = useHrLeaveTypesQuery();
    const { control, handleSubmit, register, reset } = useForm({ defaultValues: { userId: "", leaveTypeId: "", startDate: "", endDate: "", reason: "" } });

    React.useEffect(() => {
        if (open) reset({ userId: "", leaveTypeId: "", startDate: "", endDate: "", reason: "" });
    }, [open, reset]);

    const onSubmit = async (data: any) => {
        setSaving(true);
        try {
            await AxiosAPI.post(hrLeavesUrl, data);
            toast.success("Leave application submitted");
            onSaved();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Apply failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="sm:max-w-[640px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold">Apply Leave</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller control={control} name="userId" render={({ field }) => (
                            <SelectInput label="Staff" options={(staffResponse?.data || []).map((u: any) => ({ value: u.id, label: staffName(u) }))} value={field.value} onChange={field.onChange} searchable />
                        )} />
                        <Controller control={control} name="leaveTypeId" rules={{ required: true }} render={({ field }) => (
                            <SelectInput label="Leave Type" required options={(typesResponse?.data || []).filter((t: any) => t.status === "Active").map((t: any) => ({ value: t.id, label: t.name }))} value={field.value} onChange={field.onChange} />
                        )} />
                        <FormInput id="startDate" label="Start Date" type="date" required {...register("startDate", { required: true })} />
                        <FormInput id="endDate" label="End Date" type="date" required {...register("endDate", { required: true })} />
                    </div>
                    <FormInput id="reason" label="Reason" required {...register("reason", { required: true })} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Submitting..." : "Submit"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DecisionDialog({ leave, decision, open, onClose, onSaved }: any) {
    const [saving, setSaving] = React.useState(false);
    const { handleSubmit, register, reset } = useForm({ defaultValues: { reviewNote: "" } });

    React.useEffect(() => {
        if (open) reset({ reviewNote: "" });
    }, [open, reset]);

    const onSubmit = async (data: any) => {
        setSaving(true);
        try {
            await AxiosAPI.post(hrLeaveDecisionUrl(leave.id), { status: decision, reviewNote: data.reviewNote || undefined });
            toast.success(`Leave ${decision.toLowerCase()}`);
            onSaved();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Decision failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="sm:max-w-[460px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold">{decision} Leave</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <FormInput id="reviewNote" label="Review Note" {...register("reviewNote")} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Saving..." : decision}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function HrLeaveListView() {
    const [status, setStatus] = React.useState("");
    const [applyOpen, setApplyOpen] = React.useState(false);
    const [decisionOpen, setDecisionOpen] = React.useState(false);
    const [decision, setDecision] = React.useState<"Approved" | "Rejected">("Approved");
    const [selected, setSelected] = React.useState<any>();
    const { data, isLoading, mutate } = useHrLeavesQuery({ status });
    const rows = data?.data || [];

    const columns: ColumnDef<any>[] = [
        { header: "Staff", cell: ({ row }) => staffName(row.original.user) },
        { header: "Type", cell: ({ row }) => row.original.leaveType?.name || "-" },
        { header: "Dates", cell: ({ row }) => `${row.original.startDate?.slice?.(0, 10)} to ${row.original.endDate?.slice?.(0, 10)}` },
        { accessorKey: "totalDays", header: "Days" },
        { accessorKey: "reason", header: "Reason" },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(row.original.status)}`}>{row.original.status}</span> },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => row.original.status === "Pending" ? (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setSelected(row.original); setDecision("Approved"); setDecisionOpen(true); }}><Check className="h-4 w-4 mr-1" /> Approve</Button>
                    <Button variant="outline" size="sm" onClick={() => { setSelected(row.original); setDecision("Rejected"); setDecisionOpen(true); }}><X className="h-4 w-4 mr-1" /> Reject</Button>
                </div>
            ) : <span className="text-xs text-muted-foreground">Decided</span>,
        },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div><Title>Leave Applications</Title><p className="text-xs text-muted-foreground mt-1">Apply, review, approve, and reject staff leave requests.</p></div>
                        <div className="flex gap-2">
                            <SelectInput showNoneOption={false} options={[{ value: "", label: "All" }, { value: "Pending", label: "Pending" }, { value: "Approved", label: "Approved" }, { value: "Rejected", label: "Rejected" }]} value={status} onChange={setStatus} />
                            <Button onClick={() => setApplyOpen(true)}><Plus className="h-4 w-4 mr-2" /> Apply</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent><DataTable columns={columns} data={rows} searchKey="reason" /></CardContent>
            </Card>
            <ApplyLeaveDialog open={applyOpen} onClose={() => setApplyOpen(false)} onSaved={mutate} />
            <DecisionDialog leave={selected} decision={decision} open={decisionOpen} onClose={() => setDecisionOpen(false)} onSaved={mutate} />
        </div>
    );
}
