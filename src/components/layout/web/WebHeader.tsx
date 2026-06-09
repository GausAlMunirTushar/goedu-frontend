"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import WebTopbar from "./WebTopbar";
import NavItem from "./NavItem";
import { topBarData, webHeaderData } from "@/data/webData";

export default function WebHeader() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <>
            <WebTopbar data={topBarData} />
            <header className="w-full bg-white font-sans sticky top-0 z-50">
                {/* Main Header */}
                <div className="max-w-7xl mx-auto px-4 py-1 flex flex-col lg:flex-row justify-between items-center lg:items-center gap-6 relative z-50">
                    {/* Left: Logo & Name */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center justify-center p-1 rounded-lg">
                            <Image src="/logo.svg" alt="ePathshala Logo" width={64} height={64} className="w-16 h-16 object-contain" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                {lng === "bn" ? webHeaderData.schoolNameBn : webHeaderData.schoolNameEn}
                            </h1>
                            <p className="text-[12px] text-gray-500 mt-0.5">
                                {lng === "bn" ? webHeaderData.addressBn : webHeaderData.address}
                            </p>
                        </div>
                    </div>

                    {/* Right: Info & Menu */}
                    <div className="flex flex-col items-center lg:items-end gap-5">
                        {/* Navigation Menu */}
                        <nav className="flex flex-wrap justify-center lg:justify-end items-center gap-y-2 text-[14px] font-bold text-gray-700">
                            {webHeaderData.navLinks.map((link, index) => (
                                <NavItem key={index} link={link} />
                            ))}
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
}
