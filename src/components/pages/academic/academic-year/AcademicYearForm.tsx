"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export interface AcademicYearData {
    id?: string;
    year: string;
    start_date: string;
    end_date: string;
    status: string;
}

interface AcademicYearFormProps {
    mode: "create" | "edit";
    initialData?: AcademicYearData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AcademicYearData) => void;
}

export function AcademicYearForm({
    mode,
    initialData,
    isOpen,
    onClose,
    onSubmit,
}: AcademicYearFormProps) {
    const { register, handleSubmit, reset } = useForm<AcademicYearData>({
        defaultValues: initialData || { year: "", start_date: "", end_date: "", status: "Active" },
    });

    // Reset form when opened with new data
    React.useEffect(() => {
        if (isOpen) {
            reset(initialData || { year: "", start_date: "", end_date: "", status: "Active" });
        }
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = (data: AcademicYearData) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Create Academic Year" : "Edit Academic Year"}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="year">Year Name</Label>
                        <Input id="year" placeholder="e.g. 2026" {...register("year", { required: true })} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input id="start_date" type="date" {...register("start_date", { required: true })} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input id="end_date" type="date" {...register("end_date", { required: true })} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select 
                            id="status" 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register("status")}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {mode === "create" ? "Create" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
