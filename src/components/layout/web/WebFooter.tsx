"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function WebFooter() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <footer className="bg-primary/5 text-primary pt-16 pb-8 border-t border-primary/10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div>
                    <h3 className="font-bold text-xl mb-4 text-primary">Demo International High School</h3>
                    <div className="space-y-3 text-sm text-primary/80">
                        <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> 01712345678</p>
                        <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> divine.edu.info@gmail.com</p>
                        <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Domar Road, Nilphamari</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-xl mb-4 text-primary">{t("important_links") || "Important Links"}</h3>
                    <ul className="space-y-2 text-sm text-primary/80">
                        <li><Link href="#" className="hover:text-primary transition">Ministry of Education</Link></li>
                        <li><Link href="#" className="hover:text-primary transition">Education Board</Link></li>
                        <li><Link href="#" className="hover:text-primary transition">UGC Bangladesh</Link></li>
                    </ul>
                </div>
                <div className="flex flex-col items-start md:items-end justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-primary/10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                        <div>
                            <h4 className="font-bold text-lg text-gray-800 leading-tight">Pathshala</h4>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Education Management System</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-primary/20 flex flex-col md:flex-row justify-between items-center text-sm text-primary/70 gap-4">
                <p>&copy; {new Date().getFullYear()} Demo International High School. All rights reserved.</p>
                <p>Developed by IT Lab Solutions Ltd.</p>
            </div>
        </footer>
    );
}
