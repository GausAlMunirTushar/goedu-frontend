"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { DepartmentData } from "./DepartmentListView";

interface DepartmentFormProps {
    mode: "create" | "edit";
    initialData?: DepartmentData;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: DepartmentData) => void;
}

export function DepartmentForm({
    mode,
    initialData,
    isOpen,
    isSubmitting = false,
    onClose,
    onSubmit,
}: DepartmentFormProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<DepartmentData>({
        defaultValues: initialData || { name: "", code: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", code: "", status: "Active" });
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = (data: DepartmentData) => {
        onSubmit(data);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-[450px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? t("create_department") : t("edit_department")}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 px-6 py-4">
                    {/* Department Name */}
                    <FormInput
                        id="name"
                        label={t("department_name")}
                        placeholder={t("department_name_placeholder")}
                        required
                        error={errors.name?.message}
                        {...register("name", { required: t("department_name_required") })}
                    />

                    {/* Department Code */}
                    <FormInput
                        id="code"
                        label={t("code")}
                        placeholder={t("department_code_placeholder")}
                        error={errors.code?.message}
                        {...register("code")}
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
                            disabled={isSubmitting}
                            className="text-slate-700 border-slate-200"
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                        >
                            {isSubmitting
                                ? t("saving")
                                : mode === "create"
                                  ? t("create")
                                  : t("save_changes")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
