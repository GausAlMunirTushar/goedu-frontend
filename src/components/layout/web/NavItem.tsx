"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

interface NavChild {
  labelKey: string;
  href: string;
  defaultLabel: string;
  separator?: boolean;
  group?: string;
}

interface NavItemProps {
  link: {
    labelKey: string;
    href: string;
    defaultLabel: string;
    children?: NavChild[];
  };
}

export default function NavItem({ link }: NavItemProps) {
  const { lng } = useLanguage();
  const { t } = useTranslationClient(lng);
  const pathname = usePathname();

  const isHome = link.labelKey === "home" && !link.children;
  const isActive =
    pathname === link.href ||
    link.children?.some((c) => pathname === c.href);

  /* ── Simple link ──────────────────────────────────────── */
  if (!link.children || link.children.length === 0) {
    return (
      <Link
        href={link.href}
        className={cn(
          "px-3 py-1.5 transition-all duration-200",
          isHome
            ? "bg-primary text-primary-foreground px-4 rounded-full shadow-sm mx-1 hover:opacity-90 font-medium"
            : cn(
                "relative group hover:text-primary font-medium",
                isActive ? "text-primary" : "text-gray-700"
              )
        )}
      >
        {t(link.labelKey) || link.defaultLabel}
        {!isHome && (
          <span
            className={cn(
              "absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full transition-transform duration-300 origin-left",
              isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            )}
          />
        )}
      </Link>
    );
  }

  /* ── Dropdown ─────────────────────────────────────────── */
  return (
    <div className="relative group">
      {/* Trigger */}
      <button
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-[14px] font-medium transition-all duration-200 relative select-none",
          isActive ? "text-primary" : "text-gray-700 hover:text-primary"
        )}
      >
        {t(link.labelKey) || link.defaultLabel}
        <ChevronDown className="w-3.5 h-3.5 mt-px transition-transform duration-200 group-hover:rotate-180" />
        <span
          className={cn(
            "absolute bottom-0.5 left-3 right-6 h-0.5 bg-primary rounded-full transition-transform duration-300 origin-left",
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          )}
        />
      </button>

      {/* Panel */}
      <div
        className={cn(
          "absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 min-w-[210px]",
          "opacity-0 invisible pointer-events-none translate-y-2",
          "group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0",
          "transition-all duration-200 ease-out"
        )}
      >
        {/* Caret */}
        <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />

        {/* Dropdown box */}
        <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden py-1">
          {link.children.map((child, idx) => {
            const isChildActive = pathname === child.href;
            const isPlaceholder = child.href === "#";

            return (
              <React.Fragment key={idx}>
                {/* Separator */}
                {child.separator && (
                  <div className="my-1 border-t border-gray-100" />
                )}

                <Link
                  href={child.href}
                  className={cn(
                    "group/item flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-150",
                    isChildActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : isPlaceholder
                      ? "text-gray-400 pointer-events-none"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  )}
                >
                  {t(child.labelKey) || child.defaultLabel}

                  {!isPlaceholder && (
                    <ArrowRight
                      className={cn(
                        "w-3.5 h-3.5 shrink-0 transition-all duration-150",
                        isChildActive
                          ? "opacity-70"
                          : "opacity-0 -translate-x-1 group-hover/item:opacity-50 group-hover/item:translate-x-0"
                      )}
                    />
                  )}
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
