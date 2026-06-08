"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import { fallbackLng } from "@/lib/i18n/settings";

interface LanguageContextType {
    lng: string;
    setLng: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lng, setLngState] = useState<string>(() => Cookies.get("locale") || fallbackLng);

    useEffect(() => {
        document.documentElement.setAttribute("lang", lng);
    }, [lng]);

    const setLng = useCallback((newLng: string) => {
        Cookies.set("locale", newLng, { path: "/", expires: 365 });
        document.documentElement.setAttribute("lang", newLng);
        setLngState(newLng);
    }, []);

    const value = useMemo(() => ({ lng, setLng }), [lng, setLng]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
};
