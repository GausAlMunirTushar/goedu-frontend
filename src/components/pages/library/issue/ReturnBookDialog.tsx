"use client";

import { AxiosAPI } from "@/apis/configs";
import { libraryIssueReturnUrl } from "@/apis/endpoints/library_apis";
import { useLibrarySettingsQuery } from "@/apis/queries/library_queries";
import FormInput from "@/components/form/Input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    issue?: any;
    isOpen: boolean;
    onClose: () => void;
    onChanged: () => void;
}

interface ReturnFormData {
    returnDate: string;
    fineAmount?: number;
    remarks?: string;
}

const today = () => new Date().toISOString().slice(0, 10);

const overdueDays = (dueDate?: string, returnDate?: string) => {
    if (!dueDate || !returnDate) return 0;
    const diff = new Date(returnDate).getTime() - new Date(dueDate).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export function ReturnBookDialog({ issue, isOpen, onClose, onChanged }: Props) {
    const [saving, setSaving] = React.useState(false);
    const { data: settingResponse } = useLibrarySettingsQuery();
    const finePerDay = Number(settingResponse?.data?.finePerDay || 0);
    const { handleSubmit, register, reset, setValue, watch } = useForm<ReturnFormData>({
        defaultValues: { returnDate: today(), fineAmount: 0, remarks: "" },
    });
    const returnDate = watch("returnDate");
    const days = overdueDays(issue?.dueDate, returnDate);
    const suggestedFine = days * finePerDay;

    React.useEffect(() => {
        if (isOpen) {
            const currentDate = today();
            reset({ returnDate: currentDate, fineAmount: overdueDays(issue?.dueDate, currentDate) * finePerDay, remarks: "" });
        }
    }, [finePerDay, isOpen, issue?.dueDate, reset]);

    React.useEffect(() => {
        if (isOpen) setValue("fineAmount", suggestedFine);
    }, [isOpen, setValue, suggestedFine]);

    const onSubmit = async (data: ReturnFormData) => {
        if (!issue?.id) return;
        setSaving(true);
        try {
            await AxiosAPI.post(libraryIssueReturnUrl(issue.id), {
                returnDate: data.returnDate,
                fineAmount: Number(data.fineAmount || 0),
                remarks: data.remarks || undefined,
            });
            toast.success("Book returned");
            onChanged();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Return failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[520px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">Return Book</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <div className="rounded-md border p-3 text-sm">
                        <p className="font-medium">{issue?.copy?.book?.title || "Book"}</p>
                        <p className="text-muted-foreground">Accession: {issue?.copy?.accessionNumber || "-"}</p>
                        <p className="text-muted-foreground">Due: {issue?.dueDate?.slice?.(0, 10) || "-"}</p>
                    </div>
                    <FormInput id="returnDate" type="date" label="Return Date" {...register("returnDate")} />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-md border p-3">
                            <p className="text-muted-foreground">Overdue Days</p>
                            <p className="text-lg font-semibold">{days}</p>
                        </div>
                        <div className="rounded-md border p-3">
                            <p className="text-muted-foreground">Suggested Fine</p>
                            <p className="text-lg font-semibold">{suggestedFine}</p>
                        </div>
                    </div>
                    <FormInput id="fineAmount" type="number" label="Fine Amount" {...register("fineAmount", { valueAsNumber: true })} />
                    <FormInput id="remarks" label="Remarks" placeholder="Optional return note" {...register("remarks")} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Returning..." : "Return Book"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
