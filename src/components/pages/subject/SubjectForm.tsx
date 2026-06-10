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
import { useClassesQuery } from "@/apis/queries/academic_queries";

export interface SubjectData {
    id?: string;
    name: string;
    code: string;
    type: string;
    classId: string;
    className?: string;
    status: string;
}

interface SubjectFormProps {
    mode: "create" | "edit";
    initialData?: SubjectData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SubjectData) => void;
}

export function SubjectForm({ mode, initialData, isOpen, onClose, onSubmit }: SubjectFormProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm<SubjectData>();

    // Load active classes
    const { data: classesResponse } = useClassesQuery();
    const classesList = classesResponse?.data || [];

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                name: "",
                code: "",
                type: "Core",
                classId: classesList[0]?.id || "",
                status: "Active",
            });
        }
    }, [initialData, reset, isOpen, classesList]);

    const onFormSubmit = (data: SubjectData) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Add New Subject" : "Edit Subject"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Subject Name</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="e.g. Mathematics" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="code">Subject Code</Label>
                        <Input id="code" {...register("code", { required: true })} placeholder="e.g. MAT-101" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Subject Type</Label>
                        <Select onValueChange={(v) => setValue("type", v)} value={watch("type")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Core">Core</SelectItem>
                                <SelectItem value="Elective">Elective</SelectItem>
                                <SelectItem value="Optional">Optional</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="classId">Class</Label>
                        <Select onValueChange={(v) => setValue("classId", v)} value={watch("classId")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classesList.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={(v) => setValue("status", v)} value={watch("status")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{mode === "create" ? "Create Subject" : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
