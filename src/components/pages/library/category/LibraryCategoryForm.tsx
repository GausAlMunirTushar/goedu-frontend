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
import { LibraryCategoryData } from "./LibraryCategoryListView";

interface Props {
    mode: "create" | "edit";
    initialData?: LibraryCategoryData;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: LibraryCategoryData) => void;
}

export function LibraryCategoryForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit }: Props) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<LibraryCategoryData>({
        defaultValues: initialData || { name: "", code: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", code: "", status: "Active" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? "Create Category" : "Edit Category"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <FormInput
                        id="name"
                        label="Category Name"
                        placeholder="Reference books"
                        required
                        error={errors.name?.message}
                        {...register("name", { required: "Category name is required" })}
                    />
                    <FormInput
                        id="code"
                        label="Code"
                        placeholder="REF"
                        error={errors.code?.message}
                        {...register("code")}
                    />
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
