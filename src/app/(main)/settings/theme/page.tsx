"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Save,
    Loader2,
    Monitor,
    Sun,
    Moon,
    Laptop,
    Palette,
    LayoutGrid,
    Check,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const colorPresets = {
    blue: { primary: "#3b82f6", secondary: "#60a5fa", accent: "#93c5fd" },
    green: { primary: "#22c55e", secondary: "#4ade80", accent: "#86efac" },
    purple: { primary: "#a855f7", secondary: "#c084fc", accent: "#e9d5ff" },
    orange: { primary: "#f97316", secondary: "#fb923c", accent: "#fed7aa" },
    red: { primary: "#ef4444", secondary: "#f87171", accent: "#fca5a5" },
    teal: { primary: "#14b8a6", secondary: "#2dd4bf", accent: "#99f6e4" },
};

export default function ThemeSettingPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState("blue");
    const [customColors, setCustomColors] = useState({
        primary: "#3b82f6",
        secondary: "#60a5fa",
        accent: "#93c5fd",
    });
    const [layoutSettings, setLayoutSettings] = useState({
        sidebar_position: "left",
        sidebar_behavior: "persistent",
        content_width: "full",
        header_style: "fixed",
        show_breadcrumbs: true,
        show_tabs: true,
        show_module_bar: true,
        compact_mode: false,
        animations: true,
    });

    const handlePresetSelect = (presetName: keyof typeof colorPresets) => {
        setSelectedPreset(presetName);
        const preset = colorPresets[presetName];
        setCustomColors({
            primary: preset.primary,
            secondary: preset.secondary,
            accent: preset.accent,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <section className="space-y-6 p-6">
            <form onSubmit={handleSubmit}>
                {/* Theme Appearance */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Monitor className="w-6 h-6 text-purple-600" />
                            <div>
                                <CardTitle>{t("theme_appearance")}</CardTitle>
                                <CardDescription>
                                    {t("theme_appearance_description")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    id: "light",
                                    icon: Sun,
                                    label: "light",
                                    desc: "light_theme_description",
                                },
                                {
                                    id: "dark",
                                    icon: Moon,
                                    label: "dark",
                                    desc: "dark_theme_description",
                                },
                                {
                                    id: "system",
                                    icon: Laptop,
                                    label: "system",
                                    desc: "system_theme_description",
                                },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    className={`relative p-4 rounded-lg border-2 transition-all ${
                                        theme === opt.id
                                            ? "border-purple-600 bg-purple-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() => setTheme(opt.id)}
                                >
                                    <div className="flex flex-col items-center text-center space-y-2">
                                        <opt.icon
                                            className={`w-8 h-8 ${theme === opt.id ? "text-purple-600" : "text-gray-400"}`}
                                        />
                                        <div>
                                            <p className="font-medium capitalize">{t(opt.label)}</p>
                                            <p className="text-xs text-gray-500">{t(opt.desc)}</p>
                                        </div>
                                    </div>
                                    {theme === opt.id && (
                                        <Check className="w-5 h-5 text-purple-600 absolute top-2 right-2" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">
                            {t("current_theme")}:{" "}
                            <span className="font-medium capitalize">{resolvedTheme}</span>
                        </p>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <Label className="font-medium">{t("compact_mode")}</Label>
                                <p className="text-sm text-gray-500">
                                    {t("compact_mode_description")}
                                </p>
                            </div>
                            <Switch
                                checked={layoutSettings.compact_mode}
                                onCheckedChange={(v) =>
                                    setLayoutSettings({ ...layoutSettings, compact_mode: v })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <Label className="font-medium">{t("enable_animations")}</Label>
                                <p className="text-sm text-gray-500">
                                    {t("animations_description")}
                                </p>
                            </div>
                            <Switch
                                checked={layoutSettings.animations}
                                onCheckedChange={(v) =>
                                    setLayoutSettings({ ...layoutSettings, animations: v })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Color Scheme */}
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Palette className="w-6 h-6 text-purple-600" />
                            <div>
                                <CardTitle>{t("color_scheme")}</CardTitle>
                                <CardDescription>{t("color_scheme_description")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {Object.entries(colorPresets).map(([name, colors]) => (
                                <button
                                    key={name}
                                    type="button"
                                    className={`relative p-4 rounded-lg border-2 transition-all ${
                                        selectedPreset === name
                                            ? "border-gray-900"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() =>
                                        handlePresetSelect(name as keyof typeof colorPresets)
                                    }
                                >
                                    <div className="flex gap-1 justify-center mb-2">
                                        <div
                                            className="w-5 h-5 rounded-full"
                                            style={{ backgroundColor: colors.primary }}
                                        />
                                        <div
                                            className="w-5 h-5 rounded-full"
                                            style={{ backgroundColor: colors.secondary }}
                                        />
                                        <div
                                            className="w-5 h-5 rounded-full"
                                            style={{ backgroundColor: colors.accent }}
                                        />
                                    </div>
                                    <p className="text-sm font-medium capitalize">{t(name)}</p>
                                    {selectedPreset === name && (
                                        <Check className="w-4 h-4 text-green-600 absolute top-2 right-2" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(customColors).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <Label className="capitalize">{t(key)}</Label>
                                    <div className="flex gap-2">
                                        <div
                                            className="w-10 h-10 rounded border border-gray-300"
                                            style={{ backgroundColor: value }}
                                        />
                                        <Input
                                            type="text"
                                            value={value}
                                            onChange={(e) =>
                                                setCustomColors({
                                                    ...customColors,
                                                    [key]: e.target.value,
                                                })
                                            }
                                            className="font-mono"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">{t("color_preview")}</p>
                            <div className="flex gap-3">
                                <Button
                                    style={{ backgroundColor: customColors.primary }}
                                    className="text-white"
                                >
                                    {t("button")}
                                </Button>
                                <Button
                                    variant="outline"
                                    style={{
                                        borderColor: customColors.primary,
                                        color: customColors.primary,
                                    }}
                                >
                                    {t("outline_button")}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Layout Options */}
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="w-6 h-6 text-purple-600" />
                            <div>
                                <CardTitle>{t("layout_options")}</CardTitle>
                                <CardDescription>{t("layout_options_description")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>{t("sidebar_position")}</Label>
                                <Select
                                    value={layoutSettings.sidebar_position}
                                    onValueChange={(v) =>
                                        setLayoutSettings({
                                            ...layoutSettings,
                                            sidebar_position: v,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">{t("left")}</SelectItem>
                                        <SelectItem value="right">{t("right")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>{t("sidebar_behavior")}</Label>
                                <Select
                                    value={layoutSettings.sidebar_behavior}
                                    onValueChange={(v) =>
                                        setLayoutSettings({
                                            ...layoutSettings,
                                            sidebar_behavior: v,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="persistent">
                                            {t("persistent")}
                                        </SelectItem>
                                        <SelectItem value="collapsible">
                                            {t("collapsible")}
                                        </SelectItem>
                                        <SelectItem value="overlay">{t("overlay")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>{t("content_width")}</Label>
                                <Select
                                    value={layoutSettings.content_width}
                                    onValueChange={(v) =>
                                        setLayoutSettings({ ...layoutSettings, content_width: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full">{t("full_width")}</SelectItem>
                                        <SelectItem value="boxed">{t("boxed")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>{t("header_style")}</Label>
                                <Select
                                    value={layoutSettings.header_style}
                                    onValueChange={(v) =>
                                        setLayoutSettings({ ...layoutSettings, header_style: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">{t("fixed")}</SelectItem>
                                        <SelectItem value="sticky">{t("sticky")}</SelectItem>
                                        <SelectItem value="static">{t("static")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <Label className="font-medium">{t("show_breadcrumbs")}</Label>
                                    <p className="text-sm text-gray-500">
                                        {t("show_breadcrumbs_description")}
                                    </p>
                                </div>
                                <Switch
                                    checked={layoutSettings.show_breadcrumbs}
                                    onCheckedChange={(v) =>
                                        setLayoutSettings({
                                            ...layoutSettings,
                                            show_breadcrumbs: v,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <Label className="font-medium">{t("show_tabs")}</Label>
                                    <p className="text-sm text-gray-500">
                                        {t("show_tabs_description")}
                                    </p>
                                </div>
                                <Switch
                                    checked={layoutSettings.show_tabs}
                                    onCheckedChange={(v) =>
                                        setLayoutSettings({ ...layoutSettings, show_tabs: v })
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <Label className="font-medium">{t("show_module_bar")}</Label>
                                    <p className="text-sm text-gray-500">
                                        {t("show_module_bar_description")}
                                    </p>
                                </div>
                                <Switch
                                    checked={layoutSettings.show_module_bar}
                                    onCheckedChange={(v) =>
                                        setLayoutSettings({ ...layoutSettings, show_module_bar: v })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="outline">
                        {t("reset_to_default")}
                    </Button>
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
