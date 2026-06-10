"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useClassesQuery } from "@/apis/queries/academic_queries";

export interface SectionData {
    id?: string;
    name: string;
    classId: string;
    className?: string;
    capacity: number;
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
        defaultValues: initialData || { name: "", classId: "", capacity: 40, status: "Active" },
    });

    // Load active classes for the dropdown
    const { data: classesResponse } = useClassesQuery();
    const classesList = classesResponse?.data || [];

    React.useEffect(() => {
        if (isOpen) {
            reset(initialData || { name: "", classId: classesList[0]?.id || "", capacity: 40, status: "Active" });
        }
    }, [isOpen, initialData, reset, classesList]);

    const handleFormSubmit = (data: SectionData) => {
        // Coerce capacity to number
        data.capacity = Number(data.capacity);
        onSubmit(data);
        onClose();
    };

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
                        <Label htmlFor="classId">Class</Label>
                        <select
                            id="classId"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            {...register("classId", { required: true })}
                        >
                            {classesList.map((cls: any) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input 
                            id="capacity" 
                            type="number" 
                            placeholder="e.g. 40" 
                            {...register("capacity", { required: true, min: 1 })} 
                        />
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
