"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDesignationsQuery, useDepartmentsQuery } from "@/apis/queries/teacher_queries";

export interface TeacherData {
  id?: string;
  username: string;
  phone: string;
  email?: string;
  password?: string;
  firstName: string;
  lastName: string;
  designationId?: string | null;
  departmentId?: string | null;
  isActive: boolean;
  designation?: { id: string; title: string };
  department?: { id: string; name: string };
}

interface TeacherFormProps {
  mode: "create" | "edit";
  initialData?: TeacherData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  inline?: boolean;
}

export function TeacherForm({ mode, initialData, isOpen, onClose, onSubmit, inline = false }: TeacherFormProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<any>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
      email: "",
      password: "",
      designationId: "none",
      departmentId: "none",
      isActive: "true",
    },
  });

  const { data: designationsRes } = useDesignationsQuery();
  const { data: departmentsRes } = useDepartmentsQuery();

  const designations = designationsRes?.data || [];
  const departments = departmentsRes?.data || [];

  const activeDesignations = React.useMemo(() => {
    return designations.filter((d: any) => d.status === "Active" || d.id === initialData?.designation?.id);
  }, [designations, initialData]);

  const activeDepartments = React.useMemo(() => {
    return departments.filter((d: any) => d.status === "Active" || d.id === initialData?.department?.id);
  }, [departments, initialData]);

  React.useEffect(() => {
    if (isOpen) {
      reset(
        initialData
          ? {
              firstName: initialData.firstName || "",
              lastName: initialData.lastName || "",
              username: initialData.username || "",
              phone: initialData.phone || "",
              email: initialData.email || "",
              password: "",
              designationId: initialData.designation?.id || "none",
              departmentId: initialData.department?.id || "none",
              isActive: initialData.isActive ? "true" : "false",
            }
          : {
              firstName: "",
              lastName: "",
              username: "",
              phone: "",
              email: "",
              password: "",
              designationId: "none",
              departmentId: "none",
              isActive: "true",
            }
      );
    }
  }, [isOpen, initialData, reset]);

  const submit = (formData: any) => {
    const payload: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      phone: formData.phone,
      email: formData.email || null,
      designationId: formData.designationId === "none" ? null : formData.designationId,
      departmentId: formData.departmentId === "none" ? null : formData.departmentId,
      isActive: formData.isActive === "true",
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    onSubmit(payload);
  };

  const formContent = (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="e.g. John"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="e.g. Doe"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message as string}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="e.g. johndoe"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters" },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Alphanumeric and underscores only",
              },
            })}
          />
          {errors.username && <p className="text-xs text-red-500">{errors.username.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="e.g. 01712345678"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^0[0-9]+$/,
                message: "Must start with 0 and contain numbers only",
              },
            })}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message as string}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. john@example.com"
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder={mode === "create" ? "••••••" : "Leave empty to keep current password"}
            {...register("password", {
              required: mode === "create" ? "Password is required" : false,
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="designationId">Designation</Label>
          <select
            id="designationId"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            {...register("designationId")}
          >
            <option value="none">Not Selected</option>
            {activeDesignations.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="departmentId">Department</Label>
          <select
            id="departmentId"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            {...register("departmentId")}
          >
            <option value="none">Not Selected</option>
            {activeDepartments.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="isActive">Status</Label>
          <select
            id="isActive"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            {...register("isActive")}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === "create" ? "Create Teacher" : "Save Changes"}
        </Button>
      </div>
    </form>
  );

  if (inline) {
    return <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">{formContent}</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Teacher" : "Edit Teacher"}</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
