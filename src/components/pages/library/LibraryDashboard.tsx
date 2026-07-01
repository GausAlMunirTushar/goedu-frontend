"use client";

import { useLibraryDashboardQuery } from "@/apis/queries/library_queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { BookOpen, CheckCircle2, Clock, Copy, Repeat, WalletCards } from "lucide-react";

const statConfig = [
    { key: "totalBooks", label: "Total Books", icon: BookOpen },
    { key: "totalCopies", label: "Total Copies", icon: Copy },
    { key: "availableCopies", label: "Available Copies", icon: CheckCircle2 },
    { key: "issuedCopies", label: "Issued Copies", icon: Repeat },
    { key: "overdueIssues", label: "Overdue Issues", icon: Clock },
    { key: "collectedFines", label: "Collected Fines", icon: WalletCards },
];

export function LibraryDashboard() {
    const { data: response, isLoading } = useLibraryDashboardQuery();
    const data = response?.data || {};
    const settings = data.settings || {};

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <div>
                <Title>Library</Title>
                <p className="text-xs text-muted-foreground mt-1">
                    Track books, accession copies, student issues, returns, and fines.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {statConfig.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.key}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-semibold text-slate-900 mt-1">
                                        {data[stat.key] ?? 0}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Current Lending Rules</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="rounded-md border p-3">
                        <p className="text-muted-foreground">Loan Days</p>
                        <p className="text-lg font-semibold">{settings.loanDays ?? 14}</p>
                    </div>
                    <div className="rounded-md border p-3">
                        <p className="text-muted-foreground">Max Active Issues</p>
                        <p className="text-lg font-semibold">{settings.maxActiveIssues ?? 3}</p>
                    </div>
                    <div className="rounded-md border p-3">
                        <p className="text-muted-foreground">Fine Per Day</p>
                        <p className="text-lg font-semibold">{settings.finePerDay ?? 5}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
