"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    LayoutTemplate,
    FileText,
    Bell,
    Image as ImageIcon,
    Phone,
    Globe,
    ArrowRight,
    MessageSquare,
    Eye
} from "lucide-react";
import Link from "next/link";

// Export sub-management views
export { HomepageManagement } from "./HomepageManagement";
export { AboutUsManagement } from "./AboutUsManagement";
export { NoticesManagement } from "./NoticesManagement";
export { GalleryManagement } from "./GalleryManagement";
export { ContactManagement } from "./ContactManagement";

export function CmsPage() {
    const cards = [
        {
            title: "Homepage Management",
            desc: "Update slider banners, quick stats, principal message, and about section.",
            icon: LayoutTemplate,
            path: "/website/homepage",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "About Us Content",
            desc: "Configure introduction paragraph, Vision, Mission, and strategic milestones.",
            icon: FileText,
            path: "/website/about",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Notices & Announcements",
            desc: "Draft, publish, and schedule school board notices with attachments.",
            icon: Bell,
            path: "/website/notices",
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            title: "Photo Gallery CMS",
            desc: "Organize campus events, sports days, and labs photos by categories.",
            icon: ImageIcon,
            path: "/website/gallery",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "Contact Settings & Inbox",
            desc: "Manage official phone/email details and reply to visitor inquiries.",
            icon: Phone,
            path: "/website/contact",
            color: "text-rose-500",
            bg: "bg-rose-500/10",
        },
    ];

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Page Title & Action */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Website CMS Dashboard</Title>
                    <p className="text-sm text-gray-500 mt-1">
                        Control and customize content published to your public school portal.
                    </p>
                </div>
                <Button asChild variant="outline" className="flex items-center gap-2 hover:bg-primary/5 transition-colors">
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 text-primary" /> View Live Portal <Eye className="w-3.5 h-3.5" />
                    </a>
                </Button>
            </div>

            {/* Quick Summary Widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">Hero Slides</span>
                            <h3 className="text-2xl font-extrabold text-gray-800 mt-1">2</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <LayoutTemplate className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">Live Notices</span>
                            <h3 className="text-2xl font-extrabold text-gray-800 mt-1">2</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                            <Bell className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">Gallery Photos</span>
                            <h3 className="text-2xl font-extrabold text-gray-800 mt-1">4</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-medium">New Messages</span>
                            <h3 className="text-2xl font-extrabold text-red-500 mt-1">1</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Card key={index} className="shadow-sm border-gray-200/60 hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between hover:shadow-md bg-white">
                            <CardHeader className="pb-3">
                                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-base font-bold text-gray-800">{card.title}</CardTitle>
                                <CardDescription className="text-xs text-gray-500 leading-relaxed pt-1">{card.desc}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 pb-4 px-6">
                                <Button asChild variant="ghost" size="sm" className="w-full text-xs font-semibold text-primary hover:text-primary/95 group-hover:bg-primary/5 justify-between px-2">
                                    <Link href={card.path}>
                                        Manage Content <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
