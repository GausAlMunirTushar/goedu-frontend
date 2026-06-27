import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function TableSkeleton() {
  return (
    <div className="p-2 space-y-4">
      <Card>
        <CardHeader className="bg-white border-b border-gray-100 pb-3">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-3.5 w-80" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Skeleton className="h-9 w-full sm:w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white rounded-b-xl pt-3 space-y-4">
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
            <Skeleton className="h-9 w-60" />
            <Skeleton className="h-9 w-20" />
          </div>
          <div className="space-y-3">
            <div className="flex gap-4">
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 w-20" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center py-2 border-b border-slate-50">
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
