"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { User, Quote, BookOpen, Award, GraduationCap, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HeadTeacherMessage() {
  const { lng } = useLanguage();
  const { t } = useTranslationClient(lng);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
            <ClipboardList className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {lng === "bn" ? "প্রধান শিক্ষকের বাণী" : "Head Teacher's Message"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {lng === "bn" ? "প্রধান শিক্ষকের পক্ষ থেকে শুভেচ্ছা" : "Message From Our Head Teacher"}
          </h1>
          <div className="w-24 h-1.5 bg-emerald-500 rounded-full mx-auto" />
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left: Head Teacher Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl overflow-hidden bg-white">
              <div className="relative h-80 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="w-32 h-32 text-gray-400 opacity-50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white">Mrs. Farhana</h2>
                  <p className="text-emerald-200 font-medium">Head Teacher, Demo International High School</p>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Experience</p>
                    <p className="font-semibold">12+ Years in Academic Admin</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Education</p>
                    <p className="font-semibold">M.Sc, M.Ed (Gold Medalist)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-emerald-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
               <Quote className="absolute -top-4 -right-4 w-24 h-24 text-white/10 rotate-12 transition-transform group-hover:scale-110" />
               <p className="relative z-10 italic text-lg leading-relaxed">
                 "Academic discipline and creative freedom are the two wings that allow a student to fly high."
               </p>
            </div>
          </div>

          {/* Right: Message Content */}
          <div className="lg:col-span-2 space-y-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="relative">
              <Quote className="absolute -top-6 -left-6 w-12 h-12 text-emerald-500/10" />
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
                <p className="text-xl font-medium text-gray-900 italic border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-50 rounded-r-xl">
                  {lng === "bn" 
                    ? "মানসম্মত শিক্ষা এবং শৃঙ্খলাই আমাদের পথচলার মূল শক্তি।" 
                    : "Quality education and discipline are the core strengths of our journey."}
                </p>

                <p>
                  {lng === "bn"
                    ? "সুপ্রিয় শিক্ষার্থীবৃন্দ ও অভিভাবকগণ, আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভার বিকাশ ঘটানো। আমরা মনে করি, শিক্ষা কেবল পরীক্ষার ফলাফল নয়, বরং জীবনের প্রতিটি ক্ষেত্রে আদর্শ মানুষ হিসেবে গড়ে ওঠার প্রস্তুতি।"
                    : "Dear students and parents, our goal is to develop the latent talent of every student. We believe that education is not just about exam results, but preparation to become an ideal person in every aspect of life."}
                </p>

                <p>
                  {lng === "bn"
                    ? "শ্রেণীকক্ষে পাঠদানের পাশাপাশি আমরা সহ-শিক্ষা কার্যক্রমের ওপরও গুরুত্ব দিই। খেলাধুলা, বিতর্ক এবং সাংস্কৃতিক চর্চার মাধ্যমে শিক্ষার্থীদের নেতৃত্বের গুণাবলী বিকশিত হয়। আমাদের আধুনিক ক্লাসরুম এবং সমৃদ্ধ ল্যাবরেটরি শিক্ষার্থীদের বিজ্ঞানমনস্ক করে গড়ে তুলতে সাহায্য করছে।"
                    : "Alongside classroom teaching, we also emphasize co-curricular activities. Through sports, debates, and cultural practices, students' leadership qualities develop. Our modern classrooms and enriched laboratories are helping to build science-minded students."}
                </p>

                <p>
                  {lng === "bn"
                    ? "আমরা চাই আমাদের শিক্ষার্থীরা দেশ ও দশের গর্ব হয়ে গড়ে উঠুক। সকলের উজ্জ্বল ভবিষ্যৎ কামনা করছি।"
                    : "We want our students to grow up to be the pride of the country. I wish everyone a bright future."}
                </p>

                <div className="pt-8 border-t border-gray-100">
                  <p className="font-bold text-gray-900 mb-1">Mrs. Farhana</p>
                  <p className="text-sm text-gray-500">Head Teacher</p>
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
