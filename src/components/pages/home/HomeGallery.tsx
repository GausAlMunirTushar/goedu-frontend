// src/components/pages/home/HomeGallery.tsx
"use client"

import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "swiper/css/autoplay"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Button } from "@/components/ui/button"

// Sample data – replace with your API or CMS data later
const galleryItems = [
  { type: "image" as const, src: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=2070", alt: "Image 1" },
  { type: "image" as const, src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070", alt: "Image 2" },
  { type: "image" as const, src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2070", alt: "Image 3" },
  { type: "image" as const, src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070", alt: "Image 4" },
  { type: "image" as const, src: "https://images.unsplash.com/photo-1521335629791-ce4aec67ddc5?q=80&w=2070", alt: "Image 5" },
]

// Simple i18n – adapt to your i18n solution
const translations = {
  en: { title: "Gallery", next: "Next", prev: "Prev" },
  bn: { title: "গ্যালারী", next: "পরবর্তী", prev: "পূর্বের" },
}

interface HomeGalleryProps {
  /** Language code – "en" or "bn" */
  locale?: "en" | "bn"
}

export default function HomeGallery({ locale = "en" }: HomeGalleryProps) {
  const swiperRef = useRef<any>(null);
  const t = translations[locale]
  return (
    <section className="my-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">{t.title}</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="max-w-5xl mx-auto"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {galleryItems.map((item, idx) => (
          <SwiperSlide key={idx} className="flex justify-center group">
            <div className="relative w-80 h-80 overflow-hidden rounded-lg">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.alt}
              </div>
            </div>
          </SwiperSlide>
        ))}
        {/* Custom Navigation Buttons */}
        <Button
          variant="outline"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white"
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          variant="outline"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white"
        >
          <ChevronRight size={20} />
        </Button>
      </Swiper>
    </section>
  )
}
