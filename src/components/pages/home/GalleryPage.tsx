"use client";
import React, { useState } from "react";
import WebPageHeader from "@/components/layout/web/WebPageHeader";
import { ImageIcon, Maximize2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import Image from "next/image";

const galleryImages = [
    { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1470&auto=format&fit=crop", category: "Campus", title: "Main Building" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1532&auto=format&fit=crop", category: "Academic", title: "Classroom" },
    { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1470&auto=format&fit=crop", category: "Academic", title: "Physics Lab" },
    { src: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1470&auto=format&fit=crop", category: "Events", title: "Sports Day" },
    { src: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=1470&auto=format&fit=crop", category: "Events", title: "Prize Giving Ceremony" },
    { src: "https://images.unsplash.com/photo-1577894778592-35feda1039b4?q=80&w=1374&auto=format&fit=crop", category: "Campus", title: "Playground" },
    { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1632&auto=format&fit=crop", category: "Academic", title: "Library" },
    { src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1473&auto=format&fit=crop", category: "Campus", title: "Garden Area" },
];

export default function GalleryPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
    const [filter, setFilter] = useState("All");

    const categories = ["All", ...Array.from(new Set(galleryImages.map(img => img.category)))];
    const filteredImages = filter === "All" ? galleryImages : galleryImages.filter(img => img.category === filter);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <WebPageHeader 
                title={t("gallery") || "Photo Gallery"} 
                subtitle="Glimpses of our vibrant campus life, academic excellence, and cultural events."
                icon={ImageIcon} 
            />
            
            <div className="max-w-7xl mx-auto px-4 mt-12">
                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                                filter === cat 
                                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((img, index) => (
                        <div 
                            key={index}
                            className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
                            onClick={() => setSelectedImage(img)}
                        >
                            <Image 
                                src={img.src} 
                                alt={img.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-primary-foreground/80 text-xs font-bold uppercase tracking-wider mb-1">{img.category}</span>
                                <h3 className="text-white font-bold text-lg">{img.title}</h3>
                                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform delay-100">
                                    <Maximize2 className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button className="absolute top-6 right-6 text-white hover:text-primary transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                    <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
                        <Image 
                            src={selectedImage.src} 
                            alt={selectedImage.title}
                            fill
                            className="object-contain"
                        />
                        <div className="absolute -bottom-12 left-0 right-0 text-center">
                            <h3 className="text-white font-bold text-xl">{selectedImage.title}</h3>
                            <p className="text-gray-400 text-sm">{selectedImage.category}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
