"use client";

import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { LibraryShelfData } from "./LibraryShelfListView";

interface Props {
    mode: "create" | "edit";
    initialData?: LibraryShelfData;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: LibraryShelfData) => void;
}

export function LibraryShelfForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit }: Props) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<LibraryShelfData>({
        defaultValues: initialData || { name: "", code: "", location: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", code: "", location: "", status: "Active" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? "Create Shelf" : "Edit Shelf"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <FormInput
                        id="name"
                        label="Shelf Name"
                        placeholder="Shelf A"
                        required
                        error={errors.name?.message}
                        {...register("name", { required: "Shelf name is required" })}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput id="code" label="Code" placeholder="A-01" {...register("code")} />
                        <FormInput id="location" label="Location" placeholder="North wing" {...register("location")} />
                    </div>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <SelectInput
                                label="Status"
                                required
                                showNoneOption={false}
                                options={[
                                    { value: "Active", label: "Active" },
                                    { value: "Inactive", label: "Inactive" },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
