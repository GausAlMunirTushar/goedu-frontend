"use client";
import React from "react";
import WebPageHeader from "@/components/layout/web/WebPageHeader";
import { BookOpen, Download, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const syllabusData = [
    { class: "Class 6", title: "Half-Yearly Syllabus 2026", date: "Jan 10, 2026" },
    { class: "Class 7", title: "Half-Yearly Syllabus 2026", date: "Jan 10, 2026" },
    { class: "Class 8", title: "Half-Yearly Syllabus 2026", date: "Jan 10, 2026" },
    { class: "Class 9", title: "SSC Preparatory Syllabus 2026", date: "Jan 12, 2026" },
    { class: "Class 10", title: "SSC Final Syllabus 2026", date: "Jan 12, 2026" },
];

export default function Syllabus() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <WebPageHeader 
                title={t("syllabus") || "Academic Syllabus"} 
                subtitle="Download the latest academic syllabus for all classes and subjects."
                icon={BookOpen} 
            />
            
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {syllabusData.map((item, index) => (
                        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider">
                                        {item.class}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">Published on: {item.date}</p>
                                <Button className="w-full gap-2 rounded-xl" variant="outline">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
