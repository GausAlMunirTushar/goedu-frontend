"use client";

import DynamicModuleSidebar from "@/components/layout/DynamicModuleSidebar";
import Topbar from "@/components/layout/Topbar";
import lmsConfig from "@/configs/nav-config/modules/lms-config.json";
import { Tab, TabProvider } from "@/contexts/TabContext";
import { usePermissions } from "@/hooks/usePermissions";
import { usePathname } from "next/navigation";
import React from "react";

const staticTabs: Tab[] = [{ id: "lms-dashboard", label: "LMS Dashboard", path: "/lms", type: "list" }];
const breadcrumbs = (path: string) => path.split("/").filter(Boolean).map((s) => s.charAt(0).toUpperCase() + s.slice(1));

export default function LmsLayout({ children }: { children: React.ReactNode }) {
    const { permissions } = usePermissions();
    const pathname = usePathname();
    return (
        <TabProvider staticTabs={staticTabs}>
            <DynamicModuleSidebar config={lmsConfig as any} userPermissions={permissions} />
            <div className="flex flex-col flex-1 h-screen">
                <div className="sticky top-0 z-30"><Topbar breadcrumbs={breadcrumbs(pathname)} hasSidebar={true} showFiscalYear={false} /></div>
                <main className="flex-1 overflow-auto bg-background text-foreground">{children}</main>
            </div>
        </TabProvider>
    );
}
