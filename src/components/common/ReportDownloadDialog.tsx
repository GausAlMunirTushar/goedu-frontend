"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Download, FileText, RefreshCw, X, XCircle } from "lucide-react";
import { AxiosAPI } from "@/apis/configs";

// ─── Types ────────────────────────────────────────────────────────────────────

type DownloadStatus = "idle" | "requesting" | "downloading" | "done" | "error";

interface DownloadState {
    status: DownloadStatus;
    /** 0-100 for determinate, -1 for indeterminate */
    progress: number;
    filename: string;
    error: string;
}

export interface ReportDownloadDialogProps {
    open: boolean;
    url: string;
    reportType: string;
    onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MIME_TO_EXT: Record<string, string> = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel": "xls",
    "text/csv": "csv",
    "application/csv": "csv",
};

function getExtension(contentType: string): string {
    return MIME_TO_EXT[contentType.split(";")[0].trim()] ?? "bin";
}

function parseFilename(
    disposition: string | undefined,
    contentType: string,
    reportType: string,
): string {
    if (disposition) {
        // RFC 5987: filename*=UTF-8''encoded-name
        const utf8Match = disposition.match(/filename\*=UTF-8''([^\s;]+)/i);
        if (utf8Match) {
            try {
                return decodeURIComponent(utf8Match[1]);
            } catch {
                /* fall through */
            }
        }
        // Standard: filename="name.ext" or filename=name.ext
        const basicMatch = disposition.match(/filename="?([^";\r\n]+)"?/i);
        if (basicMatch) return basicMatch[1].trim();
    }
    const ext = getExtension(contentType);
    return `${reportType.replace(/\s+/g, "_")}_report.${ext}`;
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    // Defer revoke so browser has time to start the download
    setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
}

async function readBlobError(blob: Blob): Promise<string | null> {
    try {
        const text = await blob.text();
        const json = JSON.parse(text);
        return json.message ?? json.detail ?? null;
    } catch {
        return null;
    }
}

