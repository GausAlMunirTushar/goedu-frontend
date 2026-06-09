"use client";
import React from "react";
import WebPageHeader from "@/components/layout/web/WebPageHeader";
import TeacherCard from "@/components/pages/academic/TeacherCard";
import { Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

import { teachers } from "@/data/teachers";

export default function TeachersPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <WebPageHeader 
                title={t("our_teachers") || "Our Faculty & Teachers"} 
                subtitle={t("teachers_subtitle") || "Meet our dedicated team of experienced educators committed to shaping the future of our students."}
                icon={Users} 
            />
            
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {teachers.map((teacher) => (
                        <TeacherCard key={teacher.id} {...teacher} />
                    ))}
                </div>
            </div>
        </div>
    );
}
