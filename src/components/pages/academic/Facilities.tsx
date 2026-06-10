"use client";
import React from "react";
import WebPageHeader from "@/components/layout/web/WebPageHeader";
import { Building2, Wifi, Book, Coffee, Monitor, Music } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardContent } from "@/components/ui/card";

const facilitiesData = [
    {
        icon: Book,
        titleEn: "Modern Library",
        titleBn: "আধুনিক লাইব্রেরি",
        descEn: "A vast collection of books, journals, and digital resources for students.",
        descBn: "শিক্ষার্থীদের জন্য বই, জার্নাল এবং ডিজিটাল রিসোর্সের বিশাল সংগ্রহ।"
    },
    {
        icon: Monitor,
        titleEn: "Computer Lab",
        titleBn: "কম্পিউটার ল্যাব",
        descEn: "State-of-the-art computer labs with high-speed internet and latest software.",
        descBn: "উচ্চগতির ইন্টারনেট এবং আধুনিক সফটওয়্যারসহ অত্যাধুনিক কম্পিউটার ল্যাব।"
    },
    {
        icon: Wifi,
        titleEn: "Smart Classrooms",
        titleBn: "স্মার্ট ক্লাসরুম",
        descEn: "Interactive smart boards and multimedia projectors in every classroom.",
        descBn: "প্রতিটি ক্লাসরুমে ইন্টারেক্টিভ স্মার্ট বোর্ড এবং মাল্টিমিডিয়া প্রজেক্টর।"
    },
    {
        icon: Coffee,
        titleEn: "Hygienic Canteen",
        titleBn: "স্বাস্থ্যসম্মত ক্যান্টিন",
        descEn: "Nutritious and hygienic food options for students and faculty.",
        descBn: "শিক্ষার্থী এবং শিক্ষকদের জন্য পুষ্টিকর ও স্বাস্থ্যসম্মত খাবারের ব্যবস্থা।"
    },
    {
        icon: Music,
        titleEn: "Auditorium",
        titleBn: "অডিটোরিয়াম",
        descEn: "Large auditorium for cultural events, seminars, and workshops.",
        descBn: "সাংস্কৃতিক অনুষ্ঠান, সেমিনার এবং ওয়ার্কশপের জন্য বিশাল অডিটোরিয়াম।"
    },
    {
        icon: Building2,
        titleEn: "Sports Complex",
        titleBn: "স্পোর্টস কমপ্লেক্স",
        descEn: "Facilities for indoor and outdoor sports including a large playground.",
        descBn: "বিশাল খেলার মাঠসহ ইনডোর এবং আউটডোর খেলার সুবিধা।"
    }
];

export default function Facilities() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <WebPageHeader 
                title={t("facilities") || "Campus Facilities"} 
                subtitle="Explore the modern infrastructure and facilities available at our institution."
                icon={Building2} 
            />
            
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {facilitiesData.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Card key={index} className="border-none shadow-sm hover:shadow-lg transition-all group overflow-hidden">
                                <div className="h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
                                <CardContent className="p-8">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {lng === "bn" ? item.titleBn : item.titleEn}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {lng === "bn" ? item.descBn : item.descEn}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
