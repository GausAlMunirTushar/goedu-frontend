"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, Coins, Plus, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ExchangeRate {
    id: string;
    currency_code: string;
    currency_name: string;
    rate: number;
}

export default function CurrencySettingPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);
    const [baseCurrency, setBaseCurrency] = useState("BDT");

    const [currencyData, setCurrencyData] = useState({
        currency_name: "Bangladeshi Taka",
        currency_code: "BDT",
        currency_symbol: "৳",
        currency_symbol_native: "৳",
        decimal_digits: 2,
        rounding: 0,
        code_position: "before",
        decimal_separator: ".",
        thousand_separator: ",",
        is_default: true,
        is_active: true,
    });

    const [rates, setRates] = useState<ExchangeRate[]>([
        { id: "1", currency_code: "USD", currency_name: "US Dollar", rate: 110.5 },
        { id: "2", currency_code: "EUR", currency_name: "Euro", rate: 120.75 },
        { id: "3", currency_code: "GBP", currency_name: "British Pound", rate: 140.25 },
        { id: "4", currency_code: "INR", currency_name: "Indian Rupee", rate: 1.33 },
    ]);

    const [newRate, setNewRate] = useState({ currency_code: "", rate: "" });

    const handleAddRate = () => {
        if (newRate.currency_code && newRate.rate) {
            setRates([
                ...rates,
                {
                    id: Date.now().toString(),
                    currency_code: newRate.currency_code.toUpperCase(),
                    currency_name: newRate.currency_code.toUpperCase(),
                    rate: parseFloat(newRate.rate),
                },
            ]);
            setNewRate({ currency_code: "", rate: "" });
        }
    };

    const handleRemoveRate = (id: string) => {
        setRates(rates.filter((r) => r.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <section className="space-y-6 p-6">
            <form onSubmit={handleSubmit}>
                {/* Currency Setup */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Coins className="w-6 h-6 text-green-600" />
                            <div>
                                <CardTitle>{t("currency_setup")}</CardTitle>
                                <CardDescription>{t("currency_setup_description")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label>{t("currency_name")}</Label>
                                <Input
                                    value={currencyData.currency_name}
                                    onChange={(e) =>
                                        setCurrencyData({
                                            ...currencyData,
                                            currency_name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label>{t("currency_code")}</Label>
                                <Input
                                    value={currencyData.currency_code}
                                    onChange={(e) =>
                                        setCurrencyData({
                                            ...currencyData,
                                            currency_code: e.target.value.toUpperCase(),
                                        })
                                    }
                                    maxLength={3}
                                />
                            </div>
                            <div>
                                <Label>{t("currency_symbol")}</Label>
                                <Input
                                    value={currencyData.currency_symbol}
                                    onChange={(e) =>
                                        setCurrencyData({
                                            ...currencyData,
                                            currency_symbol: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label>{t("currency_symbol_native")}</Label>
                                <Input
                                    value={currencyData.currency_symbol_native}
                                    onChange={(e) =>
                                        setCurrencyData({
                                            ...currencyData,
                                            currency_symbol_native: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label>{t("decimal_digits")}</Label>
                                <Input
                                    type="number"
                                    value={currencyData.decimal_digits}
                                    onChange={(e) =>
                                        setCurrencyData({
                                            ...currencyData,
                                            decimal_digits: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    min={0}
                                    max={5}
                                />
                            </div>
                            <div>
                                <Label>{t("rounding")}</Label>
                                <Input
                                    type="number"
                                    value={currencyData.rounding}
                                    onChange={(e) =>
                                        setCurrencyData({
                                            ...currencyData,
                                            rounding: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <Label>{t("code_position")}</Label>
                                <Select
                                    value={currencyData.code_position}
                                    onValueChange={(v) =>
                                        setCurrencyData({ ...currencyData, code_position: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="before">{t("before_amount")}</SelectItem>
                                        <SelectItem value="after">{t("after_amount")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>{t("decimal_separator")}</Label>
                                <Select
                                    value={currencyData.decimal_separator}
                                    onValueChange={(v) =>
                                        setCurrencyData({ ...currencyData, decimal_separator: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=".">{t("period")}</SelectItem>
                                        <SelectItem value=",">{t("comma")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>{t("thousand_separator")}</Label>
                                <Select
                                    value={currencyData.thousand_separator}
                                    onValueChange={(v) =>
                                        setCurrencyData({ ...currencyData, thousand_separator: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=",">{t("comma")}</SelectItem>
                                        <SelectItem value=".">{t("period")}</SelectItem>
                                        <SelectItem value=" ">{t("space")}</SelectItem>
                                        <SelectItem value="none">{t("none")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <Label className="font-medium">
                                    {t("set_as_default_currency")}
                                </Label>
                                <p className="text-sm text-gray-500">
                                    {t("default_currency_description")}
                                </p>
                            </div>
                            <Switch
                                checked={currencyData.is_default}
                                onCheckedChange={(v) =>
                                    setCurrencyData({ ...currencyData, is_default: v })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <Label className="font-medium">{t("active_currency")}</Label>
                                <p className="text-sm text-gray-500">
                                    {t("active_currency_description")}
                                </p>
                            </div>
                            <Switch
                                checked={currencyData.is_active}
                                onCheckedChange={(v) =>
                                    setCurrencyData({ ...currencyData, is_active: v })
                                }
                            />
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">{t("example_amounts")}:</p>
                            <p className="font-medium">
                                {currencyData.code_position === "before"
                                    ? `${currencyData.currency_symbol}${(1234.56).toFixed(currencyData.decimal_digits)}`
                                    : `${(1234.56).toFixed(currencyData.decimal_digits)}${currencyData.currency_symbol}`}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Exchange Rates */}
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Plus className="w-6 h-6 text-green-600" />
                            <div>
                                <CardTitle>{t("exchange_rates")}</CardTitle>
                                <CardDescription>{t("exchange_rates_description")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>{t("base_currency")}</Label>
                                <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BDT">BDT - Bangladeshi Taka</SelectItem>
                                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                            <h3 className="text-lg font-semibold">{t("add_new_currency")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>{t("currency_code")}</Label>
                                    <Input
                                        value={newRate.currency_code}
                                        onChange={(e) =>
                                            setNewRate({
                                                ...newRate,
                                                currency_code: e.target.value.toUpperCase(),
                                            })
                                        }
                                        placeholder="USD"
                                        maxLength={3}
                                    />
                                </div>
                                <div>
                                    <Label>{t("exchange_rate")}</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={newRate.rate}
                                        onChange={(e) =>
                                            setNewRate({ ...newRate, rate: e.target.value })
                                        }
                                        placeholder="110.50"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        onClick={handleAddRate}
                                        className="w-full"
                                    >
                                        <Plus className="w-4 h-4" /> {t("add_currency")}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t("currency_code")}</TableHead>
                                        <TableHead>{t("currency_name")}</TableHead>
                                        <TableHead className="text-right">
                                            {t("rate")} (1 {baseCurrency})
                                        </TableHead>
                                        <TableHead className="text-right">{t("action")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rates.map((rate) => (
                                        <TableRow key={rate.id}>
                                            <TableCell className="font-medium">
                                                {rate.currency_code}
                                            </TableCell>
                                            <TableCell>{rate.currency_name}</TableCell>
                                            <TableCell className="text-right">
                                                {rate.rate.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveRate(rate.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
