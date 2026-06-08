/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Slider() {
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070",
            title: "ডিভাইন ইন্টারন্যাশনাল স্কুল",
            subtitle: ""
        },
        {
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070",
            title: "ডিভাইন ইন্টারন্যাশনাল স্কুল",
            subtitle: ""
        },
        {
            image: "https://images.unsplash.com/photo-1427504494785-319cecb4ce92?q=80&w=2070",
            title: "ডিভাইন ইন্টারন্যাশনাল স্কুল",
            subtitle: ""
        }
    ];

    return (
        <div className="relative w-full h-[300px] md:h-[450px] bg-primary overflow-hidden group">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                navigation={{
                    prevEl: '.custom-prev',
                    nextEl: '.custom-next'
                }}
                pagination={{ 
                    el: '.custom-pagination',
                    clickable: true 
                }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full h-full relative">
                            <div className="absolute inset-0 bg-black/40 z-10"></div>
                            <img src={slide.image} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90" alt="School" />
                            <div className="absolute inset-x-0 bottom-16 z-20 flex flex-col items-center justify-center text-white px-4 text-center">
                                <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg tracking-tight">{slide.title}</h2>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            
            {/* Custom Pagination (Bottom Left) */}
            <div className="custom-pagination absolute left-4 md:left-8 bottom-6 z-30 flex gap-2"></div>

            {/* Custom Navigation Icons (Bottom Right) */}
            <div className="absolute right-4 md:right-8 bottom-6 z-30 flex gap-2">
                <button className="custom-prev w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center rounded transition shadow-sm cursor-pointer">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="custom-next w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center rounded transition shadow-sm cursor-pointer">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            
            <style jsx global>{`
                .custom-pagination .swiper-pagination-bullet {
                    background: rgba(255,255,255,0.4);
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                .custom-pagination .swiper-pagination-bullet-active {
                    background: var(--primary);
                    width: 10px;
                    height: 10px;
                }
            `}</style>
        </div>
    );
}
