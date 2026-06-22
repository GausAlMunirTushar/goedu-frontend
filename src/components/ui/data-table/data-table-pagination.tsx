import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
    page: number;
    pageCount: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function DataTablePagination({
    page,
    pageCount,
    pageSize,
    totalCount,
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const safePage = Number(page) || 1;
    const safePageSize = Number(pageSize) || 0;
    const safeTotal = Number(totalCount) || 0;

    const from = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1;
    const to = safeTotal === 0 ? 0 : Math.min(safePage * safePageSize, safeTotal);

    return (
        <div className="flex items-center justify-between px-2 gap-6 font-[inherit]">
            {/* Count info */}
            <div className="text-sm text-muted-foreground font-[inherit]">
                {t("showing")} <span className="font-medium">{from}</span> -{" "}
                <span className="font-medium">{to}</span> {t("of")}{" "}
                <span className="font-medium">{totalCount}</span>
            </div>

            <div className="flex items-center gap-6">
                {/* Rows per page */}
                <div className="flex items-center space-x-2 font-[inherit]">
                    <p className="text-sm font-medium">{t("rows_per_page")}</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Page info */}
                <div className="flex w-[120px] items-center justify-center text-sm font-medium font-[inherit]">
                    {t("page")} {page} {t("of")} {pageCount}
                </div>

                {/* Navigation */}
                <div className="flex items-center space-x-2 font-[inherit]">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(1)}
                        disabled={page === 1}
                    >
                        <ChevronsLeft />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === pageCount}
                    >
                        <ChevronRight />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(pageCount)}
                        disabled={page === pageCount}
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
