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

export interface SessionData {
    id?: string;
    name: string;
    start_month: string;
    end_month: string;
    status: string;
}

interface SessionFormProps {
    mode: "create" | "edit";
    initialData?: SessionData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SessionData) => void;
}

export function SessionForm({
    mode,
    initialData,
    isOpen,
    onClose,
    onSubmit,
}: SessionFormProps) {
    const { register, handleSubmit, reset } = useForm<SessionData>({
        defaultValues: initialData || { name: "", start_month: "", end_month: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) {
            reset(initialData || { name: "", start_month: "", end_month: "", status: "Active" });
        }
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = (data: SessionData) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Create Session" : "Edit Session"}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Session Name</Label>
                        <Input id="name" placeholder="e.g. 2025-2026" {...register("name", { required: true })} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="start_month">Start Month</Label>
                        <Input id="start_month" placeholder="e.g. July" {...register("start_month", { required: true })} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="end_month">End Month</Label>
                        <Input id="end_month" placeholder="e.g. June" {...register("end_month", { required: true })} />
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
