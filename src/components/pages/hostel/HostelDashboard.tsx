"use client";

import { useHostelDashboardQuery } from "@/apis/queries/hostel_queries";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { Building2, CheckCircle2, DoorOpen, UserRoundCheck, Users, WalletCards } from "lucide-react";

const statConfig = [
    { key: "hostels", label: "Active Hostels", icon: Building2 },
    { key: "rooms", label: "Active Rooms", icon: DoorOpen },
    { key: "beds", label: "Total Beds", icon: WalletCards },
    { key: "availableBeds", label: "Available Beds", icon: CheckCircle2 },
    { key: "activeAllocations", label: "Residents", icon: Users },
    { key: "activeLeaves", label: "On Leave Today", icon: UserRoundCheck },
];

export function HostelDashboard() {
    const { data: response, isLoading } = useHostelDashboardQuery();
    const data = response?.data || {};

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <div>
                <Title>Hostel</Title>
                <p className="text-xs text-muted-foreground mt-1">
                    Manage residential hostels, rooms, beds, allocations, leave-out records, and occupancy.
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
                                <div className="h-10 w-10 rounded-md bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Occupancy Rate</p>
                            <p className="text-xs text-muted-foreground mt-1">Occupied beds compared with usable beds.</p>
                        </div>
                        <div className="text-2xl font-semibold text-fuchsia-700">{data.occupancyRate ?? 0}%</div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-fuchsia-600" style={{ width: `${Math.min(data.occupancyRate ?? 0, 100)}%` }} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
