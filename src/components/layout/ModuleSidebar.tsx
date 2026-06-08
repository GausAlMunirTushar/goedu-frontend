"use client";

import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
    name: string;
    icon?: React.ReactNode;
    path: string;
    children?: MenuItem[];
}

interface ModuleSidebarProps {
    moduleTitle: string;
    moduleDescription?: string;
    menuItems: MenuItem[];
}

export default function ModuleSidebar({
    moduleTitle,
    moduleDescription,
    menuItems,
}: ModuleSidebarProps) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleExpand = (itemName: string) => {
        setExpandedItems((prev) =>
            prev.includes(itemName)
                ? prev.filter((item) => item !== itemName)
                : [...prev, itemName],
        );
    };

    const isActive = (path: string) => pathname === path;

    const renderMenuItem = (item: MenuItem, level: number = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.name);
        const active = isActive(item.path);

        return (
            <div key={item.name}>
                <Link
                    href={item.path}
                    onClick={(e) => {
                        if (hasChildren) {
                            e.preventDefault();
                            toggleExpand(item.name);
                        }
                    }}
                    className={`
            flex items-center justify-between px-4 py-2.5 text-sm
            transition-colors duration-150 cursor-pointer rounded-md
            ${
                active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }
            ${level > 0 ? "pl-" + (4 + level * 4) : ""}
          `}
                >
                    <div className="flex items-center gap-3">
                        {item.icon && (
                            <span className="text-sidebar-foreground/70">{item.icon}</span>
                        )}
                        <span className={active ? "font-semibold" : ""}>{item.name}</span>
                    </div>
                    {hasChildren && (
                        <ChevronRight
                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                    )}
                </Link>

                {hasChildren && isExpanded && (
                    <div className="bg-sidebar/50 mt-1 rounded-md">
                        {item.children!.map((child) => renderMenuItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const filteredItems = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen fixed left-16 top-0 z-40 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-sidebar-border">
                <h2 className="text-lg font-bold text-sidebar-foreground">{moduleTitle}</h2>
                {moduleDescription && (
                    <p className="text-xs text-sidebar-foreground/70 mt-1">{moduleDescription}</p>
                )}
            </div>

            {/* Search */}
            <div className="p-3 border-b border-sidebar-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/60" />
                    <input
                        type="text"
                        placeholder="Search in module..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-input bg-background text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
                <nav className="py-2">{filteredItems.map((item) => renderMenuItem(item))}</nav>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
                <p>Module: {moduleTitle}</p>
            </div>
        </div>
    );
}
