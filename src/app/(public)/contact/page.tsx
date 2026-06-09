"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Clock,
    Send,
    Building2,
    Headphones,
    Globe,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { useState } from "react";
import { toast } from "sonner";
import { topBarData, webHeaderData } from "@/data/webData";

export default function ContactPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const contactInfo = [
        {
            icon: Mail,
            title: "email_us",
            value: topBarData.email,
            href: `mailto:${topBarData.email}`,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            icon: Phone,
            title: "call_us",
            value: topBarData.phone,
            href: `tel:${topBarData.phone}`,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            icon: MapPin,
            title: "visit_us",
            value: lng === "bn" ? webHeaderData.addressBn : webHeaderData.address,
            href: null,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            icon: Clock,
            title: "business_hours",
            value: "business_hours_value",
            href: null,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success(t("message_sent_success") || "Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setIsSubmitting(false);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">{t("get_in_touch") || "Get In Touch"}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        {t("contact_title") || "Contact Us"}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {t("contact_subtitle") || "Have a question or need assistance? Fill out the form below and our team will get back to you as soon as possible."}
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <Card
                                key={index}
                                className="text-center hover:shadow-lg transition-shadow border-primary/10"
                            >
                                <CardHeader>
                                    <div className={`mx-auto mb-4 w-14 h-14 ${info.bgColor} rounded-full flex items-center justify-center`}>
                                        <Icon className={`w-7 h-7 ${info.color}`} />
                                    </div>
                                    <CardTitle className="text-lg">
                                        {t(info.title) || info.title.replace("_", " ")}
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        {info.href ? (
                                            <a href={info.href} className="hover:underline text-primary font-medium">
                                                {t(info.value) || info.value}
                                            </a>
                                        ) : (
                                            <span className="font-medium text-gray-700">{t(info.value) || info.value}</span>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-gray-200 shadow-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                    <Send className="w-6 h-6 text-primary" />
                                    {t("send_message") || "Send us a Message"}
                                </CardTitle>
                                <CardDescription>
                                    {t("send_message_description") || "Fill out the form below and we'll get back to you shortly."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">{t("full_name") || "Full Name"}</Label>
                                            <Input
                                                id="name"
                                                placeholder={t("enter_full_name") || "John Doe"}
                                                value={formData.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">{t("email") || "Email Address"}</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder={t("enter_email") || "john@example.com"}
                                                value={formData.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">{t("phone") || "Phone Number"}</Label>
                                            <Input
                                                id="phone"
                                                placeholder={t("enter_phone") || "+880..."}
                                                value={formData.phone}
                                                onChange={(e) => handleChange("phone", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">{t("subject") || "Subject"}</Label>
                                            <Input
                                                id="subject"
                                                placeholder={t("enter_subject") || "How can we help?"}
                                                value={formData.subject}
                                                onChange={(e) => handleChange("subject", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">{t("message") || "Message"}</Label>
                                        <Textarea
                                            id="message"
                                            placeholder={t("enter_message") || "Type your message here..."}
                                            value={formData.message}
                                            onChange={(e) => handleChange("message", e.target.value)}
                                            rows={6}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 text-white"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                {t("sending") || "Sending..."}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                {t("send_message") || "Send Message"}
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Contact */}
                        <Card className="bg-primary text-white border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Headphones className="w-6 h-6" />
                                    {t("quick_contact") || "Quick Contact"}
                                </CardTitle>
                                <CardDescription className="text-primary-foreground/80">
                                    {t("quick_contact_description") || "Reach out to our admission desk directly."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5" />
                                    <span>{topBarData.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5" />
                                    <span>{topBarData.email}</span>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-white text-primary hover:bg-gray-100 font-bold"
                                    asChild
                                >
                                    <Link href={topBarData.admissionLink}>{t("admission_form") || "Admission Form"}</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Company Info */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Building2 className="w-6 h-6 text-primary" />
                                    {t("institution_info") || "Institution Info"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">
                                        {t("name") || "Institution Name"}
                                    </h4>
                                    <p className="text-gray-800 font-medium">
                                        {lng === "bn" ? webHeaderData.schoolNameBn : webHeaderData.schoolNameEn}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">
                                        {t("location") || "Location"}
                                    </h4>
                                    <p className="text-gray-800 font-medium">
                                        {lng === "bn" ? webHeaderData.addressBn : webHeaderData.address}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Map Section */}
                <div>
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-center text-gray-900">
                                {t("our_location") || "Our Location"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="w-full h-[400px] bg-gray-100 rounded-b-xl flex items-center justify-center border-t border-gray-200">
                                <div className="text-center text-gray-500">
                                    <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                                    <p className="text-lg font-medium text-gray-800 mb-1">
                                        {lng === "bn" ? webHeaderData.schoolNameBn : webHeaderData.schoolNameEn}
                                    </p>
                                    <p className="text-sm">
                                        {lng === "bn" ? webHeaderData.addressBn : webHeaderData.address}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
