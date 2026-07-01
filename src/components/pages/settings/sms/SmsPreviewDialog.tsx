"use client";

import type { SmsPreview, SmsSendPayload } from "@/apis/types/sms_type";
import { previewSms, sendSms } from "@/apis/mutations/sms_mutations";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SmsPreviewDialogProps {
    open: boolean;
    payload: SmsSendPayload | null;
    onOpenChange: (open: boolean) => void;
    onSent?: () => void;
}

export function SmsPreviewDialog({ open, payload, onOpenChange, onSent }: SmsPreviewDialogProps) {
    const [preview, setPreview] = useState<SmsPreview | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (!open || !payload) return;

        setIsLoading(true);
        setPreview(null);
        previewSms(payload)
            .then((response) => setPreview(response.data.data))
            .catch((error) => toast.error(error.response?.data?.message || "Failed to preview SMS"))
            .finally(() => setIsLoading(false));
    }, [open, payload]);

    const handleSend = async () => {
        if (!payload) return;
        setIsSending(true);
        try {
            await sendSms(payload);
            toast.success("SMS send completed");
            onOpenChange(false);
            onSent?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send SMS");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl bg-white">
                <DialogHeader>
                    <DialogTitle>SMS Preview</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                        Preparing preview...
                    </div>
                ) : preview ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                            <div className="rounded-md border p-3">
                                <p className="text-xs text-muted-foreground">Balance</p>
                                <p className="text-lg font-bold">{preview.wallet.balance}</p>
                            </div>
                            <div className="rounded-md border p-3">
                                <p className="text-xs text-muted-foreground">Estimated</p>
                                <p className="text-lg font-bold">{preview.estimatedCredits}</p>
                            </div>
                            <div className="rounded-md border p-3">
                                <p className="text-xs text-muted-foreground">Valid</p>
                                <p className="text-lg font-bold">{preview.validRecipients}</p>
                            </div>
                            <div className="rounded-md border p-3">
                                <p className="text-xs text-muted-foreground">Skipped</p>
                                <p className="text-lg font-bold">{preview.skippedRecipients}</p>
                            </div>
                            <div className="rounded-md border p-3">
                                <p className="text-xs text-muted-foreground">Status</p>
                                <Badge variant={preview.canSend ? "default" : "destructive"}>
                                    {preview.canSend ? "Ready" : "Blocked"}
                                </Badge>
                            </div>
                        </div>

                        <div className="max-h-72 overflow-auto rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/60 text-left">
                                    <tr>
                                        <th className="p-2">Recipient</th>
                                        <th className="p-2">Number</th>
                                        <th className="p-2">Units</th>
                                        <th className="p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.recipients.map((recipient, index) => (
                                        <tr
                                            key={`${recipient.originalNumber}-${index}`}
                                            className="border-t"
                                        >
                                            <td className="p-2">{recipient.name || "Custom"}</td>
                                            <td className="p-2">
                                                {recipient.normalizedNumber ||
                                                    recipient.originalNumber}
                                            </td>
                                            <td className="p-2">{recipient.units}</td>
                                            <td className="p-2">
                                                <Badge
                                                    variant={
                                                        recipient.status === "valid"
                                                            ? "outline"
                                                            : "destructive"
                                                    }
                                                >
                                                    {recipient.status === "valid"
                                                        ? "Valid"
                                                        : "Skipped"}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                        No preview available.
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSending}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={!preview?.canSend || isSending}>
                        {isSending ? "Sending..." : "Send SMS"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
