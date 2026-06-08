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
import { Save, Loader2, Settings, GripVertical, Plus, Award } from "lucide-react";
import Title from "@/components/ui/custom-ui/title";

interface FieldConfig {
    id: string;
    name: string;
    label_en: string;
    label_bn: string;
    type: "text" | "number" | "currency" | "date" | "formula";
    section: "header" | "employee_info" | "salary_info" | "footer";
    is_visible: boolean;
    is_required: boolean;
    order: number;
    placeholder?: string;
}

export default function SalaryCertificateFieldsPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);

    const [headerFields, setHeaderFields] = useState<FieldConfig[]>([
        {
            id: "1",
            name: "certificate_number",
            label_en: "Certificate Number",
            label_bn: "সনদপত্র নম্বর",
            type: "text",
            section: "header",
            is_visible: true,
            is_required: false,
            order: 1,
        },
        {
            id: "2",
            name: "issue_date",
            label_en: "Issue Date",
            label_bn: "ইস্যুর তারিখ",
            type: "date",
            section: "header",
            is_visible: true,
            is_required: true,
            order: 2,
        },
        {
            id: "3",
            name: "validity_period",
            label_en: "Validity Period",
            label_bn: "মেয়াদকাল",
            type: "text",
            section: "header",
            is_visible: true,
            is_required: false,
            order: 3,
        },
    ]);

    const [employeeInfoFields, setEmployeeInfoFields] = useState<FieldConfig[]>([
        {
            id: "4",
            name: "employee_name",
            label_en: "Employee Name",
            label_bn: "কর্মচারীর নাম",
            type: "text",
            section: "employee_info",
            is_visible: true,
            is_required: true,
            order: 1,
        },
        {
            id: "5",
            name: "employee_id",
            label_en: "Employee ID",
            label_bn: "কর্মচারী আইডি",
            type: "text",
            section: "employee_info",
            is_visible: true,
            is_required: true,
            order: 2,
        },
        {
            id: "6",
            name: "designation",
            label_en: "Designation",
            label_bn: "পদবী",
            type: "text",
            section: "employee_info",
            is_visible: true,
            is_required: true,
            order: 3,
        },
        {
            id: "7",
            name: "department",
            label_en: "Department",
            label_bn: "বিভাগ",
            type: "text",
            section: "employee_info",
            is_visible: true,
            is_required: false,
            order: 4,
        },
        {
            id: "8",
            name: "joining_date",
            label_en: "Joining Date",
            label_bn: "যোগদানের তারিখ",
            type: "date",
            section: "employee_info",
            is_visible: true,
            is_required: true,
            order: 5,
        },
        {
            id: "9",
            name: "employment_type",
            label_en: "Employment Type",
            label_bn: "কর্মসংস্থানের ধরন",
            type: "text",
            section: "employee_info",
            is_visible: true,
            is_required: false,
            order: 6,
        },
    ]);

    const [salaryInfoFields, setSalaryInfoFields] = useState<FieldConfig[]>([
        {
            id: "10",
            name: "basic_salary",
            label_en: "Basic Salary",
            label_bn: "মূল বেতন",
            type: "currency",
            section: "salary_info",
            is_visible: true,
            is_required: true,
            order: 1,
        },
        {
            id: "11",
            name: "house_rent",
            label_en: "House Rent",
            label_bn: "বাড়ি ভাড়া",
            type: "currency",
            section: "salary_info",
            is_visible: true,
            is_required: false,
            order: 2,
        },
        {
            id: "12",
            name: "medical_allowance",
            label_en: "Medical Allowance",
            label_bn: "চিকিৎসা ভাতা",
            type: "currency",
            section: "salary_info",
            is_visible: true,
            is_required: false,
            order: 3,
        },
        {
            id: "13",
            name: "other_allowances",
            label_en: "Other Allowances",
            label_bn: "অন্যান্য ভাতা",
            type: "currency",
            section: "salary_info",
            is_visible: true,
            is_required: false,
            order: 4,
        },
        {
            id: "14",
            name: "gross_salary",
            label_en: "Gross Salary",
            label_bn: "মোট বেতন",
            type: "currency",
            section: "salary_info",
            is_visible: true,
            is_required: true,
            order: 5,
            placeholder: "auto_calculated",
        },
    ]);

    const [footerFields, setFooterFields] = useState<FieldConfig[]>([
        {
            id: "15",
            name: "purpose",
            label_en: "Purpose",
            label_bn: "উদ্দেশ্য",
            type: "text",
            section: "footer",
            is_visible: true,
            is_required: false,
            order: 1,
        },
        {
            id: "16",
            name: "authorized_by",
            label_en: "Authorized By",
            label_bn: "কর্তৃপক্ষ",
            type: "text",
            section: "footer",
            is_visible: true,
            is_required: true,
            order: 2,
        },
        {
            id: "17",
            name: "signature_date",
            label_en: "Signature Date",
            label_bn: "স্বাক্ষরের তারিখ",
            type: "date",
            section: "footer",
            is_visible: true,
            is_required: true,
            order: 3,
        },
    ]);

    const toggleFieldVisibility = (
        fieldId: string,
        section: "header" | "employee_info" | "salary_info" | "footer",
    ) => {
        const updateFields = (fields: FieldConfig[]) =>
            fields.map((f) => (f.id === fieldId ? { ...f, is_visible: !f.is_visible } : f));

        if (section === "header") setHeaderFields(updateFields(headerFields));
        else if (section === "employee_info")
            setEmployeeInfoFields(updateFields(employeeInfoFields));
        else if (section === "salary_info") setSalaryInfoFields(updateFields(salaryInfoFields));
        else if (section === "footer") setFooterFields(updateFields(footerFields));
    };

    const toggleFieldRequired = (
        fieldId: string,
        section: "header" | "employee_info" | "salary_info" | "footer",
    ) => {
        const updateFields = (fields: FieldConfig[]) =>
            fields.map((f) => (f.id === fieldId ? { ...f, is_required: !f.is_required } : f));

        if (section === "header") setHeaderFields(updateFields(headerFields));
        else if (section === "employee_info")
            setEmployeeInfoFields(updateFields(employeeInfoFields));
        else if (section === "salary_info") setSalaryInfoFields(updateFields(salaryInfoFields));
        else if (section === "footer") setFooterFields(updateFields(footerFields));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Add API call to save field configuration
        setTimeout(() => setIsLoading(false), 1000);
    };

    const renderFieldRow = (
        field: FieldConfig,
        section: "header" | "employee_info" | "salary_info" | "footer",
    ) => (
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
                        <Settings className="w-8 h-8 text-red-600" />
                        <div>
                            <CardTitle>
                                <Title>{t("salary_certificate_field_configuration")}</Title>
                            </CardTitle>
                            <CardDescription>
                                {t("salary_certificate_field_configuration_description")}
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

                        {/* Employee Info Fields */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    {t("employee_information_fields")}
                                </h3>
                                <Button type="button" variant="outline" size="sm">
                                    <Plus className="w-4 h-4" />
                                    {t("add_field")}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {employeeInfoFields.map((field) =>
                                    renderFieldRow(field, "employee_info"),
                                )}
                            </div>
                        </div>

                        {/* Salary Info Fields */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    {t("salary_information_fields")}
                                </h3>
                                <Button type="button" variant="outline" size="sm">
                                    <Plus className="w-4 h-4" />
                                    {t("add_field")}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {salaryInfoFields.map((field) =>
                                    renderFieldRow(field, "salary_info"),
                                )}
                            </div>
                        </div>

                        {/* Footer Fields */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{t("footer_fields")}</h3>
                                <Button type="button" variant="outline" size="sm">
                                    <Plus className="w-4 h-4" />
                                    {t("add_field")}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {footerFields.map((field) => renderFieldRow(field, "footer"))}
                            </div>
                        </div>

                        {/* Auto-calculated Fields */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("auto_calculated_fields")}</h3>
                            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{t("gross_salary")}</span>
                                    <span className="text-sm text-gray-500">
                                        {t("auto_calculated")} = {t("sum_of_all_allowances")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{t("annual_gross_salary")}</span>
                                    <span className="text-sm text-gray-500">
                                        {t("auto_calculated")} = {t("gross_salary")} × 12
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
