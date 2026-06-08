"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    columns?: number;
    rows?: number;
    showToolbar?: boolean;
    showPagination?: boolean;
};

export default function DataTableSkeleton({
    columns = 6,
    rows = 10,
    showToolbar = true,
    showPagination = true,
}: Props) {
    const gridTemplateColumns =
        columns <= 1
            ? `minmax(0, 1fr)`
            : columns === 2
              ? `auto 2fr`
              : `auto 2fr repeat(${Math.max(0, columns - 2)}, minmax(0, 1fr))`;

    return (
        <div className="w-full space-y-4 animate-pulse" aria-hidden>
            {/* Toolbar */}
            {showToolbar && (
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-full max-w-2xl">
                        <Skeleton className="h-10 w-64 rounded-md bg-gray-200 dark:bg-gray-700" />
                        <div className="hidden sm:flex gap-2">
                            <Skeleton className="h-8 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                            <Skeleton className="h-8 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-10 rounded-md bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-8 w-10 rounded-md bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-8 w-28 rounded-md bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            )}

            {/* Table container */}
            <div className="rounded-lg border bg-background overflow-hidden shadow-sm">
                {/* Header */}
                <div
                    className="grid border-b bg-muted/40 dark:bg-muted/30 px-4"
                    style={{ gridTemplateColumns }}
                >
                    {/* first header (checkbox or small) */}
                    <div className="p-4 flex items-center">
                        <Skeleton className="h-4 w-6 rounded-sm bg-gray-300 dark:bg-gray-600" />
                    </div>

                    {/* second header (primary) */}
                    <div className="p-4 flex items-center">
                        <Skeleton className="h-4 w-3/5 rounded-md bg-gray-300 dark:bg-gray-600" />
                    </div>

                    {/* remaining headers */}
                    {Array.from({ length: Math.max(0, columns - 2) }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center">
                            <Skeleton className="h-4 w-4/5 rounded-md bg-gray-300 dark:bg-gray-600" />
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div>
                    {Array.from({ length: rows }).map((_, r) => (
                        <div
                            key={r}
                            className={`grid border-b last:border-b-0 even:bg-transparent`}
                            style={{ gridTemplateColumns }}
                        >
                            {/* small cell (checkbox/avatar placeholder) */}
                            <div className="p-4 flex items-center">
                                <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                            </div>

                            {/* primary cell (two-line skeleton for title + subtitle) */}
                            <div className="p-4 flex flex-col justify-center gap-2">
                                <Skeleton className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
                                <Skeleton className="h-3 w-1/3 rounded-md bg-gray-200 dark:bg-gray-700" />
                            </div>

                            {/* remaining cells */}
                            {Array.from({ length: Math.max(0, columns - 2) }).map((_, c) => (
                                <div key={c} className="p-4 flex items-center">
                                    <Skeleton className="h-4 w-4/5 rounded-md bg-gray-200 dark:bg-gray-700" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {showPagination && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-36 rounded-md bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-9 rounded-md bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-9 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-9 w-9 rounded-md bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            )}
        </div>
    );
}
