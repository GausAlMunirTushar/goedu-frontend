"use client";
import React from "react";
import Slider from "@/components/layout/web/Slider";
import { Building, GraduationCap, Clock, FileCheck, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import HomeGallery from "@/components/pages/home/HomeGallery";
import StudentGallery from "@/components/pages/home/StudentGallery";

export default function Home() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Slider />
            
            {/* Quick Stats Banner */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-40">
                <div className="bg-white rounded-2xl shadow-lg shadow-primary/5 border border-primary/10 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="flex flex-col items-center justify-center group">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <FileCheck className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-primary">15005030</h4>
                        <p className="text-xs text-primary/70 font-medium uppercase tracking-wider">{t("institution_bin") || "Institution BIN"}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center group">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Building className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-primary">N/A</h4>
                        <p className="text-xs text-primary/70 font-medium uppercase tracking-wider">{t("institution_code") || "Institution Code"}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center group">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Building className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-primary">N/A</h4>
                        <p className="text-xs text-primary/70 font-medium uppercase tracking-wider">{t("center_code") || "Center Code"}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center group">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-primary">2025</h4>
                        <p className="text-xs text-primary/70 font-medium uppercase tracking-wider">{t("established") || "Established"}</p>
                    </div>
                </div>
            </div>

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
                        <p className="text-gray-600 italic leading-relaxed relative z-10">Welcome to Demo International High School. We are dedicated to providing excellence in education. Our mission is to empower students with knowledge, moral values, and skills necessary to face the challenges of tomorrow&apos;s world.</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-primary inline-block pb-2">{t("about_institution") || "About Institution"}</h2>
                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                            Demo International High School is a premier educational institution committed to fostering academic excellence, critical thinking, and character development in students. Our campus is equipped with modern facilities designed to create an engaging learning environment.
                        </p>
                        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold shadow-sm shadow-primary/30 transition-all hover:shadow-md">
                            {t("read_more") || "Read More"}
                        </button>
                    </div>
                </div>

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

            {/* Teachers Section */}
            <div className="bg-white py-20 border-t border-primary/10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12 relative inline-block">
                        {t("teachers") || "Teachers"}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></div>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1,2,3,4,5,6].map((i) => (
                            <div key={i} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex items-center gap-5 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all text-left group">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:border-primary/30">
                                    <User className="text-gray-400 w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Teacher Name {i}</h4>
                                    <p className="text-xs text-gray-500 mb-3">(Assistant Teacher)</p>
                                    <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider group-hover:bg-primary group-hover:text-primary-foreground transition-colors">{t("details") || "Details"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-12 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-full font-bold shadow-sm shadow-primary/30 transition-all hover:shadow-md hover:-translate-y-0.5">
                        {t("view_all_teachers") || "View All Teachers"}
                    </button>
                    <StudentGallery locale={lng} />
                    <HomeGallery locale={lng} />
                </div>
            </div>
        </div>
    );
}
