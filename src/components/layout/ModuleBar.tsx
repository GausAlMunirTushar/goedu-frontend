"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getIcon } from "@/lib/icon-mapper";
import { getEnabledModules, getActiveModule } from "@/lib/config-utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Image from "next/image";

interface ModuleBarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function ModuleBar({ isOpen = true, onClose }: ModuleBarProps) {
    const pathname = usePathname();

    const modules = useMemo(() => {
        return getEnabledModules();
    }, []);

    // Determine active module from pathname using contain_menus
    const activeModuleId = useMemo(() => {
        const activeModule = getActiveModule(pathname || "");
        return activeModule?.id || "main";
    }, [pathname]);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && onClose && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Module Bar */}
            <div
                className={`
        w-20
        bg-modularbar text-sidebar-foreground flex flex-col items-center py-3 h-screen fixed left-0 top-0 z-50
        transition-transform duration-300 ease-in-out
        border-r border-sidebar-border
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
            >
                {/* Logo/Brand */}
                <Link href="/" className="mb-3">
                    <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-sm`}
                    >
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                </Link>

                {/* Module Icons with Names */}
                <div className="flex-1 flex flex-col items-center w-full space-y-2.5 overflow-y-auto scrollbar-hide py-2">
                    {modules.map((module) => {
                        const isActive = activeModuleId === module.id;
                        const IconComponent = getIcon(module.icon);
                        return (
                            <Tooltip key={module.id} delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={module.path}
                                        onClick={() => onClose?.()}
                                        className="w-full px-1 group"
                                    >
                                        <div
                                            className={`
                                                w-full flex flex-col items-center justify-center py-1.5 px-1 rounded-lg
                                                transition-all duration-200 cursor-pointer relative
                                                ${isActive
                                                    ? ""
                                                    : "hover:bg-primary/10 hover:from-primary/20 hover:to-primary/10 hover:border-primary/30"
                                                }
                                            `}
                                        >
                                            {/* Active Indicator */}
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary rounded-r-full shadow-[0_0_8px_2px_rgba(var(--primary),0.4)]" />
                                            )}

                                            {/* Icon */}
                                            <div
                                                className={`
                                                    flex items-center justify-center transition-all duration-200 relative
                                                    ${isActive
                                                        ? "text-primary scale-110"
                                                        : "text-sidebar-foreground/70 group-hover:text-primary group-hover:scale-105"
                                                    }
                                                `}
                                            >
                                                {/* Glow effect */}
                                                <div
                                                    className={`
                                                        absolute inset-0 bg-primary/20 blur-md rounded-full -z-10
                                                        transition-opacity duration-200
                                                        ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                                                    `}
                                                />
                                                {IconComponent && (
                                                    <IconComponent className="w-5 h-5" />
                                                )}
                                            </div>

                                            {/* Module Name */}
                                            <span
                                                className={`
                                                    text-[9px] font-medium text-center truncate w-full mt-0.5 transition-all duration-200
                                                    ${isActive
                                                        ? "text-primary font-semibold"
                                                        : "text-sidebar-foreground/60 group-hover:text-primary group-hover:font-medium"
                                                    }
                                                `}
                                            >
                                                {module.name}
                                            </span>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={6}>
                                    {module.name}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
