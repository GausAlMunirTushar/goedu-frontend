"use client";

import { AxiosAPI } from "@/apis/configs";
import { publicAdmissionApplicationsUrl } from "@/apis/endpoints/academic_apis";
import { usePublicAdmissionClassesQuery } from "@/apis/queries/academic_queries";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Title from "@/components/ui/custom-ui/title";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface PublicAdmissionFormData {
    applicantName: string;
    dob?: string;
    gender?: string;
    bloodGroup?: string;
    religion?: string;
    classId: string;
    previousSchool?: string;
    guardianName: string;
    guardianPhone: string;
    guardianEmail?: string;
    guardianOccupation?: string;
    address?: string;
}

export function PublicAdmissionApplicationForm() {
    const [submitting, setSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState<any>();
    const { data: classesResponse } = usePublicAdmissionClassesQuery();
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<PublicAdmissionFormData>({
        defaultValues: {
            applicantName: "",
            dob: "",
            gender: "Male",
            bloodGroup: "",
            religion: "",
            classId: "",
            previousSchool: "",
            guardianName: "",
            guardianPhone: "",
            guardianEmail: "",
            guardianOccupation: "",
            address: "",
        },
    });

    const onSubmit = async (data: PublicAdmissionFormData) => {
        setSubmitting(true);
        try {
            const res = await AxiosAPI.post(publicAdmissionApplicationsUrl, {
                ...data,
                dob: data.dob || undefined,
                guardianEmail: data.guardianEmail || undefined,
            });
            setSubmitted(res.data?.data);
            toast.success("Application submitted successfully");
            reset();
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Application submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-50 py-8">
            <div className="mx-auto w-full max-w-5xl px-4 space-y-6">
                <div>
                    <Title>Online Admission</Title>
                    <p className="text-sm text-muted-foreground mt-1">
                        Submit an application for admission. The admission office will review and contact the guardian.
                    </p>
                </div>

                {submitted && (
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                            <p className="font-semibold text-green-800">Application submitted</p>
                            <p className="text-sm text-green-700 mt-1">
                                Application No: <span className="font-mono font-bold">{submitted.applicationNo}</span>
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Application Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    id="applicantName"
                                    label="Applicant Name"
                                    required
                                    error={errors.applicantName?.message}
                                    {...register("applicantName", { required: "Applicant name is required" })}
                                />
                                <Controller
                                    control={control}
                                    name="classId"
                                    rules={{ required: "Class is required" }}
                                    render={({ field }) => (
                                        <SelectInput
                                            label="Applied Class"
                                            required
                                            options={(classesResponse?.data || []).map((item: any) => ({ value: item.id, label: item.name }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={errors.classId?.message}
                                        />
                                    )}
                                />
                                <FormInput id="dob" type="date" label="Date of Birth" {...register("dob")} />
                                <Controller
                                    control={control}
                                    name="gender"
                                    render={({ field }) => (
                                        <SelectInput
                                            label="Gender"
                                            showNoneOption={false}
                                            options={["Male", "Female", "Other"].map((item) => ({ value: item, label: item }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                <FormInput id="bloodGroup" label="Blood Group" {...register("bloodGroup")} />
                                <FormInput id="religion" label="Religion" {...register("religion")} />
                                <FormInput id="previousSchool" label="Previous School" {...register("previousSchool")} />
                            </div>

                            <div className="border-t pt-5">
                                <h3 className="text-sm font-semibold mb-4">Guardian Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        id="guardianName"
                                        label="Guardian Name"
                                        required
                                        error={errors.guardianName?.message}
                                        {...register("guardianName", { required: "Guardian name is required" })}
                                    />
                                    <FormInput
                                        id="guardianPhone"
                                        label="Guardian Phone"
                                        required
                                        error={errors.guardianPhone?.message}
                                        {...register("guardianPhone", { required: "Guardian phone is required" })}
                                    />
                                    <FormInput id="guardianEmail" type="email" label="Guardian Email" {...register("guardianEmail")} />
                                    <FormInput id="guardianOccupation" label="Guardian Occupation" {...register("guardianOccupation")} />
                                </div>
                            </div>

                            <FormInput id="address" label="Address" {...register("address")} />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? "Submitting..." : "Submit Application"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
