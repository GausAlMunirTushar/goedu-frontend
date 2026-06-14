"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

export interface ClassData {
    id?: string;
    name: string;
    code: string;
    capacity: string;
    status: string;
}

interface ClassFormProps {
    mode: "create" | "edit";
    initialData?: ClassData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ClassData) => void;
}

export function ClassForm({ mode, initialData, isOpen, onClose, onSubmit }: ClassFormProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<ClassData>({
        defaultValues: initialData || { name: "", code: "", capacity: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", code: "", capacity: "", status: "Active" });
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = (data: ClassData) => { onSubmit(data); onClose(); };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-[450px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? t("create_class") : t("edit_class")}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 px-6 py-4">
                    {/* Class Name */}
                    <FormInput
                        id="name"
                        label={t("class_name")}
                        placeholder={t("class_name_placeholder")}
                        required
                        error={errors.name?.message}
                        {...register("name", { required: true })}
                    />
                    
                    {/* Class Code */}
                    <FormInput
                        id="code"
                        label={t("class_code")}
                        placeholder={t("class_code_placeholder")}
                        required
                        error={errors.code?.message}
                        {...register("code", { required: true })}
                    />
                    
                    {/* Capacity */}
                    <FormInput
                        id="capacity"
                        type="number"
                        label={t("capacity")}
                        placeholder={t("capacity_placeholder")}
                        required
                        error={errors.capacity?.message}
                        {...register("capacity", { required: true })}
                    />
                    
                    {/* Status Select Input */}
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <SelectInput
                                label={t("status")}
                                required
                                showNoneOption={false}
                                options={[
                                    { value: "Active", label: t("active") },
                                    { value: "Inactive", label: t("inactive") },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.status?.message}
                            />
                        )}
                    />

                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="text-slate-700 border-slate-200"
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                        >
                            {mode === "create" ? t("create") : t("save_changes")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
