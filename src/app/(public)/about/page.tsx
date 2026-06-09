"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { GraduationCap, BookOpen, Users, Target, Award, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { webHeaderData } from "@/data/webData";
import Link from "next/link";

export default function AboutPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    const values = [
        {
            icon: BookOpen,
            title: "academic_excellence",
            description: "Fostering a culture of continuous learning and high academic achievement.",
            defaultTitle: "Academic Excellence"
        },
        {
            icon: Users,
            title: "community",
            description: "Building a supportive, inclusive, and collaborative environment.",
            defaultTitle: "Community"
        },
        {
            icon: Target,
            title: "innovation",
            description: "Embracing new ideas and creative approaches to problem-solving.",
            defaultTitle: "Innovation"
        },
        {
            icon: Award,
            title: "integrity",
            description: "Upholding strong moral principles and ethical standards in all we do.",
            defaultTitle: "Integrity"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-primary/5 py-20 border-b border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-semibold">{t("about_us") || "About Us"}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                        {t("welcome_to") || "Welcome to"}{" "}
                        <span className="text-primary block md:inline mt-2 md:mt-0">
                            {lng === "bn" ? webHeaderData.schoolNameBn : webHeaderData.schoolNameEn}
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Dedicated to nurturing the leaders of tomorrow through holistic education, critical thinking, and character development since {webHeaderData.establishedYear}.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                {/* Mission & Vision Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Our Mission & Vision</h2>
                        <div className="w-20 h-1 bg-primary rounded-full"></div>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our mission is to empower students with knowledge, moral values, and the skills necessary to face the challenges of tomorrow&apos;s world. We strive to create an inclusive environment where every student can discover their unique potential.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We envision a learning community that inspires lifelong learning, fosters global citizenship, and cultivates innovative thinkers who will contribute positively to society.
                        </p>
                        <div className="pt-4">
                            <Link href="/contact" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors">
                                Get in touch with us <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gray-200 shadow-xl flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="font-medium">Institution Image</p>
                        </div>
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            These fundamental principles guide our educational approach and shape the culture of our institution.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow bg-white text-center group">
                                    <CardContent className="pt-8 pb-8 px-6">
                                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-900 mb-3">{t(value.title) || value.defaultTitle}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Institution Stats Summary */}
                <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Excellence in Education</h2>
                        <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-10">
                            Join our vibrant academic community and embark on a journey of discovery, growth, and unparalleled achievement.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/contact" className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg">
                                Admission Inquiry
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
