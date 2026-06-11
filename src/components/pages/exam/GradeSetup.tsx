"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Award, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useExamGradesQuery } from "@/apis/queries/exam_queries";
import { createExamGrade, updateExamGrade, deleteExamGrade } from "@/apis/mutations/exam_mutations";

export function GradeSetupPage() {
  const { data: response, mutate, isLoading } = useExamGradesQuery();
  const grades = response?.data || [];

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    gradeName: "",
    gradePoint: 0.00,
    markFrom: 0,
    markTo: 100,
    remarks: "",
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      gradeName: "",
      gradePoint: 4.00,
      markFrom: 70,
      markTo: 79,
      remarks: "",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (grade: any) => {
    setEditingId(grade.id);
    setFormData({
      gradeName: grade.gradeName,
      gradePoint: grade.gradePoint,
      markFrom: grade.markFrom,
      markTo: grade.markTo,
      remarks: grade.remarks || "",
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.gradeName) {
      toast.error("Grade name is required");
      return;
    }

    try {
      if (editingId) {
        await updateExamGrade(editingId, formData);
        toast.success("Grade updated successfully");
      } else {
        await createExamGrade(formData);
        toast.success("Grade created successfully");
      }
      mutate();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save grading rule");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this grading rule?")) {
      try {
        await deleteExamGrade(id);
        toast.success("Grade rule deleted");
        mutate();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete grading rule");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Grade Setup</Title>
          <p className="text-sm text-muted-foreground mt-1">Configure grading scales and point systems.</p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Add New Grade
        </Button>
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-base font-bold">Grading System</CardTitle>
          <CardDescription className="text-xs">Standard grading scale for all examinations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading grading scales...</div>
            ) : grades.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No grading scales configured yet. Click "Add New Grade" to create one.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Grade Name</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Grade Point</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Mark Range</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Remarks</th>
                    <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade: any) => (
                    <tr key={grade.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${grade.gradeName === 'F' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                            {grade.gradeName}
                          </div>
                          <span className="font-semibold">{grade.gradeName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-bold text-primary">{Number(grade.gradePoint).toFixed(2)}</td>
                      <td className="py-3.5 font-medium">
                        {grade.markFrom}% - {grade.markTo}%
                      </td>
                      <td className="py-3.5 text-muted-foreground">{grade.remarks || "-"}</td>
                      <td className="py-3.5">
                        <div className="flex gap-1">
                          <Button onClick={() => handleOpenEdit(grade)} variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button onClick={() => handleDelete(grade.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-primary/10 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              GPA Calculation Rule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The system calculates GPA based on the average of grade points obtained in each subject. 
              An "F" grade in any mandatory subject will result in a total GPA of 0.00.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-primary/10 bg-amber-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-700">
              Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-700/80 leading-relaxed">
              Changes to the grading system will only apply to new result processing. 
              Existing results will maintain their historical grading rules.
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Grade Rule" : "Add New Grade"}</DialogTitle>
            <DialogDescription>Set grade details and minimum/maximum percentage score boundaries.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="grade-name">Grade Name *</Label>
                <Input
                  id="grade-name"
                  placeholder="E.g., A+"
                  value={formData.gradeName}
                  onChange={(e) => setFormData({ ...formData, gradeName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="grade-point">Grade Point (GPA) *</Label>
                <Input
                  id="grade-point"
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  placeholder="E.g., 5.00"
                  value={formData.gradePoint}
                  onChange={(e) => setFormData({ ...formData, gradePoint: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="mark-from">Minimum Score (%) *</Label>
                <Input
                  id="mark-from"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.markFrom}
                  onChange={(e) => setFormData({ ...formData, markFrom: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mark-to">Maximum Score (%) *</Label>
                <Input
                  id="mark-to"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.markTo}
                  onChange={(e) => setFormData({ ...formData, markTo: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="remarks">Remarks / Description</Label>
              <Input
                id="remarks"
                placeholder="E.g., Outstanding"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Grade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
