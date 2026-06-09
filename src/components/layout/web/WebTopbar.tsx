"use client";
import React from "react";
import { Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

interface WebTopbarProps {
    data: {
        email: string;
        phone: string;
        noticeText: string;
        socials: {
            facebook: string;
            twitter: string;
            instagram: string;
            youtube: string;
        };
        admissionLink: string;
        loginLink: string;
    };
}

export default function WebTopbar({ data }: WebTopbarProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="bg-[#f8f9fa] py-2 text-[13px] text-gray-600 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
                {/* Left: Contact - Hidden on mobile, shown on md+ */}
                <div className="hidden md:flex items-center gap-4 font-medium">
                    <a href={`mailto:${data.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Mail className="w-4 h-4 text-gray-500" /> {data.email}
                    </a>
                    <span className="text-gray-300">|</span>
                    <a href={`tel:${data.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Phone className="w-4 h-4 text-gray-500" /> {data.phone}
                    </a>
                </div>
                
                {/* Middle: Notice Ticker - Hidden on mobile, shown on lg+ */}
                <div className="hidden lg:flex items-center flex-1 max-w-lg mx-4 bg-gray-200/50 rounded-full overflow-hidden">
                    <div className="bg-primary text-primary-foreground px-4 py-1 text-xs font-bold rounded-full whitespace-nowrap">
                        {t("notice") || "নোটিশ"}
                    </div>
                    <div className="px-3 text-xs font-medium text-gray-700 whitespace-nowrap truncate">
                        {data.noticeText}
                    </div>
                </div>

                {/* Right: Socials & Actions */}
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <div className="flex items-center gap-3 text-gray-400">
                        <a href={data.socials.facebook} className="hover:text-primary transition-colors"><Facebook className="w-4 h-4" /></a>
                        <a href={data.socials.youtube} className="hover:text-primary transition-colors"><Youtube className="w-4 h-4" /></a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <div className="h-4 w-[1px] bg-gray-300" />
                        <Link href={data.admissionLink} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                            {t("admission_form") || "ভর্তি আবেদন"}
                        </Link>
                        <Link href={data.loginLink} className="hidden md:block bg-primary text-primary-foreground px-4 py-1 rounded-full text-[11px] font-bold hover:opacity-90 transition-all">
                            {t("login") || "লগইন"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
