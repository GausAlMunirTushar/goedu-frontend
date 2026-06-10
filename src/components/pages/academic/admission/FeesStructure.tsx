"use client";
import React from "react";
import WebPageHeader from "@/components/layout/web/WebPageHeader";
import { CreditCard, Info, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const feeData = [
    { class: "Class 6", admissionFee: "৳5,000", sessionFee: "৳3,000", monthlyTuition: "৳1,500" },
    { class: "Class 7", admissionFee: "৳5,000", sessionFee: "৳3,000", monthlyTuition: "৳1,500" },
    { class: "Class 8", admissionFee: "৳5,000", sessionFee: "৳3,000", monthlyTuition: "৳1,500" },
    { class: "Class 9", admissionFee: "৳6,000", sessionFee: "৳4,000", monthlyTuition: "৳2,000" },
    { class: "Class 10", admissionFee: "৳6,000", sessionFee: "৳4,000", monthlyTuition: "৳2,000" },
];

export default function FeesStructure() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <WebPageHeader 
                title={t("fees") || "Fees Structure"} 
                subtitle="Detailed breakdown of admission, session, and monthly tuition fees."
                icon={CreditCard} 
            />
            
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <Card className="border-none shadow-sm overflow-hidden mb-8">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-primary/5">
                                <TableRow>
                                    <TableHead className="font-bold text-gray-900">Class</TableHead>
                                    <TableHead className="font-bold text-gray-900">Admission Fee</TableHead>
                                    <TableHead className="font-bold text-gray-900">Session Fee (Yearly)</TableHead>
                                    <TableHead className="font-bold text-gray-900">Monthly Tuition</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feeData.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{row.class}</TableCell>
                                        <TableCell>{row.admissionFee}</TableCell>
                                        <TableCell>{row.sessionFee}</TableCell>
                                        <TableCell className="font-bold text-primary">{row.monthlyTuition}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 flex items-start gap-4">
                        <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-blue-900 mb-2">Payment Methods</h4>
                            <p className="text-blue-800 text-sm leading-relaxed mb-4">
                                Fees can be paid via bKash, Nagad, or directly at the school accounts office. Online payments incur a 1.5% processing fee.
                            </p>
                            <div className="flex gap-4">
                                <div className="h-8 w-16 bg-white rounded border border-gray-100 flex items-center justify-center font-bold text-xs text-pink-600 italic">bKash</div>
                                <div className="h-8 w-16 bg-white rounded border border-gray-100 flex items-center justify-center font-bold text-xs text-orange-600">Nagad</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Download Prospectus</h4>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                For more detailed information about scholarships, waivers, and specific subject fees, please download our official prospectus.
                            </p>
                        </div>
                        <Button className="w-full gap-2 rounded-xl" size="lg">
                            <Download className="w-5 h-5" />
                            Download Prospectus (PDF)
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
