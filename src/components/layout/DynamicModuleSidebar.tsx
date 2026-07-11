"use client";

import { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationConfig } from "@/lib/navigation-utils";
import { getIcon } from "@/lib/icon-mapper";
import { useTranslationClient } from "@/lib/i18n/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarGroup,
    SidebarGroupContent,
} from "@/components/ui/sidebar";

interface Submenu {
    id?: string;
    path: string;
    label: string;
    icon?: string;
    required_permissions?: string[];
    permissions?: string[];
}

interface Menu {
    id: string;
    label: string;
    icon?: string;
    path?: string;
    submenus?: Submenu[];
    required_permissions?: string[];
    permissions?: string[];
}

interface DynamicModuleSidebarProps {
    config: NavigationConfig;
    userPermissions?: string[];
    children?: React.ReactNode;
}

export default function DynamicModuleSidebar({
    config,
    userPermissions = [],
    children,
}: DynamicModuleSidebarProps) {
    void userPermissions;
    const pathname = usePathname();
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [searchQuery, setSearchQuery] = useState("");

    // Calculate initial expanded items based on active path
    const getInitialExpandedItems = () => {
        const menusToExpand: string[] = [];
        const menus = config?.module?.menus || [];
        menus.forEach((menu) => {
            if (menu.submenus && menu.submenus.length > 0) {
                const hasActiveSubmenu = menu.submenus.some(
                    (submenu: Submenu) =>
                        pathname === submenu.path || pathname.startsWith(submenu.path + "/"),
                );
                if (hasActiveSubmenu) {
                    menusToExpand.push(menu.id);
                }
            }
        });
        return menusToExpand;
    };

    const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpandedItems());

    // Update expanded items when pathname changes
    useEffect(() => {
        const menusToExpand = getInitialExpandedItems();
        setExpandedItems(menusToExpand);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const toggleExpand = (itemName: string) => {
        setExpandedItems((prev) =>
            prev.includes(itemName)
                ? prev.filter((item) => item !== itemName)
                : [...prev, itemName],
        );
    };

    // const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");
    const isActive = (path: string) => pathname === path;

    const menus = config?.module?.menus || [];
    const filteredMenus = menus.filter((menu) =>
        t(menu.label).toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Render menu items recursively for Sidebar
    const renderSidebarItems = (menus: Menu[]) =>
        menus.map((menu) => {
            const IconComponent = menu.icon ? getIcon(menu.icon) : undefined;
            const hasChildren = menu.submenus && menu.submenus.length > 0;
            const isExpanded = expandedItems.includes(menu.id);
            const active = menu.path ? isActive(menu.path) : false;

            return (
                <SidebarMenuItem key={menu.id}>
                    <SidebarMenuButton
                        asChild={!hasChildren}
                        isActive={active}
                        onClick={hasChildren ? () => toggleExpand(menu.id) : undefined}
                    >
                        {hasChildren ? (
                            <div className="flex items-center gap-1.5 w-full text-xs">
                                {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                                <span>{t(menu.label)}</span>
                                <ChevronRight
                                    className={`ml-auto transition-transform w-3.5 h-3.5 ${isExpanded ? "rotate-90" : ""
                                        }`}
                                />
                            </div>
                        ) : (
                            <Link href={menu.path || "#"} className="text-xs">
                                {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                                <span>{t(menu.label)}</span>
                            </Link>
                        )}
                    </SidebarMenuButton>
                    {hasChildren && isExpanded && menu.submenus && (
                        <SidebarMenuSub>
                            {menu.submenus.map((submenu: Submenu) => {
                                const SubIconComponent = submenu.icon
                                    ? getIcon(submenu.icon)
                                    : undefined;
                                const subActive = isActive(submenu.path);

                                return (
                                    <SidebarMenuSubItem key={submenu.id}>
                                        <SidebarMenuSubButton asChild isActive={subActive}>
                                            <Link href={submenu.path} className="text-xs">
                                                {SubIconComponent && (
                                                    <SubIconComponent className="w-3 h-3" />
                                                )}
                                                <span>{t(submenu.label)}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                );
                            })}
                        </SidebarMenuSub>
                    )}
                </SidebarMenuItem>
            );
        });

    return (
        <>
            <Sidebar collapsible="icon" className="ml-20">
                <SidebarHeader className="border-b">
                    <div className="p-2">
                        <h2 className="text-md font-semibold tracking-tight">
                            {t(config?.module?.label || "Menu")}
                        </h2>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <div className="py-1.5 mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder={t("search") || "Search..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-2 py-2 bg-background text-foreground border border-primary rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </div>
                        <SidebarGroupContent>
                            <SidebarMenu>{renderSidebarItems(filteredMenus)}</SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="border-t">
                    <div className="px-2 py-1.5 text-[10px] text-muted-foreground">
                        <p>{t(config?.module?.label || "Menu")}</p>
                    </div>
                </SidebarFooter>
            </Sidebar>
            {children}
        </>
    );
}
