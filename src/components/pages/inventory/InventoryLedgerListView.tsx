"use client";

import { useInventoryStockTransactionsQuery } from "@/apis/queries/inventory_queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import type { StockTransactionData } from "./inventoryTypes";

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString() : "-";

export function InventoryLedgerListView() {
    const [search, setSearch] = React.useState("");
    const { data: response, isLoading } = useInventoryStockTransactionsQuery();
    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => rows.filter((item: StockTransactionData) => item.stockItem?.name?.toLowerCase().includes(search.toLowerCase()) || item.reference?.toLowerCase().includes(search.toLowerCase()) || item.type?.toLowerCase().includes(search.toLowerCase())), [rows, search]);
    const columns: ColumnDef<StockTransactionData>[] = [
        { header: "Date", cell: ({ row }) => formatDate(row.original.transactionDate) },
        { header: "Item", cell: ({ row }) => row.original.stockItem?.name || "-" },
        { accessorKey: "type", header: "Type" },
        { accessorKey: "quantity", header: "Qty" },
        { accessorKey: "previousQuantity", header: "Before" },
        { accessorKey: "newQuantity", header: "After" },
        { accessorKey: "reference", header: "Reference" },
        { header: "By", cell: ({ row }) => row.original.performedBy?.username || "-" },
    ];
    if (isLoading) return <TableSkeleton />;
    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100"><div><Title>Stock Ledger</Title><p className="text-xs text-muted-foreground mt-1">Immutable stock movement history.</p></div></CardHeader>
                <CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filteredRows} searchKey="type" searchPlaceholder="Search ledger..." searchValue={search} onSearch={setSearch} /></CardContent>
            </Card>
        </div>
    );
}
