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
import { LibraryBookData } from "./LibraryBookListView";

interface Props {
    mode: "create" | "edit";
    initialData?: LibraryBookData;
    categories: any[];
    shelves: any[];
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: LibraryBookData) => void;
}

export function LibraryBookForm({
    mode,
    initialData,
    categories,
    shelves,
    isOpen,
    isSubmitting,
    onClose,
    onSubmit,
}: Props) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<LibraryBookData>({
        defaultValues: initialData || {
            title: "",
            isbn: "",
            author: "",
            publisher: "",
            edition: "",
            subject: "",
            categoryId: "",
            shelfId: "",
            status: "Active",
        },
    });

    React.useEffect(() => {
        if (isOpen) {
            reset(initialData || {
                title: "",
                isbn: "",
                author: "",
                publisher: "",
                edition: "",
                subject: "",
                categoryId: "",
                shelfId: "",
                status: "Active",
            });
        }
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[720px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? "Create Book" : "Edit Book"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            id="title"
                            label="Title"
                            placeholder="Book title"
                            required
                            error={errors.title?.message}
                            {...register("title", { required: "Title is required" })}
                        />
                        <FormInput
                            id="author"
                            label="Author"
                            placeholder="Author name"
                            required
                            error={errors.author?.message}
                            {...register("author", { required: "Author is required" })}
                        />
                        <FormInput id="isbn" label="ISBN" placeholder="978..." {...register("isbn")} />
                        <FormInput id="publisher" label="Publisher" placeholder="Publisher" {...register("publisher")} />
                        <FormInput id="edition" label="Edition" placeholder="2nd" {...register("edition")} />
                        <FormInput id="subject" label="Subject" placeholder="Science" {...register("subject")} />
                        <Controller
                            control={control}
                            name="categoryId"
                            render={({ field }) => (
                                <SelectInput
                                    label="Category"
                                    placeholder="Select category"
                                    options={categories.map((item) => ({ value: item.id, label: item.name }))}
                                    value={field.value}
                                    onChange={field.onChange}
                                    searchable
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="shelfId"
                            render={({ field }) => (
                                <SelectInput
                                    label="Shelf"
                                    placeholder="Select shelf"
                                    options={shelves.map((item) => ({ value: item.id, label: item.name }))}
                                    value={field.value}
                                    onChange={field.onChange}
                                    searchable
                                />
                            )}
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
                    </div>
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
