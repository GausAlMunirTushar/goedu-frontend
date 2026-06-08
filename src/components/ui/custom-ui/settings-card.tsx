"use client";

import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

interface SettingsCardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    isLoading?: boolean;
    onSubmit?: (e: React.FormEvent) => void;
    showActions?: boolean;
    onCancel?: () => void;
}

export default function SettingsCard({
    title,
    description,
    icon,
    children,
    isLoading = false,
    onSubmit,
    showActions = true,
    onCancel,
}: SettingsCardProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    const handleSubmit = (e: React.FormEvent) => {
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {icon && <div className="w-8 h-8">{icon}</div>}
                    <div>
                        <CardTitle>
                            <h1 className="text-xl font-bold">{title}</h1>
                        </CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>{children}</CardContent>
                {showActions && (
                    <CardFooter className="flex justify-end gap-3 border-t pt-6">
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                {t("cancel")}
                            </Button>
                        )}
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
                )}
            </form>
        </Card>
    );
}
