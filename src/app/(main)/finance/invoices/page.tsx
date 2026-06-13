"use client";

import React, { useState, useMemo } from "react";
import { useFeeInvoicesQuery, useFeeCategoriesQuery } from "@/apis/queries/finance_queries";
import { useClassQuery } from "@/apis/queries/academic_queries";
import { useStudentQuery } from "@/apis/queries/student_queries";
import { financeInvoicesUrl, financeInvoicesBulkUrl, financeInvoiceDetailUrl } from "@/apis/endpoints/finance_apis";
import axiosInstance from "@/apis/configs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import TableActions from "@/components/ui/table-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentInvoicesPage() {
    const [statusFilter, setStatusFilter] = useState("all");
    const { data: res, isLoading, mutate } = useFeeInvoicesQuery(statusFilter !== "all" ? { status: statusFilter } : undefined);
    const invoices = res?.data || [];

    const { data: catRes } = useFeeCategoriesQuery();
    const categories = catRes?.data || [];

    const { data: classRes } = useClassQuery();
    const classes = classRes?.data || [];

    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const [bulkData, setBulkData] = useState({ classId: "", sectionId: "", categoryId: "", amount: "", dueDate: "" });

    // Pagination and Search state for DataTable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const pageCount = Math.ceil(invoices.length / pageSize) || 1;
    const paginatedData = useMemo(() => {
      return invoices.slice((page - 1) * pageSize, page * pageSize);
    }, [invoices, page, pageSize]);

    const handleBulkGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post(financeInvoicesBulkUrl, {
                ...bulkData,
                amount: parseFloat(bulkData.amount)
            });
            toast.success(res.data.message || "Invoices generated");
            setIsBulkOpen(false);
            mutate();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Generation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if(!confirm("Delete this invoice?")) return;
        try {
            await axiosInstance.delete(financeInvoiceDetailUrl(id));
            toast.success("Deleted");
            mutate();
        } catch (error: any) {
            toast.error("Deletion failed");
        }
    };

    const columns: ColumnDef<any>[] = [
      { accessorKey: "invoiceNumber", header: "Invoice #" },
      {
        header: "Student Name",
        accessorFn: (row) => `${row.student?.firstName || ""} ${row.student?.lastName || ""}`,
        id: "studentName",
      },
      {
        header: "Class Info",
        accessorFn: (row) => `${row.student?.class?.name || ""} - ${row.student?.section?.name || ""}`,
        id: "classInfo",
      },
      {
        header: "Category",
        accessorFn: (row) => row.category?.name || "N/A",
        id: "category",
      },
      {
        header: "Amount",
        accessorFn: (row) => `${row.amount.toLocaleString()} BDT`,
        id: "amount",
      },
      {
        header: "Due Date",
        accessorFn: (row) => new Date(row.dueDate).toLocaleDateString(),
        id: "dueDate",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
             <Badge variant={status === 'Paid' ? 'success' : status === 'Unpaid' ? 'destructive' : 'warning'}>
                 {status}
             </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TableActions
            onDelete={() => handleDelete(row.original.id)}
          />
        ),
      },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Student Invoices</h1>
                    <p className="text-muted-foreground text-sm">Manage student billing and fee generation.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                        <SelectTrigger className="h-9 w-full sm:w-[150px] bg-white border-gray-200">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Partial">Partial</SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                        </SelectContent>
                    </Select>

                    <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-9"><Plus className="w-4 h-4 mr-2" /> Bulk Generate</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Generate Class Invoices</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleBulkGenerate} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Class</label>
                                        <select 
                                            required 
                                            className="w-full border p-2 rounded-md"
                                            value={bulkData.classId}
                                            onChange={e => setBulkData({...bulkData, classId: e.target.value, sectionId: ""})}
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Section</label>
                                        <select 
                                            required 
                                            className="w-full border p-2 rounded-md"
                                            value={bulkData.sectionId}
                                            onChange={e => setBulkData({...bulkData, sectionId: e.target.value})}
                                            disabled={!bulkData.classId}
                                        >
                                            <option value="">Select Section</option>
                                            {classes.find((c: any) => c.id === bulkData.classId)?.sections?.map((s: any) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Fee Category</label>
                                    <select 
                                        required 
                                        className="w-full border p-2 rounded-md"
                                        value={bulkData.categoryId}
                                        onChange={e => setBulkData({...bulkData, categoryId: e.target.value})}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Amount (BDT)</label>
                                        <Input required type="number" value={bulkData.amount} onChange={e => setBulkData({...bulkData, amount: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Due Date</label>
                                        <Input required type="date" value={bulkData.dueDate} onChange={e => setBulkData({...bulkData, dueDate: e.target.value})} />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Generate Invoices</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="studentName"
                        searchValue={search}
                        onSearch={(val) => { setSearch(val); setPage(1); }}
                        searchPlaceholder="Search student name..."
                        isLoading={isLoading}
                        pagination={{
                            page,
                            pageCount,
                            pageSize,
                            totalCount: invoices.length,
                            onPageChange: setPage,
                            onPageSizeChange: (size) => {
                                setPageSize(size);
                                setPage(1);
                            },
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
