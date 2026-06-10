"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Calendar, Award, Star, Milestone, Building, Landmark, Compass } from "lucide-react";

export default function History() {
  const { lng } = useLanguage();
  const { t } = useTranslationClient(lng);

  const milestones = [
    {
      year: "2015",
      titleEn: "Foundation & First Stone",
      titleBn: "প্রতিষ্ঠা ও ভিত্তিপ্রস্তর স্থাপন",
      descEn: "ePathshala was founded with a small cohort of 120 students and 8 teachers in a temporary campus, with a mission to bring high-quality modern education to the local community.",
      descBn: "মাত্র ১২০ জন শিক্ষার্থী এবং ৮ জন শিক্ষক নিয়ে একটি অস্থায়ী ক্যাম্পাসে ই-পাঠশালার যাত্রা শুরু হয়, যার লক্ষ্য ছিল স্থানীয় সম্প্রদায়ের কাছে মানসম্মত আধুনিক শিক্ষা পৌঁছে দেওয়া।",
      icon: Landmark,
      color: "bg-emerald-500",
    },
    {
      year: "2018",
      titleEn: "Permanent Campus & Recognition",
      titleBn: "স্থায়ী ক্যাম্পাস ও সরকারি স্বীকৃতি",
      descEn: "Moved to our state-of-the-art permanent campus. Received official government recognition and affiliation. Student enrollment crossed 500+.",
      descBn: "আমাদের নিজস্ব আধুনিক স্থায়ী ক্যাম্পাসে স্থানান্তর। অফিশিয়াল সরকারি স্বীকৃতি এবং অধিভুক্তি লাভ। শিক্ষার্থীর সংখ্যা ৫০০ ছাড়িয়ে যায়।",
      icon: Building,
      color: "bg-primary",
    },
    {
      year: "2020",
      titleEn: "Introduction of Science & Commerce streams",
      titleBn: "বিজ্ঞান ও ব্যবসায় শিক্ষা বিভাগ চালু",
      descEn: "Expanded curriculum to support Science and Business studies. Constructed specialized Physics, Chemistry and Biology laboratories.",
      descBn: "বিজ্ঞান ও ব্যবসায় শিক্ষা বিভাগ চালুর মাধ্যমে কারিকুলামের সম্প্রসারণ। আধুনিক পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞান ল্যাবরেটরি নির্মাণ।",
      icon: Milestone,
      color: "bg-teal-500",
    },
    {
      year: "2022",
      titleEn: "Best Digital School Award",
      titleBn: "সেরা ডিজিটাল স্কুল পুরস্কার",
      descEn: "Awarded as the 'Best Smart School' in the division for our digital learning platforms, computer labs, and smart classroom integrations.",
      descBn: "ডিজিটাল লার্নিং প্ল্যাটফর্ম, কম্পিউটার ল্যাব এবং স্মার্ট ক্লাসরুমের সফল ব্যবহারের জন্য বিভাগীয় পর্যায়ে 'সেরা স্মার্ট স্কুল' হিসেবে পুরস্কৃত।",
      icon: Award,
      color: "bg-amber-500",
    },
    {
      year: "2025",
      titleEn: "10-Year Anniversary & Next-Gen Smart Portal",
      titleBn: "১০ বছর পূর্তি ও নতুন স্মার্ট পোর্টাল",
      descEn: "Celebrating a decade of academic excellence. Launched the ePathshala all-in-one smart portal for interactive parents-teachers-student connection.",
      descBn: "একাডেমিক শ্রেষ্ঠত্বের এক দশক উদযাপন। অভিভাবক, শিক্ষক ও শিক্ষার্থীদের সরাসরি যোগাযোগের জন্য অল-ইন-ওয়ান ই-পাঠশালা স্মার্ট পোর্টাল চালু।",
      icon: Star,
      color: "bg-indigo-500",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-emerald-50/20 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {lng === "bn" ? "আমাদের ইতিহাস" : "Our Journey & History"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 font-sans">
            {lng === "bn" ? "শিক্ষার গৌরবময় পথচলা" : "A Decade of Educational Excellence"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {lng === "bn" 
              ? "২০১৫ সাল থেকে যাত্রা শুরু করে আজ অবধি আমাদের গৌরবময় ইতিহাস এবং সাফল্যের মাইলফলক।" 
              : "Discover the stories, milestones, and achievements that have shaped ePathshala since our establishment in 2015."}
          </p>
        </div>

        {/* Timeline representation */}
        <div className="relative border-l border-gray-200 ml-4 md:ml-32 space-y-12 pb-10">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            const title = lng === "bn" ? m.titleBn : m.titleEn;
            const desc = lng === "bn" ? m.descBn : m.descEn;
            
            return (
              <div key={idx} className="relative pl-8 md:pl-12 group">
                {/* Year tag for large screen, aligned left of timeline */}
                <div className="hidden md:block absolute -left-32 top-1 text-right w-24">
                  <span className="text-2xl font-black text-primary font-mono">{m.year}</span>
                </div>

                {/* Timeline Icon circle indicator */}
                <div className={`absolute -left-[18px] top-1 w-9 h-9 rounded-full ${m.color} text-white flex items-center justify-center ring-4 ring-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Card content */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                  {/* Year tag for small screens */}
                  <span className="inline-block md:hidden text-xs bg-primary/10 text-primary font-black px-2.5 py-1 rounded-full mb-2 font-mono">
                    {m.year}
                  </span>
                  
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing summary */}
        <div className="bg-primary text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg mt-12">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <h2 className="text-2xl font-bold mb-4">
            {lng === "bn" ? "ভবিষ্যতের দিকে এগিয়ে চলা" : "Looking Forward to the Future"}
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {lng === "bn"
              ? "আমরা কেবল আমাদের ইতিহাস উদযাপন করছি না, আমরা প্রতিটি শিক্ষার্থীকে আগামীর চ্যালেঞ্জ মোকাবিলায় প্রস্তুত করার জন্য প্রতিনিয়ত আমাদের প্রচেষ্টা চালনা করছি।"
              : "While we are proud of our past, we remain fully committed to innovating our pedagogy and systems to give students the best opportunities for their future."}
          </p>
        </div>

      </div>
    </div>
  );
}
