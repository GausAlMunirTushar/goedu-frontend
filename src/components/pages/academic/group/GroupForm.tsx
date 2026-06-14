"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useClassesQuery } from "@/apis/queries/academic_queries";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

export interface GroupData {
    id?: string;
    name: string;
    classId: string;
    className?: string;
    status: string;
}

interface GroupFormProps {
    mode: "create" | "edit";
    initialData?: GroupData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: GroupData) => void;
}

export function GroupForm({ mode, initialData, isOpen, onClose, onSubmit }: GroupFormProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<GroupData>({
        defaultValues: initialData || { name: "", classId: "", status: "Active" },
    });

    const { data: classesResponse } = useClassesQuery();
    const classesList = classesResponse?.data || [];

    React.useEffect(() => {
        if (isOpen) {
            reset(initialData || { name: "", classId: classesList[0]?.id || "", status: "Active" });
        }
    }, [isOpen, initialData, reset, classesList]);

    const handleFormSubmit = (data: GroupData) => { 
        onSubmit(data); 
        onClose(); 
    };

    const classOptions = classesList.map((cls: any) => ({
        value: cls.id,
        label: cls.name,
    }));

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-[450px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? t("create_group") : t("edit_group")}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 px-6 py-4">
                    {/* Group Name */}
                    <FormInput
                        id="name"
                        label={t("group_name")}
                        placeholder={t("group_name_placeholder")}
                        required
                        error={errors.name?.message}
                        {...register("name", { required: true })}
                    />
                    
                    {/* Class Select */}
                    <Controller
                        control={control}
                        name="classId"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <SelectInput
                                label={t("class")}
                                required
                                showNoneOption={false}
                                options={classOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.classId?.message}
                            />
                        )}
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
