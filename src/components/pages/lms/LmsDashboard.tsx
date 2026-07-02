"use client";

import { useLmsDashboardQuery } from "@/apis/queries/lms_queries";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { BookOpen, ClipboardList, FileCheck, FileText, Inbox } from "lucide-react";

const stats = [
    { key: "lessonPlans", label: "Lesson Plans", icon: ClipboardList },
    { key: "homeworks", label: "Homework", icon: BookOpen },
    { key: "submissions", label: "Submissions", icon: Inbox },
    { key: "pendingReviews", label: "Pending Reviews", icon: FileCheck },
    { key: "resources", label: "Resources", icon: FileText },
];

export function LmsDashboard() {
    const { data: response, isLoading } = useLmsDashboardQuery();
    const data = response?.data || {};
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><div><Title>LMS</Title><p className="text-xs text-muted-foreground mt-1">Manage lesson planning, homework, submissions, and class resources.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">{stats.map((stat) => { const Icon = stat.icon; return <Card key={stat.key}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-2xl font-semibold text-slate-900 mt-1">{data[stat.key] ?? 0}</p></div><div className="h-10 w-10 rounded-md bg-violet-50 text-violet-700 flex items-center justify-center"><Icon className="h-5 w-5" /></div></CardContent></Card>; })}</div></div>;
}
