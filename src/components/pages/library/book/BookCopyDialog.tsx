"use client";

import { AxiosAPI } from "@/apis/configs";
import { libraryBookCopiesUrl, libraryCopyStatusUrl } from "@/apis/endpoints/library_apis";
import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { LibraryBookData } from "./LibraryBookListView";

interface CopyFormData {
    accessionNumber: string;
    barcode?: string;
    status: string;
}

interface Props {
    book?: LibraryBookData;
    isOpen: boolean;
    onClose: () => void;
    onChanged: () => void;
}

const copyStatuses = ["Available", "Issued", "Lost", "Damaged", "Inactive"];

export function BookCopyDialog({ book, isOpen, onClose, onChanged }: Props) {
    const [saving, setSaving] = React.useState(false);
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<CopyFormData>({
        defaultValues: { accessionNumber: "", barcode: "", status: "Available" },
    });

    React.useEffect(() => {
        if (isOpen) reset({ accessionNumber: "", barcode: "", status: "Available" });
    }, [isOpen, reset]);

    const handleAddCopy = async (data: CopyFormData) => {
        if (!book?.id) return;
        setSaving(true);
        try {
            await AxiosAPI.post(libraryBookCopiesUrl(book.id), {
                copies: [{
                    accessionNumber: data.accessionNumber,
                    barcode: data.barcode || undefined,
                    status: data.status,
                }],
            });
            toast.success("Copy added");
            reset({ accessionNumber: "", barcode: "", status: "Available" });
            onChanged();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Copy add failed");
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (copyId: string, status: string) => {
        try {
            await AxiosAPI.put(libraryCopyStatusUrl(copyId), { status });
            toast.success("Copy status updated");
            onChanged();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Status update failed");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[820px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        Copies: {book?.title || "Book"}
                    </DialogTitle>
                </DialogHeader>
                <div className="px-6 py-4 space-y-4">
                    <form onSubmit={handleSubmit(handleAddCopy)} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_180px_auto] gap-3 items-end">
                        <FormInput
                            id="accessionNumber"
                            label="Accession Number"
                            placeholder="ACC-0001"
                            required
                            error={errors.accessionNumber?.message}
                            {...register("accessionNumber", { required: "Accession number is required" })}
                        />
                        <FormInput id="barcode" label="Barcode" placeholder="Optional barcode" {...register("barcode")} />
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <SelectInput
                                    label="Status"
                                    showNoneOption={false}
                                    options={copyStatuses.map((status) => ({ value: status, label: status }))}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Button type="submit" disabled={saving}>{saving ? "Adding..." : "Add Copy"}</Button>
                    </form>

                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="text-left px-3 py-2">Accession</th>
                                    <th className="text-left px-3 py-2">Barcode</th>
                                    <th className="text-left px-3 py-2 w-48">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(book?.copies || []).map((copy: any) => (
                                    <tr key={copy.id} className="border-t">
                                        <td className="px-3 py-2 font-medium">{copy.accessionNumber}</td>
                                        <td className="px-3 py-2 text-muted-foreground">{copy.barcode || "-"}</td>
                                        <td className="px-3 py-2">
                                            <SelectInput
                                                showNoneOption={false}
                                                options={copyStatuses.map((status) => ({ value: status, label: status }))}
                                                value={copy.status}
                                                onChange={(status) => handleStatusChange(copy.id, status)}
                                                disabled={copy.status === "Issued"}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {!book?.copies?.length && (
                                    <tr>
                                        <td colSpan={3} className="px-3 py-8 text-center text-muted-foreground">
                                            No copies added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <DialogFooter className="flex flex-row gap-3 justify-end items-center bg-slate-50 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                    <Button type="button" variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
