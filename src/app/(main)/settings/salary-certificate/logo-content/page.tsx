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
import { Image, Upload, Save, Loader2, Trash2, Eye, Award } from "lucide-react";
import Title from "@/components/ui/custom-ui/title";

export default function SalaryCertificateLogoContentPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [sealPreview, setSealPreview] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const sealInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        certificate_title_en: "Salary Certificate",
        certificate_title_bn: "বেতন সনদপত্র",
        header_text_en: "This is to certify that",
        header_text_bn: "এই মর্মে প্রত্যয়ন করা যাইতেছে যে",
        body_text_en:
            "is employed in our organization since [Joining Date]. His/Her current monthly gross salary is BDT [Amount]. This certificate is issued upon the request of the employee for [Purpose].",
        body_text_bn:
            "[যোগদানের তারিখ] হইতে আমাদের প্রতিষ্ঠানে কর্মরত আছেন। তাঁর/তাঁহার বর্তমান মাসিক মোট বেতন টাকা [পরিমাণ]। এই সনদপত্রটি [উদ্দেশ্য] এর জন্য কর্মচারীর অনুরোধক্রমে প্রদান করা হইল।",
        footer_text_en: "This certificate is valid for 6 months from the date of issue.",
        footer_text_bn: "এই সনদপত্রটি ইস্যুর তারিখ থেকে ৬ মাস পর্যন্ত কার্যকর।",
        show_logo: true,
        show_seal: true,
        show_signature: true,
        show_organization_name: true,
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

    const handleSealChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSealPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Add API call to save certificate logo and content
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
                                <Title>{t("salary_certificate_logo_content")}</Title>
                            </CardTitle>
                            <CardDescription>
                                {t("salary_certificate_logo_content_description")}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8">
                        {/* Logo and Seal Upload */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Logo */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">{t("organization_logo")}</h3>
                                <div className="flex flex-col gap-4 items-start">
                                    <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <Image className="w-10 h-10 mx-auto mb-2" />
                                                <p className="text-sm">{t("no_logo_uploaded")}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => logoInputRef.current?.click()}
                                        >
                                            <Upload className="w-4 h-4" />
                                            {t("upload")}
                                        </Button>
                                        {logoPreview && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
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
                                        id="certificate_logo_upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Seal */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">{t("official_seal")}</h3>
                                <div className="flex flex-col gap-4 items-start">
                                    <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                        {sealPreview ? (
                                            <img
                                                src={sealPreview}
                                                alt="Seal preview"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <Award className="w-10 h-10 mx-auto mb-2" />
                                                <p className="text-sm">{t("no_seal_uploaded")}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => sealInputRef.current?.click()}
                                        >
                                            <Upload className="w-4 h-4" />
                                            {t("upload")}
                                        </Button>
                                        {sealPreview && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setSealPreview(null);
                                                    if (sealInputRef.current) {
                                                        sealInputRef.current.value = "";
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {t("remove")}
                                            </Button>
                                        )}
                                    </div>
                                    <input
                                        ref={sealInputRef}
                                        id="certificate_seal_upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleSealChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("certificate_content")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="title_en">{t("certificate_title_en")}</Label>
                                    <Input
                                        id="title_en"
                                        value={formData.certificate_title_en}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                certificate_title_en: e.target.value,
                                            })
                                        }
                                        placeholder="Salary Certificate"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="title_bn">{t("certificate_title_bn")}</Label>
                                    <Input
                                        id="title_bn"
                                        value={formData.certificate_title_bn}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                certificate_title_bn: e.target.value,
                                            })
                                        }
                                        placeholder="বেতন সনদপত্র"
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
                                        placeholder="This is to certify that"
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
                                        placeholder="এই মর্মে প্রত্যয়ন করা যাইতেছে যে"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="body_en">{t("body_text_en")}</Label>
                                    <Textarea
                                        id="body_en"
                                        value={formData.body_text_en}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                body_text_en: e.target.value,
                                            })
                                        }
                                        placeholder="Certificate body text..."
                                        rows={4}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="body_bn">{t("body_text_bn")}</Label>
                                    <Textarea
                                        id="body_bn"
                                        value={formData.body_text_bn}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                body_text_bn: e.target.value,
                                            })
                                        }
                                        placeholder="সনদপত্র মূল অংশ..."
                                        rows={4}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="footer_en">{t("footer_text_en")}</Label>
                                    <Input
                                        id="footer_en"
                                        value={formData.footer_text_en}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                footer_text_en: e.target.value,
                                            })
                                        }
                                        placeholder="Validity information..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="footer_bn">{t("footer_text_bn")}</Label>
                                    <Input
                                        id="footer_bn"
                                        value={formData.footer_text_bn}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                footer_text_bn: e.target.value,
                                            })
                                        }
                                        placeholder="বৈধতার তথ্য..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Display Options */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold">{t("display_options")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <Label htmlFor="show_logo" className="font-medium">
                                            {t("show_logo")}
                                        </Label>
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
                                        <Label htmlFor="show_seal" className="font-medium">
                                            {t("show_official_seal")}
                                        </Label>
                                    </div>
                                    <Switch
                                        id="show_seal"
                                        checked={formData.show_seal}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, show_seal: checked })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <Label htmlFor="show_signature" className="font-medium">
                                            {t("show_signature_block")}
                                        </Label>
                                    </div>
                                    <Switch
                                        id="show_signature"
                                        checked={formData.show_signature}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, show_signature: checked })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <Label htmlFor="show_org_name" className="font-medium">
                                            {t("show_organization_name")}
                                        </Label>
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
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                {t("preview")}
                            </h3>
                            <div className="border rounded-lg p-8 bg-white">
                                <div className="max-w-2xl mx-auto space-y-6">
                                    <div className="text-center border-b-2 border-gray-800 pb-4">
                                        {formData.show_logo && logoPreview && (
                                            <img
                                                src={logoPreview}
                                                alt="Logo"
                                                className="h-16 mx-auto mb-2"
                                            />
                                        )}
                                        {formData.show_organization_name && (
                                            <h2 className="text-xl font-bold">Organization Name</h2>
                                        )}
                                        <p className="text-sm text-gray-600">Address Line</p>
                                    </div>
                                    <div className="text-center py-4">
                                        <h3 className="text-2xl font-bold">
                                            {formData.certificate_title_en}
                                        </h3>
                                    </div>
                                    <div className="py-4 text-center">
                                        <p className="text-lg">{formData.header_text_en}</p>
                                        <p className="text-xl font-bold my-4">[Employee Name]</p>
                                        <p className="text-sm text-gray-700">
                                            {formData.body_text_en}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-end pt-8">
                                        <div className="text-center">
                                            {formData.show_seal && sealPreview && (
                                                <img
                                                    src={sealPreview}
                                                    alt="Seal"
                                                    className="h-20"
                                                />
                                            )}
                                        </div>
                                        {formData.show_signature && (
                                            <div className="text-center">
                                                <div className="h-16 w-32 border-b border-gray-800 mb-2" />
                                                <p className="text-sm font-medium">
                                                    Authorized Signature
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center text-sm text-gray-500 pt-4 border-t">
                                        {formData.footer_text_en}
                                    </div>
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
