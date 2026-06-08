"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import {
    Briefcase,
    Building2,
    DollarSign,
    Edit3,
    ExternalLink,
    GraduationCap,
    User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserSidebarNavigationProps {
    userId: number;
}

export default function UserSidebarNavigation({ userId }: UserSidebarNavigationProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const pathname = usePathname();

    const navItems = [
        {
            href: `/users/users/${userId}`,
            label: t("user_details") || "User Details",
            icon: ExternalLink,
        },
        {
            href: `/users/users/${userId}/edit`,
            label: t("edit_user") || "Edit User",
            icon: Edit3,
        },
        {
            href: `/users/users/${userId}/user-designations`,
            label: t("manage_user_designations") || "Manage User Designations",
            icon: Briefcase,
        },
        {
            href: `/users/users/${userId}/job-status`,
            label: t("manage_job_status") || "Manage Job Status",
            icon: Building2,
        },
        {
            href: `/users/users/${userId}/grades`,
            label: t("manage_grades") || "Manage Grades",
            icon: GraduationCap,
        },
        // {
        //     href: `/users/users/${userId}/salaries`,
        //     label: t("manage_salaries") || "Manage Salaries",
        //     icon: DollarSign,
        // },
    ];

    return (
        <div className="lg:w-1/4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t("actions") || "Actions"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="block">
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start py-5 cursor-pointer ${
                                            isActive
                                                ? "bg-accent text-accent-foreground font-medium"
                                                : ""
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4 mr-3" />
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