const INITIAL_STATE: DownloadState = {
    status: "idle",
    progress: 0,
    filename: "",
    error: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

const ReportDownloadDialog: React.FC<ReportDownloadDialogProps> = ({
    open,
    url,
    reportType,
    onClose,
}) => {
    const [state, setState] = useState<DownloadState>(INITIAL_STATE);
    const abortRef = useRef<AbortController | null>(null);

    // ── Core download logic ────────────────────────────────────────────────────
    const startDownload = useCallback(async () => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setState({ status: "requesting", progress: 0, filename: "", error: "" });

        try {
            const response = await AxiosAPI.get(url, {
                responseType: "blob",
                signal: abortRef.current.signal,
                onDownloadProgress: (evt) => {
                    if (evt.total && evt.total > 0) {
                        const pct = Math.min(Math.round((evt.loaded / evt.total) * 100), 99);
                        setState((prev) => ({ ...prev, status: "downloading", progress: pct }));
                    } else {
                        // Server did not send Content-Length → indeterminate
                        setState((prev) => ({ ...prev, status: "downloading", progress: -1 }));
                    }
                },
            });

            const contentType =
                (response.headers["content-type"] as string | undefined) ??
                "application/octet-stream";
            const blob = new Blob([response.data], { type: contentType });
            const filename = parseFilename(
                response.headers["content-disposition"] as string | undefined,
                contentType,
                reportType,
            );

            triggerBrowserDownload(blob, filename);
            setState({ status: "done", progress: 100, filename, error: "" });
        } catch (err: any) {
            // Cancelled by user — silently ignore
            if (err.name === "CanceledError" || err.name === "AbortError") return;

            let message = "An unexpected error occurred. Please try again.";

            if (err.response) {
                const serverMessage = await readBlobError(err.response.data as Blob);
                if (serverMessage) {
                    message = serverMessage;
                } else {
                    switch (err.response.status) {
                        case 403:
                            message = "You don't have permission to download this report.";
                            break;
                        case 404:
                            message = "Report not found. Please try again later.";
                            break;
                        default:
                            if (err.response.status >= 500) {
                                message = "Server error. Please try again later.";
                            }
                    }
                }
            } else if (
                err.code === "ECONNABORTED" ||
                err.message?.toLowerCase().includes("timeout")
            ) {
                message = "Request timed out. Please check your connection and try again.";
            } else if (typeof navigator !== "undefined" && !navigator.onLine) {
                message = "No internet connection. Please check your network.";
            }

            setState({ status: "error", progress: 0, filename: "", error: message });
        }
    }, [url, reportType]);

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (open) {
            setState(INITIAL_STATE);
            startDownload();
        }
        return () => {
            abortRef.current?.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleCancel = useCallback(() => {
        abortRef.current?.abort();
        onClose();
    }, [onClose]);

    const isInProgress = state.status === "requesting" || state.status === "downloading";

    // Block closing via Escape / overlay click while download is running
    const handleOpenChange = useCallback(
        (next: boolean) => {
            if (!next && isInProgress) return;
            if (!next) onClose();
        },
        [isInProgress, onClose],
    );

    // ── Derived booleans for readability ──────────────────────────────────────
    const isDone = state.status === "done";
    const isError = state.status === "error";
    const isIndeterminate = state.status === "requesting" || state.progress < 0;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Keyframe for indeterminate sliding bar */}
            <style>{`
                @keyframes ums-slide {
                    0%   { transform: translateX(-100%); }
                    50%  { transform: translateX(100%); }
                    100% { transform: translateX(300%); }
                }
                .ums-indeterminate {
                    animation: ums-slide 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>

            <AlertDialog open={open} onOpenChange={handleOpenChange}>
                {/* AlertDialog by design blocks outside clicks and Escape — no extra handlers needed */}
                <AlertDialogContent className="max-w-md gap-5">
                    {/* ── Header ─────────────────────────────────────────── */}
                    <AlertDialogHeader className="gap-0">
                        <div className="flex items-center gap-3">
                            {isDone ? (
                                <CheckCircle2
                                    className="size-6 text-green-500 shrink-0"
                                    aria-hidden="true"
                                />
                            ) : isError ? (
                                <XCircle
                                    className="size-6 text-destructive shrink-0"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Download
                                    className="size-6 text-primary shrink-0 animate-bounce"
                                    aria-hidden="true"
                                />
                            )}

                            <AlertDialogTitle>
                                {isDone
                                    ? "Download Complete"
                                    : isError
                                      ? "Download Failed"
                                      : "Downloading Report"}
                            </AlertDialogTitle>
                        </div>

                        <AlertDialogDescription className="mt-2 ml-9">
                            {state.status === "requesting" ? (
                                "Preparing your report, please wait…"
                            ) : state.status === "downloading" ? (
                                <>
                                    Downloading{" "}
                                    <span className="font-medium text-foreground">
                                        {reportType}
                                    </span>{" "}
                                    report…
                                </>
                            ) : isDone ? (
                                <>
                                    <span className="font-medium text-foreground break-all">
                                        {state.filename}
                                    </span>{" "}
                                    has been saved to your downloads folder.
                                </>
                            ) : (
                                state.error
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* ── Progress area ───────────────────────────────────── */}
                    <div className="space-y-2" role="region" aria-label="Download progress">
                        {/* Report type label + percentage */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="size-4 shrink-0" aria-hidden="true" />
                            <span className="font-medium truncate">{reportType}</span>

                            {state.status === "downloading" && state.progress >= 0 && (
                                <span
                                    className="ml-auto tabular-nums font-mono text-xs"
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {state.progress}%
                                </span>
                            )}
                        </div>

                        {/* Progress track */}
                        <div
                            className="relative h-2 w-full overflow-hidden rounded-full bg-secondary"
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={isIndeterminate || isError ? undefined : state.progress}
                            aria-label={
                                isIndeterminate
                                    ? "Download in progress"
                                    : isError
                                      ? "Download failed"
                                      : `Download progress: ${state.progress}%`
                            }
                        >
                            {isError ? (
                                <div className="h-full w-full bg-destructive/40 rounded-full" />
                            ) : isDone ? (
                                <div className="h-full w-full bg-green-500 rounded-full transition-all duration-500" />
                            ) : isIndeterminate ? (
                                /* Sliding indeterminate bar */
                                <div className="absolute inset-y-0 left-0 w-1/3 bg-primary rounded-full ums-indeterminate" />
                            ) : (
                                /* Determinate bar */
                                <div
                                    className={cn(
                                        "h-full bg-primary rounded-full transition-all duration-300 ease-out",
                                        state.progress >= 99 && "bg-green-500",
                                    )}
                                    style={{ width: `${state.progress}%` }}
                                />
                            )}
                        </div>

                        {/* Status caption */}
                        <p
                            className="text-xs text-muted-foreground h-4"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {state.status === "requesting" && "Generating report…"}
                            {state.status === "downloading" &&
                                (state.progress >= 0
                                    ? `${state.progress}% downloaded`
                                    : "Downloading…")}
                            {isDone && `Saved as: ${state.filename}`}
                        </p>
                    </div>

                    {/* ── Footer ─────────────────────────────────────────── */}
                    <AlertDialogFooter>
                        {isError && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={startDownload}
                                className="gap-1.5"
                            >
                                <RefreshCw className="size-3.5" aria-hidden="true" />
                                Retry
                            </Button>
                        )}

                        <Button
                            variant={isDone ? "default" : "outline"}
                            size="sm"
                            onClick={isInProgress ? handleCancel : onClose}
                            className="gap-1.5"
                        >
                            {isInProgress ? (
                                <>
                                    <X className="size-3.5" aria-hidden="true" />
                                    Cancel
                                </>
                            ) : isDone ? (
                                "Done"
                            ) : (
                                "Close"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ReportDownloadDialog;
