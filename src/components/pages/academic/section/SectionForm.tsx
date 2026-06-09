"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export interface SectionData {
    id?: string;
    name: string;
    class: string;
    room_number: string;
    status: string;
}

interface SectionFormProps {
    mode: "create" | "edit";
    initialData?: SectionData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SectionData) => void;
}

export function SectionForm({ mode, initialData, isOpen, onClose, onSubmit }: SectionFormProps) {
    const { register, handleSubmit, reset } = useForm<SectionData>({
        defaultValues: initialData || { name: "", class: "", room_number: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", class: "", room_number: "", status: "Active" });
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = (data: SectionData) => { onSubmit(data); onClose(); };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create Section" : "Edit Section"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Section Name</Label>
                        <Input id="name" placeholder="e.g. Section A" {...register("name", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Input id="class" placeholder="e.g. Class 10" {...register("class", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="room_number">Room Number</Label>
                        <Input id="room_number" placeholder="e.g. 101" {...register("room_number", { required: true })} />
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
