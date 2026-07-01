"use client";

import React, { useState, useMemo } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Search, Upload, Trash2, Eye } from "lucide-react";
import { useStudentDocumentsQuery, useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { createStudentDocument, deleteStudentDocument } from "@/apis/mutations/student_mutations";

export function StudentDocumentsPage() {
  const [searchId, setSearchId] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [docType, setDocType] = useState("Birth Certificate");
  const [fileNameInput, setFileNameInput] = useState("");

  const { data: studentsRes } = useStudentProfilesQuery(
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

  const { data: documentsRes, mutate: mutateDocuments } = useStudentDocumentsQuery(matchedStudent?.id);
  const documents = documentsRes?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) {
      toast.error("Please enter a Student ID");
      return;
    }
    setActiveSearch(searchId);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedStudent) {
      toast.error("Please verify a student first");
      return;
    }
    if (!fileNameInput) {
      toast.error("Please provide a file name or select a file");
      return;
    }

    try {
      await createStudentDocument({
        studentId: matchedStudent.id,
        type: docType,
        fileName: fileNameInput.endsWith(".pdf") ? fileNameInput : `${fileNameInput}.pdf`,
        fileSize: "1.8 MB",
      });
      mutateDocuments();
      setFileNameInput("");
      toast.success("Document saved successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save document");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudentDocument(id);
      mutateDocuments();
      toast.success("Document removed from profile database");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete document");
    }
  };

  return (
    <div className="p-2 space-y-6">
      <Card>
        <CardHeader className="bg-white pb-4">
          <div>
            <Title>Student Academic Documents</Title>
            <p className="text-xs text-muted-foreground mt-1">Upload and archive student birth certificates, credentials, and transcripts.</p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Panel */}
        <Card className="shadow-sm border-none ring-1 ring-gray-200">
          <CardHeader className="bg-gray-50/50 rounded-t-xl py-3 border-b border-gray-100">
            <CardTitle className="text-sm font-bold">Query Student</CardTitle>
            <CardDescription className="text-xs">Search profile to manage archive</CardDescription>
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
                <div className="text-primary font-bold">Student Verified</div>
                <p><strong>Name:</strong> {`${matchedStudent.firstName} ${matchedStudent.lastName}`}</p>
                <p><strong>ID:</strong> {matchedStudent.studentId}</p>
                <p><strong>Placement:</strong> {matchedStudent.class?.name || "N/A"}</p>
              </div>
            ) : activeSearch ? (
              <p className="text-xs text-amber-600 italic">No student found matching "{activeSearch}".</p>
            ) : null}
          </CardContent>
        </Card>

        {/* Documents Vault Panel */}
        <Card className="lg:col-span-2 shadow-sm border-none ring-1 ring-gray-200">
          <CardHeader className="bg-gray-50/50 rounded-t-xl py-3 border-b border-gray-100">
            <CardTitle className="text-sm font-bold">Documents Vault</CardTitle>
            <CardDescription className="text-xs">Uploaded files and transcripts</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            {/* Upload form */}
            {matchedStudent ? (
              <form onSubmit={handleUpload} className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-200/60">
                <div className="space-y-1">
                  <Label htmlFor="doc-type">Document Type</Label>
                  <select
                    id="doc-type"
                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="Previous Transcript">Previous Transcript</option>
                    <option value="Admission Clearance Form">Admission Clearance Form</option>
                    <option value="Medical Certificate">Medical Certificate</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="file-name">File Name</Label>
                  <Input
                    id="file-name"
                    placeholder="e.g. birth_cert_john"
                    value={fileNameInput}
                    onChange={(e) => setFileNameInput(e.target.value)}
                    className="bg-white h-9"
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full h-9 bg-primary gap-2 font-semibold">
                    <Upload className="w-4 h-4" /> Upload
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center p-6 bg-gray-50 text-xs text-muted-foreground rounded-lg border border-dashed border-gray-200">
                Verify a student on the left panel to upload new documents.
              </div>
            )}

            {/* Document list table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Archive List</h3>
              {documents.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No documents currently uploaded to vault.</p>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-gray-50/30 transition-colors bg-white">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary/70 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-gray-800">{doc.fileName}</p>
                          <p className="text-xs text-gray-400">
                            {doc.type} - Uploaded: {new Date(doc.createdAt).toLocaleDateString()} - Size: {doc.fileSize || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(doc.id)}
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
