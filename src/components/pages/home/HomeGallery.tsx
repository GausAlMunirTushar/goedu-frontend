"use client"

import { useRef } from "react"
import type { Swiper as SwiperClass } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { ChevronLeft, ChevronRight, Images } from "lucide-react"
import "swiper/css/autoplay"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// Sample data – replace with your API or CMS data later
const galleryItems = [
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=2070",
    alt: "Students Learning",
    label: "Collaborative Learning",
  },
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070",
    alt: "Campus Life",
    label: "Campus Life",
  },
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2070",
    alt: "Science Lab",
    label: "Science Lab",
  },
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070",
    alt: "Digital Classroom",
    label: "Digital Classroom",
  },
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070",
    alt: "Student Activities",
    label: "Student Activities",
  },
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070",
    alt: "Library",
    label: "Library & Resources",
  },
]

// Simple i18n – adapt to your i18n solution
const translations = {
  en: {
    title: "Gallery",
    subtitle: "Explore our campus life, events & activities",
    next: "Next",
    prev: "Prev",
  },
  bn: {
    title: "গ্যালারী",
    subtitle: "আমাদের ক্যাম্পাস জীবন, ইভেন্ট এবং কার্যক্রম অন্বেষণ করুন",
    next: "পরবর্তী",
    prev: "পূর্বের",
  },
}

interface HomeGalleryProps {
  /** Language code */
  locale?: string
}

export default function HomeGallery({ locale = "en" }: HomeGalleryProps) {
  const swiperRef = useRef<SwiperClass | null>(null)
  const currentLocale = locale === "bn" ? "bn" : "en"
  const t = translations[currentLocale]

  return (
    <section className="w-full py-14 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <Images className="w-5 h-5 text-primary" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Photo Gallery
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl">
            {t.subtitle}
          </p>
          <div className="mt-4 w-16 h-1 rounded-full bg-primary/60" />
        </div>

        {/* Slider Container */}
        <div className="relative group">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            loop
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="w-full pb-10"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {galleryItems.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-md cursor-pointer group/slide">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 group-hover/slide:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300" />
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 w-full px-4 py-3 translate-y-2 opacity-0 group-hover/slide:translate-y-0 group-hover/slide:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-semibold truncate">
                      {item.label}
                    </p>
                    <p className="text-white/70 text-xs">{item.alt}</p>
                  </div>
                  {/* Badge */}
                  <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300">
                    #{idx + 1}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Prev Button */}
          <button
            aria-label={t.prev}
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-[calc(50%-20px)] -translate-y-1/2 -translate-x-3 z-10
              w-10 h-10 flex items-center justify-center rounded-full
              bg-white shadow-lg border border-gray-100
              text-gray-600 hover:text-primary hover:border-primary/30
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Custom Next Button */}
          <button
            aria-label={t.next}
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-[calc(50%-20px)] -translate-y-1/2 translate-x-3 z-10
              w-10 h-10 flex items-center justify-center rounded-full
              bg-white shadow-lg border border-gray-100
              text-gray-600 hover:text-primary hover:border-primary/30
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
