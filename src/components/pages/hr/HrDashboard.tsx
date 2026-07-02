"use client";

import { useHrDashboardQuery } from "@/apis/queries/hr_queries";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { CalendarCheck, ClipboardList, UserCheck, Users } from "lucide-react";

const stats = [
    { key: "staffCount", label: "Active Staff", icon: Users },
    { key: "pendingLeaves", label: "Pending Leaves", icon: ClipboardList },
    { key: "approvedLeaves", label: "Approved Leaves", icon: CalendarCheck },
    { key: "leaveTypes", label: "Leave Types", icon: UserCheck },
];

export function HrDashboard() {
    const { data: response, isLoading } = useHrDashboardQuery();
    const data = response?.data || {};
    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <div>
                <Title>HR</Title>
                <p className="text-xs text-muted-foreground mt-1">Manage staff attendance, leave types, applications, and approvals.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.key}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-semibold mt-1">{data[stat.key] || 0}</p>
                                </div>
                                <div className="h-10 w-10 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
