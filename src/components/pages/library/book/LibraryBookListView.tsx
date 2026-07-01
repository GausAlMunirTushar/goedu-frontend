"use client";

import { AxiosAPI } from "@/apis/configs";
import { libraryBookDetailUrl, libraryBooksUrl } from "@/apis/endpoints/library_apis";
import {
    useLibraryBooksQuery,
    useLibraryCategoriesQuery,
    useLibraryShelvesQuery,
} from "@/apis/queries/library_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { BookCopyDialog } from "./BookCopyDialog";
import { LibraryBookForm } from "./LibraryBookForm";

export interface LibraryBookData {
    id?: string;
    title: string;
    isbn?: string;
    author: string;
    publisher?: string;
    edition?: string;
    subject?: string;
    categoryId?: string;
    shelfId?: string;
    category?: any;
    shelf?: any;
    copies?: any[];
    totalCopies?: number;
    availableCopies?: number;
    status: string;
}

export function LibraryBookListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isCopyOpen, setIsCopyOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<LibraryBookData>();
    const [selectedBook, setSelectedBook] = React.useState<LibraryBookData>();
    const [isSaving, setIsSaving] = React.useState(false);

    const { data: response, isLoading, mutate } = useLibraryBooksQuery();
    const { data: categoryResponse } = useLibraryCategoriesQuery();
    const { data: shelfResponse } = useLibraryShelvesQuery();
    const categories = categoryResponse?.data || [];
    const shelves = shelfResponse?.data || [];

    const rows = React.useMemo(() => response?.data || [], [response]);
    const filteredRows = React.useMemo(() => {
        return rows.filter((item: LibraryBookData) =>
            item.title?.toLowerCase().includes(search.toLowerCase()) ||
            item.author?.toLowerCase().includes(search.toLowerCase()) ||
            item.isbn?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [rows, search]);

    React.useEffect(() => {
        if (selectedBook?.id) {
            const refreshed = rows.find((item: LibraryBookData) => item.id === selectedBook.id);
            if (refreshed) setSelectedBook(refreshed);
        }
    }, [rows, selectedBook?.id]);

    const normalizePayload = (data: LibraryBookData) => ({
        title: data.title,
        isbn: data.isbn || undefined,
        author: data.author,
        publisher: data.publisher || undefined,
        edition: data.edition || undefined,
        subject: data.subject || undefined,
        categoryId: data.categoryId || undefined,
        shelfId: data.shelfId || undefined,
        status: data.status,
    });

    const handleSubmit = async (formData: LibraryBookData) => {
        setIsSaving(true);
        try {
            const res = formMode === "create"
                ? await AxiosAPI.post(libraryBooksUrl, normalizePayload(formData))
                : await AxiosAPI.put(libraryBookDetailUrl(formData.id!), normalizePayload(formData));
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Book created" : "Book updated");
                mutate();
                setIsFormOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        openModal("confirm-delete", {
            title: "Delete book",
            description: "This book and its inactive library record will be removed from active catalog lists.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(libraryBookDetailUrl(id));
                    toast.success("Book deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<LibraryBookData>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.title}</p>
                    <p className="text-xs text-muted-foreground">{row.original.subject || row.original.publisher || "-"}</p>
                </div>
            ),
        },
        { accessorKey: "author", header: "Author" },
        { accessorKey: "isbn", header: "ISBN" },
        { header: "Category", cell: ({ row }) => row.original.category?.name || "-" },
        { header: "Shelf", cell: ({ row }) => row.original.shelf?.name || "-" },
        { accessorKey: "totalCopies", header: "Total" },
        { accessorKey: "availableCopies", header: "Available" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {row.original.status}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedBook(row.original);
                            setIsCopyOpen(true);
                        }}
                    >
                        <Copy className="h-4 w-4 mr-1" /> Copies
                    </Button>
                    <TableActions
                        onEdit={() => {
                            setFormMode("edit");
                            setEditingData({
                                ...row.original,
                                categoryId: row.original.categoryId || row.original.category?.id || "",
                                shelfId: row.original.shelfId || row.original.shelf?.id || "",
                            });
                            setIsFormOpen(true);
                        }}
                        onDelete={() => handleDelete(row.original.id!)}
                    />
                </div>
            ),
        },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Books</Title>
                            <p className="text-xs text-muted-foreground mt-1">Maintain catalog records and accession-level physical copies.</p>
                        </div>
                        <Button onClick={() => {
                            setFormMode("create");
                            setEditingData(undefined);
                            setIsFormOpen(true);
                        }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Book
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl">
                    <DataTable
                        columns={columns}
                        data={filteredRows}
                        searchKey="title"
                        searchPlaceholder="Search books..."
                        searchValue={search}
                        onSearch={setSearch}
                    />
                </CardContent>
            </Card>

            <LibraryBookForm
                mode={formMode}
                initialData={editingData}
                categories={categories}
                shelves={shelves}
                isOpen={isFormOpen}
                isSubmitting={isSaving}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
            />
            <BookCopyDialog
                book={selectedBook}
                isOpen={isCopyOpen}
                onClose={() => setIsCopyOpen(false)}
                onChanged={mutate}
            />
        </div>
    );
}
