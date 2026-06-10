"use client";
import React from "react";
import { User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { teachers } from "@/data/teachers";
import Link from "next/link";

export default function TeacherSection() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    // Show only first 6 teachers on home page
    const displayTeachers = teachers.slice(0, 6);

    return (
        <div className="bg-white py-20 border-t border-primary/10">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-12 relative inline-block">
                    {t("teachers") || "Teachers"}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></div>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayTeachers.map((teacher, i) => (
                        <div key={teacher.id || i} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex items-center gap-5 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all text-left group">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:border-primary/30">
                                <User className="text-gray-400 w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">{teacher.name}</h4>
                                <p className="text-xs text-gray-500 mb-3">({teacher.designation})</p>
                                <Link 
                                    href={`/academic/teachers`} 
                                    className="text-[10px] bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold uppercase tracking-wider group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 inline-block"
                                >
                                    {t("details") || "Details"}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <Link 
                    href="/academic/teachers"
                    className="mt-12 inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-full font-bold shadow-sm shadow-primary/30 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                    {t("view_all_teachers") || "View All Teachers"}
                </Link>
            </div>
        </div>
    );
}
