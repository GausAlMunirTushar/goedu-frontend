"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Globe, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExamsQuery } from "@/apis/queries/exam_queries";
import { publishExamResult } from "@/apis/mutations/exam_mutations";
import { toast } from "sonner";

export function ResultPublishPage() {
  const { data: examsData, isLoading: isLoadingExams } = useExamsQuery();
  const exams = examsData?.data || [];

  const [selectedExamId, setSelectedExamId] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    if (!selectedExamId) {
      toast.error("Please select an exam first");
      return;
    }

    setIsPublishing(true);
    try {
      await publishExamResult(selectedExamId);
      setPublished(true);
      toast.success("Results published successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to publish results");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Result Publish</Title>
          <p className="text-sm text-muted-foreground mt-1">Make processed results available online for students and parents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-primary/10">
            <CardHeader>
              <CardTitle className="text-base font-bold">Publish Settings</CardTitle>
              <CardDescription className="text-xs">Select an examination after result processing is complete.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam Name</label>
                <Select value={selectedExamId} onValueChange={setSelectedExamId} disabled={isLoadingExams}>
                  <SelectTrigger><SelectValue placeholder={isLoadingExams ? "Loading..." : "Select Exam"} /></SelectTrigger>
                  <SelectContent>
                    {exams.map((exam: any) => (
                      <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-bold">Publish Scope</h4>
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs text-muted-foreground">
                  The selected exam is published for all processed result records under that exam. Process class and section results before publishing.
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || published || !selectedExamId}
                  className={`w-full h-12 gap-2 text-base font-bold transition-all ${published ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary/90"}`}
                >
                  {isPublishing ? (
                    <>Publishing...</>
                  ) : published ? (
                    <>
                      <ShieldCheck className="w-5 h-5" /> Results Published Successfully
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Publish Results Online
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-3 italic">
                  * Publishing enables online result visibility. SMS sending remains a separate manual action from the result screen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-primary/10 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Live Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Portal Status:</span>
                <span className={`font-bold ${published ? "text-emerald-600" : "text-amber-600"}`}>
                  {published ? "LIVE" : "MAINTENANCE"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last Published:</span>
                <span className="font-semibold text-foreground">
                  {published ? "Just now" : "Not published in this session"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y text-[11px]">
                <div className="p-3 bg-gray-50/50">
                  <p className="font-semibold">{published ? "Results published from this panel" : "No publish activity in this session"}</p>
                  <p className="text-muted-foreground mt-0.5">{published ? "Just now - by current user" : "Select an exam and publish after final verification"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              <strong>Caution:</strong> Once published, results cannot be unpublished without admin authorization. Double-check all tabulation sheets before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
