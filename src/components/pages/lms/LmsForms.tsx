"use client";

import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { ClassResourceData, HomeworkData, HomeworkSubmissionData, LessonPlanData } from "./lmsTypes";

const statusOptions = ["Draft", "Published", "Archived"].map((value) => ({ value, label: value }));

interface AcademicOptions {
    classes: any[];
    sections: any[];
    subjects: any[];
    teachers: any[];
}

interface DialogProps<T> extends AcademicOptions {
    mode: "create" | "edit";
    initialData?: T;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: T) => void;
}

function AcademicFields({ control, classes, sections, subjects, teachers, classId, requiredSubject = true }: any) {
    const filteredSections = sections.filter((item: any) => !classId || item.classId === classId);
    const filteredSubjects = subjects.filter((item: any) => !classId || item.classId === classId);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller control={control} name="classId" render={({ field }) => <SelectInput label="Class" required showNoneOption={false} options={classes.map((item: any) => ({ value: item.id, label: item.name }))} value={field.value} onChange={field.onChange} />} />
            <Controller control={control} name="sectionId" render={({ field }) => <SelectInput label="Section" options={filteredSections.map((item: any) => ({ value: item.id, label: item.name }))} value={field.value || ""} onChange={field.onChange} />} />
            <Controller control={control} name="subjectId" render={({ field }) => <SelectInput label="Subject" required={requiredSubject} showNoneOption={!requiredSubject} options={filteredSubjects.map((item: any) => ({ value: item.id, label: item.name }))} value={field.value || ""} onChange={field.onChange} />} />
            <Controller control={control} name="teacherId" render={({ field }) => <SelectInput label="Teacher" searchable options={teachers.map((item: any) => ({ value: item.id, label: `${item.firstName || ""} ${item.lastName || ""}`.trim() || item.username }))} value={field.value || ""} onChange={field.onChange} />} />
        </div>
    );
}

export function LessonPlanForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, classes, sections, subjects, teachers }: DialogProps<LessonPlanData>) {
    const { control, handleSubmit, register, reset, watch, formState: { errors } } = useForm<LessonPlanData>({ defaultValues: initialData || { title: "", classId: "", sectionId: "", subjectId: "", teacherId: "", planDate: new Date().toISOString().slice(0, 10), objectives: "", activities: "", materials: "", homeworkNote: "", status: "Draft" } });
    const classId = watch("classId");
    React.useEffect(() => { if (isOpen) reset(initialData || { title: "", classId: "", sectionId: "", subjectId: "", teacherId: "", planDate: new Date().toISOString().slice(0, 10), objectives: "", activities: "", materials: "", homeworkNote: "", status: "Draft" }); }, [initialData, isOpen, reset]);
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}><DialogContent className="sm:max-w-[760px] bg-white rounded-xl p-0 shadow-lg border-none"><DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Create Lesson Plan" : "Edit Lesson Plan"}</DialogTitle></DialogHeader><form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <FormInput id="title" label="Title" required error={errors.title?.message} {...register("title", { required: "Title is required" })} />
            <AcademicFields control={control} classes={classes} sections={sections} subjects={subjects} teachers={teachers} classId={classId} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput id="planDate" label="Plan Date" type="date" required {...register("planDate", { required: true })} /><Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={statusOptions} value={field.value} onChange={field.onChange} />} /></div>
            <FormInput id="objectives" label="Objectives" {...register("objectives")} /><FormInput id="activities" label="Activities" {...register("activities")} /><FormInput id="materials" label="Materials" {...register("materials")} /><FormInput id="homeworkNote" label="Homework Note" {...register("homeworkNote")} />
            <DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button></DialogFooter>
        </form></DialogContent></Dialog>
    );
}

export function HomeworkForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, classes, sections, subjects, teachers }: DialogProps<HomeworkData>) {
    const { control, handleSubmit, register, reset, watch, formState: { errors } } = useForm<HomeworkData>({ defaultValues: initialData || { title: "", description: "", classId: "", sectionId: "", subjectId: "", teacherId: "", dueDate: new Date().toISOString().slice(0, 10), attachmentUrl: "", status: "Published" } });
    const classId = watch("classId");
    React.useEffect(() => { if (isOpen) reset(initialData || { title: "", description: "", classId: "", sectionId: "", subjectId: "", teacherId: "", dueDate: new Date().toISOString().slice(0, 10), attachmentUrl: "", status: "Published" }); }, [initialData, isOpen, reset]);
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}><DialogContent className="sm:max-w-[760px] bg-white rounded-xl p-0 shadow-lg border-none"><DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Create Homework" : "Edit Homework"}</DialogTitle></DialogHeader><form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <FormInput id="title" label="Title" required error={errors.title?.message} {...register("title", { required: "Title is required" })} />
            <FormInput id="description" label="Description" required error={errors.description?.message} {...register("description", { required: "Description is required" })} />
            <AcademicFields control={control} classes={classes} sections={sections} subjects={subjects} teachers={teachers} classId={classId} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><FormInput id="dueDate" label="Due Date" type="date" required {...register("dueDate", { required: true })} /><FormInput id="attachmentUrl" label="Attachment URL" {...register("attachmentUrl")} /><Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={statusOptions} value={field.value} onChange={field.onChange} />} /></div>
            <DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button></DialogFooter>
        </form></DialogContent></Dialog>
    );
}

