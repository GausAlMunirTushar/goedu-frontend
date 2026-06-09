"use client";

import DynamicModuleSidebar from "@/components/layout/DynamicModuleSidebar";
import Topbar from "@/components/layout/Topbar";
import examinationConfig from "@/configs/nav-config/modules/examination-config.json";
import { usePermissions } from "@/hooks/usePermissions";
import { usePathname } from "next/navigation";
import React from "react";
import { TabProvider, Tab } from "@/contexts/TabContext";

function getBreadcrumbs(pathname: string) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
}

// Examination module currently has no additional tabs
const staticTabs: Tab[] = [];

export default function ExaminationLayout({ children }: { children: React.ReactNode }) {
  const { permissions } = usePermissions();
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <TabProvider staticTabs={staticTabs}>
      <DynamicModuleSidebar config={examinationConfig as any} userPermissions={permissions} />
      <div className="flex flex-col flex-1 h-screen">
        <div className="sticky top-0 z-30">
          <Topbar breadcrumbs={breadcrumbs} hasSidebar={true} showFiscalYear={false} />
        </div>
        <main className="flex-1 overflow-auto bg-background text-foreground animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </TabProvider>
  );
}
