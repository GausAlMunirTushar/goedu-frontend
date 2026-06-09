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

export interface RoomData {
    id?: string;
    name: string;
    building: string;
    capacity: string;
    type: string;
    status: string;
}

interface RoomFormProps {
    mode: "create" | "edit";
    initialData?: RoomData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RoomData) => void;
}

export function RoomForm({ mode, initialData, isOpen, onClose, onSubmit }: RoomFormProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm<RoomData>();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                name: "",
                building: "",
                capacity: "",
                type: "Classroom",
                status: "Active",
            });
        }
    }, [initialData, reset, isOpen]);

    const onFormSubmit = (data: RoomData) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Add New Room" : "Edit Room"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Room Name</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="e.g. Room 101" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="building">Building</Label>
                        <Input id="building" {...register("building", { required: true })} placeholder="e.g. Main Building" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input id="capacity" {...register("capacity", { required: true })} type="number" placeholder="e.g. 50" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Room Type</Label>
                        <Select onValueChange={(v) => setValue("type", v)} value={watch("type")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Classroom">Classroom</SelectItem>
                                <SelectItem value="Laboratory">Laboratory</SelectItem>
                                <SelectItem value="Office">Office</SelectItem>
                                <SelectItem value="Library">Library</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
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
                        <Button type="submit">{mode === "create" ? "Create Room" : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
