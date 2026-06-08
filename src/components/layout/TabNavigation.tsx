"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useTabContext } from "@/contexts/TabContext";
import { useTranslationClient } from "@/lib/i18n/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabNavigation() {
    const { tabs, activeTab, setActiveTab, closeTab } = useTabContext();
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const pathname = usePathname();

    if (!tabs || tabs.length === 0) {
        return null;
    }

    return (
        <div className="border-b bg-card border-border">
            <nav
                className="flex gap-2 px-4 pt-6 bg-card rounded-t-xl z-50 min-w-max"
                aria-label="Tabs"
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <Link
                            key={tab.id}
                            href={tab.path}
                            className={`relative px-4 pb-2 pt-2 text-xs font-semibold transition-all duration-200
                                rounded-t-lg whitespace-nowrap
                                ${
                                    isActive
                                        ? "bg-background text-primary shadow border-x border-t border-b-transparent border-border -mb-px"
                                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                                }
                                hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                            `}
                            style={{
                                boxShadow: isActive ? "0 -2px 0 0 var(--color-primary)" : undefined,
                            }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {t(tab.label)}
                            {(tab.type === "edit" || tab.type === "view") && (
                                <button
                                    className="ml-2 text-xs hover:text-red-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        closeTab(tab.id);
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
