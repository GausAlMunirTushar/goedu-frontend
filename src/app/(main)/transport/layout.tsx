"use client";

import DynamicModuleSidebar from "@/components/layout/DynamicModuleSidebar";
import Topbar from "@/components/layout/Topbar";
import transportConfig from "@/configs/nav-config/modules/transport-config.json";
import { Tab, TabProvider } from "@/contexts/TabContext";
import { usePermissions } from "@/hooks/usePermissions";
import { usePathname } from "next/navigation";
import React from "react";

function getBreadcrumbs(pathname: string) {
    return pathname
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
}

const staticTabs: Tab[] = [
    {
        id: "transport-dashboard",
        label: "Transport Dashboard",
        path: "/transport",
        type: "list",
    },
];

export default function TransportLayout({ children }: { children: React.ReactNode }) {
    const { permissions } = usePermissions();
    const pathname = usePathname();
    const breadcrumbs = getBreadcrumbs(pathname);

    return (
        <TabProvider staticTabs={staticTabs}>
            <DynamicModuleSidebar config={transportConfig as any} userPermissions={permissions} />
            <div className="flex flex-col flex-1 h-screen">
                <div className="sticky top-0 z-30">
                    <Topbar breadcrumbs={breadcrumbs} hasSidebar={true} showFiscalYear={false} />
                </div>
                <main className="flex-1 overflow-auto bg-background text-foreground">
                    {children}
                </main>
            </div>
        </TabProvider>
    );
}
