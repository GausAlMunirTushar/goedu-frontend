"use client";

import DynamicModuleSidebar from "@/components/layout/DynamicModuleSidebar";
import Topbar from "@/components/layout/Topbar";
import hrConfig from "@/configs/nav-config/modules/hr-config.json";
import { Tab, TabProvider } from "@/contexts/TabContext";
import { usePermissions } from "@/hooks/usePermissions";
import { usePathname } from "next/navigation";
import React from "react";

function getBreadcrumbs(pathname: string) {
    return pathname.split("/").filter(Boolean).map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
}

const staticTabs: Tab[] = [{ id: "hr-dashboard", label: "HR Dashboard", path: "/hr", type: "list" }];

export default function HrLayout({ children }: { children: React.ReactNode }) {
    const { permissions } = usePermissions();
    const pathname = usePathname();
    return (
        <TabProvider staticTabs={staticTabs}>
            <DynamicModuleSidebar config={hrConfig as any} userPermissions={permissions} />
            <div className="flex flex-col flex-1 h-screen">
                <div className="sticky top-0 z-30">
                    <Topbar breadcrumbs={getBreadcrumbs(pathname)} hasSidebar={true} showFiscalYear={false} />
                </div>
                <main className="flex-1 overflow-auto bg-background text-foreground">{children}</main>
            </div>
        </TabProvider>
    );
}
