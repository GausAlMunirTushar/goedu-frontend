"use client";

import React, { useState, useMemo } from "react";
import { useFeePaymentsQuery, useFeeInvoicesQuery } from "@/apis/queries/finance_queries";
import { financePaymentsUrl } from "@/apis/endpoints/finance_apis";
import axiosInstance from "@/apis/configs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Banknote, Search, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";

export default function PaymentCollectionPage() {
    const { data: res, isLoading, mutate } = useFeePaymentsQuery();
    const payments = res?.data || [];

    const { data: invRes, mutate: mutateInv } = useFeeInvoicesQuery();
    const allInvoices = invRes?.data || [];

    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const [searchInvoice, setSearchInvoice] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [paymentData, setPaymentData] = useState({ amount: "", paymentMethod: "Cash", remarks: "" });

    // Pagination and Search state for DataTable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const pageCount = Math.ceil(payments.length / pageSize) || 1;
    const paginatedData = useMemo(() => {
      return payments.slice((page - 1) * pageSize, page * pageSize);
    }, [payments, page, pageSize]);

    const handleSearch = () => {
        const found = allInvoices.find((i: any) => i.invoiceNumber.toLowerCase() === searchInvoice.toLowerCase());
        if (found) {
            setSelectedInvoice(found);
            // Calculate remaining amount
            const paid = found.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
            setPaymentData({ ...paymentData, amount: (found.amount - paid).toString() });
        } else {
            toast.error("Invoice not found");
        }
    };

    const handleCollect = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post(financePaymentsUrl, {
                invoiceId: selectedInvoice.id,
                amount: parseFloat(paymentData.amount),
                paymentMethod: paymentData.paymentMethod,
                remarks: paymentData.remarks
            });
            toast.success("Payment recorded successfully!");
            setIsCollectionOpen(false);
            setSelectedInvoice(null);
            setSearchInvoice("");
            mutate();
            mutateInv();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Payment failed");
        }
    };

    const columns: ColumnDef<any>[] = [
      { accessorKey: "paymentId", header: "Transaction ID" },
      {
        header: "Date & Time",
        accessorFn: (row) => new Date(row.paymentDate).toLocaleString(),
        id: "paymentDate",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            {new Date(row.original.paymentDate).toLocaleString()}
          </div>
        )
      },
      {
        header: "Invoice Ref",
        accessorFn: (row) => row.invoice?.invoiceNumber || "N/A",
        id: "invoiceRef",
      },
      { accessorKey: "paymentMethod", header: "Method" },
      {
        header: "Amount",
        accessorFn: (row) => `+${row.amount.toLocaleString()} BDT`,
        id: "amount",
        cell: ({ row }) => (
          <div className="font-bold text-emerald-600">
            +{row.original.amount.toLocaleString()} BDT
          </div>
        )
      },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Payment Collection</h1>
                    <p className="text-muted-foreground text-sm">Process student fee payments and view transaction history.</p>
                </div>

                <Dialog open={isCollectionOpen} onOpenChange={setIsCollectionOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg"><Banknote className="w-5 h-5 mr-2" /> Collect Payment</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Process Payment</DialogTitle>
                        </DialogHeader>
                        
                        {!selectedInvoice ? (
                            <div className="flex gap-2 pt-4">
                                <Input 
                                    placeholder="Enter Invoice Number..." 
                                    value={searchInvoice} 
                                    onChange={e => setSearchInvoice(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                />
                                <Button onClick={handleSearch}><Search className="w-4 h-4" /></Button>
                            </div>
                        ) : (
                            <form onSubmit={handleCollect} className="space-y-4 pt-4">
                                <div className="p-4 bg-muted rounded-lg space-y-2">
                                    <div className="flex justify-between font-bold">
                                        <span>{selectedInvoice.invoiceNumber}</span>
                                        <span>{selectedInvoice.category?.name}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {selectedInvoice.student?.firstName} {selectedInvoice.student?.lastName}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Paying Amount (BDT)</label>
                                    <Input required type="number" value={paymentData.amount} onChange={e => setPaymentData({...paymentData, amount: e.target.value})} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Payment Method</label>
                                    <select 
                                        className="w-full border p-2 rounded-md"
                                        value={paymentData.paymentMethod}
                                        onChange={e => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Online">Online Gateway</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Remarks (Optional)</label>
                                    <Input value={paymentData.remarks} onChange={e => setPaymentData({...paymentData, remarks: e.target.value})} placeholder="Check number, notes, etc." />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button type="button" variant="outline" className="w-1/3" onClick={() => setSelectedInvoice(null)}>Cancel</Button>
                                    <Button type="submit" className="w-2/3">Confirm Payment</Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        searchKey="paymentId"
                        searchValue={search}
                        onSearch={(val) => { setSearch(val); setPage(1); }}
                        searchPlaceholder="Search by transaction ID..."
                        isLoading={isLoading}
                        pagination={{
                            page,
                            pageCount,
                            pageSize,
                            totalCount: payments.length,
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
