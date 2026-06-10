"use client";
import React from "react";
import { Users, Award, Trophy, School } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const stats = [
    { 
        icon: Users, 
        labelEn: "Total Students", 
        labelBn: "মোট শিক্ষার্থী", 
        value: "1,200+", 
        color: "bg-blue-500" 
    },
    { 
        icon: School, 
        labelEn: "Expert Teachers", 
        labelBn: "অভিজ্ঞ শিক্ষক", 
        value: "45+", 
        color: "bg-emerald-500" 
    },
    { 
        icon: Award, 
        labelEn: "Pass Rate", 
        labelBn: "পাসের হার", 
        value: "100%", 
        color: "bg-amber-500" 
    },
    { 
        icon: Trophy, 
        labelEn: "GPA 5.00 (Last Year)", 
        labelBn: "জিপিএ ৫ (গত বছর)", 
        value: "85+", 
        color: "bg-purple-500" 
    },
];

export default function AcademicStats() {
    const { lng } = useLanguage();

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} className="text-center group">
                                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${stat.color} transform group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h4 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                                    {stat.value}
                                </h4>
                                <p className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-wide">
                                    {lng === "bn" ? stat.labelBn : stat.labelEn}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
