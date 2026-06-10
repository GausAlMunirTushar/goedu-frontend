"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useClassesQuery } from "@/apis/queries/academic_queries";

export interface GroupData {
    id?: string;
    name: string;
    classId: string;
    className?: string;
    status: string;
}

interface GroupFormProps {
    mode: "create" | "edit";
    initialData?: GroupData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: GroupData) => void;
}

export function GroupForm({ mode, initialData, isOpen, onClose, onSubmit }: GroupFormProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm<GroupData>({
        defaultValues: initialData || { name: "", classId: "", status: "Active" },
    });

    const { data: classesResponse } = useClassesQuery();
    const classesList = classesResponse?.data || [];

    React.useEffect(() => {
        if (isOpen) {
            reset(initialData || { name: "", classId: classesList[0]?.id || "", status: "Active" });
        }
    }, [isOpen, initialData, reset, classesList]);

    const handleFormSubmit = (data: GroupData) => { 
        onSubmit(data); 
        onClose(); 
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create Group" : "Edit Group"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Group Name</Label>
                        <Input id="name" placeholder="e.g. Science" {...register("name", { required: true })} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="classId">Class</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select id="status" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none" {...register("status")}>
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
