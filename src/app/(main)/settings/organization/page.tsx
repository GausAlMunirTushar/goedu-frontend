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
import { Save, Loader2, Image, Upload, Trash2, Building2, Phone } from "lucide-react";

export default function OrganizationSettingPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        // Profile
        organization_name_en: "",
        organization_name_bn: "",
        short_name: "",
        established_date: "",
        organization_type: "",
        website: "",
        description_en: "",
        description_bn: "",
        // Contact
        phone: "",
        mobile: "",
        fax: "",
        email: "",
        address_en: "",
        address_bn: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        // Display
        show_logo: true,
        show_organization_name: true,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFaviconPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Add API call
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <section className="space-y-6 p-6">
            <form onSubmit={handleSubmit}>
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-blue-600" />
                            <div>
                                <CardTitle>{t("organization_profile")}</CardTitle>
                                <CardDescription>
                                    {t("organization_profile_description")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>
                                    {t("organization_name_en")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.organization_name_en}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            organization_name_en: e.target.value,
                                        })
                                    }
                                    placeholder={t("enter_organization_name_en")}
                                />
                            </div>
                            <div>
                                <Label>
                                    {t("organization_name_bn")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.organization_name_bn}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            organization_name_bn: e.target.value,
                                        })
                                    }
                                    placeholder={t("enter_organization_name_bn")}
                                />
                            </div>
                            <div>
                                <Label>{t("short_name")}</Label>
                                <Input
                                    value={formData.short_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, short_name: e.target.value })
                                    }
                                    placeholder={t("enter_short_name")}
                                />
                            </div>
                            <div>
                                <Label>{t("established_date")}</Label>
                                <Input
                                    type="date"
                                    value={formData.established_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            established_date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label>{t("organization_type")}</Label>
                                <Input
                                    value={formData.organization_type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            organization_type: e.target.value,
                                        })
                                    }
                                    placeholder={t("enter_organization_type")}
                                />
                            </div>
                            <div>
                                <Label>{t("website")}</Label>
                                <Input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) =>
                                        setFormData({ ...formData, website: e.target.value })
                                    }
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label>{t("description_en")}</Label>
                                <Textarea
                                    value={formData.description_en}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description_en: e.target.value })
                                    }
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label>{t("description_bn")}</Label>
                                <Textarea
                                    value={formData.description_bn}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description_bn: e.target.value })
                                    }
                                    rows={3}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logo & Branding Section */}
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Image className="w-6 h-6 text-blue-600" />
                            <div>
                                <CardTitle>{t("organization_logo_branding")}</CardTitle>
                                <CardDescription>
                                    {t("organization_logo_description")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label>{t("main_logo")}</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center bg-gray-50">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="max-h-32" />
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
                                        <Upload className="w-4 h-4" /> {t("upload")}
                                    </Button>
                                    {logoPreview && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                setLogoPreview(null);
                                                if (logoInputRef.current)
                                                    logoInputRef.current.value = "";
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" /> {t("remove")}
                                        </Button>
                                    )}
                                </div>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label>{t("favicon")}</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center bg-gray-50">
                                    {faviconPreview ? (
                                        <img
                                            src={faviconPreview}
                                            alt="Favicon"
                                            className="max-h-32"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Image className="w-10 h-10 mx-auto mb-2" />
                                            <p className="text-sm">{t("no_favicon_uploaded")}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => faviconInputRef.current?.click()}
                                    >
                                        <Upload className="w-4 h-4" /> {t("upload")}
                                    </Button>
                                    {faviconPreview && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                setFaviconPreview(null);
                                                if (faviconInputRef.current)
                                                    faviconInputRef.current.value = "";
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" /> {t("remove")}
                                        </Button>
                                    )}
                                </div>
                                <input
                                    ref={faviconInputRef}
                                    type="file"
                                    accept="image/*,.ico"
                                    onChange={handleFaviconChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Section */}
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Phone className="w-6 h-6 text-blue-600" />
                            <div>
                                <CardTitle>{t("organization_contact_information")}</CardTitle>
                                <CardDescription>
                                    {t("organization_contact_description")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>{t("phone")}</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    placeholder="+880-XXX-XXXXXXX"
                                />
                            </div>
                            <div>
                                <Label>{t("mobile")}</Label>
                                <Input
                                    value={formData.mobile}
                                    onChange={(e) =>
                                        setFormData({ ...formData, mobile: e.target.value })
                                    }
                                    placeholder="+880-1XXX-XXXXXX"
                                />
                            </div>
                            <div>
                                <Label>{t("fax")}</Label>
                                <Input
                                    value={formData.fax}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fax: e.target.value })
                                    }
                                    placeholder="+880-XXX-XXXXXXX"
                                />
                            </div>
                            <div>
                                <Label>{t("email")}</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="info@example.com"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label>{t("address_en")}</Label>
                                <Textarea
                                    value={formData.address_en}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address_en: e.target.value })
                                    }
                                    rows={2}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label>{t("address_bn")}</Label>
                                <Textarea
                                    value={formData.address_bn}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address_bn: e.target.value })
                                    }
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label>{t("city")}</Label>
                                <Input
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData({ ...formData, city: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label>{t("state")}</Label>
                                <Input
                                    value={formData.state}
                                    onChange={(e) =>
                                        setFormData({ ...formData, state: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label>{t("postal_code")}</Label>
                                <Input
                                    value={formData.postal_code}
                                    onChange={(e) =>
                                        setFormData({ ...formData, postal_code: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label>{t("country")}</Label>
                                <Input
                                    value={formData.country}
                                    onChange={(e) =>
                                        setFormData({ ...formData, country: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 mt-6">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> {t("saving")}
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> {t("save_changes")}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
}
