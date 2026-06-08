"use client";
import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

interface NavItemProps {
    link: {
        labelKey: string;
        href: string;
        defaultLabel: string;
        children?: { labelKey: string; href: string; defaultLabel: string; }[];
    };
}

export default function NavItem({ link }: NavItemProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const isHome = link.labelKey === "home" && !link.children;

    if (!link.children || link.children.length === 0) {
        return (
            <Link 
                href={link.href} 
                className={isHome ? "bg-primary text-primary-foreground px-4 py-1.5 rounded-full shadow-sm mx-1" : "px-3 py-1.5 hover:text-primary transition-colors"}
            >
                {t(link.labelKey) || link.defaultLabel}
            </Link>
        );
    }

    return (
        <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-1.5 hover:text-primary transition-colors">
                {t(link.labelKey) || link.defaultLabel}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-primary/10 py-2 w-48 flex flex-col relative overflow-hidden">
                    {link.children.map((child, idx) => (
                        <Link 
                            key={idx} 
                            href={child.href}
                            className="px-4 py-2 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium text-gray-700 block"
                        >
                            {t(child.labelKey) || child.defaultLabel}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
