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
}

export function TeacherForm({ mode, initialData, isOpen, onClose, onSubmit }: TeacherFormProps) {
  const { register, handleSubmit, reset } = useForm<TeacherData>({
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Teacher" : "Edit Teacher"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g. Jane Doe" {...register("name", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input id="designation" placeholder="e.g. Professor" {...register("designation", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" placeholder="e.g. Mathematics" {...register("department")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="e.g. jane@example.com" {...register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="e.g. 1234567890" {...register("phone")} />
          </div>
          <DialogFooter className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{mode === "create" ? "Create" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
