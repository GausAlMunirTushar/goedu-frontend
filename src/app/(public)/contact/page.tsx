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
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
    {
        icon: Mail,
        title: "email_us",
        value: "support@ingohr.com",
        href: "mailto:support@ingohr.com",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
    },
    {
        icon: Phone,
        title: "call_us",
        value: "+880-1234-567890",
        href: "tel:+8801234567890",
        color: "text-green-600",
        bgColor: "bg-green-100",
    },
    {
        icon: MapPin,
        title: "visit_us",
        value: "dhaka_address",
        isTranslation: true,
        color: "text-red-600",
        bgColor: "bg-red-100",
    },
    {
        icon: Clock,
        title: "business_hours",
        value: "business_hours_value",
        isTranslation: true,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
    },
];

const faqs = [
    {
        question: "faq_question_1",
        answer: "faq_answer_1",
    },
    {
        question: "faq_question_2",
        answer: "faq_answer_2",
    },
    {
        question: "faq_question_3",
        answer: "faq_answer_3",
    },
    {
        question: "faq_question_4",
        answer: "faq_answer_4",
    },
];

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success(t("message_sent_success"));
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setIsSubmitting(false);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">{t("get_in_touch")}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {t("contact_title")}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        {t("contact_subtitle")}
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <Card
                                key={index}
                                className="text-center hover:shadow-lg transition-shadow"
                            >
                                <CardHeader>
                                    <div
                                        className={`mx-auto mb-4 w-14 h-14 ${info.bgColor} rounded-full flex items-center justify-center`}
                                    >
                                        <Icon className={`w-7 h-7 ${info.color}`} />
                                    </div>
                                    <CardTitle className="text-lg">
                                        {t(info.title)}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {info.href ? (
                                            <Link
                                                href={info.href}
                                                className="hover:underline text-blue-600"
                                            >
                                                {t(info.value)}
                                            </Link>
                                        ) : (
                                            t(info.value)
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
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Send className="w-6 h-6 text-blue-600" />
                                    {t("send_message")}
                                </CardTitle>
                                <CardDescription>
                                    {t("send_message_description")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">{t("full_name")}</Label>
                                            <Input
                                                id="name"
                                                placeholder={t("enter_full_name")}
                                                value={formData.name}
                                                onChange={(e) =>
                                                    handleChange("name", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">{t("email")}</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder={t("enter_email")}
                                                value={formData.email}
                                                onChange={(e) =>
                                                    handleChange("email", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">{t("phone")}</Label>
                                            <Input
                                                id="phone"
                                                placeholder={t("enter_phone")}
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    handleChange("phone", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">{t("subject")}</Label>
                                            <Input
                                                id="subject"
                                                placeholder={t("enter_subject")}
                                                value={formData.subject}
                                                onChange={(e) =>
                                                    handleChange("subject", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">{t("message")}</Label>
                                        <Textarea
                                            id="message"
                                            placeholder={t("enter_message")}
                                            value={formData.message}
                                            onChange={(e) =>
                                                handleChange("message", e.target.value)
                                            }
                                            rows={6}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                {t("sending")}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                {t("send_message")}
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
                        <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Headphones className="w-6 h-6" />
                                    {t("quick_contact")}
                                </CardTitle>
                                <CardDescription className="text-blue-100">
                                    {t("quick_contact_description")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5" />
                                    <span>+880-1234-567890</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5" />
                                    <span>support@ingohr.com</span>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-white text-blue-600 hover:bg-blue-50"
                                    asChild
                                >
                                    <Link href="/pricing">{t("view_pricing")}</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Company Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                    {t("company_info")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">
                                        {t("company_name_label")}
                                    </h4>
                                    <p className="text-gray-800">IngoHR Solutions</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">
                                        {t("location")}
                                    </h4>
                                    <p className="text-gray-800">
                                        {t("dhaka_address")}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">
                                        {t("website")}
                                    </h4>
                                    <Link
                                        href="/"
                                        className="text-blue-600 hover:underline"
                                    >
                                        www.ingohr.com
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-blue-600" />
                                    {t("follow_us")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="icon" asChild>
                                        <Link
                                            href="https://linkedin.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="icon" asChild>
                                        <Link
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="icon" asChild>
                                        <Link
                                            href="https://twitter.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                            </svg>
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-5xl mx-auto mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {t("frequently_asked_questions")}
                        </h2>
                        <p className="text-gray-600 text-lg">
                            {t("faq_subtitle")}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                        <CardTitle className="text-lg">
                                            {t(faq.question)}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{t(faq.answer)}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Map Section */}
                <div className="mb-16">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">
                                {t("our_location")}
                            </CardTitle>
                            <CardDescription className="text-center">
                                {t("our_location_description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="w-full h-[400px] bg-gray-100 rounded-b-xl flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <MapPin className="w-12 h-12 mx-auto mb-4" />
                                    <p className="text-lg font-medium">
                                        {t("map_placeholder")}
                                    </p>
                                    <p className="text-sm">{t("dhaka_address")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("ready_to_transform")}
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        {t("ready_to_transform_description")}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-white text-blue-600 hover:bg-blue-50"
                            asChild
                        >
                            <Link href="/login">{t("start_free_trial")}</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                            asChild
                        >
                            <Link href="/pricing">{t("view_pricing_plans")}</Link>
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-gray-500 text-sm">
                    <p>{t("contact_footer_note")}</p>
                </div>
            </div>
        </div>
    );
}
