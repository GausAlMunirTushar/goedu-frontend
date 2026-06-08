import WebHeader from "@/components/layout/web/WebHeader";
import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <WebHeader />
            <main className="flex-1">{children}</main>
        </div>
    );
}
