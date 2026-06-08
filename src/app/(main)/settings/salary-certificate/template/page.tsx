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
import { Save, Loader2, FileText, Check, Award } from "lucide-react";
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
        id: "formal",
        name: "Formal",
        description: "Traditional formal certificate layout",
        preview: "/templates/certificate-formal.png",
    },
    {
        id: "modern",
        name: "Modern",
        description: "Contemporary clean design",
        preview: "/templates/certificate-modern.png",
    },
    {
        id: "elegant",
        name: "Elegant",
        description: "Sophisticated design with decorative elements",
        preview: "/templates/certificate-elegant.png",
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "Simple and minimal design",
        preview: "/templates/certificate-minimal.png",
    },
];

export default function SalaryCertificateTemplatePage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("formal");
    const [paperSize, setPaperSize] = useState("A4");
    const [orientation, setOrientation] = useState("portrait");
    const [fontSize, setFontSize] = useState("medium");
    const [borderStyle, setBorderStyle] = useState("classic");

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
                        <Award className="w-8 h-8 text-red-600" />
                        <div>
                            <CardTitle>
                                <Title>{t("salary_certificate_template")}</Title>
                            </CardTitle>
                            <CardDescription>
                                {t("salary_certificate_template_description")}
                            </CardDescription>
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
                                                ? "border-red-600 bg-red-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <div className="aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center">
                                            <Award className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <p className="font-medium">{t(template.name)}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {t(template.description)}
                                        </p>
                                        {selectedTemplate === template.id && (
                                            <div className="absolute top-2 right-2">
                                                <Check className="w-5 h-5 text-red-600" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Print Settings */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("print_settings")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                                <div>
                                    <Label htmlFor="border_style">{t("border_style")}</Label>
                                    <Select value={borderStyle} onValueChange={setBorderStyle}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("select_border_style")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">{t("none")}</SelectItem>
                                            <SelectItem value="classic">{t("classic")}</SelectItem>
                                            <SelectItem value="double">{t("double")}</SelectItem>
                                            <SelectItem value="decorative">
                                                {t("decorative")}
                                            </SelectItem>
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
                                    <Label htmlFor="signature_style">{t("signature_style")}</Label>
                                    <Select defaultValue="line">
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t("select_signature_style")}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="line">{t("line")}</SelectItem>
                                            <SelectItem value="box">{t("box")}</SelectItem>
                                            <SelectItem value="circle">{t("circle")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Template Preview */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("template_preview")}</h3>
                            <div className="border rounded-lg p-6 bg-gray-50">
                                <div className="aspect-[3/4] max-w-md mx-auto bg-white shadow-lg rounded p-8">
                                    {/* Simplified certificate preview */}
                                    <div
                                        className={`h-full border-2 ${
                                            borderStyle === "double"
                                                ? "border-double"
                                                : borderStyle === "decorative"
                                                  ? "border-dashed"
                                                  : "border-solid"
                                        } border-gray-800 p-6 flex flex-col justify-between`}
                                    >
                                        <div className="text-center space-y-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
                                            <div>
                                                <h2 className="text-lg font-bold">
                                                    Organization Name
                                                </h2>
                                                <p className="text-xs text-gray-600">
                                                    Address Line
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-center py-6">
                                            <h3 className="text-2xl font-bold mb-4">
                                                SALARY CERTIFICATE
                                            </h3>
                                            <p className="text-sm text-gray-700">
                                                This is to certify that
                                            </p>
                                            <p className="text-lg font-bold my-2">
                                                [Employee Name]
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                is employed in our organization...
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-end pt-4">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-1" />
                                                <p className="text-xs">Official Seal</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="h-8 w-24 border-b border-gray-800 mb-1" />
                                                <p className="text-xs">Authorized Signature</p>
                                            </div>
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
