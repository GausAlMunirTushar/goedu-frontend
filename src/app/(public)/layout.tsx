import WebHeader from "@/components/layout/web/WebHeader";
import WebFooter from "@/components/layout/web/WebFooter";
import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <WebHeader />
            <main className="flex-1">{children}</main>
            <WebFooter />
        </div>
    );
}
