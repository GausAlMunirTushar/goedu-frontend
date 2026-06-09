"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3X3, Plus, Download, Printer, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SeatPlanPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Seat Plan</Title>
          <p className="text-sm text-muted-foreground mt-1">Manage and generate seating arrangements for examinations.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Create Seat Plan
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search seat plans..." className="pl-9 h-9 text-sm" />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Seat Plan List</CardTitle>
          <CardDescription className="text-xs">All generated seat plans for examinations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-5">
              <Grid3X3 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold">No Seat Plans Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Create your first seat plan by clicking the &quot;Create Seat Plan&quot; button above. Seat plans help organize student seating during examinations.
            </p>
            <Button size="sm" className="mt-6 gap-2">
              <Plus className="w-4 h-4" /> Create First Seat Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
