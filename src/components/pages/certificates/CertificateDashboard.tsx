"use client";

import { useCertificateDashboardQuery } from "@/apis/queries/certificate_queries";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { FileCheck, LayoutTemplate, ShieldX } from "lucide-react";

const stats = [{ key: "templates", label: "Templates", icon: LayoutTemplate }, { key: "issued", label: "Issued", icon: FileCheck }, { key: "revoked", label: "Revoked", icon: ShieldX }];

export function CertificateDashboard() {
    const { data: response, isLoading } = useCertificateDashboardQuery();
    const data = response?.data || {};
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><div><Title>Certificates</Title><p className="text-xs text-muted-foreground mt-1">Manage official templates, generated certificates, and public verification.</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{stats.map((stat) => { const Icon = stat.icon; return <Card key={stat.key}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-2xl font-semibold text-slate-900 mt-1">{data[stat.key] ?? 0}</p></div><div className="h-10 w-10 rounded-md bg-blue-50 text-blue-800 flex items-center justify-center"><Icon className="h-5 w-5" /></div></CardContent></Card>; })}</div></div>;
}
