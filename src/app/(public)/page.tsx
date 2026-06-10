"use client";
import React from "react";
import Slider from "@/components/layout/web/Slider";
import AcademicPrograms from "@/components/pages/home/AcademicPrograms";
import AcademicStats from "@/components/pages/home/AcademicStats";
import QuickStats from "@/components/pages/home/QuickStats";
import PrincipalMessageAbout from "@/components/pages/home/PrincipalMessageAbout";
import TeacherSection from "@/components/pages/home/TeacherSection";
import StudentGallery from "@/components/pages/home/StudentGallery";
import HomeGallery from "@/components/pages/home/HomeGallery";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
    const { lng } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Slider />
            
            <QuickStats />

            <PrincipalMessageAbout />

            <AcademicPrograms />
            <AcademicStats />

            <TeacherSection />

            <StudentGallery locale={lng} />
            <HomeGallery locale={lng} />
        </div>
    );
}
