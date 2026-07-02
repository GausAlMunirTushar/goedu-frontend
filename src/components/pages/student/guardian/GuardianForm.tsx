"use client";

import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { GuardianData } from "./GuardianListView";

interface Props {
    mode: "create" | "edit";
    initialData?: GuardianData;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: GuardianData) => void;
}

export function GuardianForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit }: Props) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<GuardianData>({
        defaultValues: initialData || {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            relationType: "Father",
            occupation: "",
            address: "",
            status: "Active",
            createUserAccount: false,
            username: "",
            password: "",
        },
    });

    React.useEffect(() => {
        if (isOpen) {
            reset(initialData || {
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                relationType: "Father",
                occupation: "",
                address: "",
                status: "Active",
                createUserAccount: false,
                username: "",
                password: "",
            });
        }
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[720px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? "Create Guardian" : "Edit Guardian"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="firstName" label="First Name" required error={errors.firstName?.message} {...register("firstName", { required: "First name is required" })} />
                        <FormInput id="lastName" label="Last Name" required error={errors.lastName?.message} {...register("lastName", { required: "Last name is required" })} />
                        <FormInput id="phone" label="Phone" required error={errors.phone?.message} {...register("phone", { required: "Phone is required" })} />
                        <FormInput id="email" type="email" label="Email" {...register("email")} />
                        <Controller
                            control={control}
                            name="relationType"
                            render={({ field }) => (
                                <SelectInput
                                    label="Relation"
                                    showNoneOption={false}
                                    options={["Father", "Mother", "Guardian", "Brother", "Sister", "Other"].map((item) => ({ value: item, label: item }))}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <FormInput id="occupation" label="Occupation" {...register("occupation")} />
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <SelectInput
                                    label="Status"
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
                    <FormInput id="address" label="Address" {...register("address")} />
                    {mode === "create" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-md border p-3">
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input type="checkbox" {...register("createUserAccount")} />
                                Create portal account
                            </label>
                            <FormInput id="username" label="Username" placeholder="Defaults to phone" {...register("username")} />
                            <FormInput id="password" type="password" label="Password" placeholder="Default: parent123" {...register("password")} />
                        </div>
                    )}
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
