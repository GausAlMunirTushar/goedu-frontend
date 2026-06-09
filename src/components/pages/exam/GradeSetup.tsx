"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Award, Pencil, Trash2 } from "lucide-react";
import { gradeSetupData } from "@/data/exam";

export function GradeSetupPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Grade Setup</Title>
          <p className="text-sm text-muted-foreground mt-1">Configure grading scales and point systems.</p>
        </div>
        <Button size="sm" className="gap-2">
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
                {gradeSetupData.map((grade) => (
                  <tr key={grade.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${grade.gradeName === 'F' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                          {grade.gradeName}
                        </div>
                        <span className="font-semibold">{grade.gradeName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-bold text-primary">{grade.gradePoint.toFixed(2)}</td>
                    <td className="py-3.5 font-medium">
                      {grade.markFrom}% - {grade.markTo}%
                    </td>
                    <td className="py-3.5 text-muted-foreground">{grade.remarks}</td>
                    <td className="py-3.5">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}
