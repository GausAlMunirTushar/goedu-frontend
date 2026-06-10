"use client";
import React from "react";
import WebPageHeader from "@/components/layout/web/WebPageHeader";
import { ShieldCheck, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rulesData = [
    {
        titleEn: "Eligibility Criteria",
        titleBn: "আবেদনের যোগ্যতা",
        itemsEn: [
            "Students must meet the age requirements for the specific class.",
            "Transfer certificate from the previous school is mandatory.",
            "Successful completion of the admission test/interview."
        ],
        itemsBn: [
            "শিক্ষার্থীকে নির্দিষ্ট শ্রেণীর জন্য নির্ধারিত বয়সসীমা পূরণ করতে হবে।",
            "পূর্ববর্তী বিদ্যালয় থেকে ছাড়পত্র (TC) বাধ্যতামূলক।",
            "ভর্তি পরীক্ষা বা সাক্ষাৎকারে উত্তীর্ণ হতে হবে।"
        ]
    },
    {
        titleEn: "Required Documents",
        titleBn: "প্রয়োজনীয় কাগজপত্র",
        itemsEn: [
            "Birth Certificate (Attested Copy)",
            "Previous Academic Transcript/Report Card",
            "Passport Size Photographs (4 Copies)",
            "Parent's NID Photocopy"
        ],
        itemsBn: [
            "জন্ম নিবন্ধন সনদের সত্যায়িত কপি।",
            "পূর্ববর্তী শ্রেণীর একাডেমিক ট্রান্সক্রিপ্ট বা রিপোর্ট কার্ড।",
            "পাসপোর্ট সাইজের ছবি (৪ কপি)।",
            "পিতা-মাতার এনআইডি-র ফটোকপি।"
        ]
    },
    {
        titleEn: "Admission Process",
        titleBn: "ভর্তি প্রক্রিয়া",
        itemsEn: [
            "Collect or fill out the online admission form.",
            "Submit the required documents to the office.",
            "Pay the admission and session fees within the deadline.",
            "Collect the student ID and uniform details."
        ],
        itemsBn: [
            "অনলাইন বা অফিস থেকে ভর্তি ফরম সংগ্রহ ও পূরণ।",
            "প্রয়োজনীয় কাগজপত্র অফিসে জমা দান।",
            "নির্ধারিত সময়ের মধ্যে ভর্তি ও সেশন ফি প্রদান।",
            "স্টুডেন্ট আইডি এবং ইউনিফর্মের তথ্য সংগ্রহ।"
        ]
    }
];

export default function AdmissionRules() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <WebPageHeader 
                title={t("admission_rules") || "Admission Rules & Regulations"} 
                subtitle="Please read the instructions carefully before applying for admission."
                icon={ShieldCheck} 
            />
            
            <div className="max-w-4xl mx-auto px-4 mt-12 space-y-8">
                {rulesData.map((section, idx) => (
                    <Card key={idx} className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/10">
                            <CardTitle className="text-xl font-bold text-primary flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6" />
                                {lng === "bn" ? section.titleBn : section.titleEn}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ul className="space-y-4">
                                {(lng === "bn" ? section.itemsBn : section.itemsEn).map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-700">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-amber-900 mb-1">Important Note</h4>
                        <p className="text-amber-800 text-sm">
                            The institution reserves the right to cancel any admission if the information provided is found to be incorrect or if the student violates the code of conduct.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
