"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, FileDown, FileSpreadsheet } from "lucide-react";
import { useReportDownloader } from "@/hooks/useApplication";

interface ExportDropdownButtonProps {
    exportUrl: string;
    exportFileName: string;
    label?: string;
}

const ExportDropdownButton = ({
    exportUrl,
    exportFileName,
    label = "Export",
}: ExportDropdownButtonProps) => {
    const [downloadFormat, setDownloadFormat] = React.useState<"pdf" | "xlsx">("pdf");
    const reportDownloader = useReportDownloader();
    const handleDownloadFormatChange = (format: "pdf" | "xlsx") => {
        setDownloadFormat(format);
    };

    const onExport = () => {
        reportDownloader.downloadReport(
            `${exportUrl}?report_format=${downloadFormat}`,
            exportFileName,
        );
    };

    return (
        <div className="flex">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="rounded-r-none border-r-0 px-2">
                        {downloadFormat === "pdf" ? (
                            <>
                                <FileDown className="size-4" aria-hidden="true" /> PDF
                            </>
                        ) : (
                            <>
                                <FileSpreadsheet className="size-4" aria-hidden="true" /> Excel
                            </>
                        )}
                        <ChevronDown className="ml-2 size-4" aria-hidden="true" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleDownloadFormatChange("pdf")}>
                        <FileDown className="size-4 mr-2" aria-hidden="true" />
                        PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadFormatChange("xlsx")}>
                        <FileSpreadsheet className="size-4 mr-2" aria-hidden="true" />
                        Excel
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-l-none border-l-0"
                onClick={onExport}
            >
                {label}
            </Button>
        </div>
    );
};

export default ExportDropdownButton;
