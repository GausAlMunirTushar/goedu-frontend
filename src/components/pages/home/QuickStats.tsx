"use client";
import React from "react";
import { Building, Clock, FileCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

export default function QuickStats() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-40">
            <div className="bg-white rounded-2xl shadow-lg shadow-primary/5 border border-primary/10 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center justify-center group">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-lg text-primary">15005030</h4>
                    <p className="text-xs text-primary/70 font-medium uppercase tracking-wider">
                        {t("institution_bin") || "Institution BIN"}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center group">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Building className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-lg text-primary">N/A</h4>
                    <p className="text-xs text-primary/70 font-medium uppercase tracking-wider">
                        {t("institution_code") || "Institution Code"}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center group">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Building className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-lg text-primary">N/A</h4>
                    <p className="text-xs text-primary/70 font-medium uppercase tracking-wider">
                        {t("center_code") || "Center Code"}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center group">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-lg text-primary">2025</h4>
                    <p className="text-xs text-primary/70 font-medium uppercase tracking-wider">
                        {t("established") || "Established"}
                    </p>
                </div>
            </div>
        </div>
    );
}
