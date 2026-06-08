"use client";
import { usePermissions } from "@/hooks/usePermissions";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export type TabType = "list" | "tree" | "create" | "view" | "edit" | "custom";
export interface Tab {
    id: string;
    label: string;
    path: string;
    type: TabType;
    permission?: string;
    parentId?: string; // <-- Add this
}

interface TabContextProps {
    tabs: Tab[];
    activeTab: string;
    openTab: (tab: Tab) => void;
    closeTab: (id: string) => void;
    closeCurrentTab: () => void;
    setActiveTab: (id: string) => void;
}

const TabContext = createContext<TabContextProps | undefined>(undefined);

export const useTabContext = () => {
    const ctx = useContext(TabContext);
    if (!ctx) throw new Error("TabContext not found");
    return ctx;
};

interface TabProviderProps {
    staticTabs: Tab[];
    children: React.ReactNode;
}

export const TabProvider = ({ staticTabs = [], children }: TabProviderProps) => {
    const { permissions } = usePermissions();
    const router = useRouter();
    const pathname = usePathname();

    const filteredStaticTabs = staticTabs.filter(
        (tab) => !tab.permission || permissions.includes(tab.permission),
    );

    const [dynamicTabs, setDynamicTabs] = useState<Tab[]>([]);

    // Initialize activeTab from pathname for static tabs, otherwise default to first tab
    const [activeTab, setActiveTab] = useState<string>(() => {
        // Sort tabs by path length (longest first) to match most specific path
        const sortedTabs = [...filteredStaticTabs].sort((a, b) => b.path.length - a.path.length);

        const matchingTab = sortedTabs.find(
            (tab) => pathname === tab.path || pathname?.startsWith(tab.path + "/"),
        );
        return matchingTab?.id || filteredStaticTabs[0]?.id || "";
    });

    // Build tabs array with dynamic tabs inserted after the active static tab
    const tabs = React.useMemo(() => {
        const result = [...filteredStaticTabs];
        dynamicTabs.forEach((dynTab) => {
            const parentIdx = result.findIndex((t) => t.id === dynTab.parentId);
            if (parentIdx !== -1) {
                result.splice(parentIdx + 1, 0, dynTab);
            } else {
                result.push(dynTab);
            }
        });
        return result;
    }, [filteredStaticTabs, dynamicTabs]);

    // Track previous active tab id
    const prevActiveTabRef = useRef<string>(activeTab);
    const isInitializedRef = useRef<boolean>(false);
    const prevPathnameRef = useRef<string>(pathname || "");

    // On initial load, check if we're on a dynamic tab route and redirect to default
    useEffect(() => {
        if (isInitializedRef.current) return;

        // If current pathname is a dynamic route (e.g., /details/:id, /edit/:id),
        // navigate to the best matching static tab by checking exact match or prefix.
        const isDynamicRoute = !!pathname && /\/details\/|\/edit\//.test(pathname);
        if (isDynamicRoute) {
            const sortedTabs = [...filteredStaticTabs].sort(
                (a, b) => b.path.length - a.path.length,
            );
            const matchingTab =
                sortedTabs.find(
                    (tab) => pathname === tab.path || pathname?.startsWith(tab.path + "/"),
                ) || filteredStaticTabs[0];
            if (matchingTab) router.push(matchingTab.path);
        }
    }, []);

    // Sync activeTab with pathname changes (e.g., on reload or direct navigation)
    useEffect(() => {
        if (!isInitializedRef.current) {
            isInitializedRef.current = true;
            prevPathnameRef.current = pathname || "";
            return;
        }

        // Only sync if pathname actually changed
        if (prevPathnameRef.current === pathname) return;
        prevPathnameRef.current = pathname || "";

        // Don't sync if current active tab is a dynamic tab (view/edit)
        const currentActiveTab = tabs.find((tab) => tab.id === activeTab);
        if (
            currentActiveTab &&
            (currentActiveTab.type === "view" ||
                currentActiveTab.type === "edit" ||
                currentActiveTab.type === "custom")
        ) {
            return;
        }

        // Sort tabs by path length (longest first) to match most specific path
        const sortedTabs = [...filteredStaticTabs].sort((a, b) => b.path.length - a.path.length);

        const matchingTab = sortedTabs.find(
            (tab) => pathname === tab.path || pathname?.startsWith(tab.path + "/"),
        );

        if (matchingTab && matchingTab.id !== activeTab) {
            router.push(matchingTab.path);
        }
    }, [pathname, filteredStaticTabs, activeTab, tabs]);

    useEffect(() => {
        if (!isInitializedRef.current) return;

        const currentTab = tabs.find((tab) => tab.id === activeTab);
        // Only push if path is different and current tab path doesn't match pathname
        if (
            currentTab &&
            currentTab.path &&
            currentTab.path !== pathname &&
            !pathname?.startsWith(currentTab.path + "/")
        ) {
            router.push(currentTab.path);
        }
    }, [activeTab]);

    // Auto-close view/edit tab when leaving its page/tab
    useEffect(() => {
        const prevTabId = prevActiveTabRef.current;
        const prevTab = tabs.find((tab) => tab.id === prevTabId);
        const currentTab = tabs.find((tab) => tab.id === activeTab);

        // If previous tab was view/edit and we switched away from it, close it
        if (
            prevTab &&
            (prevTab.type === "view" || prevTab.type === "edit" || prevTab.type === "custom") &&
            prevTab.id !== activeTab
        ) {
            setDynamicTabs((prev) => prev.filter((t) => t.id !== prevTab.id));
        }

        prevActiveTabRef.current = activeTab;
    }, [activeTab, tabs]);

    const openTab = (tab: Tab) => {
        if (tab.permission && !permissions.includes(tab.permission)) return;
        if (tab.type === "edit" || tab.type === "view" || tab.type === "custom") {
            setDynamicTabs((prev) => {
                if (prev.find((t) => t.id === tab.id)) return prev;
                return [...prev, { ...tab, parentId: activeTab }];
            });
            setActiveTab(tab.id);
        } else if (tab.type === "create") {
            // For create tabs, navigate directly to the path
            router.push(tab.path);
        } else {
            setActiveTab(tab.id);
        }
    };

    const closeTab = (id: string) => {
        const closingTab = tabs.find((tab) => tab.id === id);

        setDynamicTabs((prev) => prev.filter((t) => t.id !== id));

        if (activeTab === id) {
            // Find the next tab to switch to
            const remainingTabs = tabs.filter((tab) => tab.id !== id);
            const nextTab = remainingTabs[0] || filteredStaticTabs[0];

            if (nextTab) {
                // Navigate immediately to the next tab's path
                router.push(nextTab.path);
                setActiveTab(nextTab.id);
            }
        }
    };

    const closeCurrentTab = () => {
        closeTab(activeTab);
    };

    return (
        <TabContext.Provider
            value={{ tabs, activeTab, openTab, closeTab, closeCurrentTab, setActiveTab }}
        >
            {children}
        </TabContext.Provider>
    );
};
