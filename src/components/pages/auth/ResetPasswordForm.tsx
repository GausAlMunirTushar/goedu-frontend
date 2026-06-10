"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2, Key } from "lucide-react";
import Logo from "@/components/common/Logo";
import Input from "@/components/form/Input";
import { useResetPasswordMutation } from "@/apis/mutations/auth_mutations";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";

export default function ResetPasswordForm() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const searchParams = useSearchParams();
    const tokenParam = searchParams.get("token") || "";

    const [isSuccess, setIsSuccess] = useState(false);
    const { data, errors, isLoading, submit, register, setData } = useResetPasswordMutation();

    useEffect(() => {
        if (tokenParam) {
            setData("token", tokenParam);
        }
    }, [tokenParam, setData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Backend expects: { token, password }
            const payload = {
                token: data.token,
                password: data.password,
            };

            const response = await submit(undefined, payload as any);
            if (response && response.success) {
                toast.success(response.message || "Password reset successfully!");
                setIsSuccess(true);
            } else {
                toast.error(response?.message || "Password reset failed. Invalid or expired token.");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const tokenProps = register("token");
    const passwordProps = register("password");
    const confirmPasswordProps = register("confirmPassword");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 from-background via-background to-primary/10 p-4 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl p-8 backdrop-blur-md transition-all duration-300 ring-1 ring-gray-200">
                    <div className="text-center mb-8">
                        <Logo show={true} />
                    </div>

                    {!isSuccess ? (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {t("reset_password") || "Reset Password"}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {t("reset_password_desc") || "Enter your token and set a new password."}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    id="token"
                                    type="text"
                                    label="Reset Token"
                                    placeholder="Enter your 32-character reset token"
                                    icon={<Key className="h-5 w-5" />}
                                    {...(tokenProps as React.InputHTMLAttributes<HTMLInputElement>)}
                                    error={errors.token}
                                    required
                                    className="transition-all"
                                />

                                <Input
                                    id="password"
                                    type="password"
                                    label="New Password"
                                    placeholder="e.g. min 6 characters"
                                    icon={<Lock className="h-5 w-5" />}
                                    isPassword={true}
                                    {...(passwordProps as React.InputHTMLAttributes<HTMLInputElement>)}
                                    error={errors.password}
                                    required
                                    className="transition-all"
                                />

                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    label="Confirm New Password"
                                    placeholder="Re-enter your new password"
                                    icon={<Lock className="h-5 w-5" />}
                                    isPassword={true}
                                    {...(confirmPasswordProps as React.InputHTMLAttributes<HTMLInputElement>)}
                                    error={errors.confirmPassword}
                                    required
                                    className="transition-all"
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
                                >
                                    {isLoading ? "Resetting password..." : "Reset Password"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6 animate-fade-in">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                Password Reset Successful
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Your password has been successfully updated. You can now log in using your new credentials.
                            </p>

                            <Link href="/login" className="block mt-6">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                    <span>Proceed to Login</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
