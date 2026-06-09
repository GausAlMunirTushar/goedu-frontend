"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TeacherData {
  id?: string;
  name: string;
  designation: string;
  department?: string;
  email?: string;
  phone?: string;
}

interface TeacherFormProps {
  mode: "create" | "edit";
  initialData?: TeacherData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherData) => void;
  inline?: boolean; // render form inline instead of modal
}

export function TeacherForm({ mode, initialData, isOpen, onClose, onSubmit, inline = false }: TeacherFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TeacherData>({
    defaultValues: initialData || { name: "", designation: "", department: "", email: "", phone: "" },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialData || { name: "", designation: "", department: "", email: "", phone: "" });
    }
  }, [isOpen, initialData, reset]);

  const submit = (data: TeacherData) => {
    onSubmit(data);
    onClose();
  };

  const formContent = (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="e.g. Jane Doe" {...register("name", { required: true })} />
          {errors.name && <p className="text-sm text-red-500">Name is required</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" placeholder="e.g. Professor" {...register("designation", { required: true })} />
          {errors.designation && <p className="text-sm text-red-500">Designation is required</p>}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input id="department" placeholder="e.g. Mathematics" {...register("department")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="e.g. jane@example.com" {...register("email")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="e.g. 1234567890" {...register("phone")} />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{mode === "create" ? "Create" : "Save"}</Button>
      </div>
    </form>
  );

  if (inline) {
    return <>{formContent}</>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Teacher" : "Edit Teacher"}</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
