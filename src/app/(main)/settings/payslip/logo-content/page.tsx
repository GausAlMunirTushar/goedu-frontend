"use client";

import { useState, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Image, Upload, Save, Loader2, Trash2, Eye } from "lucide-react";
import Title from "@/components/ui/custom-ui/title";

export default function PayslipLogoContentPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        payslip_title_en: "Pay Slip",
        payslip_title_bn: "বেতন স্লিপ",
        header_text_en: "Monthly Salary Statement",
        header_text_bn: "মাসিক বেতন বিবরণী",
        footer_text_en: "This is a computer-generated document. No signature is required.",
        footer_text_bn: "এটি একটি কম্পিউটার-জেনারেটেড নথি। কোনো স্বাক্ষরের প্রয়োজন নেই।",
        show_logo: true,
        show_organization_name: true,
        show_employee_photo: false,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Add API call to save payslip logo and content
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <section className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Image className="w-8 h-8 text-orange-600" />
                        <div>
                            <CardTitle>
                                <Title>{t("payslip_logo_content")}</Title>
                            </CardTitle>
                            <CardDescription>
                                {t("payslip_logo_content_description")}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8">
                        {/* Logo Upload */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">{t("payslip_logo")}</h3>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-full md:w-64 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Payslip logo preview"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Image className="w-12 h-12 mx-auto mb-2" />
                                            <p className="text-sm">{t("no_logo_uploaded")}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <Label htmlFor="payslip_logo_upload">
                                        {t("upload_payslip_logo")} (PNG, JPG - Max 1MB)
                                    </Label>
                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => logoInputRef.current?.click()}
                                        >
                                            <Upload className="w-4 h-4" />
                                            {t("choose_file")}
                                        </Button>
                                        {logoPreview && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => {
                                                    setLogoPreview(null);
                                                    if (logoInputRef.current) {
                                                        logoInputRef.current.value = "";
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {t("remove")}
                                            </Button>
                                        )}
                                    </div>
                                    <input
                                        ref={logoInputRef}
                                        id="payslip_logo_upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("text_content")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="title_en">{t("payslip_title_en")}</Label>
                                    <Input
                                        id="title_en"
                                        value={formData.payslip_title_en}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                payslip_title_en: e.target.value,
                                            })
                                        }
                                        placeholder="Pay Slip"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="title_bn">{t("payslip_title_bn")}</Label>
                                    <Input
                                        id="title_bn"
                                        value={formData.payslip_title_bn}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                payslip_title_bn: e.target.value,
                                            })
                                        }
                                        placeholder="বেতন স্লিপ"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="header_en">{t("header_text_en")}</Label>
                                    <Input
                                        id="header_en"
                                        value={formData.header_text_en}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                header_text_en: e.target.value,
                                            })
                                        }
                                        placeholder="Monthly Salary Statement"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="header_bn">{t("header_text_bn")}</Label>
                                    <Input
                                        id="header_bn"
                                        value={formData.header_text_bn}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                header_text_bn: e.target.value,
                                            })
                                        }
                                        placeholder="মাসিক বেতন বিবরণী"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="footer_en">{t("footer_text_en")}</Label>
                                    <Textarea
                                        id="footer_en"
                                        value={formData.footer_text_en}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                footer_text_en: e.target.value,
                                            })
                                        }
                                        placeholder="This is a computer-generated document..."
                                        rows={3}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="footer_bn">{t("footer_text_bn")}</Label>
                                    <Textarea
                                        id="footer_bn"
                                        value={formData.footer_text_bn}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                footer_text_bn: e.target.value,
                                            })
                                        }
                                        placeholder="এটি একটি কম্পিউটার-জেনারেটেড নথি..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Display Options */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("display_options")}</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <Label htmlFor="show_logo" className="font-medium">
                                            {t("show_logo_on_payslip")}
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            {t("show_logo_description")}
                                        </p>
                                    </div>
                                    <Switch
                                        id="show_logo"
                                        checked={formData.show_logo}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, show_logo: checked })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <Label htmlFor="show_org_name" className="font-medium">
                                            {t("show_organization_name")}
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            {t("show_org_name_description")}
                                        </p>
                                    </div>
                                    <Switch
                                        id="show_org_name"
                                        checked={formData.show_organization_name}
                                        onCheckedChange={(checked) =>
                                            setFormData({
                                                ...formData,
                                                show_organization_name: checked,
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <Label htmlFor="show_photo" className="font-medium">
                                            {t("show_employee_photo")}
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            {t("show_employee_photo_description")}
                                        </p>
                                    </div>
                                    <Switch
                                        id="show_photo"
                                        checked={formData.show_employee_photo}
                                        onCheckedChange={(checked) =>
                                            setFormData({
                                                ...formData,
                                                show_employee_photo: checked,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                {t("preview")}
                            </h3>
                            <div className="border rounded-lg p-6 bg-white">
                                <div className="text-center border-b pb-4 mb-4">
                                    {formData.show_logo && logoPreview && (
                                        <img
                                            src={logoPreview}
                                            alt="Logo"
                                            className="h-16 mx-auto mb-2"
                                        />
                                    )}
                                    {formData.show_organization_name && (
                                        <h2 className="text-lg font-bold">Organization Name</h2>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        {formData.header_text_en}
                                    </p>
                                </div>
                                <div className="text-center py-8">
                                    <h3 className="text-xl font-semibold">
                                        {formData.payslip_title_en}
                                    </h3>
                                </div>
                                <div className="border-t pt-4 mt-4 text-center text-sm text-gray-500">
                                    {formData.footer_text_en}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t pt-6">
                        <Button type="button" variant="outline">
                            {t("cancel")}
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
