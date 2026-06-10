import React from "react";
import { User, Mail, Phone, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Badge } from "@/components/ui/badge";

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
        <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20">
            {/* Header Background */}
            <div className="h-24 bg-linear-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-primary/40" />
                </div>
                {/* Decorative blobs */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-blob animation-delay-2000"></div>
            </div>

            {/* Profile Section */}
            <div className="px-5 pb-6 text-center relative">
                {/* Profile Image */}
                <div className="relative -mt-12 mb-4 mx-auto w-24 h-24 rounded-full border-4 border-card shadow-md overflow-hidden bg-muted flex items-center justify-center">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <User className="w-10 h-10 text-muted-foreground/40" />
                    )}
                </div>

                {/* Teacher Info */}
                <div className="space-y-1.5 mb-4">
                    <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-sm font-semibold text-primary/80 uppercase tracking-wider">
                        {designation}
                    </p>
                    <div className="flex justify-center mt-2.5">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors">
                            {department}
                        </Badge>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-2 border-t border-border/50 pt-4 mt-2">
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center justify-center gap-2.5 text-xs text-muted-foreground hover:text-primary transition-colors group/link py-0.5"
                        >
                            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover/link:bg-primary/10 transition-colors shrink-0">
                                <Mail className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate max-w-[180px]">{email}</span>
                        </a>
                    )}
                    {phone && (
                        <a
                            href={`tel:${phone}`}
                            className="flex items-center justify-center gap-2.5 text-xs text-muted-foreground hover:text-primary transition-colors group/link py-0.5"
                        >
                            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover/link:bg-primary/10 transition-colors shrink-0">
                                <Phone className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{phone}</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
    );
}

