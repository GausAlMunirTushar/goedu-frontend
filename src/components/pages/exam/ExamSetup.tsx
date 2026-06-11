"use client";

import React, { useState, useEffect } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useExamsQuery } from "@/apis/queries/exam_queries";
import { createExam, updateExam, deleteExam } from "@/apis/mutations/exam_mutations";
import { useAcademicYearsQuery } from "@/apis/queries/academic_queries";

const statusStyle: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Inactive: "bg-gray-100 text-gray-600",
  Draft: "bg-amber-100 text-amber-700",
};

export function ExamSetupPage() {
  const { data: response, mutate, isLoading } = useExamsQuery();
  const exams = response?.data || [];

  const { data: yearsResponse } = useAcademicYearsQuery();
  const yearsList = yearsResponse?.data || [];

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "Mid-Term",
    academicYearId: "",
    totalMarks: 100,
    passMarks: 33,
    status: "Draft" as "Active" | "Inactive" | "Draft",
  });

  useEffect(() => {
    if (yearsList.length > 0 && !formData.academicYearId) {
      const active = yearsList.find((y: any) => y.isActive) || yearsList[0];
      setFormData(prev => ({ ...prev, academicYearId: active.id }));
    }
  }, [yearsList, formData.academicYearId]);

  const handleOpenCreate = () => {
    const active = yearsList.find((y: any) => y.isActive) || yearsList[0];
    setEditingId(null);
    setFormData({
      name: "",
      type: "Mid-Term",
      academicYearId: active?.id || "",
      totalMarks: 100,
      passMarks: 33,
      status: "Draft",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (exam: any) => {
    setEditingId(exam.id);
    setFormData({
      name: exam.name,
      type: exam.type,
      academicYearId: exam.academicYearId,
      totalMarks: exam.totalMarks,
      passMarks: exam.passMarks,
      status: exam.status,
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.academicYearId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateExam(editingId, formData);
        toast.success("Exam configuration updated");
      } else {
        await createExam(formData);
        toast.success("Exam configuration created");
      }
      mutate();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save exam configurations");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this examination configuration? This will delete all schedules, marks, and results related to it.")) {
      try {
        await deleteExam(id);
        toast.success("Exam configuration deleted");
        mutate();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete exam configuration");
      }
    }
  };

  const filtered = exams.filter((e: any) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Exam Setup</Title>
          <p className="text-sm text-muted-foreground mt-1">Create and manage examination configurations.</p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Create Exam
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search exams..."
          className="pl-9 h-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-base font-bold">Exam List</CardTitle>
          <CardDescription className="text-xs">All configured examinations for current session.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading exams list...</div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No examinations configured yet. Click "Create Exam" to get started.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Exam Name</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Type</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Session</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Total Marks</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Pass Marks</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((exam: any) => (
                    <tr key={exam.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                      <td className="py-3.5 font-medium">{exam.name}</td>
                      <td className="py-3.5 text-muted-foreground">{exam.type}</td>
                      <td className="py-3.5 text-muted-foreground">{exam.academicYear?.title || "-"}</td>
                      <td className="py-3.5 font-semibold">{exam.totalMarks}</td>
                      <td className="py-3.5 font-semibold">{exam.passMarks}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[exam.status] || ""}`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex gap-1">
                          <Button onClick={() => handleOpenEdit(exam)} variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button onClick={() => handleDelete(exam.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Exam Configurations" : "Create New Exam"}</DialogTitle>
            <DialogDescription>Setup test/exam scopes, totals, and passing grades.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="exam-name">Exam Name *</Label>
              <Input
                id="exam-name"
                placeholder="E.g., Mid-Term Examination 2026"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="exam-type">Type *</Label>
                <select
                  id="exam-type"
                  className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="Final">Final</option>
                  <option value="Unit Test">Unit Test</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Pre-Test">Pre-Test</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exam-session">Academic Session *</Label>
                <select
                  id="exam-session"
                  className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={formData.academicYearId}
                  onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                >
                  {yearsList.map((y: any) => (
                    <option key={y.id} value={y.id}>{y.title} {y.isActive ? "(Active)" : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="exam-total">Total Marks *</Label>
                <Input
                  id="exam-total"
                  type="number"
                  min="1"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exam-pass">Pass Marks *</Label>
                <Input
                  id="exam-pass"
                  type="number"
                  min="1"
                  value={formData.passMarks}
                  onChange={(e) => setFormData({ ...formData, passMarks: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exam-status">Status</Label>
              <select
                id="exam-status"
                className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Configs</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
