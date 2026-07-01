"use client";

import React, { useState, useMemo } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRightLeft, Search, UserCheck } from "lucide-react";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { processStudentTransfer } from "@/apis/mutations/student_mutations";

export function StudentTransferPage() {
  const [searchId, setSearchId] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [destinationSchool, setDestinationSchool] = useState("");
  const [reason, setReason] = useState("");
  const [transferDate, setTransferDate] = useState("");

  const { data: studentsRes, mutate } = useStudentProfilesQuery(
    activeSearch ? { search: activeSearch } : undefined
  );
  
  const students = studentsRes?.data || [];
  
  // Find matched student
  const matchedStudent = useMemo(() => {
    if (!activeSearch) return null;
    return students.find(
      (s: any) =>
        s.studentId.toLowerCase() === activeSearch.toLowerCase() ||
        s.id === activeSearch
    );
  }, [students, activeSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) {
      toast.error("Please enter a Student ID or Database ID");
      return;
    }
    setActiveSearch(searchId);
  };

  const handleProcessTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedStudent) {
      toast.error("No valid student selected for transfer");
      return;
    }
    if (!destinationSchool || !reason || !transferDate) {
      toast.error("Please fill in all transfer details");
      return;
    }

    try {
      const res = await processStudentTransfer({
        studentId: matchedStudent.id,
        destinationInstitution: destinationSchool,
        reason,
        transferDate,
      });

      if (res.success) {
        toast.success(`Student ${matchedStudent.firstName} ${matchedStudent.lastName} has been successfully marked as Transferred!`);
        // Reset form
        setDestinationSchool("");
        setReason("");
        setTransferDate("");
        setActiveSearch("");
        setSearchId("");
        mutate();
      } else {
        toast.error("Failed to process student transfer");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred while processing transfer");
    }
  };

  return (
    <div className="p-2 space-y-6">
      <Card>
        <CardHeader className="bg-white pb-4">
          <div>
            <Title>Student Transfer Management</Title>
            <p className="text-xs text-muted-foreground mt-1">Process outward transfers, releases, and migration clearances.</p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Search Student */}
        <Card className="md:col-span-1 shadow-sm border-none ring-1 ring-gray-200">
          <CardHeader className="bg-gray-50/50 rounded-t-xl py-3 border-b border-gray-100">
            <CardTitle className="text-sm font-bold">Select Student</CardTitle>
            <CardDescription className="text-xs">Search by Student ID</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <form onSubmit={handleSearch} className="space-y-2">
              <Label htmlFor="search-id">Student ID</Label>
              <div className="flex gap-2">
                <Input
                  id="search-id"
                  placeholder="e.g. STU10001"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="bg-white h-9"
                />
                <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {matchedStudent ? (
              <div className="bg-primary/5 rounded-lg p-3.5 space-y-2 text-xs border border-primary/10">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <UserCheck className="w-4 h-4" /> Student Found
                </div>
                <p><strong>Name:</strong> {`${matchedStudent.firstName} ${matchedStudent.lastName}`}</p>
                <p><strong>Class:</strong> {matchedStudent.class?.name || "N/A"} ({matchedStudent.section?.name || "N/A"})</p>
                <p><strong>Current Status:</strong> {matchedStudent.status}</p>
              </div>
            ) : activeSearch ? (
              <p className="text-xs text-amber-600 italic">No student found matching "{activeSearch}".</p>
            ) : null}
          </CardContent>
        </Card>

        {/* Right Side: Transfer Processing Details */}
        <Card className="md:col-span-2 shadow-sm border-none ring-1 ring-gray-200">
          <CardHeader className="bg-gray-50/50 rounded-t-xl py-3 border-b border-gray-100">
            <CardTitle className="text-sm font-bold">Transfer Release Form</CardTitle>
            <CardDescription className="text-xs">Submit outward migration details</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleProcessTransfer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="destination">Destination School / College</Label>
                  <Input
                    id="destination"
                    placeholder="e.g. Dhaka High School"
                    value={destinationSchool}
                    onChange={(e) => setDestinationSchool(e.target.value)}
                    className="bg-white"
                    disabled={!matchedStudent}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="transfer-date">Date of Transfer</Label>
                  <Input
                    id="transfer-date"
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="bg-white"
                    disabled={!matchedStudent}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reason">Reason for Transfer</Label>
                <textarea
                  id="reason"
                  rows={3}
                  placeholder="e.g. Family relocation to new city"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!matchedStudent}
                />
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <Button
                  type="submit"
                  disabled={!matchedStudent || matchedStudent.status === "Transferred"}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold shadow-sm gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4" /> Process TC Release
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
