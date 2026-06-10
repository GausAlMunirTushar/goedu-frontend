"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Compass, Eye, ShieldAlert, Award, Star, Heart, Target, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MissionVision() {
  const { lng } = useLanguage();
  const { t } = useTranslationClient(lng);

  const pillars = [
    {
      icon: BookOpen,
      titleEn: "Academic Excellence",
      titleBn: "একাডেমিক শ্রেষ্ঠত্ব",
      descEn: "We aim to deliver a rigorous and comprehensive curriculum that fosters critical thinking, problem-solving, and a lifelong passion for knowledge.",
      descBn: "আমরা একটি কঠোর এবং তথ্যবহুল কারিকুলাম প্রদান করি যা শিক্ষার্থীদের বিশ্লেষণাত্মক চিন্তাভাবনা এবং আজীবন শিক্ষার প্রতি অনুরাগী করে তোলে।"
    },
    {
      icon: Award,
      titleEn: "Moral & Ethical Values",
      titleBn: "নৈতিক ও মানবিক মূল্যবোধ",
      descEn: "Nurturing empathy, respect, and responsibility to help students build strong character and become responsible global citizens.",
      descBn: "সহানুভূতি, সম্মান এবং দায়িত্ববোধের বিকাশের মাধ্যমে শিক্ষার্থীদের চরিত্র গঠন এবং দায়িত্বশীল বৈশ্বিক নাগরিক হিসেবে প্রস্তুত করা।"
    },
    {
      icon: Sparkles,
      titleEn: "Innovation & Technology",
      titleBn: "উদ্ভাবন ও প্রযুক্তির ব্যবহার",
      descEn: "Integrating modern technology and innovative learning paradigms to prepare students for the demands of the digital era.",
      descBn: "ডিজিটাল যুগের চ্যালেঞ্জ মোকাবিলায় আধুনিক প্রযুক্তি এবং উদ্ভাবনী শিখন পদ্ধতির সমন্বয় ঘটানো।"
    }
  ];

  const coreValues = [
    {
      icon: ShieldAlert,
      titleEn: "Integrity",
      titleBn: "সততা",
      descEn: "Upholding honesty, ethics, and strong moral principles in all actions.",
      descBn: "প্রতিটি কাজে সততা, নৈতিকতা এবং শক্তিশালী নীতি মেনে চলা।"
    },
    {
      icon: Heart,
      titleEn: "Compassion",
      titleBn: "সহমর্মিতা",
      descEn: "Creating an inclusive, friendly, and supportive community for everyone.",
      descBn: "সবার জন্য একটি অন্তর্ভুক্তিমূলক, বন্ধুত্বপূর্ণ ও সহায়ক পরিবেশ তৈরি করা।"
    },
    {
      icon: Target,
      titleEn: "Perseverance",
      titleBn: "অধ্যবসায়",
      descEn: "Encouraging dedication, resilience, and hard work to achieve goals.",
      descBn: "লক্ষ্য অর্জনে নিষ্ঠা, স্থিতিস্থাপকতা এবং কঠোর পরিশ্রমকে উৎসাহিত করা।"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-emerald-50/20 py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {lng === "bn" ? "মিশন ও ভিশন" : "Our Purpose & Values"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 font-sans">
            {lng === "bn" ? "আমাদের লক্ষ্য ও উদ্দেশ্য" : "Our Mission, Vision & Core Values"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {lng === "bn"
              ? "শিক্ষার্থীদের মধ্যে জ্ঞানের বিকাশ, নৈতিক গুণাবলী অর্জন এবং ভবিষ্যতের উপযোগী দক্ষতা গড়ার মাধ্যমে ই-পাঠশালার অভীষ্ট লক্ষ্য অর্জন করা।"
              : "Discover the guiding principles, long-term vision, and daily mission statements that drive every learning experience at ePathshala."}
          </p>
        </div>

        {/* Vision & Mission Row */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision card */}
          <Card className="border-none shadow-lg bg-white overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {lng === "bn" ? "আমাদের ভিশন (দৃষ্টিভঙ্গি)" : "Our Vision"}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {lng === "bn"
                  ? "একটি অগ্রগামী শিক্ষাপ্রতিষ্ঠান হিসেবে আত্মপ্রকাশ করা, যা এমন এক প্রজন্ম তৈরি করবে যারা চিন্তা ও কর্মে হবে আধুনিক, অনুভূতিশীল এবং বিশ্বমানের দক্ষতায় বলীয়ান।"
                  : "To become a pioneering institution that nurtures enlightened, innovative, and ethically grounded global citizens capable of steering positive change in a dynamic world."}
              </p>
            </CardContent>
          </Card>

          {/* Mission card */}
          <Card className="border-none shadow-lg bg-white overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {lng === "bn" ? "আমাদের মিশন (লক্ষ্য)" : "Our Mission"}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {lng === "bn"
                  ? "শিক্ষার্থীদের নৈতিক গুণাবলী সম্পন্ন, বিজ্ঞানমনস্ক এবং প্রযুক্তিবান্ধব যুগোপযোগী শিক্ষাদানের মাধ্যমে তাদের সুপ্ত মেধার বিকাশ ঘটানো এবং সফল নেতৃত্বের গুণাবলী তৈরি করা।"
                  : "To empower students with value-based holistic education, state-of-the-art facilities, and advanced pedagogical tools that cultivate lifelong curiosity, moral strength, and excellence."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Three Pillars of Mission */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {lng === "bn" ? "মিশনের মূল স্তম্ভসমূহ" : "Pillars of Our Mission"}
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-3" />
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Card key={idx} className="border-gray-100/80 shadow-sm hover:shadow-md transition-shadow bg-white text-center p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mx-auto">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {lng === "bn" ? p.titleBn : p.titleEn}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    {lng === "bn" ? p.descBn : p.descEn}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-gray-50/50 rounded-3xl p-8 md:p-12 border border-gray-100 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {lng === "bn" ? "আমাদের মূল মূল্যবোধ" : "Our Core Values"}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-2">
              {lng === "bn" ? "এই মৌলিক মূল্যবোধগুলো আমাদের সামগ্রিক কাজ ও শিক্ষাদান কার্যক্রমকে পরিচালিত করে।" : "The core guidelines that direct our curriculum development and school community behavior."}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {coreValues.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">
                      {lng === "bn" ? v.titleBn : v.titleEn}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {lng === "bn" ? v.descBn : v.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
