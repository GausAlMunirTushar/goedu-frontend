"use client";

import { AxiosAPI } from "@/apis/configs";
import { libraryIssuesUrl } from "@/apis/endpoints/library_apis";
import { useLibraryBooksQuery, useLibrarySettingsQuery } from "@/apis/queries/library_queries";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface IssueFormData {
    studentId: string;
    copyId: string;
    issueDate?: string;
    dueDate?: string;
    remarks?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onChanged: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const addDays = (date: string, days: number) => {
    const value = new Date(date);
    value.setDate(value.getDate() + days);
    return value.toISOString().slice(0, 10);
};

const studentLabel = (student: any) => {
    const name = student.user?.name || [student.firstName, student.lastName].filter(Boolean).join(" ") || student.name || "Student";
    const roll = student.rollNumber || student.roll || student.studentId;
    return roll ? `${name} (${roll})` : name;
};

export function IssueBookDialog({ isOpen, onClose, onChanged }: Props) {
    const [saving, setSaving] = React.useState(false);
    const { data: studentResponse } = useStudentProfilesQuery({ status: "Active" });
    const { data: bookResponse } = useLibraryBooksQuery({ status: "Active" });
    const { data: settingResponse } = useLibrarySettingsQuery();
    const settings = settingResponse?.data || {};
    const loanDays = Number(settings.loanDays || 14);

    const { control, handleSubmit, register, reset, setValue, watch, formState: { errors } } = useForm<IssueFormData>({
        defaultValues: { studentId: "", copyId: "", issueDate: today(), dueDate: addDays(today(), loanDays), remarks: "" },
    });

    const issueDate = watch("issueDate");

    React.useEffect(() => {
        if (issueDate && isOpen) setValue("dueDate", addDays(issueDate, loanDays));
    }, [issueDate, isOpen, loanDays, setValue]);

    React.useEffect(() => {
        if (isOpen) reset({ studentId: "", copyId: "", issueDate: today(), dueDate: addDays(today(), loanDays), remarks: "" });
    }, [isOpen, loanDays, reset]);

    const students = studentResponse?.data || [];
    const availableCopies = React.useMemo(() => {
        const books = bookResponse?.data || [];
        return books.flatMap((book: any) =>
            (book.copies || [])
                .filter((copy: any) => copy.status === "Available")
                .map((copy: any) => ({
                    value: copy.id,
                    label: `${book.title} - ${copy.accessionNumber}`,
                })),
        );
    }, [bookResponse]);

    const onSubmit = async (data: IssueFormData) => {
        setSaving(true);
        try {
            await AxiosAPI.post(libraryIssuesUrl, {
                studentId: data.studentId,
                copyId: data.copyId,
                issueDate: data.issueDate,
                dueDate: data.dueDate,
                remarks: data.remarks || undefined,
            });
            toast.success("Book issued");
            onChanged();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Issue failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[620px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">Issue Book</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller
                        control={control}
                        name="studentId"
                        rules={{ required: "Student is required" }}
                        render={({ field }) => (
                            <SelectInput
                                label="Student"
                                required
                                searchable
                                placeholder="Select student"
                                options={students.map((student: any) => ({ value: student.id, label: studentLabel(student) }))}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.studentId?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="copyId"
                        rules={{ required: "Available copy is required" }}
                        render={({ field }) => (
                            <SelectInput
                                label="Available Copy"
                                required
                                searchable
                                placeholder="Select accession copy"
                                options={availableCopies}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.copyId?.message}
                            />
                        )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput id="issueDate" type="date" label="Issue Date" {...register("issueDate")} />
                        <FormInput id="dueDate" type="date" label="Due Date" {...register("dueDate")} />
                    </div>
                    <FormInput id="remarks" label="Remarks" placeholder="Optional note" {...register("remarks")} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Issuing..." : "Issue Book"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
