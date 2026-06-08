import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { useApplication } from "@/hooks/useApplication";
import { FiscalYearType } from "@/types/configs";

type FiscalYearInputProps = {
    errors: undefined | string;
    data: string | undefined | number;
    setData: (value: string) => void;
    disabled?: boolean;
};

export default function FiscalYearInput({ data, disabled, setData, errors }: FiscalYearInputProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const setup = useApplication();

    const getDefaultValue = () => {
        if (data === undefined || data == "") {
            return String(setup.current_fiscal_year?.id);
        }
        return String(data);
    };

    useEffect(() => {
        if (data == undefined && setup.current_fiscal_year?.id != null) {
            setData(String(setup.current_fiscal_year.id));
        }
    }, [setup.current_fiscal_year]);

    return (
        <>
            <label className="block text-sm font-medium mb-2">
                {t("fiscal_year")} <span className="text-destructive">*</span>
            </label>
            <Select
                onValueChange={setData}
                disabled={disabled}
                defaultValue={getDefaultValue()}
                value={data === undefined ? undefined : String(data)}
            >
                <SelectTrigger>
                    <SelectValue placeholder={t("select_fiscal_year")} />
                </SelectTrigger>
                <SelectContent>
                    {(setup.fiscal_years ?? []).map((fy: FiscalYearType) => (
                        <SelectItem key={fy.id} value={String(fy.id)}>
                            {fy.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors && <div className="text-destructive text-xs">{errors}</div>}
        </>
    );
}
