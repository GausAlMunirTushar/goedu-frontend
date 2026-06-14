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

export interface SessionData {
    id?: string;
    name: string;
    start_month: string;
    end_month: string;
    status: string;
}

interface SessionFormProps {
    mode: "create" | "edit";
    initialData?: SessionData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SessionData) => void;
}

export function SessionForm({
    mode,
    initialData,
    isOpen,
    onClose,
    onSubmit,
}: SessionFormProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<SessionData>({
        defaultValues: initialData || { name: "", start_month: "", end_month: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) {
            reset(initialData || { name: "", start_month: "", end_month: "", status: "Active" });
        }
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = (data: SessionData) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-[450px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? t("create_session") : t("edit_session")}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 px-6 py-4">
                    {/* Session Name */}
                    <FormInput
                        id="name"
                        label={t("session_name")}
                        placeholder={t("session_name_placeholder")}
                        required
                        error={errors.name?.message}
                        {...register("name", { required: t("session_name_required") })}
                    />
                    
                    {/* Month Range in responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Start Month */}
                        <FormInput
                            id="start_month"
                            label={t("start_month")}
                            placeholder={t("start_month_placeholder")}
                            required
                            error={errors.start_month?.message}
                            {...register("start_month", { required: t("start_month_required") })}
                        />
                        
                        {/* End Month */}
                        <FormInput
                            id="end_month"
                            label={t("end_month")}
                            placeholder={t("end_month_placeholder")}
                            required
                            error={errors.end_month?.message}
                            {...register("end_month", { required: t("end_month_required") })}
                        />
                    </div>
                    
                    {/* Status Select Input */}
                    <Controller
                        control={control}
                        name="status"
                        rules={{ required: t("status_required") }}
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
