import React from "react";
import { User, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

interface TeacherCardProps {
    name: string;
    designation: string;
    department: string;
    email?: string;
    phone?: string;
    imageUrl?: string;
}

export default function TeacherCard({ name, designation, department, email, phone, imageUrl }: TeacherCardProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-primary/30 transition-all duration-300 group">
            <div className="bg-primary/5 pt-6 pb-3 flex justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50"></div>
                <div className="w-28 h-28 bg-white rounded-full border-4 border-white flex items-center justify-center overflow-hidden relative z-10">
                    {imageUrl ? (
                        <Image src={imageUrl} alt={name} width={112} height={112} className="object-cover w-full h-full" />
                    ) : (
                        <User className="w-12 h-12 text-gray-300" />
                    )}
                </div>
            </div>
            <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-sm font-medium text-primary mb-1">{designation}</p>
                <p className="text-xs text-gray-500 mb-3">{department}</p>
                
                <div className="space-y-1.5 text-xs text-gray-600 mt-3 border-t border-gray-50 pt-3">
                    {email && (
                        <div className="flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a href={`mailto:${email}`} className="hover:text-primary transition-colors truncate">{email}</a>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${phone}`} className="hover:text-primary transition-colors truncate">{phone}</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
