"use client";
import React from "react";
import { GraduationCap, User } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

export default function PrincipalMessageAbout() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <>
            {/* Principal Message & About */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 border border-primary/10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full shrink-0 flex items-center justify-center ring-4 ring-primary/10 overflow-hidden">
                        <User className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="relative">
                        <div className="absolute -top-6 -left-4 text-primary/20 text-6xl font-serif">&quot;</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1 relative z-10">Harish</h3>
                        <p className="text-gray-600 font-medium mb-4 relative z-10">{t("principal") || "Principal"}</p>
                        <p className="text-gray-600 italic leading-relaxed relative z-10 mb-4">
                            Welcome to Demo International High School. We are dedicated to providing excellence in education. Our mission is to empower students with knowledge, moral values, and skills necessary to face the challenges of tomorrow&apos;s world.
                        </p>
                        <Link href="/about/principal-message" className="text-primary font-bold hover:underline inline-flex items-center gap-2">
                            {t("read_more") || "Read More"}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area: About Institution & Notice Board */}
            <div className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-primary/10 p-8 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-48 h-48 bg-primary/10 rounded-full shrink-0 border-12 border-primary/20 flex items-center justify-center">
                        <div className="text-center">
                            <GraduationCap className="w-12 h-12 text-primary mx-auto mb-2" />
                            <h4 className="font-bold text-gray-900 leading-tight">DEMO</h4>
                            <p className="text-[9px] uppercase font-bold text-gray-600 tracking-wider">International High School</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-primary inline-block pb-2">
                            {t("about_institution") || "About Institution"}
                        </h2>
                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                            Demo International High School is a premier educational institution committed to fostering academic excellence, critical thinking, and character development in students. Our campus is equipped with modern facilities designed to create an engaging learning environment.
                        </p>
                        <Link href="/about" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold shadow-sm shadow-primary/30 transition-all hover:shadow-md">
                            {t("read_more") || "Read More"}
                        </Link>
                    </div>
                </div>

                {/* Notice Board */}
                <div className="bg-white rounded-3xl border border-primary/10 shadow-sm p-8 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="text-red-500 text-2xl">📢</span> {t("notice_board") || "Notice Board"}
                    </h3>
                    <div className="space-y-4 flex-1">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4 hover:border-primary/30 hover:bg-primary/5 transition cursor-pointer">
                                <div className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">!</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm leading-tight">Class Routine Published</h4>
                                    <p className="text-[11px] text-gray-500 mt-1.5 font-medium flex items-center gap-1">🗓️ 11 January, 2026</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
                        {t("view_all_notices") || "View All Notices"}
                    </button>
                </div>
            </div>
        </>
    );
}
