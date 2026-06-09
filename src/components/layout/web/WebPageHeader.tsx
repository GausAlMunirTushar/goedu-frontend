import React from "react";
import { useTranslationClient } from "@/lib/i18n/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { LucideIcon } from "lucide-react";

interface WebPageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
}

export default function WebPageHeader({ title, subtitle, icon: Icon }: WebPageHeaderProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="bg-primary/5 py-6 md:py-8 border-b border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl -z-10"></div>
            <div className="max-w-7xl mx-auto px-4 text-center">
                {Icon && (
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-4">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-semibold">{title}</span>
                    </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
