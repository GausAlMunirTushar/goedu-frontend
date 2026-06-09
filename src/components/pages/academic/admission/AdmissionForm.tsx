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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classes } from "@/data/academic";

export interface AdmissionData {
    id?: string;
    applicant_name: string;
    class: string;
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
    const { register, handleSubmit, reset, setValue, watch } = useForm<AdmissionData>();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                applicant_name: "",
                class: classes[0].name,
                mobile: "",
                status: "Pending",
            });
        }
    }, [initialData, reset, isOpen]);

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
                        <Label htmlFor="class">Applied Class</Label>
                        <Select onValueChange={(v) => setValue("class", v)} value={watch("class")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((c) => (
                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" {...register("mobile", { required: true })} placeholder="e.g. 01700000000" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={(v) => setValue("status", v)} value={watch("status")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
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
