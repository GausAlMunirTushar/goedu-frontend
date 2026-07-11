"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Key, Copy, Check, Info } from "lucide-react";
import Logo from "@/components/common/Logo";
import Input from "@/components/form/Input";
import { useForgotPasswordMutation } from "@/apis/mutations/auth_mutations";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordForm() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    const [generatedToken, setGeneratedToken] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { data, errors, isLoading, submit, register } = useForgotPasswordMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload = { email: data.identifier };

            const response = await submit(undefined, payload as any);
            
            if (response && response.success) {
                const token = response.data?.token;
                if (token) {
                    setGeneratedToken(token);
                    toast.success("Reset token generated successfully!");
                } else {
                    toast.success(response.message || "Reset request submitted successfully!");
                }
            } else {
                toast.error(response?.message || "User account not found.");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleCopy = () => {
        if (generatedToken) {
            navigator.clipboard.writeText(generatedToken);
            setCopied(true);
            toast.success("Token copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const identifierProps = register("identifier");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 from-background via-background to-primary/10 p-4 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl p-8 backdrop-blur-md transition-all duration-300 ring-1 ring-gray-200">
                    <div className="text-center mb-8">
                        <Logo show={true} />
                    </div>

                    {!generatedToken ? (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {t("forgot_password") || "Forgot Password"}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {t("forgot_password_desc") || "Enter your email address to generate a password reset token."}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    id="identifier"
                                    type="email"
                                    label={t("email") || "Email"}
                                    placeholder={t("email_placeholder") || "admin@demo.epathshala.com"}
                                    icon={<Mail className="h-5 w-5" />}
                                    {...(identifierProps as React.InputHTMLAttributes<HTMLInputElement>)}
                                    error={errors.identifier}
                                    required
                                    className="transition-all"
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    {isLoading ? "Generating token..." : "Generate Reset Token"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                                    <Key className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">
                                    Reset Token Generated
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Because email services are bypassed in sandbox/dev mode, copy the token below to reset your password.
                                </p>
                            </div>

                            <div className="bg-muted/50 border border-border p-4 rounded-lg flex items-center justify-between gap-3">
                                <code className="text-sm break-all font-mono font-bold select-all text-primary">
                                    {generatedToken}
                                </code>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCopy}
                                    className="shrink-0 hover:bg-muted"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>

                            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex items-start gap-2.5">
                                <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <p className="text-xs text-primary/80 leading-normal">
                                    Clicking the button below will take you to the reset password form and automatically load this token.
                                </p>
                            </div>

                            <Link href={`/reset-password?token=${generatedToken}`} className="block">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Go to Reset Password Form
                                </Button>
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t("back_to_login") || "Back to login"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
