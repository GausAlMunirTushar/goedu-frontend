"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IdCard, Plus, Download, Printer, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdmitCardPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Admit Card</Title>
          <p className="text-sm text-muted-foreground mt-1">Generate, preview and distribute admit cards for students.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Generate Admit Cards
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search admit cards..." className="pl-9 h-9 text-sm" />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Admit Cards</CardTitle>
          <CardDescription className="text-xs">All generated admit cards for enrolled students.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-5">
              <IdCard className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold">No Admit Cards Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Generate admit cards by clicking the &quot;Generate Admit Cards&quot; button above. Students will receive their admit cards for upcoming examinations.
            </p>
            <Button size="sm" className="mt-6 gap-2">
              <Plus className="w-4 h-4" /> Generate First Admit Cards
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
