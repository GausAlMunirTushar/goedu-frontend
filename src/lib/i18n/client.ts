"use client";

import i18next from "i18next";
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { getOptions, languages } from "./settings";
import { useEffect } from "react";

const runsOnServerSide = typeof window === "undefined";

// Initialize i18next for client-side
i18next
    .use(initReactI18next)
    .use(
        resourcesToBackend(
            (language: string, namespace: string) =>
                import(`./locales/${language}/${namespace}.json`),
        ),
    )
    .init({
        ...getOptions(),
        lng: undefined, // detect language on client side
        detection: {
            order: ["path", "htmlTag", "cookie", "navigator"],
        },
        preload: runsOnServerSide ? languages : [],
    });

export function useTranslationClient(
    lng: string,
    ns: string = "translation",
    options: { keyPrefix?: string } = {},
) {
    const ret = useTranslationOrg(ns, options);
    const { i18n } = ret;

    // Always call hooks unconditionally
    // Removed unnecessary state and effect for activeLng

    useEffect(() => {
        if (!lng || i18n.resolvedLanguage === lng) return;
        i18n.changeLanguage(lng);
    }, [lng, i18n]);

    if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
        i18n.changeLanguage(lng);
    }

    return ret;
}

// Alias for backward compatibility
export const useTranslation = useTranslationClient;
