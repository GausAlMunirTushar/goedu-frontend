import { fallbackLng } from "@/lib/i18n/settings";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export const metadata: Metadata = {
    title: "BdREN University Management System - Coming Soon",
    description:
        "A comprehensive platform for managing university operations, accounting, and administration. Powered by Bangladesh Research and Education Network.",
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
                <link
                    rel="preload"
                    href="/fonts/SolaimanLipiNormalCustomNumber.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous"
                />
            </head>
            <body suppressHydrationWarning className={`${inter.variable} antialiased`}>
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
