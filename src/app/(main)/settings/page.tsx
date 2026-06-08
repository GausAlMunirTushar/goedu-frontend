"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Award, Building, Coins, FileText, Lock, Palette } from "lucide-react";
import Link from "next/link";

const settingsCategories = [
    {
        id: "organization",
        title: "organization_setting",
        description: "organization_setting_description",
        icon: Building,
        path: "/settings/organization",
        color: "blue",
    },
    {
        id: "currency",
        title: "currency_setting",
        description: "currency_setting_description",
        icon: Coins,
        path: "/settings/currency",
        color: "green",
    },
    {
        id: "theme",
        title: "theme_setting",
        description: "theme_setting_description",
        icon: Palette,
        path: "/settings/theme",
        color: "purple",
    },
    {
        id: "payslip",
        title: "payslip_setting",
        description: "payslip_setting_description",
        icon: FileText,
        path: "/settings/payslip",
        color: "orange",
    },
    {
        id: "salary-certificate",
        title: "salary_certificate_setting",
        description: "salary_certificate_setting_description",
        icon: Award,
        path: "/settings/salary-certificate",
        color: "red",
    },
];

export default function SettingsDashboard() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <section className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                        {t("settings_dashboard")}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        {t("settings_dashboard_description")}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingsCategories.map((category) => {
                    const Icon = category.icon as any;
                    return (
                        <Link key={category.id} href={category.path}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <div
                                        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 bg-${category.color}-100`}
                                    >
                                        <Icon className={`w-6 h-6 text-${category.color}-600`} />
                                    </div>
                                    <CardTitle className="text-lg">{t(category.title)}</CardTitle>
                                    <CardDescription>{t(category.description)}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className={`text-${category.color}-600 text-sm font-medium hover:underline`}
                                    >
                                        {t("configure_now")} →
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
