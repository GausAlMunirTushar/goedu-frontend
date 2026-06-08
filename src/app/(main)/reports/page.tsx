"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, DollarSign, FileText, Download, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

const reportCategories = [
    {
        id: "employee-reports",
        title: "employee_reports",
        description: "employee_reports_description",
        icon: Users,
        path: "/reports/employees",
        color: "blue",
        features: ["employee_list", "attendance_summary", "department_wise", "employment_status"],
    },
    {
        id: "salary-reports",
        title: "salary_reports",
        description: "salary_reports_description",
        icon: DollarSign,
        path: "/reports/salary",
        color: "green",
        features: ["payroll_summary", "salary_breakdown", "bonus_report", "deduction_report"],
    },
];

export default function ReportsDashboard() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <section className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                        {t("reports_dashboard")}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        {t("reports_dashboard_description")}
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("total_employees")}</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("monthly_payroll")}</p>
                                <p className="text-2xl font-bold">৳ 0</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("present_today")}</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("attendance_rate")}</p>
                                <p className="text-2xl font-bold">0%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Report Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                        <Link key={category.id} href={category.path}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${category.color}-100`}
                                        >
                                            <Icon
                                                className={`w-6 h-6 text-${category.color}-600`}
                                            />
                                        </div>
                                        <Download
                                            className={`w-5 h-5 text-${category.color}-600`}
                                        />
                                    </div>
                                    <CardTitle className="text-lg mt-4">
                                        {t(category.title)}
                                    </CardTitle>
                                    <CardDescription>{t(category.description)}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2">
                                        {category.features.map((feature) => (
                                            <div
                                                key={feature}
                                                className="text-xs px-2 py-1 bg-gray-100 rounded"
                                            >
                                                {t(feature)}
                                            </div>
                                        ))}
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
