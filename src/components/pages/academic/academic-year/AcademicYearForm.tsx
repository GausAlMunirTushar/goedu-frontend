"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

export interface AcademicYearData {
    id?: string;
    title: string;
    startDate: string;
    endDate: string;
    isActive: string;
}

interface AcademicYearFormProps {
    mode: "create" | "edit";
    initialData?: AcademicYearData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AcademicYearData) => void;
    isLoading?: boolean;
}

export function AcademicYearForm({
    mode,
    initialData,
    isOpen,
    onClose,
    onSubmit,
    isLoading: parentIsLoading = false,
}: AcademicYearFormProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isLoading = parentIsLoading || isSubmitting;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<AcademicYearData>({
        defaultValues: initialData || { title: "", startDate: "", endDate: "", isActive: "Active" },
    });

    // Reset form when opened with new data
    React.useEffect(() => {
        if (isOpen) {
            reset(initialData || { title: "", startDate: "", endDate: "", isActive: "Active" });
        }
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = async (data: AcademicYearData) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!isLoading && !open) {
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-[450px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? t("create_academic_year") : t("edit_academic_year")}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 px-6 py-4">
                    {/* Year Name Input */}
                    <FormInput
                        id="title"
                        label={t("year_name")}
                        placeholder={t("year_name_placeholder")}
                        required
                        disabled={isLoading}
                        error={errors.title?.message}
                        {...register("title", {
                            required: t("year_name_required"),
                            pattern: {
                                value: /^\d{4}(-\d{4})?$/,
                                message: t("year_name_format_error"),
                            },
                        })}
                    />
                    
                    {/* Date Inputs in responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Start Date Input */}
                        <FormInput
                            id="startDate"
                            type="date"
                            label={t("start_date")}
                            required
                            disabled={isLoading}
                            error={errors.startDate?.message}
                            {...register("startDate", {
                                required: t("start_date_required"),
                            })}
                        />
                        
                        {/* End Date Input */}
                        <FormInput
                            id="endDate"
                            type="date"
                            label={t("end_date")}
                            required
                            disabled={isLoading}
                            error={errors.endDate?.message}
                            {...register("endDate", {
                                required: t("end_date_required"),
                                validate: (val, formValues) => {
                                    if (!formValues.startDate) return true;
                                    return (
                                        new Date(val) > new Date(formValues.startDate) ||
                                        t("end_date_after_start_date")
                                    );
                                },
                            })}
                        />
                    </div>
                    
                    {/* Status Select Input */}
                    <Controller
                        control={control}
                        name="isActive"
                        rules={{ required: t("status_required") }}
                        render={({ field }) => (
                            <SelectInput
                                label={t("status")}
                                required
                                disabled={isLoading}
                                showNoneOption={false}
                                options={[
                                    { value: "Active", label: t("active") },
                                    { value: "Inactive", label: t("inactive") },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.isActive?.message}
                            />
                        )}
                    />

                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-slate-700 border-slate-200"
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm flex items-center gap-1.5"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                            {isLoading ? t("saving_dots") : mode === "create" ? t("create") : t("save_changes")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
