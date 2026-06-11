"use client";

import React, { useState, useEffect, useMemo } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckSquare, Square, RefreshCw } from "lucide-react";
import { useClassesQuery, useSectionsQuery, useSessionsQuery } from "@/apis/queries/academic_queries";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { promoteStudents } from "@/apis/mutations/student_mutations";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function StudentPromotionPage() {
  // Queries
  const { data: classesRes } = useClassesQuery();
  const { data: sessionsRes } = useSessionsQuery();

  // Source filters
  const [fromClassId, setFromClassId] = useState("none");
  const [fromSectionId, setFromSectionId] = useState("none");
  const [fromSessionId, setFromSessionId] = useState("none");

  // Target filters
  const [toClassId, setToClassId] = useState("none");
  const [toSectionId, setToSectionId] = useState("none");
  const [toSessionId, setToSessionId] = useState("none");

  // Dynamic sections query
  const { data: fromSectionsRes } = useSectionsQuery(fromClassId && fromClassId !== "none" ? fromClassId : undefined);
  const { data: toSectionsRes } = useSectionsQuery(toClassId && toClassId !== "none" ? toClassId : undefined);

  // Student selection SWR query
  const isQueryReady = fromClassId !== "none" && fromSectionId !== "none" && fromSessionId !== "none";
  const { data: studentsRes, isLoading, mutate } = useStudentProfilesQuery(
    isQueryReady
      ? {
          classId: fromClassId,
          sectionId: fromSectionId,
          sessionId: fromSessionId,
        }
      : undefined
  );

  const classes = classesRes?.data || [];
  const sessions = sessionsRes?.data || [];
  const fromSections = fromSectionsRes?.data || [];
  const toSections = toSectionsRes?.data || [];
  const students = studentsRes?.data || [];

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reset fromSection when class changes
  useEffect(() => {
    setFromSectionId("none");
  }, [fromClassId]);

  // Reset toSection when class changes
  useEffect(() => {
    setToSectionId("none");
  }, [toClassId]);

  // Reset selection when student query outputs change
  useEffect(() => {
    setSelectedIds([]);
  }, [students]);

  const handleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s: any) => s.id));
    }
  };

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handlePromote = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one student to promote");
      return;
    }
    if (toClassId === "none" || toSectionId === "none" || toSessionId === "none") {
      toast.error("Please select target Class, Section, and Session");
      return;
    }
    if (fromClassId === toClassId && fromSectionId === toSectionId && fromSessionId === toSessionId) {
      toast.error("Target academic placement cannot be identical to source academic placement");
      return;
    }

    const payload = {
      studentIds: selectedIds,
      classId: toClassId,
      sectionId: toSectionId,
      sessionId: toSessionId,
    };

    try {
      const res = await promoteStudents(payload);
      if (res.success) {
        toast.success(res.message || `Successfully promoted ${selectedIds.length} students!`);
        mutate();
        setSelectedIds([]);
      } else {
        toast.error(res.message || "Failed to process bulk student promotion");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred during promotion");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Bulk Promotion</h1>
        <p className="text-sm text-gray-500">Promote students in batch from one placement to another.</p>
      </div>

      {/* Grid of Placement Choices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Placement */}
        <Card className="shadow-sm border-none ring-1 ring-gray-200">
          <CardHeader className="bg-gray-50/50 rounded-t-xl py-3 border-b border-gray-200/50">
            <CardTitle className="text-sm font-bold text-gray-800">Source placement (From)</CardTitle>
            <CardDescription className="text-xs">Query students from this academic sector</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="space-y-1">
              <Label htmlFor="from-class">Class</Label>
              <select
                id="from-class"
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={fromClassId}
                onChange={(e) => setFromClassId(e.target.value)}
              >
                <option value="none">Select class</option>
                {classes.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="from-section">Section</Label>
              <select
                id="from-section"
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={fromSectionId}
                onChange={(e) => setFromSectionId(e.target.value)}
                disabled={fromClassId === "none"}
              >
                <option value="none">Select section</option>
                {fromSections.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="from-session">Session</Label>
              <select
                id="from-session"
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={fromSessionId}
                onChange={(e) => setFromSessionId(e.target.value)}
              >
                <option value="none">Select session</option>
                {sessions.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Target Placement */}
        <Card className="shadow-sm border-none ring-1 ring-gray-200">
          <CardHeader className="bg-primary/5 rounded-t-xl py-3 border-b border-primary/10">
            <CardTitle className="text-sm font-bold text-primary">Target placement (To)</CardTitle>
            <CardDescription className="text-xs">Promote selected students to this academic placement</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="space-y-1">
              <Label htmlFor="to-class">Class</Label>
              <select
                id="to-class"
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={toClassId}
                onChange={(e) => setToClassId(e.target.value)}
              >
                <option value="none">Select class</option>
                {classes.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="to-section">Section</Label>
              <select
                id="to-section"
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={toSectionId}
                onChange={(e) => setToSectionId(e.target.value)}
                disabled={toClassId === "none"}
              >
                <option value="none">Select section</option>
                {toSections.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="to-session">Session</Label>
              <select
                id="to-session"
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={toSessionId}
                onChange={(e) => setToSessionId(e.target.value)}
              >
                <option value="none">Select session</option>
                {sessions.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Students List Card */}
      <Card className="shadow-sm border-none ring-1 ring-gray-200">
        <CardContent className="p-0">
          {!isQueryReady ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              Please select Class, Section, and Session under the "Source placement" to retrieve students.
            </div>
          ) : isLoading ? (
            <div className="p-12 text-center text-gray-400 text-sm flex justify-center items-center gap-2">
              <RefreshCw className="animate-spin w-4 h-4" /> Retrieving student records...
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              No students found matching this placement criteria.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between p-4 bg-gray-50/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100 text-gray-500"
                    onClick={handleSelectAll}
                  >
                    {selectedIds.length === students.length ? (
                      <CheckSquare className="w-5 h-5 text-primary" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </Button>
                  <span>Select All Students ({students.length})</span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {selectedIds.length} of {students.length} selected
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
                {students.map((student: any) => {
                  const isChecked = selectedIds.includes(student.id);
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                          onClick={() => handleToggle(student.id)}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4.5 h-4.5 text-primary" />
                          ) : (
                            <Square className="w-4.5 h-4.5" />
                          )}
                        </Button>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{`${student.firstName} ${student.lastName}`}</p>
                          <p className="text-xs text-gray-400">ID: {student.studentId} | Roll: {student.roll}</p>
                        </div>
                      </div>
                      <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end p-4 gap-4 bg-gray-50/30">
                <Button
                  type="button"
                  onClick={handlePromote}
                  disabled={selectedIds.length === 0}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground gap-2 font-bold shadow-sm"
                >
                  Promote Selected Students <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