export function ResourceForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, classes, sections, subjects, teachers }: DialogProps<ClassResourceData>) {
    const { control, handleSubmit, register, reset, watch, formState: { errors } } = useForm<ClassResourceData>({ defaultValues: initialData || { title: "", description: "", type: "Link", fileUrl: "", classId: "", sectionId: "", subjectId: "", teacherId: "", status: "Published" } });
    const classId = watch("classId");
    React.useEffect(() => { if (isOpen) reset(initialData || { title: "", description: "", type: "Link", fileUrl: "", classId: "", sectionId: "", subjectId: "", teacherId: "", status: "Published" }); }, [initialData, isOpen, reset]);
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}><DialogContent className="sm:max-w-[720px] bg-white rounded-xl p-0 shadow-lg border-none"><DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Resource" : "Edit Resource"}</DialogTitle></DialogHeader><form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <FormInput id="title" label="Title" required error={errors.title?.message} {...register("title", { required: "Title is required" })} /><FormInput id="description" label="Description" {...register("description")} />
            <AcademicFields control={control} classes={classes} sections={sections} subjects={subjects} teachers={teachers} classId={classId} requiredSubject={false} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Controller control={control} name="type" render={({ field }) => <SelectInput label="Type" showNoneOption={false} options={[{ value: "Link", label: "Link" }, { value: "File", label: "File" }, { value: "Video", label: "Video" }]} value={field.value} onChange={field.onChange} />} /><FormInput id="fileUrl" label="URL" {...register("fileUrl")} /><Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={statusOptions} value={field.value} onChange={field.onChange} />} /></div>
            <DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button></DialogFooter>
        </form></DialogContent></Dialog>
    );
}

export function SubmissionForm({ homeworks, isOpen, isSubmitting, onClose, onSubmit }: { homeworks: HomeworkData[]; isOpen: boolean; isSubmitting?: boolean; onClose: () => void; onSubmit: (data: HomeworkSubmissionData) => void }) {
    const { control, handleSubmit, register, reset } = useForm<HomeworkSubmissionData>({ defaultValues: { homeworkId: "", content: "", attachmentUrl: "" } });
    React.useEffect(() => { if (isOpen) reset({ homeworkId: "", content: "", attachmentUrl: "" }); }, [isOpen, reset]);
    return <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}><DialogContent className="sm:max-w-[560px] bg-white rounded-xl p-0 shadow-lg border-none"><DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">Submit Homework</DialogTitle></DialogHeader><form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4"><Controller control={control} name="homeworkId" render={({ field }) => <SelectInput label="Homework" required showNoneOption={false} options={homeworks.map((item) => ({ value: item.id || "", label: item.title }))} value={field.value} onChange={field.onChange} />} /><FormInput id="content" label="Answer / Note" {...register("content")} /><FormInput id="attachmentUrl" label="Attachment URL" {...register("attachmentUrl")} /><DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</Button></DialogFooter></form></DialogContent></Dialog>;
}

export function ReviewForm({ submission, isOpen, isSubmitting, onClose, onSubmit }: { submission?: HomeworkSubmissionData; isOpen: boolean; isSubmitting?: boolean; onClose: () => void; onSubmit: (data: HomeworkSubmissionData) => void }) {
    const { control, handleSubmit, register, reset } = useForm<HomeworkSubmissionData>({ defaultValues: { marks: undefined, grade: "", feedback: "", status: "Reviewed" } });
    React.useEffect(() => { if (isOpen) reset({ marks: submission?.marks, grade: submission?.grade || "", feedback: submission?.feedback || "", status: submission?.status || "Reviewed" }); }, [isOpen, reset, submission]);
    return <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}><DialogContent className="sm:max-w-[520px] bg-white rounded-xl p-0 shadow-lg border-none"><DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">Review Submission</DialogTitle></DialogHeader><form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4"><FormInput id="marks" label="Marks" type="number" {...register("marks", { valueAsNumber: true })} /><FormInput id="grade" label="Grade" {...register("grade")} /><FormInput id="feedback" label="Feedback" {...register("feedback")} /><Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={[{ value: "Reviewed", label: "Reviewed" }, { value: "Needs Revision", label: "Needs Revision" }]} value={field.value || "Reviewed"} onChange={field.onChange} />} /><DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Review"}</Button></DialogFooter></form></DialogContent></Dialog>;
}
