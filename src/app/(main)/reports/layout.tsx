"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DynamicModuleSidebar from "@/components/layout/DynamicModuleSidebar";
import Topbar from "@/components/layout/Topbar";
import reportsConfig from "@/configs/nav-config/modules/reports-config.json";
import { usePermissions } from "@/hooks/usePermissions";

function getBreadcrumbs(pathname: string) {
    return pathname
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
}

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
    const { permissions } = usePermissions();
    const pathname = usePathname();
    const breadcrumbs = getBreadcrumbs(pathname);

    return (
        <>
            <DynamicModuleSidebar config={reportsConfig} userPermissions={permissions} />
            <div className="flex flex-col flex-1 h-screen">
                <div className="sticky top-0 z-30">
                    <Topbar breadcrumbs={breadcrumbs} hasSidebar={true} showFiscalYear={false} />
                </div>
                <main className="flex-1 overflow-auto bg-background text-foreground">
                    {children}
                </main>
            </div>
        </>
    );
}
