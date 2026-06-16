"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { useDepartmentsQuery } from "@/apis/queries/academic_queries";
import { BranchData } from "./BranchListView";

interface BranchFormProps {
    mode: "create" | "edit";
    initialData?: BranchData;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BranchData) => void;
}

export function BranchForm({ mode, initialData, isOpen, onClose, onSubmit }: BranchFormProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    const { data: deptResponse } = useDepartmentsQuery();
    const departmentOptions = React.useMemo(() => {
        return (deptResponse?.data || []).map((dept: any) => ({
            value: dept.id,
            label: dept.name,
        }));
    }, [deptResponse]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<BranchData>({
        defaultValues: initialData || { name: "", code: "", address: "", departmentId: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", code: "", address: "", departmentId: "", status: "Active" });
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = (data: BranchData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        {mode === "create" ? t("create_branch") : t("edit_branch")}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 px-6 py-4">
                    {/* Branch Name */}
                    <FormInput
                        id="branch-name"
                        label={t("branch_name")}
                        placeholder={t("branch_name_placeholder")}
                        required
                        error={errors.name?.message}
                        {...register("name", { required: true })}
                    />

                    {/* Branch Code */}
                    <FormInput
                        id="branch-code"
                        label={t("code")}
                        placeholder={t("branch_code_placeholder")}
                        error={errors.code?.message}
                        {...register("code")}
                    />

                    {/* Address */}
                    <FormInput
                        id="branch-address"
                        label={t("address")}
                        placeholder={t("branch_address_placeholder")}
                        error={errors.address?.message}
                        {...register("address")}
                    />

                    {/* Department Select */}
                    <Controller
                        control={control}
                        name="departmentId"
                        render={({ field }) => (
                            <SelectInput
                                label={t("department")}
                                showNoneOption={true}
                                options={departmentOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.departmentId?.message}
                            />
                        )}
                    />

                    {/* Status Select */}
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
