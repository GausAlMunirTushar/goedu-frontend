"use client";

import Loader from "@/components/common/Loader";
import ModuleBar from "@/components/layout/ModuleBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ApplicationProvider from "@/contexts/ApplicationContext";
import { getModuleById } from "@/lib/config-utils";
import { usePathname } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [isModuleBarOpen, setIsModuleBarOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const currentModule = useMemo(() => {
        const pathSegments = pathname?.split("/").filter(Boolean) || [];
        const moduleId = pathSegments[0] || "main";
        return getModuleById(moduleId);
    }, [pathname]);

    return (
        <ApplicationProvider>
            <div className="flex h-screen w-screen bg-gray-50 overflow-y-hidden">
                {/* Left Module Bar */}
                <ModuleBar isOpen={isModuleBarOpen} onClose={() => setIsModuleBarOpen(false)} />

                {/* Main Content Area */}
                <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    {/* min-w-0 is mandatory in flex layouts */}
                    <div className="flex flex-1 min-w-0 lg:ml-20">
                        <Suspense fallback={<Loader />}>{children}</Suspense>
                    </div>
                </SidebarProvider>
            </div>
        </ApplicationProvider>
    );
};

export default Layout;
