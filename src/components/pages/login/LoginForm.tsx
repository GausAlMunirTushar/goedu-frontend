"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Input from "@/components/form/Input";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginMutation } from "@/apis/mutations/auth_mutations";
import { COOKIES_KEYS } from "@/configs/constants";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/dashboard";
    const message = searchParams.get("message") || null;

    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const { data, errors, isLoading, submit, register } = useLoginMutation();

    useEffect(() => {
        if (message === "session_expired") {
            toast.error(t("session_expired") || "Session expired. Please login again");
        }
    }, [message, t]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await submit();
            if (!response) {
                toast.error(t("invalid_credentials") || "Invalid username or password.");
                return;
            }

            const responseData = response.data;

            const accessToken = responseData?.access_token;
            const refreshToken = responseData?.refresh_token;
            const user = responseData?.user;
            const expiration_time = responseData?.expires_in;

            if (accessToken) {
                Cookies.set(COOKIES_KEYS.ACCESS_TOKEN || "access_token", accessToken, {
                    expires: expiration_time / 86400,
                    secure: true,
                    sameSite: "Strict",
                });

                Cookies.set(COOKIES_KEYS.REFRESH_TOKEN || "refresh_token", refreshToken, {
                    secure: true,
                    sameSite: "Strict",
                });

                Cookies.set(
                    COOKIES_KEYS.EXPIRY_TIME || "expiry_time",
                    expiration_time.toString() || "",
                    {
                        secure: true,
                        sameSite: "Strict",
                    },
                );

                if (user) {
                    Cookies.set(COOKIES_KEYS.USER || "user", JSON.stringify(user), {
                        secure: true,
                        sameSite: "Strict",
                    });
                }

                toast.success(t("login_successful") || "Login successful!");

                setTimeout(() => {
                    router.push(next);
                }, 500);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(t("login_failed") || "Login failed. Please try again.");
        } finally {
            setLoadingMessage("");
        }
    };

    const usernameProps = register("username");
    const passwordProps = register("password");
    const rememberMeProps = register("remember_me");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 from-background via-background to-primary/10 p-4 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl p-8 backdrop-blur-md transition-all duration-300 ring-1 ring-gray-200">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                            {t("welcome_back") || "Welcome Back"}
                        </h1>
                        <p className="text-muted-foreground text-base">{t("login_subtitle") || "Login to ePathshala"}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            id="username"
                            type="text"
                            label={t("username") || "Username"}
                            placeholder={t("username_placeholder") || "e.g. admin"}
                            icon={<Mail className="h-5 w-5" />}
                            {...(usernameProps as React.InputHTMLAttributes<HTMLInputElement>)}
                            error={errors.username}
                            required
                            className="transition-all"
                        />

                        <Input
                            id="password"
                            type="password"
                            label={t("password") || "Password"}
                            placeholder={t("password_placeholder") || "********"}
                            icon={<Lock className="h-5 w-5" />}
                            isPassword={true}
                            {...(passwordProps as React.InputHTMLAttributes<HTMLInputElement>)}
                            error={errors.password}
                            required
                            className="transition-all"
                        />

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 bg-input border border-input text-primary rounded focus:ring-2 focus:ring-ring transition-all"
                                    checked={rememberMeProps.value as boolean}
                                    onChange={rememberMeProps.onChange}
                                    name={rememberMeProps.name}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {t("remember_me") || "Remember me"}
                                </span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                {t("forgot_password") || "Forgot password?"}
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            variant="default"
                            size="default"
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <span>{isLoading ? (t("signing_in") || "Signing in...") : (t("sign_in") || "Sign in")}</span>
                            {!isLoading && (
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-2" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
