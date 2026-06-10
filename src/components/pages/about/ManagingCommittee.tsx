"use client";
import React from "react";
import WebPageHeader from "@/components/layout/web/WebPageHeader";
import { Users, User, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardContent } from "@/components/ui/card";

const committeeData = [
    { name: "John Doe", designationEn: "Chairman", designationBn: "চেয়ারম্যান", image: null },
    { name: "Jane Smith", designationEn: "Secretary", designationBn: "সম্পাদক", image: null },
    { name: "Robert Wilson", designationEn: "Treasurer", designationBn: "কোষাধ্যক্ষ", image: null },
    { name: "Mary Johnson", designationEn: "Member", designationBn: "সদস্য", image: null },
    { name: "David Brown", designationEn: "Member", designationBn: "সদস্য", image: null },
    { name: "Sarah Taylor", designationEn: "Member", designationBn: "সদস্য", image: null },
];

export default function ManagingCommittee() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <WebPageHeader 
                title={t("managing_committee") || "Managing Committee"} 
                subtitle="The dedicated team responsible for the strategic governance and management of our institution."
                icon={ShieldCheck} 
            />
            
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {committeeData.map((member, index) => (
                        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden bg-white">
                            <CardContent className="p-0">
                                <div className="h-64 bg-gray-100 flex items-center justify-center relative group-hover:bg-primary/5 transition-colors">
                                    <User className="w-24 h-24 text-gray-300 group-hover:text-primary/20 transition-colors" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                            {lng === "bn" ? member.designationBn : member.designationEn}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {lng === "bn" ? member.designationBn : member.designationEn}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
