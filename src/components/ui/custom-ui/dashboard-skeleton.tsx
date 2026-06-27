import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="p-2 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-white pb-4 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="shadow-sm border border-slate-100">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Enrollment */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-slate-100 pb-3 space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-end justify-between gap-4 h-48 pt-6 px-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center flex-1 space-y-2">
                  <Skeleton className="w-full bg-slate-100 rounded-t" style={{ height: `${20 + i * 15}%` }} />
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admissions & Room capacity */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Navigation Setup */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-3 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 h-full">
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                <div className="space-y-1.5 w-full">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
