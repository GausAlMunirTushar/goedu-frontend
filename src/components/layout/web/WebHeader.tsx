"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import Image from "next/image";
import WebTopbar from "./WebTopbar";
import NavItem from "./NavItem";
import { topBarData, webHeaderData } from "@/data/webData";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function WebHeader() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <WebTopbar data={topBarData} />
            <header className={cn(
                "w-full bg-white font-sans sticky top-0 z-50 transition-all duration-300",
                isScrolled ? "shadow-md py-1" : "py-2"
            )}>
                {/* Main Header */}
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center gap-4">
                    {/* Left: Logo & Name */}
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center justify-center p-1 rounded-lg">
                            <Image 
                                src="/logo.svg" 
                                alt="ePathshala Logo" 
                                width={56} 
                                height={56} 
                                className={cn("object-contain transition-all duration-300", isScrolled ? "w-10 h-10" : "w-12 h-12 lg:w-16 lg:h-16")} 
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className={cn(
                                "font-bold text-gray-900 leading-tight transition-all duration-300",
                                isScrolled ? "text-lg lg:text-xl" : "text-xl lg:text-3xl"
                            )}>
                                {lng === "bn" ? webHeaderData.schoolNameBn : webHeaderData.schoolNameEn}
                            </h1>
                            <p className={cn(
                                "text-gray-500 transition-all duration-300",
                                isScrolled ? "hidden lg:block text-[10px]" : "text-[11px] lg:text-[12px]"
                            )}>
                                {lng === "bn" ? webHeaderData.addressBn : webHeaderData.address}
                            </p>
                        </div>
                    </Link>

                    {/* Right: Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1 text-[14px] font-bold text-gray-700">
                        {webHeaderData.navLinks.map((link, index) => (
                            <NavItem key={index} link={link} />
                        ))}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2 text-gray-600 hover:text-primary transition-colors">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
                                <SheetHeader className="p-6 border-b text-left">
                                    <SheetTitle className="flex items-center gap-3">
                                        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold">
                                                {lng === "bn" ? webHeaderData.schoolNameBn : webHeaderData.schoolNameEn}
                                            </span>
                                            <span className="text-xs text-gray-500 font-normal">
                                                {lng === "bn" ? webHeaderData.addressBn : webHeaderData.address}
                                            </span>
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex-1 overflow-y-auto py-6 px-4">
                                    <nav className="flex flex-col gap-1">
                                        {webHeaderData.navLinks.map((link, index) => (
                                            <MobileNavItem key={index} link={link} t={t} />
                                        ))}
                                    </nav>

                                    <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-2">
                                            {t("contact_info") || "Contact Info"}
                                        </h3>
                                        <div className="flex flex-col gap-3 px-2">
                                            <a href={`tel:${topBarData.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-primary">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium">{topBarData.phone}</span>
                                            </a>
                                            <a href={`mailto:${topBarData.email}`} className="flex items-center gap-3 text-gray-600 hover:text-primary">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-sm">{topBarData.email}</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 mt-auto border-t">
                                    <Link 
                                        href={topBarData.loginLink}
                                        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        {t("login") || "লগইন"}
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
}

interface MobileNavChild {
    labelKey: string;
    href: string;
    defaultLabel: string;
    separator?: boolean;
    group?: string;
}
interface MobileNavLink {
    labelKey: string;
    href: string;
    defaultLabel: string;
    children?: MobileNavChild[];
}
function MobileNavItem({ link, t }: { link: MobileNavLink, t: (key: string) => string }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const hasChildren = link.children && link.children.length > 0;
    const isActive = pathname === link.href || (link.children?.some((child: any) => pathname === child.href));

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                {hasChildren ? (
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "flex-1 text-left py-3 px-2 rounded-lg font-semibold transition-colors flex items-center justify-between",
                            isOpen || isActive ? "text-primary bg-primary/5" : "text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        {t(link.labelKey) || link.defaultLabel}
                        <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", isOpen && "rotate-180")} />
                    </button>
                ) : (
                    <Link 
                        href={link.href}
                        className={cn(
                            "flex-1 py-3 px-2 rounded-lg font-semibold transition-colors",
                            isActive ? "text-primary bg-primary/5" : "text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        {t(link.labelKey) || link.defaultLabel}
                    </Link>
                )}
            </div>

            {hasChildren && isOpen && (
                <div className="ml-4 pl-2 border-l-2 border-primary/10 flex flex-col gap-1 my-1">
                    {link.children?.map((child: MobileNavChild, idx: number) => {
                        const isChildActive = pathname === child.href;
                        return (
                            <Link 
                                key={idx} 
                                href={child.href}
                                className={cn(
                                    "py-2.5 px-3 rounded-lg text-sm font-medium transition-colors",
                                    isChildActive ? "text-primary bg-primary/5" : "text-gray-600 hover:text-primary hover:bg-primary/5"
                                )}
                            >
                                {t(child.labelKey) || child.defaultLabel}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

