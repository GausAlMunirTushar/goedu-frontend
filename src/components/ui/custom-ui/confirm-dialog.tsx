"use client";

import React, { useCallback, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Info, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    isLoading?: boolean;
    /**
     * Called when user confirms. Can be async.
     * If the promise resolves, dialog will close automatically.
     * If it throws, dialog will remain open (caller may show toast).
     */
    onConfirm: () => Promise<void> | void;
    confirmText?: string;
    cancelText?: string;
    /**
     * If true, the cancel button is not rendered.
     */
    hideCancel?: boolean;
    /**
     * Optional icon or node to show alongside confirm button.
     */
    confirmIcon?: React.ReactNode;
    /**
     * Optional icon or node to show alongside cancel button.
     */
    cancelIcon?: React.ReactNode;
    /**
     * Optional icon or node to show in the dialog header (left of title).
     * If not provided, a default icon is shown (warning for destructive, info otherwise).
     */
    dialogIcon?: React.ReactNode;
    /**
     * Optional className for the content wrapper
     */
    className?: string;
    /**
     * When true, confirm button uses destructive styling by default
     */
    destructive?: boolean;
    /**
     * Disable closing dialog automatically on confirm (caller will control open state)
     */
    keepOpenOnConfirm?: boolean;
}

const ConfirmDeleteDialog = ({
    open,
    onOpenChange,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    hideCancel = false,
    confirmIcon,
    cancelIcon,
    dialogIcon,
    className = "",
    destructive = false,
    keepOpenOnConfirm = false,
}: ConfirmDialogProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = useCallback(async () => {
        try {
            setIsProcessing(true);
            await onConfirm();
            if (!keepOpenOnConfirm) onOpenChange(false);
        } catch (err) {
            // let caller handle errors (e.g. toast) — keep dialog open
            console.error("[ConfirmDialog] confirm error:", err);
        } finally {
            setIsProcessing(false);
        }
    }, [onConfirm, onOpenChange, keepOpenOnConfirm]);

    const headerIcon =
        dialogIcon ??
        (destructive ? (
            <AlertTriangle className="w-6 h-6 text-destructive" />
        ) : (
            <Info className="w-6 h-6 text-primary" />
        ));

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className={className}>
                <AlertDialogHeader>
                    <div className="flex items-start gap-3">
                        <div className="mt-1">{headerIcon}</div>
                        <div className="min-w-0">
                            <AlertDialogTitle>{title}</AlertDialogTitle>
                            {description ? (
                                <AlertDialogDescription className="mt-2">
                                    {description}
                                </AlertDialogDescription>
                            ) : null}
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    {!hideCancel && (
                        <AlertDialogCancel disabled={isProcessing}>
                            {cancelIcon ? <span className="mr-2">{cancelIcon}</span> : null}
                            {cancelText}
                        </AlertDialogCancel>
                    )}

                    <AlertDialogAction asChild>
                        <Button
                            variant={destructive ? "destructive" : "default"}
                            onClick={handleConfirm}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                "Processing..."
                            ) : (
                                <>
                                    {confirmIcon ? (
                                        <span className="mr-2">{confirmIcon}</span>
                                    ) : null}
                                    {confirmText}
                                </>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmDeleteDialog;
