"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
    const { lng, setLng } = useLanguage();

    const toggleLanguage = () => {
        setLng(lng === "en" ? "bn" : "en");
    };

    return (
        <div
            onClick={toggleLanguage}
            className="relative flex items-center p-1 bg-muted/80 backdrop-blur-sm rounded-full border border-border cursor-pointer select-none w-40 h-9"
        >
            {/* Sliding Indicator */}
            <div
                className={cn(
                    "absolute h-[30px] w-[75px] bg-card rounded-full transition-all duration-300 ease-in-out",
                    lng === "bn" ? "translate-x-0" : "translate-x-[78px]"
                )}
            />

            {/* Labels */}
            <div className="relative z-10 flex w-full justify-between px-2">
                <div
                    className={cn(
                        "flex-1 flex justify-center items-center text-sm font-medium transition-colors duration-300",
                        lng === "bn" ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    বাংলা
                </div>
                <div
                    className={cn(
                        "flex-1 flex justify-center items-center text-sm font-medium transition-colors duration-300",
                        lng === "en" ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    English
                </div>
            </div>
        </div>
    );
}
