"use client";
import React from "react";
import { BookOpen, GraduationCap, Users, BookMarked, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const programs = [
    {
        icon: BookOpen,
        titleEn: "Primary Education",
        titleBn: "প্রাথমিক শিক্ষা",
        rangeEn: "Class 1 - Class 5",
        rangeBn: "প্রথম শ্রেণী - পঞ্চম শ্রেণী",
        descEn: "Building a strong foundation with core subjects and moral values.",
        descBn: "মূল বিষয় এবং নৈতিক মূল্যবোধের সাথে একটি শক্তিশালী ভিত্তি গড়ে তোলা।"
    },
    {
        icon: BookMarked,
        titleEn: "Lower Secondary",
        titleBn: "নিম্ন মাধ্যমিক",
        rangeEn: "Class 6 - Class 8",
        rangeBn: "ষষ্ঠ শ্রেণী - অষ্টম শ্রেণী",
        descEn: "Developing critical thinking and exploring diverse academic interests.",
        descBn: "চিন্তাশীলতা এবং বিভিন্ন একাডেমিক বিষয়ের প্রতি আগ্রহ বিকাশ করা।"
    },
    {
        icon: GraduationCap,
        titleEn: "Secondary (SSC)",
        titleBn: "মাধ্যমিক (এসএসসি)",
        rangeEn: "Class 9 - Class 10",
        rangeBn: "নবম শ্রেণী - দশম শ্রেণী",
        descEn: "Focused preparation for board exams with science, arts, and commerce streams.",
        descBn: "বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখায় বোর্ড পরীক্ষার জন্য নিবিড় প্রস্তুতি।"
    }
];

export default function AcademicPrograms() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="py-20 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {lng === "bn" ? "আমাদের শিক্ষা কার্যক্রম" : "Academic Programs"}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {lng === "bn" 
                            ? "আমরা প্রতিটি স্তরে মানসম্মত শিক্ষা নিশ্চিত করি যাতে শিক্ষার্থীরা তাদের আগামীর চ্যালেঞ্জ মোকাবেলা করতে পারে।" 
                            : "We provide quality education at every level, ensuring students are prepared for their future challenges."}
                    </p>
                    <div className="w-20 h-1.5 bg-primary rounded-full mx-auto mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {programs.map((program, idx) => {
                        const Icon = program.icon;
                        return (
                            <Card key={idx} className="border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {lng === "bn" ? program.titleBn : program.titleEn}
                                    </h3>
                                    <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">
                                        {lng === "bn" ? program.rangeBn : program.rangeEn}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                        {lng === "bn" ? program.descBn : program.descEn}
                                    </p>
                                    <Link 
                                        href="/academic/syllabus" 
                                        className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all"
                                    >
                                        {lng === "bn" ? "বিস্তারিত দেখুন" : "View Details"} <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
