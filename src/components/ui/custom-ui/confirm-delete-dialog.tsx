"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

const ConfirmDeleteDialog = ({
    open,
    onOpenChange,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    isLoading = false,
}: ConfirmDeleteDialogProps) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />

                <AlertDialog.Content
                    className="
                        fixed left-1/2 top-1/2 z-50
                        w-[90vw] max-w-md
                        -translate-x-1/2 -translate-y-1/2
                        rounded-xl border bg-background p-6 shadow-lg font-[inherit]
                    "
                >
                    <AlertDialog.Title className="text-lg font-semibold font-[inherit]">
                        {title}
                    </AlertDialog.Title>

                    <AlertDialog.Description className="mt-2 text-sm text-muted-foreground font-[inherit]">
                        {description}
                    </AlertDialog.Description>

                    <div className="mt-6 flex justify-end gap-2">
                        <AlertDialog.Cancel asChild>
                            <Button variant="outline">{cancelText}</Button>
                        </AlertDialog.Cancel>

                        <AlertDialog.Action asChild>
                            <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                                {isLoading ? "Deleting..." : confirmText}
                            </Button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};

export default ConfirmDeleteDialog;
