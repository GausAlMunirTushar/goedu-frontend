"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SettingsDashboard() {
    const cards = [
        {
            title: "User Management",
            desc: "Add, edit, and assign roles to system users.",
            icon: User,
            path: "/settings/users",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
        },
        {
            title: "Permissions & Roles",
            desc: "Define granular permissions and role hierarchies.",
            icon: ShieldCheck,
            path: "/settings/role-permission",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "System Preferences",
            desc: "Configure site-wide settings, themes, and integrations.",
            icon: Settings,
            path: "/settings/preferences",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="border-b border-gray-100 pb-4">
                <Title>Settings Dashboard</Title>
                <p className="text-sm text-gray-500 mt-1">
                    Manage system configuration, users, and permissions from one place.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <Card
                            key={i}
                            className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow group"
                        >
                            <CardHeader className="pb-3">
                                <div
                                    className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-base font-bold text-gray-800">
                                    {card.title}
                                </CardTitle>
                                <CardDescription className="text-xs text-gray-500 leading-relaxed pt-1">
                                    {card.desc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 pb-4 px-6">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-xs font-semibold text-primary hover:text-primary/95 group-hover:bg-primary/5 justify-between px-2"
                                >
                                    <Link href={card.path}>
                                        Open{" "}
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
