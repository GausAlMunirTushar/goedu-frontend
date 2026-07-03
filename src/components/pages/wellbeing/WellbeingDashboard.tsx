"use client";

import { useWellbeingDashboardQuery } from "@/apis/queries/wellbeing_queries";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { ClipboardList, HeartPulse, ShieldCheck, UserRound } from "lucide-react";

const stats = [
    { key: "openIncidents", label: "Open Incidents", icon: ShieldCheck },
    { key: "healthProfiles", label: "Health Profiles", icon: HeartPulse },
    { key: "openCounseling", label: "Open Counseling", icon: UserRound },
    { key: "followUpsDue", label: "Follow Ups Due", icon: ClipboardList },
];

export function WellbeingDashboard() {
    const { data: response, isLoading } = useWellbeingDashboardQuery();
    const data = response?.data || {};
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><div><Title>Student Wellbeing</Title><p className="text-xs text-muted-foreground mt-1">Track discipline, health profiles, and restricted counseling follow-ups.</p></div><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{stats.map((stat) => { const Icon = stat.icon; return <Card key={stat.key}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-2xl font-semibold text-slate-900 mt-1">{data[stat.key] ?? 0}</p></div><div className="h-10 w-10 rounded-md bg-rose-50 text-rose-800 flex items-center justify-center"><Icon className="h-5 w-5" /></div></CardContent></Card>; })}</div></div>;
}
