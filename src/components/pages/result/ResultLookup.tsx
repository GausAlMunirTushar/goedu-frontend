"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useExamResultsQuery, useExamsQuery } from "@/apis/queries/exam_queries";
import { useClassesQuery, useSectionsQuery } from "@/apis/queries/academic_queries";
import { toast } from "sonner";

export function useResultLookup() {
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [activeFilters, setActiveFilters] = useState<{
    examId: string;
    classId: string;
    sectionId: string;
  } | null>(null);

  const { data: examsRes } = useExamsQuery();
  const { data: classesRes } = useClassesQuery();
  const { data: sectionsRes } = useSectionsQuery(selectedClassId);
  const { data: resultsRes, isLoading } = useExamResultsQuery(activeFilters || undefined);

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSectionId("");
    setActiveFilters(null);
  };

  const loadResults = () => {
    if (!selectedExamId || !selectedClassId || !selectedSectionId) {
      toast.error("Please select exam, class, and section");
      return;
    }
    setActiveFilters({
      examId: selectedExamId,
      classId: selectedClassId,
      sectionId: selectedSectionId,
    });
  };

  return {
    exams: examsRes?.data || [],
    classes: classesRes?.data || [],
    sections: sectionsRes?.data || [],
    results: resultsRes?.data || [],
    isLoading,
    activeFilters,
    selectedExamId,
    selectedClassId,
    selectedSectionId,
    setSelectedExamId,
    setSelectedSectionId,
    handleClassChange,
    loadResults,
  };
}

export function ResultLookupForm({
  lookup,
  buttonText,
}: {
  lookup: ReturnType<typeof useResultLookup>;
  buttonText: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Exam
        </label>
        <Select value={lookup.selectedExamId} onValueChange={lookup.setSelectedExamId}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select Exam" />
          </SelectTrigger>
          <SelectContent>
            {lookup.exams.map((exam: any) => (
              <SelectItem key={exam.id} value={exam.id}>
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Class
        </label>
        <Select value={lookup.selectedClassId} onValueChange={lookup.handleClassChange}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {lookup.classes.map((classItem: any) => (
              <SelectItem key={classItem.id} value={classItem.id}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Section
        </label>
        <Select value={lookup.selectedSectionId} onValueChange={lookup.setSelectedSectionId}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select Section" />
          </SelectTrigger>
          <SelectContent>
            {lookup.sections.map((section: any) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={lookup.loadResults} size="sm" className="h-9 gap-2">
        <Search className="w-4 h-4" /> {buttonText}
      </Button>
    </div>
  );
}

export const getResultStudentName = (result: any) =>
  `${result.student?.firstName || ""} ${result.student?.lastName || ""}`.trim() ||
  result.studentName ||
  "Student";

export const getResultRoll = (result: any) => result.student?.roll || result.roll || "-";
