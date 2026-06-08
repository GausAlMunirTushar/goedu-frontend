"use client";

import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import Link from "next/link";

export default function WebHeader() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Left: UMS Brand */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            BdREN UMS
                        </span>
                    </Link>
                </div>

                {/* Right: Language Switcher + Login Button */}
                <div className="flex items-center gap-2 md:gap-4">
                    <LanguageSwitcher />
                    <Button asChild size="sm" className="hidden sm:inline-flex">
                        <Link href="/login">{t("login")}</Link>
                    </Button>
                    {/* Mobile Login Button - Icon Only */}
                    <Button asChild size="icon" className="sm:hidden">
                        <Link href="/login">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" x2="3" y1="12" y2="12" />
                            </svg>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
