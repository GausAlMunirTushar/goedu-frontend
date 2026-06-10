"use client"

import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import type { Swiper as SwiperClass } from "swiper"
import { ChevronLeft, ChevronRight, Star, Trophy, Medal } from "lucide-react"
import Image from "next/image"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"

const bestStudents = [
  {
    id: 1,
    name: "Ayasha Siddiqua",
    nameBn: "আয়েশা সিদ্দিকা",
    class: "Class X",
    classBn: "দশম শ্রেণী",
    gpa: "5.00",
    rank: 1,
    session: "2024",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&fit=crop",
    achievement: "Golden A+",
    achievementBn: "সোনালী এ+",
  },
  {
    id: 2,
    name: "Md. Raihan Islam",
    nameBn: "মো. রায়হান ইসলাম",
    class: "Class X",
    classBn: "দশম শ্রেণী",
    gpa: "5.00",
    rank: 2,
    session: "2024",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop",
    achievement: "Golden A+",
    achievementBn: "সোনালী এ+",
  },
  {
    id: 3,
    name: "Fatema Akter",
    nameBn: "ফাতেমা আক্তার",
    class: "Class IX",
    classBn: "নবম শ্রেণী",
    gpa: "4.94",
    rank: 3,
    session: "2024",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&h=400&fit=crop",
    achievement: "A+",
    achievementBn: "এ+",
  },
  {
    id: 4,
    name: "Sabbir Hossain",
    nameBn: "সাব্বির হোসেন",
    class: "Class VIII",
    classBn: "অষ্টম শ্রেণী",
    gpa: "4.88",
    rank: 4,
    session: "2024",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop",
    achievement: "A+",
    achievementBn: "এ+",
  },
  {
    id: 5,
    name: "Nusrat Jahan",
    nameBn: "নুসরাত জাহান",
    class: "Class X",
    classBn: "দশম শ্রেণী",
    gpa: "4.83",
    rank: 5,
    session: "2024",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop",
    achievement: "A+",
    achievementBn: "এ+",
  },
  {
    id: 6,
    name: "Tanvir Ahmed",
    nameBn: "তানভীর আহমেদ",
    class: "Class IX",
    classBn: "নবম শ্রেণী",
    gpa: "4.78",
    rank: 6,
    session: "2024",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop",
    achievement: "A",
    achievementBn: "এ",
  },
]

const rankConfig: Record<number, { icon: React.ReactNode; ring: string; badge: string }> = {
  1: {
    icon: <Trophy className="w-4 h-4" />,
    ring: "ring-yellow-400",
    badge: "bg-gradient-to-br from-yellow-400 to-amber-500 text-white",
  },
  2: {
    icon: <Medal className="w-4 h-4" />,
    ring: "ring-gray-400",
    badge: "bg-gradient-to-br from-gray-300 to-gray-500 text-white",
  },
  3: {
    icon: <Medal className="w-4 h-4" />,
    ring: "ring-amber-600",
    badge: "bg-gradient-to-br from-amber-600 to-amber-800 text-white",
  },
}

const translations = {
  en: {
    title: "Best Students",
    subtitle: "Our outstanding students who excelled in academics",
    gpa: "GPA",
    rank: "Rank",
    session: "Session",
  },
  bn: {
    title: "সেরা ছাত্র/ছাত্রী",
    subtitle: "আমাদের কৃতী শিক্ষার্থী যারা পরীক্ষায় অসাধারণ ফলাফল করেছে",
    gpa: "জিপিএ",
    rank: "স্থান",
    session: "সেশন",
  },
}

interface StudentGalleryProps {
  locale?: string
}

export default function StudentGallery({ locale = "en" }: StudentGalleryProps) {
  const swiperRef = useRef<SwiperClass | null>(null)
  const isBn = locale === "bn"
  const t = translations[isBn ? "bn" : "en"]

  return (
    <section className="w-full py-14 bg-gradient-to-b from-primary/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {isBn ? "কৃতী শিক্ষার্থী" : "Top Performers"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl">
            {t.subtitle}
          </p>
          <div className="mt-4 w-16 h-1 rounded-full bg-yellow-400" />
        </div>

        {/* Swiper */}
        <div className="relative group">
          <Swiper
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1280: { slidesPerView: 5, spaceBetween: 20 },
            }}
            className="w-full pb-10"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {bestStudents.map((student) => {
              const rc = rankConfig[student.rank]
              return (
                <SwiperSlide key={student.id}>
                  <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-5 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group/card">

                    {/* Photo */}
                    <div className={`relative w-28 h-32 rounded-2xl overflow-hidden mb-4 ring-2 ${rc?.ring ?? "ring-primary/30"} ring-offset-2`}>
                      <Image
                        src={student.photo}
                        alt={student.name}
                        fill
                        sizes="112px"
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 group-hover/card:scale-110"
                      />
                      {/* Rank Badge */}
                      <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow ${rc?.badge ?? "bg-primary text-white"}`}>
                        {rc?.icon ?? `#${student.rank}`}
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">
                      {isBn ? student.nameBn : student.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {isBn ? student.classBn : student.class}
                    </p>

                    {/* GPA Pill */}
                    <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold mb-2">
                      {t.gpa}: {student.gpa}
                    </div>

                    {/* Achievement */}
                    <span className="text-[10px] bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-0.5 rounded-full font-semibold">
                      {isBn ? student.achievementBn : student.achievement}
                    </span>

                    {/* Session */}
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                      {t.session}: {student.session}
                    </p>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>

          {/* Prev Button */}
          <button
            aria-label="Previous"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-[calc(50%-24px)] -translate-y-1/2 -translate-x-3 z-10
              w-10 h-10 flex items-center justify-center rounded-full
              bg-white shadow-lg border border-gray-100
              text-gray-600 hover:text-primary hover:border-primary/30
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Next Button */}
          <button
            aria-label="Next"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-[calc(50%-24px)] -translate-y-1/2 translate-x-3 z-10
              w-10 h-10 flex items-center justify-center rounded-full
              bg-white shadow-lg border border-gray-100
              text-gray-600 hover:text-primary hover:border-primary/30
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
