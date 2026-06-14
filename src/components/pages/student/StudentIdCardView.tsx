"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Title from "@/components/ui/custom-ui/title";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  Printer,
  Loader2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { useClassesQuery, useSectionsQuery } from "@/apis/queries/academic_queries";
import { AxiosAPI } from "@/apis/configs";
import { studentIdCardImageUrl } from "@/apis/endpoints/student_apis";
import { downloadStudentIdCard } from "@/apis/mutations/student_mutations";
import { useModalStore } from "@/stores/modalStore";
import { toast } from "sonner";

export function StudentIdCardView() {
  // Filters
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const openModal = useModalStore((state) => state.openModal);

  // Bulk operations status
  const [downloadingBulk, setDownloadingBulk] = useState<boolean>(false);
  const [printingBulk, setPrintingBulk] = useState<boolean>(false);

  // Queries
  const { data: response, isLoading: loadingStudents } = useStudentProfilesQuery({
    classId: classFilter === "all" ? undefined : classFilter,
    sectionId: sectionFilter === "all" ? undefined : sectionFilter,
    status: "Active", // Only active students need ID cards usually
    search: search || undefined,
  });

  const { data: classesRes } = useClassesQuery();
  const { data: sectionsRes } = useSectionsQuery(
    classFilter === "all" ? undefined : classFilter
  );

  const students = response?.data || [];
  const classesList = classesRes?.data || [];
  const sectionsList = sectionsRes?.data || [];

  // Reset section filter when class changes
  useEffect(() => {
    setSectionFilter("all");
    setPage(1);
  }, [classFilter]);

  // Reset page on search change
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Handle pagination calculation
  const pageCount = Math.ceil(students.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    return students.slice((page - 1) * pageSize, page * pageSize);
  }, [students, page, pageSize]);

  // Selection handlers
  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAllVisible = () => {
    const visibleIds: string[] = paginatedStudents.map((s: any) => s.id);
    const allVisibleSelected = visibleIds.every((id: string) => selectedRows.has(id));
    const newSelected = new Set(selectedRows);

    if (allVisibleSelected) {
      // Uncheck all visible
      visibleIds.forEach((id: string) => newSelected.delete(id));
    } else {
      // Check all visible
      visibleIds.forEach((id: string) => newSelected.add(id));
    }
    setSelectedRows(newSelected);
  };

  const isAllVisibleSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.map((s: any) => s.id).every((id: string) => selectedRows.has(id));

  // Open single preview dialog modal
  const handleOpenPreview = (id: string, name: string) => {
    openModal("student-id-card", {
      studentId: id,
      studentName: name,
    });
  };

  // Direct single download PDF handler
  const handleDownloadSingle = async (id: string, name: string) => {
    const toastId = toast.loading(`Generating PDF for ${name}...`);
    try {
      await downloadStudentIdCard(id, name);
      toast.success(`ID Card PDF for ${name} downloaded successfully`, { id: toastId });
    } catch (err) {
      toast.error(`Failed to download ID card PDF for ${name}`, { id: toastId });
      console.error(err);
    }
  };

  // Bulk Print handler
  const handleBulkPrint = async () => {
    if (selectedRows.size === 0) return;
    setPrintingBulk(true);
    const toastId = toast.loading(`Loading ${selectedRows.size} ID cards for printing...`);
    try {
      const selectedIds = Array.from(selectedRows);
      
      // Fetch SVGs in parallel
      const responses = await Promise.all(
        selectedIds.map((id) => AxiosAPI.get(studentIdCardImageUrl(id)))
      );
      
      const svgs = responses.map((res) => res.data);

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Bulk Print ID Cards</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                }
                .card-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  page-break-after: always;
                }
                .card-container:last-child {
                  page-break-after: avoid;
                }
                svg {
                  width: 240px;
                  height: 360px;
                }
              </style>
            </head>
            <body>
              ${svgs.map((svg) => `<div class="card-container">${svg}</div>`).join("")}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        toast.success("Ready to print!", { id: toastId });
      } else {
        throw new Error("Popup blocked by browser");
      }
    } catch (err) {
      toast.error("Failed to generate bulk print window", { id: toastId });
      console.error(err);
    } finally {
      setPrintingBulk(false);
    }
  };

  // Bulk Download handler
  const handleBulkDownload = async () => {
    if (selectedRows.size === 0) return;
    setDownloadingBulk(true);
    const selectedIds = Array.from(selectedRows);
    const toastId = toast.loading(`Preparing bulk download...`);
    
    try {
      let count = 0;
      for (const id of selectedIds) {
        const student = students.find((s: any) => s.id === id);
        const name = student
          ? `${student.firstName || ""} ${student.lastName || ""}`
          : "Student";
        
        toast.loading(`Downloading ${++count} of ${selectedIds.length}: ${name}`, { id: toastId });
        await downloadStudentIdCard(id, name);
        
        // Brief sleep to avoid hitting download blocker restrictions
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      toast.success(`Successfully downloaded ${selectedIds.length} ID Cards!`, { id: toastId });
      setSelectedRows(new Set());
    } catch (err) {
      toast.error("An error occurred during bulk download", { id: toastId });
      console.error(err);
    } finally {
      setDownloadingBulk(false);
    }
  };

  return (
    <div className="p-2 space-y-4">
      {/* Header */}
      <div>
        <Title>Student ID Cards</Title>
        <p className="text-sm text-gray-500">
          Manage, preview, and export student ID cards. Choose a class or section, search for students, and download or print in bulk.
        </p>
      </div>

      {/* Filters Toolbar */}
      <Card className="border-primary/10 shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search student by name, ID, roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200 h-9"
            />
          </div>

          {/* Class Selector */}
          <div className="w-full md:w-[200px]">
            <Select value={classFilter} onValueChange={(val) => setClassFilter(val)}>
              <SelectTrigger className="h-9 bg-gray-50 border-gray-200">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classesList.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section Selector */}
          <div className="w-full md:w-[200px]">
            <Select
              value={sectionFilter}
              onValueChange={(val) => setSectionFilter(val)}
              disabled={classFilter === "all"}
            >
              <SelectTrigger className="h-9 bg-gray-50 border-gray-200">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sectionsList.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          {(classFilter !== "all" || sectionFilter !== "all" || search !== "") && (
            <Button
              variant="ghost"
              onClick={() => {
                setClassFilter("all");
                setSectionFilter("all");
                setSearch("");
                setPage(1);
              }}
              className="text-xs hover:bg-slate-100 h-9"
            >
              Reset Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Full-Width Data Table */}
      <Card className="shadow-xs border-primary/10 bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100">
                  <TableHead className="w-[50px] text-center">
                    <Checkbox
                      checked={isAllVisibleSelected}
                      onCheckedChange={handleSelectAllVisible}
                    />
                  </TableHead>
                  <TableHead className="w-[150px]">Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class/Section</TableHead>
                  <TableHead className="w-[120px]">Roll</TableHead>
                  <TableHead className="w-[220px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingStudents ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Loading students list...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-slate-300" />
                        <span className="text-sm">No active students found matching the criteria.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student: any) => {
                    const name = `${student.firstName || ""} ${student.lastName || ""}`;
                    const isSelected = selectedRows.has(student.id);

                    // Initials for avatar
                    const initials = `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase();

                    return (
                      <TableRow
                        key={student.id}
                        className={`border-b border-slate-100 transition-colors duration-150 ${
                          isSelected ? "bg-slate-50/70" : "hover:bg-slate-50/50"
                        }`}
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleSelectRow(student.id)}
                          />
                        </TableCell>
                        <TableCell className="text-slate-600 font-mono text-xs">
                          {student.studentId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0">
                              {initials}
                            </div>
                            <div className="truncate max-w-[240px]">
                              <span className="text-slate-800 text-sm block truncate font-medium">{name}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {student.class?.name || "N/A"}{" "}
                          {student.section?.name ? `(${student.section.name})` : ""}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {student.roll || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenPreview(student.id, name)}
                              className="h-8 px-2.5 flex items-center gap-1.5 text-xs text-slate-600 hover:text-primary hover:bg-slate-50"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadSingle(student.id, name)}
                              className="h-8 px-2.5 flex items-center gap-1.5 text-xs text-slate-600 hover:text-primary hover:bg-slate-50"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download PDF
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {students.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="text-xs text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, students.length)} of {students.length} students
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 text-xs"
                >
                  Previous
                </Button>
                <div className="text-xs font-medium text-slate-700">
                  Page {page} of {pageCount}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  className="h-8 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Bar for Selected Cards */}
      {selectedRows.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-slate-900 text-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-6 border border-slate-800">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {selectedRows.size}
              </div>
              <span className="font-semibold">Selected</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-700" />

            <div className="flex items-center gap-3">
              <Button
                onClick={handleBulkPrint}
                disabled={printingBulk || downloadingBulk}
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold h-8 rounded-full flex items-center gap-1.5"
              >
                {printingBulk ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Printer className="w-3.5 h-3.5" />
                )}
                Bulk Print
              </Button>

              <Button
                onClick={handleBulkDownload}
                disabled={downloadingBulk || printingBulk}
                size="sm"
                className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold h-8 rounded-full flex items-center gap-1.5"
              >
                {downloadingBulk ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                Download PDFs
              </Button>

              <Button
                variant="ghost"
                onClick={() => setSelectedRows(new Set())}
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs px-2 h-8 rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
