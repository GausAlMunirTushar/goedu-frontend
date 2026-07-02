"use client";

import { useTransportDashboardQuery } from "@/apis/queries/transport_queries";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { ClipboardList, MapPin, Truck, UserRound } from "lucide-react";

const statConfig = [
    { key: "vehicles", label: "Active Vehicles", icon: Truck },
    { key: "drivers", label: "Active Drivers", icon: UserRound },
    { key: "routes", label: "Active Routes", icon: MapPin },
    { key: "activeAssignments", label: "Assigned Students", icon: ClipboardList },
];

export function TransportDashboard() {
    const { data: response, isLoading } = useTransportDashboardQuery();
    const data = response?.data || {};

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <div>
                <Title>Transport</Title>
                <p className="text-xs text-muted-foreground mt-1">
                    Manage vehicles, drivers, routes, stops, and student transport assignments.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
                                <div className="h-10 w-10 rounded-md bg-cyan-50 text-cyan-700 flex items-center justify-center">
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
