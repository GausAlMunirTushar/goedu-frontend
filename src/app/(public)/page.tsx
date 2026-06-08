"use client";
import { Button } from "@/components/ui/button";
import {
    Rocket,
    GraduationCap,
    Users,
    FileText,
    DollarSign,
    Calendar,
    CheckCircle2,
} from "lucide-react";
import StatusItem from "@/components/common/StatusItem";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

export default function Home() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="text-center mb-16 animate-fade-in">
                    {/* Coming Soon Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 animate-bounce-in">
                        <Rocket className="w-4 h-4" />
                        <span className="text-sm font-semibold">{t("coming_soon")}</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {t("bdren_university")}
                    </h1>
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                        {t("management_system")}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                        {t("platform_description")}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center mb-12">
                        <Button size="lg" className="text-lg px-8 py-6">
                            {t("get_notified")}
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                            {t("learn_more")}
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <FeatureCard
                        icon={<GraduationCap className="w-8 h-8" />}
                        title={t("student_management")}
                        description={t("student_management_desc")}
                    />
                    <FeatureCard
                        icon={<DollarSign className="w-8 h-8" />}
                        title={t("financial_management")}
                        description={t("financial_management_desc")}
                        link="/accounts/list-view"
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8" />}
                        title={t("staff_administration")}
                        description={t("staff_administration_desc")}
                        link="/dashboard"
                    />
                    <FeatureCard
                        icon={<FileText className="w-8 h-8" />}
                        title={t("document_management")}
                        description={t("document_management_desc")}
                    />
                    <FeatureCard
                        icon={<Calendar className="w-8 h-8" />}
                        title={t("scheduling")}
                        description={t("scheduling_desc")}
                    />
                    <FeatureCard
                        icon={<CheckCircle2 className="w-8 h-8" />}
                        title={t("compliance_reports")}
                        description={t("compliance_reports_desc")}
                    />
                </div>

                {/* Status Section */}
                <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12">
                    <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        {t("development_status")}
                    </h3>
                    <div className="space-y-4">
                        <StatusItem label={t("system_architecture")} progress={100} />
                        <StatusItem label={t("core_features")} progress={75} />
                        <StatusItem label={t("user_interface")} progress={60} />
                        <StatusItem label={t("testing_qa")} progress={40} />
                        <StatusItem label={t("documentation")} progress={50} />
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            {t("expected_launch")}:{" "}
                            <span className="font-semibold text-blue-600">Q2 2026</span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-gray-500">
                    <p>{t("powered_by")}</p>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    link,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    link?: string;
}) {
    return (
        <div className="bg-white rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer">
            {link ? (
                <Link href={link}>
                    <div className="text-blue-600 mb-4">{icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                </Link>
            ) : (
                <div>
                    <div className="text-blue-600 mb-4">{icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                </div>
            )}
        </div>
    );
}
