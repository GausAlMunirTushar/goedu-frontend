"use client";

import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { CertificateTemplateData, GeneratedCertificateData } from "./certificateTypes";

const certTypes = ["Transfer Certificate", "Character Certificate", "Bonafide Certificate", "Admit Card", "Staff Experience Certificate"];

interface TemplateProps {
    mode: "create" | "edit";
    initialData?: CertificateTemplateData;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: CertificateTemplateData) => void;
}

export function CertificateTemplateForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit }: TemplateProps) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<CertificateTemplateData>({
        defaultValues: initialData || {
            name: "",
            type: "Bonafide Certificate",
            title: "Certificate",
            body: "This is to certify that {{name}}, ID {{student_id}}, is a student of class {{class}}, section {{section}}.",
            footer: "Issued on {{issue_date}}",
            status: "Active",
        },
    });
    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", type: "Bonafide Certificate", title: "Certificate", body: "This is to certify that {{name}}, ID {{student_id}}, is a student of class {{class}}, section {{section}}.", footer: "Issued on {{issue_date}}", status: "Active" });
    }, [initialData, isOpen, reset]);
    return <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}><DialogContent className="sm:max-w-[760px] bg-white rounded-xl p-0 shadow-lg border-none"><DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Create Template" : "Edit Template"}</DialogTitle></DialogHeader><form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput id="name" label="Template Name" required error={errors.name?.message} {...register("name", { required: "Name is required" })} /><Controller control={control} name="type" render={({ field }) => <SelectInput label="Type" showNoneOption={false} options={certTypes.map((item) => ({ value: item, label: item }))} value={field.value} onChange={field.onChange} />} /></div><FormInput id="title" label="Certificate Title" required error={errors.title?.message} {...register("title", { required: "Title is required" })} /><FormInput id="body" label="Body Template" required error={errors.body?.message} {...register("body", { required: "Body is required" })} /><FormInput id="footer" label="Footer Template" {...register("footer")} /><Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} value={field.value} onChange={field.onChange} />} /><p className="text-xs text-muted-foreground">Available variables: {"{{name}}"}, {"{{student_id}}"}, {"{{roll}}"}, {"{{class}}"}, {"{{section}}"}, {"{{session}}"}, {"{{phone}}"}, {"{{issue_date}}"}</p><DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button></DialogFooter></form></DialogContent></Dialog>;
}

interface GenerateProps {
    templates: CertificateTemplateData[];
    students: any[];
    staff: any[];
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<GeneratedCertificateData>) => void;
}

export function GenerateCertificateDialog({ templates, students, staff, isOpen, isSubmitting, onClose, onSubmit }: GenerateProps) {
    const { control, handleSubmit, reset, watch } = useForm<any>({ defaultValues: { templateId: "", recipientType: "Student", studentId: "", staffId: "", issueDate: new Date().toISOString().slice(0, 10) } });
    const recipientType = watch("recipientType");
    React.useEffect(() => { if (isOpen) reset({ templateId: "", recipientType: "Student", studentId: "", staffId: "", issueDate: new Date().toISOString().slice(0, 10) }); }, [isOpen, reset]);
    return <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}><DialogContent className="sm:max-w-[560px] bg-white rounded-xl p-0 shadow-lg border-none"><DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">Generate Certificate</DialogTitle></DialogHeader><form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4"><Controller control={control} name="templateId" render={({ field }) => <SelectInput label="Template" required showNoneOption={false} options={templates.filter((t) => t.status === "Active").map((item) => ({ value: item.id || "", label: `${item.name} (${item.type})` }))} value={field.value} onChange={field.onChange} />} /><Controller control={control} name="recipientType" render={({ field }) => <SelectInput label="Recipient Type" showNoneOption={false} options={[{ value: "Student", label: "Student" }, { value: "Staff", label: "Staff" }]} value={field.value} onChange={field.onChange} />} />{recipientType === "Student" ? <Controller control={control} name="studentId" render={({ field }) => <SelectInput label="Student" searchable showNoneOption={false} options={students.map((item) => ({ value: item.id, label: `${item.fullName || `${item.firstName || ""} ${item.lastName || ""}`.trim()} - ${item.studentId}` }))} value={field.value} onChange={field.onChange} />} /> : <Controller control={control} name="staffId" render={({ field }) => <SelectInput label="Staff" searchable showNoneOption={false} options={staff.map((item) => ({ value: item.id, label: `${item.firstName || ""} ${item.lastName || ""}`.trim() || item.username }))} value={field.value} onChange={field.onChange} />} />}<Controller control={control} name="issueDate" render={({ field }) => <FormInput id="issueDate" label="Issue Date" type="date" value={field.value} onChange={field.onChange} />} /><DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Generating..." : "Generate"}</Button></DialogFooter></form></DialogContent></Dialog>;
}
