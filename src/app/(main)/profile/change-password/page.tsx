/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useChangePasswordMutation } from "@/apis/mutations/auth_mutations";
import Input from "@/components/form/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Lock, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChangePasswordPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const router = useRouter();

    const { register, submit, isLoading, errors } = useChangePasswordMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await submit(e);

        if (result) {
            toast.success(t("password_changed_success"));
            router.push("/profile");
        }
    };

    return (
        <section className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
            <Card className="border-border/50 animate-fade-in">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Lock className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-2xl font-bold">{t("change_password")}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                        {t("change_password_subtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-x-0 space-y-6">
                        <div className="space-y-4">
                            <Input
                                label={t("old_password")}
                                placeholder={t("old_password_placeholder")}
                                isPassword
                                {...(register("old_password") as any)}
                                error={errors.old_password}
                                required
                            />

                            <hr className="border-border/30 my-2" />

                            <Input
                                label={t("new_password")}
                                placeholder={t("new_password_placeholder")}
                                isPassword
                                {...(register("new_password") as any)}
                                error={errors.new_password}
                                required
                            />

                            <Input
                                label={t("confirm_password")}
                                placeholder={t("confirm_password_placeholder")}
                                isPassword
                                {...(register("confirm_password") as any)}
                                error={errors.confirm_password}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isLoading}
                                className="px-6"
                            >
                                {t("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {t("submit")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
