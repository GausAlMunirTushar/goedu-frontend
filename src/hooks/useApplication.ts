"use client";

import { useContext } from "react";

import { ApplicationContext } from "@/contexts/ApplicationContext";

export const useAuth = () => {
    const context = useContext(ApplicationContext);
    if (!context) throw new Error("useAuth must be used within AuthGuard");
    return {
        isAuthenticated: context.isAuthenticated,
        user: context.user,
        permissions: context.user.permissions,
        role: context.user.roles,
        university: context.university,
    };
};

export const useApplication = () => {
    const context = useContext(ApplicationContext);
    if (!context) throw new Error("useApplication must be used within AuthGuard");
    return context;
};

export const useUniversity = () => {
    const context = useContext(ApplicationContext);
    if (!context) throw new Error("useUniversity must be used within AuthGuard");
    return context.university;
};

export const useCurrentFiscalYear = () => {
    const context = useContext(ApplicationContext);
    console.log("ApplicationContext:", context);
    if (!context) throw new Error("useCurrentFiscalYear must be used within AuthGuard");
    return context.current_fiscal_year;
};

/**
 * Returns the `downloadReport(url, reportType)` function from ApplicationContext.
 *
 * Calling it opens the download dialog, streams the file, and auto-saves it
 * with the server-provided filename.
 *
 * @example
 * const { downloadReport } = useReportDownload();
 * <Button onClick={() => downloadReport("/api/reports/salary/", "Salary Certificate")}>
 *   Download
 * </Button>
 */
export const useReportDownloader = () => {
    const context = useContext(ApplicationContext);
    if (!context) throw new Error("useReportDownload must be used within ApplicationProvider");
    return { downloadReport: context.downloadReport };
};
