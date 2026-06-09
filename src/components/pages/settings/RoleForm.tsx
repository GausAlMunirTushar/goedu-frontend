"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const roleSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    code: z.string().min(2, "Code must be at least 2 characters"),
    description: z.string().optional(),
    status: z.string(),
});

export type RoleData = z.infer<typeof roleSchema>;

interface RoleFormProps {
    mode: "create" | "edit";
    initialData?: RoleData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RoleData) => void;
}

export function RoleForm({ mode, initialData, isOpen, onClose, onSubmit }: RoleFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<RoleData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            code: "",
            description: "",
            status: "Active",
        },
    });

    useEffect(() => {
        if (initialData && isOpen) {
            reset(initialData);
        } else if (!isOpen) {
            reset({
                name: "",
                code: "",
                description: "",
                status: "Active",
            });
        }
    }, [initialData, isOpen, reset]);

    const handleOnSubmit = (data: RoleData) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Add New Role" : "Edit Role"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input id="name" placeholder="Enter role name" {...register("name")} />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code">Role Code</Label>
                        <Input id="code" placeholder="ENTER_ROLE_CODE" {...register("code")} />
                        {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Enter role description" {...register("description")} />
                        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{mode === "create" ? "Create Role" : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
