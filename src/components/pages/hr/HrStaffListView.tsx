"use client";

import { useHrStaffQuery } from "@/apis/queries/hr_queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

function fullName(user: any) {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
}

export function HrStaffListView() {
    const [search, setSearch] = React.useState("");
    const { data, isLoading } = useHrStaffQuery();
    const rows = React.useMemo(() => {
        const source = data?.data || [];
        const keyword = search.toLowerCase();
        return source.filter((item: any) =>
            fullName(item).toLowerCase().includes(keyword) ||
            item.username?.toLowerCase().includes(keyword) ||
            item.phone?.toLowerCase().includes(keyword),
        );
    }, [data, search]);

    const columns: ColumnDef<any>[] = [
        { header: "Staff", cell: ({ row }) => <div><p className="font-medium">{fullName(row.original)}</p><p className="text-xs text-muted-foreground">{row.original.username}</p></div> },
        { accessorKey: "phone", header: "Phone" },
        { accessorKey: "email", header: "Email" },
        { header: "Role", cell: ({ row }) => row.original.role?.name || "-" },
        { header: "Department", cell: ({ row }) => row.original.department?.name || "-" },
        { header: "Designation", cell: ({ row }) => row.original.designation?.title || "-" },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b">
                    <div>
                        <Title>Staff Directory</Title>
                        <p className="text-xs text-muted-foreground mt-1">View active institution staff and role assignments.</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={rows} searchKey="staff" searchPlaceholder="Search staff..." searchValue={search} onSearch={setSearch} />
                </CardContent>
            </Card>
        </div>
    );
}
