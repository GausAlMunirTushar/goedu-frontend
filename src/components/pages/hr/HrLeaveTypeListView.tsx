"use client";

import { AxiosAPI } from "@/apis/configs";
import { hrLeaveTypeDetailUrl, hrLeaveTypesUrl } from "@/apis/endpoints/hr_apis";
import { useHrLeaveTypesQuery } from "@/apis/queries/hr_queries";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TableActions from "@/components/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

function LeaveTypeForm({ open, onClose, initialData, onSaved }: any) {
    const [saving, setSaving] = React.useState(false);
    const { control, handleSubmit, register, reset } = useForm({ defaultValues: { name: "", code: "", maxDays: "", paid: "true", status: "Active" } });
    React.useEffect(() => {
        if (open) reset(initialData ? { ...initialData, maxDays: initialData.maxDays || "", paid: String(initialData.paid ?? true) } : { name: "", code: "", maxDays: "", paid: "true", status: "Active" });
    }, [initialData, open, reset]);
    const onSubmit = async (data: any) => {
        setSaving(true);
        try {
            const payload = { ...data, maxDays: data.maxDays ? Number(data.maxDays) : undefined, paid: data.paid === "true" };
            if (initialData?.id) await AxiosAPI.put(hrLeaveTypeDetailUrl(initialData.id), payload);
            else await AxiosAPI.post(hrLeaveTypesUrl, payload);
            toast.success("Leave type saved");
            onSaved();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="sm:max-w-[520px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold">Leave Type</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <FormInput label="Name" required {...register("name", { required: true })} />
                    <FormInput label="Code" required {...register("code", { required: true })} />
                    <FormInput label="Max Days" type="number" {...register("maxDays")} />
                    <Controller control={control} name="paid" render={({ field }) => <SelectInput label="Paid" showNoneOption={false} options={[{ value: "true", label: "Paid" }, { value: "false", label: "Unpaid" }]} value={field.value} onChange={field.onChange} />} />
                    <DialogFooter className="bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button disabled={saving}>{saving ? "Saving..." : "Save"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function HrLeaveTypeListView() {
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState<any>();
    const { data, isLoading, mutate } = useHrLeaveTypesQuery();
    const rows = data?.data || [];
    const columns: ColumnDef<any>[] = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "code", header: "Code" },
        { accessorKey: "maxDays", header: "Max Days" },
        { header: "Paid", cell: ({ row }) => row.original.paid ? "Paid" : "Unpaid" },
        { accessorKey: "status", header: "Status" },
        { id: "actions", header: "Actions", cell: ({ row }) => <TableActions onEdit={() => { setEditing(row.original); setOpen(true); }} onDelete={async () => { await AxiosAPI.delete(hrLeaveTypeDetailUrl(row.original.id)); toast.success("Leave type deleted"); mutate(); }} /> },
    ];
    if (isLoading) return <TableSkeleton />;
    return (
        <div className="p-2 space-y-4">
            <Card><CardHeader className="bg-white border-b"><div className="flex justify-between items-center"><Title>Leave Types</Title><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add</Button></div></CardHeader><CardContent><DataTable columns={columns} data={rows} searchKey="name" /></CardContent></Card>
            <LeaveTypeForm open={open} onClose={() => setOpen(false)} initialData={editing} onSaved={mutate} />
        </div>
    );
}
