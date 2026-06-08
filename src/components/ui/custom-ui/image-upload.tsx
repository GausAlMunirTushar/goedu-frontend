"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, Upload, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

interface ImageUploadProps {
    label: string;
    preview: string | null;
    onPreviewChange: (preview: string | null) => void;
    accept?: string;
    maxSizeMB?: number;
    dimensionsHint?: string;
    className?: string;
}

export default function ImageUpload({
    label,
    preview,
    onPreviewChange,
    accept = "image/*",
    maxSizeMB = 2,
    dimensionsHint,
    className = "",
}: ImageUploadProps) {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size exceeds ${maxSizeMB}MB`);
            return;
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file");
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            onPreviewChange(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        onPreviewChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        setError(null);
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <Label>{label}</Label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-48 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <div className="text-center text-gray-400 p-4">
                            <Image className="w-10 h-10 mx-auto mb-2" />
                            <p className="text-xs">{t("no_image_uploaded")}</p>
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4" />
                            {t("choose_file")}
                        </Button>
                        {preview && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleRemove}
                            >
                                <Trash2 className="w-4 h-4" />
                                {t("remove")}
                            </Button>
                        )}
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {dimensionsHint && <p className="text-xs text-gray-500">{dimensionsHint}</p>}
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    );
}
