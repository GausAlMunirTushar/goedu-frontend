"use client";

import { AxiosAPI } from "@/apis/configs";
import { librarySettingsUrl } from "@/apis/endpoints/library_apis";
import { useLibrarySettingsQuery } from "@/apis/queries/library_queries";
import FormInput from "@/components/form/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LibrarySettingData {
    loanDays: number;
    maxActiveIssues: number;
    finePerDay: number;
}

export function LibrarySettingsForm() {
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useLibrarySettingsQuery();
    const { handleSubmit, register, reset, formState: { errors } } = useForm<LibrarySettingData>({
        defaultValues: { loanDays: 14, maxActiveIssues: 3, finePerDay: 5 },
    });

    React.useEffect(() => {
        if (response?.data) {
            reset({
                loanDays: Number(response.data.loanDays || 14),
                maxActiveIssues: Number(response.data.maxActiveIssues || 3),
                finePerDay: Number(response.data.finePerDay || 5),
            });
        }
    }, [response, reset]);

    const onSubmit = async (data: LibrarySettingData) => {
        setSaving(true);
        try {
            await AxiosAPI.put(librarySettingsUrl, {
                loanDays: Number(data.loanDays),
                maxActiveIssues: Number(data.maxActiveIssues),
                finePerDay: Number(data.finePerDay),
            });
            toast.success("Library settings saved");
            mutate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Settings save failed");
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card className="max-w-3xl">
                <CardHeader className="bg-white border-b border-gray-100">
                    <div>
                        <Title>Library Settings</Title>
                        <p className="text-xs text-muted-foreground mt-1">
                            Configure institution-wide lending rules and daily overdue fine.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
                        <FormInput
                            id="loanDays"
                            type="number"
                            label="Loan Days"
                            required
                            error={errors.loanDays?.message}
                            {...register("loanDays", {
                                valueAsNumber: true,
                                min: { value: 1, message: "Loan days must be at least 1" },
                                required: "Loan days are required",
                            })}
                        />
                        <FormInput
                            id="maxActiveIssues"
                            type="number"
                            label="Max Active Issues Per Student"
                            required
                            error={errors.maxActiveIssues?.message}
                            {...register("maxActiveIssues", {
                                valueAsNumber: true,
                                min: { value: 1, message: "Max active issues must be at least 1" },
                                required: "Max active issues are required",
                            })}
                        />
                        <FormInput
                            id="finePerDay"
                            type="number"
                            label="Fine Per Overdue Day"
                            required
                            error={errors.finePerDay?.message}
                            {...register("finePerDay", {
                                valueAsNumber: true,
                                min: { value: 0, message: "Fine cannot be negative" },
                                required: "Fine per day is required",
                            })}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save Settings"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
