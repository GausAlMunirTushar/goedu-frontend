"use client";
import React from "react";
import WebPageHeader from "@/components/layout/web/WebPageHeader";
import TeacherCard from "@/components/pages/academic/TeacherCard";
import { Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

// Dummy data
const teachers = [
    { id: "1", name: "Dr. Abdur Rahman", designation: "Headmaster", department: "Administration", email: "arahman@epathshala.edu", phone: "+880 1234 567890" },
    { id: "2", name: "Mrs. Salma Khatun", designation: "Senior Assistant Teacher", department: "Science (Physics)", email: "skhatun@epathshala.edu", phone: "+880 1987 654321" },
    { id: "3", name: "Mr. Jamal Uddin", designation: "Assistant Teacher", department: "Mathematics", email: "juddin@epathshala.edu", phone: "+880 1122 334455" },
    { id: "4", name: "Ms. Nusrat Jahan", designation: "Assistant Teacher", department: "English", email: "njahan@epathshala.edu" },
    { id: "5", name: "Mr. Rafiqul Islam", designation: "Assistant Teacher", department: "Science (Biology)", phone: "+880 1555 667788" },
    { id: "6", name: "Mrs. Farhana Begum", designation: "Assistant Teacher", department: "Arts & Humanities", email: "fbegum@epathshala.edu", phone: "+880 1444 998877" },
    { id: "7", name: "Mr. Anisur Rahman", designation: "Physical Education Instructor", department: "Sports", email: "anisur@epathshala.edu" },
    { id: "8", name: "Ms. Kamrun Nahar", designation: "Assistant Teacher", department: "Computer Science", email: "knahar@epathshala.edu", phone: "+880 1777 223344" },
];

export default function TeachersPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <WebPageHeader 
                title={t("our_teachers") || "Our Faculty & Teachers"} 
                subtitle={t("teachers_subtitle") || "Meet our dedicated team of experienced educators committed to shaping the future of our students."}
                icon={Users} 
            />
            
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {teachers.map((teacher) => (
                        <TeacherCard key={teacher.id} {...teacher} />
                    ))}
                </div>
            </div>
        </div>
    );
}
