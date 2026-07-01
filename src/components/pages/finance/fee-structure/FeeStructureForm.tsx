"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSectionsQuery } from "@/apis/queries/academic_queries";

export interface FeeStructureData {
  id?: string;
  name: string;
  classId: string;
  sectionId?: string;
  categoryId: string;
  amount: number | string;
  frequency: string;
  lateFineType: string;
  lateFineValue: number | string;
  status: string;
}

interface FeeStructureFormProps {
  mode: "create" | "edit";
  initialData?: FeeStructureData;
  isOpen: boolean;
  isSubmitting?: boolean;
  classes: any[];
  categories: any[];
  onClose: () => void;
  onSubmit: (data: FeeStructureData) => void;
}

const defaultValues: FeeStructureData = {
  name: "",
  classId: "",
  sectionId: "",
  categoryId: "",
  amount: "",
  frequency: "Monthly",
  lateFineType: "None",
  lateFineValue: 0,
  status: "Active",
};

export function FeeStructureForm({
  mode,
  initialData,
  isOpen,
  isSubmitting = false,
  classes,
  categories,
  onClose,
  onSubmit,
}: FeeStructureFormProps) {
  const [form, setForm] = React.useState<FeeStructureData>(defaultValues);
  const { data: sectionRes } = useSectionsQuery(form.classId);
  const sections = sectionRes?.data || [];

  React.useEffect(() => {
    if (isOpen) {
      setForm(initialData || defaultValues);
    }
  }, [isOpen, initialData]);

  const setValue = (key: keyof FeeStructureData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "classId" ? { sectionId: "" } : {}),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
      lateFineValue: Number(form.lateFineValue || 0),
      sectionId: form.sectionId || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px] bg-white rounded-xl p-0 shadow-lg border-none">
        <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
          <DialogTitle className="text-base font-bold text-slate-800">
            {mode === "create" ? "Create Fee Structure" : "Edit Fee Structure"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Structure Name</label>
            <Input
              required
              value={form.name}
              onChange={(event) => setValue("name", event.target.value)}
              placeholder="Monthly Tuition - Class 6"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <select
                required
                className="w-full border p-2 rounded-md"
                value={form.classId}
                onChange={(event) => setValue("classId", event.target.value)}
              >
                <option value="">Select Class</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <select
                className="w-full border p-2 rounded-md"
                value={form.sectionId || ""}
                onChange={(event) => setValue("sectionId", event.target.value)}
                disabled={!form.classId}
              >
                <option value="">All Sections</option>
                {sections.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                required
                className="w-full border p-2 rounded-md"
                value={form.categoryId}
                onChange={(event) => setValue("categoryId", event.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                required
                type="number"
                value={form.amount}
                onChange={(event) => setValue("amount", event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <select
                className="w-full border p-2 rounded-md"
                value={form.frequency}
                onChange={(event) => setValue("frequency", event.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
                <option value="One Time">One Time</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Late Fine</label>
              <select
                className="w-full border p-2 rounded-md"
                value={form.lateFineType}
                onChange={(event) => setValue("lateFineType", event.target.value)}
              >
                <option value="None">None</option>
                <option value="Fixed">Fixed</option>
                <option value="Percent">Percent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fine Value</label>
              <Input
                type="number"
                value={form.lateFineValue}
                onChange={(event) => setValue("lateFineValue", event.target.value)}
                disabled={form.lateFineType === "None"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full border p-2 rounded-md"
              value={form.status}
              onChange={(event) => setValue("status", event.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
