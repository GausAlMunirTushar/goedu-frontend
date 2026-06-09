// src/components/pages/home/SwiperGallery.tsx
"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// Sample data – replace with your API or CMS data later
const galleryItems = [
  { type: "image" as const, src: "/images/gallery1.jpg", alt: "Image 1" },
  { type: "image", src: "/images/gallery2.jpg", alt: "Image 2" },
  { type: "image", src: "/images/gallery3.jpg", alt: "Image 3" },
  { type: "video" as const, src: "/videos/gallery1.mp4", alt: "Video 1" },
  { type: "video", src: "/videos/gallery2.mp4", alt: "Video 2" },
]

// Simple i18n – adapt to your i18n solution
const translations = {
  en: { title: "Gallery" },
  bn: { title: "গ্যালারী" },
}

interface SwiperGalleryProps {
  /** Language code – "en" or "bn" */
  locale?: "en" | "bn"
}

export default function SwiperGallery({ locale = "en" }: SwiperGalleryProps) {
  const t = translations[locale]
  return (
    <section className="my-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">{t.title}</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
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
      >
        {galleryItems.map((item, idx) => (
          <SwiperSlide key={idx} className="flex justify-center">
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={500}
                className="object-cover rounded-lg"
              />
            ) : (
              <video
                src={item.src}
                controls
                className="w-full h-auto rounded-lg"
                aria-label={item.alt}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
