"use client";

import DynamicModuleSidebar from "@/components/layout/DynamicModuleSidebar";
import Topbar from "@/components/layout/Topbar";
import teacherConfig from "@/configs/nav-config/modules/teacher-config.json";
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

const staticTabs: Tab[] = [
  {
    id: "teacher-dashboard",
    label: "Teacher Dashboard",
    path: "/teacher",
    type: "list",
    // permission can be added if needed, e.g., "teacher.view",
  },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { permissions } = usePermissions();
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <TabProvider staticTabs={staticTabs}>
      <DynamicModuleSidebar config={teacherConfig as any} userPermissions={permissions} />
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
