"use client";

import React from "react";
import { useModalStore } from "@/stores/modalStore";
import { AcademicYearForm } from "@/components/pages/academic/academic-year/AcademicYearForm";
import { StudentIdCardModal } from "@/components/pages/student/StudentIdCardModal";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

export function GlobalModal() {
    const { isOpen, type, data, closeModal } = useModalStore();

    if (!isOpen || !type) return null;

    switch (type) {
        case "academic-year":
            return (
                <AcademicYearForm
                    mode={data?.mode || "create"}
                    initialData={data?.initialData}
                    isOpen={isOpen}
                    onClose={closeModal}
                    onSubmit={data?.onSubmit}
                    isLoading={data?.isLoading}
                />
            );

        case "student-id-card":
            return (
                <StudentIdCardModal
                    open={isOpen}
                    onOpenChange={(open) => {
                        if (!open) closeModal();
                    }}
                    studentId={data?.studentId}
                    studentName={data?.studentName}
                />
            );

        case "confirm-delete":
            return (
                <Dialog
                    open={isOpen && type === "confirm-delete"}
                    onOpenChange={(open) => {
                        if (!open) closeModal();
                    }}
                >
                    <DialogContent className="sm:max-w-[400px] bg-white rounded-xl overflow-hidden p-0 shadow-lg border-none">
                        <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-row items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <DialogTitle className="text-base font-bold text-slate-800">
                                {data?.title || "Confirm Delete"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {data?.description || "Are you sure you want to perform this delete action? This cannot be undone."}
                            </p>
                        </div>
                        <DialogFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-row gap-3 justify-end items-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeModal}
                                disabled={data?.isLoading}
                                className="text-slate-700 border-slate-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={async () => {
                                    if (data?.onConfirm) {
                                        try {
                                            await data.onConfirm();
                                        } catch (error) {
                                            console.error(error);
                                        }
                                    }
                                    closeModal();
                                }}
                                disabled={data?.isLoading}
                                className="bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1.5"
                            >
                                {data?.isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                                {data?.isLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );

        default:
            return null;
    }
}
