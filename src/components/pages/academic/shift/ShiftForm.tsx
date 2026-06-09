"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export interface ShiftData {
    id?: string;
    name: string;
    start_time: string;
    end_time: string;
    status: string;
}

interface ShiftFormProps {
    mode: "create" | "edit";
    initialData?: ShiftData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ShiftData) => void;
}

export function ShiftForm({ mode, initialData, isOpen, onClose, onSubmit }: ShiftFormProps) {
    const { register, handleSubmit, reset } = useForm<ShiftData>({
        defaultValues: initialData || { name: "", start_time: "", end_time: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", start_time: "", end_time: "", status: "Active" });
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = (data: ShiftData) => { onSubmit(data); onClose(); };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create Shift" : "Edit Shift"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Shift Name</Label>
                        <Input id="name" placeholder="e.g. Morning" {...register("name", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="start_time">Start Time</Label>
                        <Input id="start_time" type="time" {...register("start_time", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end_time">End Time</Label>
                        <Input id="end_time" type="time" {...register("end_time", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select id="status" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm" {...register("status")}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{mode === "create" ? "Create" : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
