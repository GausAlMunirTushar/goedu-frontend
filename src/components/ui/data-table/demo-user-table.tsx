"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 1. Define your data type
export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

// 2. Dummy data
const users: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "User" },
    { id: "3", name: "Charlie", email: "charlie@example.com", role: "Manager" },
    { id: "4", name: "David", email: "david@example.com", role: "User" },
    { id: "5", name: "Eva", email: "eva@example.com", role: "Admin" },
    { id: "6", name: "Frank", email: "frank@example.com", role: "User" },
    { id: "7", name: "Grace", email: "grace@example.com", role: "Manager" },
    { id: "8", name: "Hannah", email: "hannah@example.com", role: "User" },
    { id: "9", name: "Ian", email: "ian@example.com", role: "Admin" },
    { id: "10", name: "Jack", email: "jack@example.com", role: "User" },
    { id: "11", name: "Karen", email: "karen@example.com", role: "Manager" },
    { id: "12", name: "Leo", email: "leo@example.com", role: "User" },
    { id: "13", name: "Mona", email: "mona@example.com", role: "Admin" },
    { id: "14", name: "Nina", email: "nina@example.com", role: "User" },
    { id: "15", name: "Oscar", email: "oscar@example.com", role: "Manager" },
    { id: "16", name: "Paul", email: "paul@example.com", role: "User" },
    { id: "17", name: "Quinn", email: "quinn@example.com", role: "Admin" },
    { id: "18", name: "Rita", email: "rita@example.com", role: "User" },
    { id: "19", name: "Sam", email: "sam@example.com", role: "Manager" },
    { id: "20", name: "Tina", email: "tina@example.com", role: "User" },
    { id: "21", name: "Uma", email: "uma@example.com", role: "Admin" },
    { id: "22", name: "Vera", email: "vera@example.com", role: "User" },
    { id: "23", name: "Will", email: "will@example.com", role: "Manager" },
    { id: "24", name: "Xena", email: "xena@example.com", role: "User" },
    { id: "25", name: "Yara", email: "yara@example.com", role: "Admin" },
    { id: "26", name: "Zane", email: "zane@example.com", role: "User" },
    { id: "27", name: "Ava", email: "ava@example.com", role: "Manager" },
    { id: "28", name: "Ben", email: "ben@example.com", role: "User" },
    { id: "29", name: "Cara", email: "cara@example.com", role: "Admin" },
    { id: "30", name: "Duke", email: "duke@example.com", role: "User" },
    { id: "31", name: "Elle", email: "elle@example.com", role: "Manager" },
    { id: "32", name: "Finn", email: "finn@example.com", role: "User" },
    { id: "33", name: "Gina", email: "gina@example.com", role: "Admin" },
    { id: "34", name: "Hugo", email: "hugo@example.com", role: "User" },
    { id: "35", name: "Ivy", email: "ivy@example.com", role: "Manager" },
    { id: "36", name: "Jill", email: "jill@example.com", role: "User" },
    { id: "37", name: "Kyle", email: "kyle@example.com", role: "Admin" },
    { id: "38", name: "Lara", email: "lara@example.com", role: "User" },
    { id: "39", name: "Mick", email: "mick@example.com", role: "Manager" },
    { id: "40", name: "Nora", email: "nora@example.com", role: "User" },
    { id: "41", name: "Omar", email: "omar@example.com", role: "Admin" },
    { id: "42", name: "Pia", email: "pia@example.com", role: "User" },
    { id: "43", name: "Qadir", email: "qadir@example.com", role: "Manager" },
    { id: "44", name: "Rosa", email: "rosa@example.com", role: "User" },
    { id: "45", name: "Sven", email: "sven@example.com", role: "Admin" },
    { id: "46", name: "Tara", email: "tara@example.com", role: "User" },
    { id: "47", name: "Ugo", email: "ugo@example.com", role: "Manager" },
    { id: "48", name: "Vik", email: "vik@example.com", role: "User" },
    { id: "49", name: "Wren", email: "wren@example.com", role: "Admin" },
    { id: "50", name: "Yuri", email: "yuri@example.com", role: "User" },
];

// 3. Define columns
const userColumns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                            Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Send message</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

// 4. Demo Table Component
interface DemoUserTableProps {}

export default function DemoUserTable(props: DemoUserTableProps): React.JSX.Element {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(100);

    return (
        <div className="p-4 font-[inherit]">
            <h2 className="text-xl font-bold mb-4 font-[inherit]">User Table Demo</h2>
            <DataTable
                columns={userColumns}
                data={users}
                searchKey="email"
                searchPlaceholder="Filter by email..."
                pagination={{
                    page,
                    pageCount: Math.ceil(users.length / pageSize),
                    pageSize,
                    totalCount: users.length,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
            />
        </div>
    );
}
