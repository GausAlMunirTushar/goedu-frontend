"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { User, Quote, GraduationCap, Calendar, Award, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function PrincipalMessage() {
  const { lng } = useLanguage();
  const { t } = useTranslationClient(lng);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {lng === "bn" ? "অধ্যক্ষের বাণী" : "Principal's Message"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {lng === "bn" ? "অধ্যক্ষের পক্ষ থেকে স্বাগত" : "Message From Our Principal"}
          </h1>
          <div className="w-24 h-1.5 bg-primary rounded-full mx-auto" />
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left: Principal Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl overflow-hidden bg-white">
              <div className="relative h-80 bg-gray-200">
                {/* Placeholder for Principal Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="w-32 h-32 text-gray-400 opacity-50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white">Harish</h2>
                  <p className="text-primary-foreground/90 font-medium">Principal, Demo International High School</p>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Experience</p>
                    <p className="font-semibold">15+ Years in Education</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Qualification</p>
                    <p className="font-semibold">M.A. in Education, B.Ed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
               <Quote className="absolute -top-4 -right-4 w-24 h-24 text-white/10 rotate-12 transition-transform group-hover:scale-110" />
               <p className="relative z-10 italic text-lg leading-relaxed">
                 "Education is not the learning of facts, but the training of the mind to think."
               </p>
               <p className="mt-4 font-bold">- Albert Einstein</p>
            </div>
          </div>

          {/* Right: Message Content */}
          <div className="lg:col-span-2 space-y-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="relative">
              <Quote className="absolute -top-6 -left-6 w-12 h-12 text-primary/10" />
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
                <p className="text-xl font-medium text-gray-900 italic border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
                  {lng === "bn" 
                    ? "ই-পাঠশালার প্রতিটি শিক্ষার্থীকে আগামীর নেতৃত্বদানকারী হিসেবে গড়ে তোলাই আমাদের লক্ষ্য।" 
                    : "At Demo International High School, we believe that every student has the potential to become a leader of tomorrow."}
                </p>

                <p>
                  {lng === "bn"
                    ? "সুধী অভিভাবক ও শিক্ষার্থীবৃন্দ, আসসালামু আলাইকুম। একটি আধুনিক ও মানসম্মত শিক্ষাপ্রতিষ্ঠান হিসেবে আমাদের মূল লক্ষ্য হলো শিক্ষার্থীদের মেধার বিকাশের পাশাপাশি তাদের নৈতিক চরিত্র গঠন করা। আমরা বিশ্বাস করি, কেবল পুথিগত বিদ্যা নয়, বরং সৃজনশীলতা ও মূল্যবোধই একজন মানুষকে প্রকৃত মানুষ হিসেবে গড়ে তোলে।"
                    : "Dear parents and students, welcome to our academic community. As a modern and high-standard educational institution, our primary goal is to develop students' talents alongside building their moral character. We believe that not just bookish knowledge, but creativity and values truly shape a human being."}
                </p>

                <p>
                  {lng === "bn"
                    ? "আমাদের রয়েছে অভিজ্ঞ শিক্ষক মন্ডলী এবং অত্যাধুনিক শিক্ষা উপকরণ। আমরা প্রতিটি শিক্ষার্থীর ব্যক্তিগত মেধার মূল্যায়ন করি এবং তাদের সুপ্ত প্রতিভা বিকাশে সহায়তা করি। ডিজিটাল যুগে নিজেদের মানিয়ে নিতে আমরা প্রযুক্তিনির্ভর শিক্ষার ওপর গুরুত্বারোপ করছি।"
                    : "We have experienced faculty members and state-of-the-art educational tools. We evaluate each student's personal talent and assist in developing their latent potential. To adapt in the digital age, we emphasize technology-based education."}
                </p>

                <p>
                  {lng === "bn"
                    ? "আমি বিশ্বাস করি, শিক্ষক, অভিভাবক ও শিক্ষার্থীদের সম্মিলিত প্রচেষ্টায় আমরা এক উজ্জ্বল ভবিষ্যৎ গড়ে তুলতে সক্ষম হবো। আপনাদের সকলের সহযোগিতা ও দোয়া কাম্য।"
                    : "I believe that through the combined efforts of teachers, parents, and students, we will be able to build a bright future. We seek your cooperation and prayers."}
                </p>

                <div className="pt-8 border-t border-gray-100">
                  <p className="font-bold text-gray-900 mb-1">Harish</p>
                  <p className="text-sm text-gray-500">Principal</p>
                  <p className="text-sm text-gray-500 font-medium">Demo International High School</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
