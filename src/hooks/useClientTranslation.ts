"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useTranslationClient } from "@/lib/i18n/client";
import { fallbackLng } from "@/lib/i18n/settings";

/**
 * Custom hook for client-side translation with automatic language detection from cookies
 * @returns {Object} Translation function and current language
 */
export function useClientTranslation() {
    const [lng, setLng] = useState<string>(() => {
        // Read cookie immediately on initialization
        return Cookies.get("locale") || fallbackLng;
    });

    useEffect(() => {
        // No need to synchronously update language from cookie on mount;
        // polling below will handle any changes.

        // Poll for cookie changes every 300ms
        const interval = setInterval(() => {
            const currentCookieLng = Cookies.get("locale") || fallbackLng;
            setLng((prevLng) => {
                if (currentCookieLng !== prevLng) {
                    return currentCookieLng;
                }
                return prevLng;
            });
        }, 300);

        return () => clearInterval(interval);
    }, []);

    const { t } = useTranslationClient(lng);

    return { t, lng };
}
