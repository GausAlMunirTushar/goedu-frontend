"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Sparkles, Building2, Users, Shield } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

const plans = [
    {
        name: "free",
        icon: Users,
        priceMonthly: "৳0",
        priceYearly: "৳0",
        description: "free_description",
        features: [
            "up_to_10_employees",
            "basic_attendance_tracking",
            "payroll_management",
            "email_support",
            "1_admin_user",
        ],
        cta: "start_free_trial",
        popular: false,
    },
    {
        name: "starter",
        icon: Users,
        priceMonthly: "৳999",
        priceYearly: "৳9,990",
        description: "starter_description",
        features: [
            "up_to_50_employees",
            "advanced_attendance_tracking",
            "payroll_management",
            "leave_management",
            "email_support",
            "2_admin_users",
        ],
        cta: "start_free_trial",
        popular: false,
    },
    {
        name: "professional",
        icon: Building2,
        priceMonthly: "৳2,499",
        priceYearly: "৳24,990",
        description: "professional_description",
        features: [
            "up_to_200_employees",
            "advanced_attendance_tracking",
            "payroll_management",
            "leave_management",
            "reports_analytics",
            "priority_support",
            "5_admin_users",
            "api_access",
        ],
        cta: "start_free_trial",
        popular: true,
    },
    {
        name: "enterprise",
        icon: Shield,
        priceMonthly: "৳4,999",
        priceYearly: "৳49,990",
        description: "enterprise_description",
        features: [
            "unlimited_employees",
            "all_professional_features",
            "custom_integrations",
            "dedicated_account_manager",
            "custom_reports",
            "sla_support",
            "unlimited_admin_users",
            "advanced_security",
            "custom_training",
        ],
        cta: "contact_sales",
        popular: false,
    },
];

const features = [
    {
        name: "attendance_management",
        description: "attendance_management_desc",
    },
    {
        name: "payroll_processing",
        description: "payroll_processing_desc",
    },
    {
        name: "leave_tracking",
        description: "leave_tracking_desc",
    },
    {
        name: "performance_reviews",
        description: "performance_reviews_desc",
    },
    {
        name: "employee_database",
        description: "employee_database_desc",
    },
    {
        name: "compliance_reports",
        description: "compliance_reports_desc",
    },
];

export default function PricingPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-semibold">{t("flexible_pricing")}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                        {t("pricing_title")}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        {t("pricing_subtitle")}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/login">{t("get_started")}</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/">{t("learn_more")}</Link>
                        </Button>
                    </div>
                </div>

                {/* Pricing Plans */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        return (
                            <Card
                                key={plan.name}
                                className={`relative flex flex-col ${
                                    plan.popular
                                        ? "border-blue-500 shadow-xl scale-105"
                                        : "border-gray-200"
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        {t("most_popular")}
                                    </div>
                                )}
                                <CardHeader className="text-center pb-4">
                                    <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">
                                        {t(plan.name)}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {t(plan.description)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-gray-900 mb-2">
                                            {plan.priceMonthly}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {t("per_month")} / {t("or")} {plan.priceYearly} {t("per_year")}
                                        </div>
                                    </div>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-gray-700 text-sm">
                                                    {t(feature)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={plan.popular ? "default" : "outline"}
                                        size="lg"
                                        asChild
                                    >
                                        <Link href="/login">{t(plan.cta)}</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                {/* Features Section */}
                <div className="max-w-5xl mx-auto mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {t("all_plans_include")}
                        </h2>
                        <p className="text-gray-600 text-lg">
                            {t("all_plans_description")}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div
                                key={feature.name}
                                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    {t(feature.name)}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {t(feature.description)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("ready_to_get_started")}
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        {t("ready_to_get_started_description")}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-white text-primary hover:bg-orange-50"
                            asChild
                        >
                            <Link href="/login">{t("start_free_trial")}</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                            asChild
                        >
                            <Link href="/">{t("contact_sales")}</Link>
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-gray-500 text-sm">
                    <p>{t("pricing_footer_note")}</p>
                </div>
            </div>
        </div>
    );
}
