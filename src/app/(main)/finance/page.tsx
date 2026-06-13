"use client";

import React from "react";
import { useFinanceAnalyticsQuery } from "@/apis/queries/finance_queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";

export default function FinanceDashboardPage() {
    const { data: res, isLoading } = useFinanceAnalyticsQuery();
    const stats = res?.data || { totalCollected: 0, outstanding: 0, monthlyCollection: 0, totalExpected: 0 };

    if (isLoading) return <div className="p-8">Loading finance dashboard...</div>;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Finance Overview</h1>
                <p className="text-muted-foreground text-sm">Monitor revenue collection and outstanding student fees.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Revenue Collected</CardTitle>
                        <Banknote className="w-4 h-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCollected.toLocaleString()} BDT</div>
                        <p className="text-xs text-muted-foreground mt-1">Lifetime collections</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Monthly Collection</CardTitle>
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.monthlyCollection.toLocaleString()} BDT</div>
                        <p className="text-xs text-muted-foreground mt-1">Collected this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Outstanding Dues</CardTitle>
                        <TrendingDown className="w-4 h-4 text-rose-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-600">{stats.outstanding.toLocaleString()} BDT</div>
                        <p className="text-xs text-muted-foreground mt-1">Unpaid student invoices</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalExpected.toLocaleString()} BDT</div>
                        <p className="text-xs text-muted-foreground mt-1">Overall generated invoices</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
