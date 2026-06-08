"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";

import type { FiscalYearType, SystemConfigType, UniversityType, UserType } from "@/types/configs";
import { useRouter } from "next/navigation";
import { useSetupQuery } from "@/apis/queries/dashboard_queries";
import Cookies from "js-cookie";
import { COOKIES_KEYS } from "@/configs/constants";
import Loader from "@/components/common/Loader";
import ReportDownloadDialog from "@/components/common/ReportDownloadDialog";

interface DownloadDialogState {
    open: boolean;
    url: string;
    reportType: string;
}

interface ApplicationContextType {
    user: UserType;
    isAuthenticated: boolean;
    university: UniversityType;
    system_configs: SystemConfigType;
    fiscal_years: FiscalYearType[];
    current_fiscal_year: FiscalYearType;
    app_version: string;
    environment: string;
    language: string;
    timezone: string;
    /**
     * Opens the report download dialog and streams the file from `url`.
     *
     * @param url        - Absolute or relative API endpoint that returns the file.
     * @param reportType - Human-readable label shown in the dialog (e.g. "Salary Certificate").
     */
    downloadReport: (url: string, reportType: string) => void;
}

export const ApplicationContext = createContext<ApplicationContextType>({
    user: {} as UserType,
    isAuthenticated: false,
    university: {} as UniversityType,
    fiscal_years: [],
    current_fiscal_year: {} as FiscalYearType,
    system_configs: {} as SystemConfigType,
    app_version: "",
    environment: "",
    language: "",
    timezone: "",
    downloadReport: () => {},
});

interface AuthGuardProps {
    children: React.ReactNode;
}

const CLOSED_DIALOG: DownloadDialogState = { open: false, url: "", reportType: "" };

const ApplicationProvider = ({ children }: AuthGuardProps) => {
    const router = useRouter();
    const { data, isLoading, mutate } = useSetupQuery();
    const [dialog, setDialog] = useState<DownloadDialogState>(CLOSED_DIALOG);

    useEffect(() => {
        const refreshToken = Cookies.get(COOKIES_KEYS.REFRESH_TOKEN);

        // If no refresh token → user not logged in
        if (!refreshToken) {
            router.replace("/login");
            return;
        }

        // Trigger setup query
        void mutate();
    }, [mutate, router]);

    const downloadReport = useCallback((url: string, reportType: string) => {
        setDialog({ open: true, url, reportType });
    }, []);

    const handleDialogClose = useCallback(() => {
        setDialog(CLOSED_DIALOG);
    }, []);

    // While loading setup data
    if (isLoading || !data) {
        return <Loader />;
    }

    // If setup failed (and Axios already handled refresh attempt)
    if (!data.success) {
        return <Loader />;
    }

    return (
        <ApplicationContext.Provider
            value={{
                user: data.data.user,
                university: data.data.university,
                isAuthenticated: true,
                fiscal_years: data.data.fiscal_years,
                current_fiscal_year: data.data.current_fiscal_year,
                system_configs: data.data.system_configs,
                app_version: data.data.app_version,
                environment: data.data.environment,
                language: data.data.language,
                timezone: data.data.timezone,
                downloadReport,
            }}
        >
            {children}

            <ReportDownloadDialog
                open={dialog.open}
                url={dialog.url}
                reportType={dialog.reportType}
                onClose={handleDialogClose}
            />
        </ApplicationContext.Provider>
    );
};

export default ApplicationProvider;
