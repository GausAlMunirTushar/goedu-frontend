"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClassesQuery } from "@/apis/queries/academic_queries";

export interface AdmissionData {
    id?: string;
    applicant_name: string;
    classId: string;
    className?: string;
    mobile: string;
    application_date?: string;
    status: string;
}

interface AdmissionFormProps {
    mode: "create" | "edit";
    initialData?: AdmissionData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AdmissionData) => void;
}

export function AdmissionForm({ mode, initialData, isOpen, onClose, onSubmit }: AdmissionFormProps) {
    const { register, handleSubmit, reset } = useForm<AdmissionData>();

    const { data: classesResponse } = useClassesQuery();
    const classesList = classesResponse?.data || [];

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset(initialData);
            } else {
                reset({
                    applicant_name: "",
                    classId: classesList[0]?.id || "",
                    mobile: "",
                    status: "Pending",
                });
            }
        }
    }, [initialData, reset, isOpen, classesList]);

    const onFormSubmit = (data: AdmissionData) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Add Admission Application" : "Edit Application"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="applicant_name">Applicant Name</Label>
                        <Input id="applicant_name" {...register("applicant_name", { required: true })} placeholder="e.g. John Doe" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="classId">Applied Class</Label>
                        <select 
                            id="classId" 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            {...register("classId", { required: true })}
                        >
                            {classesList.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" {...register("mobile", { required: true })} placeholder="e.g. 01700000000" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <select 
                            id="status" 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none" 
                            {...register("status")}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{mode === "create" ? "Add Application" : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
