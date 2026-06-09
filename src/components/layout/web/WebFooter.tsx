"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { topBarData, webHeaderData } from "@/data/webData";

export default function WebFooter() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <footer className="bg-[#f8f9fa] text-gray-600 pt-20 pb-8 border-t-4 border-primary relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
                
                {/* Column 1: About */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center">
                            <Image src="/logo.svg" alt="ePathshala Logo" width={48} height={48} className="w-12 h-12 object-contain" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 leading-tight">
                                {lng === "bn" ? webHeaderData.schoolNameBn : webHeaderData.schoolNameEn}
                            </h3>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        We are dedicated to providing excellence in education. Our mission is to empower students with knowledge, moral values, and skills necessary to face the challenges of tomorrow&apos;s world.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                        <a href={topBarData.socials.facebook} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"><Facebook className="w-4 h-4" /></a>
                        <a href={topBarData.socials.twitter} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"><Twitter className="w-4 h-4" /></a>
                        <a href={topBarData.socials.instagram} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"><Instagram className="w-4 h-4" /></a>
                        <a href={topBarData.socials.youtube} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"><Youtube className="w-4 h-4" /></a>
                    </div>
                </div>

                {/* Column 2: Contact Info */}
                <div>
                    <h3 className="font-bold text-lg mb-6 text-gray-900">{t("contact") || "যোগাযোগ"}</h3>
                    <div className="space-y-4 text-sm text-gray-600">
                        <div className="flex items-start gap-3 group">
                            <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <p className="leading-relaxed">
                                {lng === "bn" ? webHeaderData.addressBn : webHeaderData.address}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                <Phone className="w-4 h-4" />
                            </div>
                            <p>{topBarData.phone}</p>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                <Mail className="w-4 h-4" />
                            </div>
                            <p>{topBarData.email}</p>
                        </div>
                    </div>
                </div>

                {/* Column 3: Important Links */}
                <div>
                    <h3 className="font-bold text-lg mb-6 text-gray-900">{t("important_links") || "Important Links"}</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li>
                            <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" /> Ministry of Education
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" /> Education Board
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" /> UGC Bangladesh
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" /> DSHE
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Pathshala Branding */}
                <div className="flex flex-col items-start lg:items-end justify-start">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm w-full hover:border-primary/30 transition-all duration-300 group">
                        <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">Powered By</p>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                                P
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-gray-900 leading-tight">ePathshala</h4>
                                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mt-1">Education Management System</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4 relative z-10">
                <p>&copy; {new Date().getFullYear()} {lng === "bn" ? webHeaderData.schoolNameBn : webHeaderData.schoolNameEn}. All rights reserved.</p>
                <p className="flex items-center gap-1">
                    Developed by <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">IngoTech</a>
                </p>
            </div>
        </footer>
    );
}
