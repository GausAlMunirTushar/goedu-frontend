"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, Settings, GripVertical, Plus, Trash2 } from "lucide-react";
import Title from "@/components/ui/custom-ui/title";

interface FieldConfig {
    id: string;
    name: string;
    label_en: string;
    label_bn: string;
    type: "text" | "number" | "currency" | "date" | "formula";
    section: "header" | "earnings" | "deductions" | "footer";
    is_visible: boolean;
    is_required: boolean;
    order: number;
    formula?: string;
}

export default function PayslipFieldsPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);

    const [headerFields, setHeaderFields] = useState<FieldConfig[]>([
        {
            id: "1",
            name: "employee_name",
            label_en: "Employee Name",
            label_bn: "কর্মচারীর নাম",
            type: "text",
            section: "header",
            is_visible: true,
            is_required: true,
            order: 1,
        },
        {
            id: "2",
            name: "employee_id",
            label_en: "Employee ID",
            label_bn: "কর্মচারী আইডি",
            type: "text",
            section: "header",
            is_visible: true,
            is_required: true,
            order: 2,
        },
        {
            id: "3",
            name: "department",
            label_en: "Department",
            label_bn: "বিভাগ",
            type: "text",
            section: "header",
            is_visible: true,
            is_required: false,
            order: 3,
        },
        {
            id: "4",
            name: "designation",
            label_en: "Designation",
            label_bn: "পদবী",
            type: "text",
            section: "header",
            is_visible: true,
            is_required: false,
            order: 4,
        },
        {
            id: "5",
            name: "pay_period",
            label_en: "Pay Period",
            label_bn: "বেতন মেয়াদ",
            type: "text",
            section: "header",
            is_visible: true,
            is_required: true,
            order: 5,
        },
    ]);

    const [earningsFields, setEarningsFields] = useState<FieldConfig[]>([
        {
            id: "6",
            name: "basic_salary",
            label_en: "Basic Salary",
            label_bn: "মূল বেতন",
            type: "currency",
            section: "earnings",
            is_visible: true,
            is_required: true,
            order: 1,
        },
        {
            id: "7",
            name: "house_rent",
            label_en: "House Rent",
            label_bn: "বাড়ি ভাড়া",
            type: "currency",
            section: "earnings",
            is_visible: true,
            is_required: false,
            order: 2,
        },
        {
            id: "8",
            name: "medical_allowance",
            label_en: "Medical Allowance",
            label_bn: "চিকিৎসা ভাতা",
            type: "currency",
            section: "earnings",
            is_visible: true,
            is_required: false,
            order: 3,
        },
        {
            id: "9",
            name: "conveyance",
            label_en: "Conveyance",
            label_bn: "যাতায়াত ভাতা",
            type: "currency",
            section: "earnings",
            is_visible: true,
            is_required: false,
            order: 4,
        },
        {
            id: "10",
            name: "other_allowance",
            label_en: "Other Allowance",
            label_bn: "অন্যান্য ভাতা",
            type: "currency",
            section: "earnings",
            is_visible: true,
            is_required: false,
            order: 5,
        },
    ]);

    const [deductionsFields, setDeductionsFields] = useState<FieldConfig[]>([
        {
            id: "11",
            name: "tax",
            label_en: "Income Tax",
            label_bn: "আয়কর",
            type: "currency",
            section: "deductions",
            is_visible: true,
            is_required: false,
            order: 1,
        },
        {
            id: "12",
            name: "provident_fund",
            label_en: "Provident Fund",
            label_bn: "ভবিষ্য তহবিল",
            type: "currency",
            section: "deductions",
            is_visible: true,
            is_required: false,
            order: 2,
        },
        {
            id: "13",
            name: "loan_payment",
            label_en: "Loan Payment",
            label_bn: "ঋণ পরিশোধ",
            type: "currency",
            section: "deductions",
            is_visible: true,
            is_required: false,
            order: 3,
        },
    ]);

    const toggleFieldVisibility = (
        fieldId: string,
        section: "header" | "earnings" | "deductions",
    ) => {
        const updateFields = (fields: FieldConfig[]) =>
            fields.map((f) => (f.id === fieldId ? { ...f, is_visible: !f.is_visible } : f));

        if (section === "header") setHeaderFields(updateFields(headerFields));
        else if (section === "earnings") setEarningsFields(updateFields(earningsFields));
        else if (section === "deductions") setDeductionsFields(updateFields(deductionsFields));
    };

    const toggleFieldRequired = (
        fieldId: string,
        section: "header" | "earnings" | "deductions",
    ) => {
        const updateFields = (fields: FieldConfig[]) =>
            fields.map((f) => (f.id === fieldId ? { ...f, is_required: !f.is_required } : f));

        if (section === "header") setHeaderFields(updateFields(headerFields));
        else if (section === "earnings") setEarningsFields(updateFields(earningsFields));
        else if (section === "deductions") setDeductionsFields(updateFields(deductionsFields));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Add API call to save field configuration
        setTimeout(() => setIsLoading(false), 1000);
    };

    const renderFieldRow = (field: FieldConfig, section: "header" | "earnings" | "deductions") => (
        <div
            key={field.id}
            className="grid grid-cols-12 gap-4 items-center p-3 bg-gray-50 rounded-lg"
        >
            <div className="col-span-1 flex justify-center text-gray-400">
                <GripVertical className="w-5 h-5" />
            </div>
            <div className="col-span-3">
                <p className="font-medium">{field.label_en}</p>
                <p className="text-xs text-gray-500">{field.label_bn}</p>
            </div>
            <div className="col-span-2">
                <span className="text-xs px-2 py-1 bg-gray-200 rounded capitalize">
                    {field.type}
                </span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
                <Switch
                    checked={field.is_visible}
                    onCheckedChange={() => toggleFieldVisibility(field.id, section)}
                />
                <Label className="text-sm">{t("visible")}</Label>
            </div>
            <div className="col-span-2 flex items-center gap-2">
                <Switch
                    checked={field.is_required}
                    onCheckedChange={() => toggleFieldRequired(field.id, section)}
                />
                <Label className="text-sm">{t("required")}</Label>
            </div>
            <div className="col-span-2 flex justify-end">
                <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );

    return (
        <section className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Settings className="w-8 h-8 text-orange-600" />
                        <div>
                            <CardTitle>
                                <Title>{t("payslip_field_configuration")}</Title>
                            </CardTitle>
                            <CardDescription>
                                {t("payslip_field_configuration_description")}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8">
                        {/* Header Fields */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{t("header_fields")}</h3>
                                <Button type="button" variant="outline" size="sm">
                                    <Plus className="w-4 h-4" />
                                    {t("add_field")}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                                    <div className="col-span-1 text-center">{t("drag")}</div>
                                    <div className="col-span-3">{t("field_name")}</div>
                                    <div className="col-span-2">{t("type")}</div>
                                    <div className="col-span-2">{t("visibility")}</div>
                                    <div className="col-span-2">{t("requirement")}</div>
                                    <div className="col-span-2 text-right">{t("actions")}</div>
                                </div>
                                {headerFields.map((field) => renderFieldRow(field, "header"))}
                            </div>
                        </div>

                        {/* Earnings Fields */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{t("earnings_fields")}</h3>
                                <Button type="button" variant="outline" size="sm">
                                    <Plus className="w-4 h-4" />
                                    {t("add_field")}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {earningsFields.map((field) => renderFieldRow(field, "earnings"))}
                            </div>
                        </div>

                        {/* Deductions Fields */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{t("deductions_fields")}</h3>
                                <Button type="button" variant="outline" size="sm">
                                    <Plus className="w-4 h-4" />
                                    {t("add_field")}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {deductionsFields.map((field) =>
                                    renderFieldRow(field, "deductions"),
                                )}
                            </div>
                        </div>

                        {/* Summary Fields */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("summary_fields")}</h3>
                            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{t("gross_salary")}</span>
                                    <span className="text-sm text-gray-500">
                                        {t("auto_calculated")} = {t("sum_of_earnings")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{t("total_deductions")}</span>
                                    <span className="text-sm text-gray-500">
                                        {t("auto_calculated")} = {t("sum_of_deductions")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center font-bold">
                                    <span>{t("net_salary")}</span>
                                    <span className="text-sm text-gray-500">
                                        {t("auto_calculated")} = {t("gross_salary")} -{" "}
                                        {t("total_deductions")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t pt-6">
                        <Button type="button" variant="outline">
                            {t("reset_to_default")}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {t("saving")}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {t("save_changes")}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </section>
    );
}
