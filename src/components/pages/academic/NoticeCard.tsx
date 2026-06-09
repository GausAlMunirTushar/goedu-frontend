import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

interface NoticeCardProps {
    id: string;
    title: string;
    date: string;
    description?: string;
    isNew?: boolean;
    viewMode?: "grid" | "list";
}

export default function NoticeCard({ id, title, date, description, isNew, viewMode = "grid" }: NoticeCardProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden ${
            viewMode === "list" ? "flex flex-col sm:flex-row sm:items-center gap-4" : "flex flex-col h-full"
        }`}>
            {isNew && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10">
                    {t("new") || "NEW"}
                </div>
            )}
            
            <div className={viewMode === "list" ? "flex-1" : ""}>
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{date}</span>
                    </div>
                </div>
                <h3 className={`text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors ${viewMode === "list" ? "" : "line-clamp-2"}`}>
                    {title}
                </h3>
                {description && (
                    <p className={`text-gray-600 text-xs mb-4 ${viewMode === "list" ? "line-clamp-2" : "line-clamp-3 flex-1"}`}>
                        {description}
                    </p>
                )}
            </div>
            
            <div className={`${viewMode === "list" ? "sm:w-auto shrink-0 flex items-center mt-0" : "mt-auto"}`}>
                <Link href={`/academic/notices/${id}`} className={`inline-flex items-center gap-1.5 text-primary font-semibold text-xs hover:text-primary/80 transition-colors group/link ${viewMode === "list" ? "bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary/10" : "w-fit"}`}>
                    {t("read_notice") || "Read Notice"}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
