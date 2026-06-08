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
import { Label } from "@/components/ui/label";
import { Save, Loader2, FileText, Check } from "lucide-react";
import Title from "@/components/ui/custom-ui/title";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const templates = [
    {
        id: "modern",
        name: "Modern",
        description: "Clean and professional design with modern typography",
        preview: "/templates/payslip-modern.png",
    },
    {
        id: "classic",
        name: "Classic",
        description: "Traditional layout with formal appearance",
        preview: "/templates/payslip-classic.png",
    },
    {
        id: "compact",
        name: "Compact",
        description: "Space-efficient design with condensed information",
        preview: "/templates/payslip-compact.png",
    },
    {
        id: "detailed",
        name: "Detailed",
        description: "Comprehensive layout with detailed breakdowns",
        preview: "/templates/payslip-detailed.png",
    },
];

export default function PayslipTemplatePage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("modern");
    const [paperSize, setPaperSize] = useState("A4");
    const [orientation, setOrientation] = useState("portrait");
    const [fontSize, setFontSize] = useState("medium");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Add API call to save template settings
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <section className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-orange-600" />
                        <div>
                            <CardTitle>
                                <Title>{t("payslip_template")}</Title>
                            </CardTitle>
                            <CardDescription>{t("payslip_template_description")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8">
                        {/* Template Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">{t("select_template")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        type="button"
                                        className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                                            selectedTemplate === template.id
                                                ? "border-orange-600 bg-orange-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <div className="aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center">
                                            <FileText className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <p className="font-medium">{t(template.name)}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {t(template.description)}
                                        </p>
                                        {selectedTemplate === template.id && (
                                            <div className="absolute top-2 right-2">
                                                <Check className="w-5 h-5 text-orange-600" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Print Settings */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("print_settings")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label htmlFor="paper_size">{t("paper_size")}</Label>
                                    <Select value={paperSize} onValueChange={setPaperSize}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("select_paper_size")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A4">A4</SelectItem>
                                            <SelectItem value="Letter">Letter</SelectItem>
                                            <SelectItem value="Legal">Legal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="orientation">{t("orientation")}</Label>
                                    <Select value={orientation} onValueChange={setOrientation}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("select_orientation")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="portrait">
                                                {t("portrait")}
                                            </SelectItem>
                                            <SelectItem value="landscape">
                                                {t("landscape")}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="font_size">{t("font_size")}</Label>
                                    <Select value={fontSize} onValueChange={setFontSize}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("select_font_size")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="small">{t("small")}</SelectItem>
                                            <SelectItem value="medium">{t("medium")}</SelectItem>
                                            <SelectItem value="large">{t("large")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("template_options")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="date_format">{t("date_format")}</Label>
                                    <Select defaultValue="DD/MM/YYYY">
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("select_date_format")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                            <SelectItem value="DD MMMM YYYY">
                                                DD MMMM YYYY
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="number_format">{t("number_format")}</Label>
                                    <Select defaultValue="en_BD">
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("select_number_format")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en_BD">
                                                Bangladesh (1,234.56)
                                            </SelectItem>
                                            <SelectItem value="en_US">
                                                United States (1,234.56)
                                            </SelectItem>
                                            <SelectItem value="de_DE">
                                                Germany (1.234,56)
                                            </SelectItem>
                                            <SelectItem value="fr_FR">France (1 234,56)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Template Preview */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("template_preview")}</h3>
                            <div className="border rounded-lg p-6 bg-gray-50">
                                <div className="aspect-[3/4] max-w-md mx-auto bg-white shadow-lg rounded p-6">
                                    {/* Simplified template preview */}
                                    <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2" />
                                        <h2 className="text-lg font-bold">Organization Name</h2>
                                        <p className="text-sm text-gray-600">Address Line</p>
                                    </div>
                                    <div className="text-center mb-4">
                                        <h3 className="text-xl font-semibold">PAY SLIP</h3>
                                        <p className="text-sm text-gray-500">Month: January 2024</p>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Employee Name:</span>
                                            <span className="font-medium">John Doe</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Employee ID:</span>
                                            <span className="font-medium">EMP001</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Department:</span>
                                            <span className="font-medium">Engineering</span>
                                        </div>
                                    </div>
                                    <div className="border-t mt-4 pt-4">
                                        <div className="flex justify-between font-semibold">
                                            <span>Net Salary:</span>
                                            <span>৳ 50,000.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t pt-6">
                        <Button type="button" variant="outline">
                            {t("preview_print")}
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
