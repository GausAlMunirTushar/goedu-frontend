"use client";
import React from "react";
import WebPageHeader from "@/components/layout/web/WebPageHeader";
import NoticeCard from "@/components/pages/academic/NoticeCard";
import { Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

import { notices } from "@/data/notices";

export default function NoticesPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <WebPageHeader 
                title={t("notice_board") || "Notice Board"} 
                subtitle={t("notice_subtitle") || "Stay updated with the latest announcements, circulars, and institutional news."}
                icon={Bell} 
            />
            
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="flex justify-end mb-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-1 flex items-center">
                        <button 
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-900'}`}
                            title="Grid View"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                        </button>
                        <button 
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-900'}`}
                            title="List View"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>

                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
                    {notices.map((notice) => (
                        <NoticeCard key={notice.id} {...notice} viewMode={viewMode} />
                    ))}
                </div>
            </div>
        </div>
    );
}
