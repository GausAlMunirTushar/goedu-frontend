// src/components/pages/teacher/TeacherDesignationForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TeacherDesignationData {
  id?: string;
  title: string;
  description?: string;
  status: "Active" | "Inactive";
}

interface TeacherDesignationFormProps {
  mode: "create" | "edit";
  initialData?: TeacherDesignationData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherDesignationData) => void;
}

export function TeacherDesignationForm({ mode, initialData, isOpen, onClose, onSubmit }: TeacherDesignationFormProps) {
  const { register, handleSubmit, reset } = useForm<TeacherDesignationData>({
    defaultValues: initialData || { title: "", description: "", status: "Active" },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialData || { title: "", description: "" });
    }
  }, [isOpen, initialData, reset]);

  const submit = (data: TeacherDesignationData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Designation" : "Edit Designation"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Professor" {...register("title", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Optional description" {...register("description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm" {...register("status")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
