"use client";

import Topbar from "@/components/layout/Topbar";
import { usePathname } from "next/navigation";
import React from "react";

function getBreadcrumbs(pathname: string) {
    return pathname
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="flex flex-col flex-1 h-screen">
            <div className="sticky top-0 z-30">
                <Topbar breadcrumbs={getBreadcrumbs(pathname)} hasSidebar={false} showFiscalYear={false} />
            </div>
            <main className="flex-1 overflow-auto bg-background text-foreground">
                {children}
            </main>
        </div>
    );
}
