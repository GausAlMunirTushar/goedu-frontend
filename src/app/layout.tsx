import { fallbackLng } from "@/lib/i18n/settings";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import { cookies } from "next/headers";
import React from "react";

import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

const notoSansBengali = Noto_Sans_Bengali({
    variable: "--font-noto-bengali",
    subsets: ["bengali"],
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    title: "ePathshala - Smart Education Management System",
    description:
        "A comprehensive platform for managing education operations, accounting, and administration. Powered by ePathshala.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const lng = cookieStore.get("locale")?.value || fallbackLng;

    return (
        <html suppressHydrationWarning lang={lng}>
            <head>
            </head>
            <body suppressHydrationWarning className={`${inter.variable} ${notoSansBengali.variable} antialiased`}>
                <LanguageProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
