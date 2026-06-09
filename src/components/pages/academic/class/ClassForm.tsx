"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export interface ClassData {
    id?: string;
    name: string;
    code: string;
    capacity: string;
    status: string;
}

interface ClassFormProps {
    mode: "create" | "edit";
    initialData?: ClassData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ClassData) => void;
}

export function ClassForm({ mode, initialData, isOpen, onClose, onSubmit }: ClassFormProps) {
    const { register, handleSubmit, reset } = useForm<ClassData>({
        defaultValues: initialData || { name: "", code: "", capacity: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", code: "", capacity: "", status: "Active" });
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = (data: ClassData) => { onSubmit(data); onClose(); };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create Class" : "Edit Class"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Class Name</Label>
                        <Input id="name" placeholder="e.g. Class 10" {...register("name", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code">Class Code</Label>
                        <Input id="code" placeholder="e.g. CLS-10" {...register("code", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input id="capacity" type="number" placeholder="e.g. 50" {...register("capacity", { required: true })} />
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
