"use client";

import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Flag, Star, Award, Coffee, Umbrella, Download, Printer } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */
type EventType = "exam" | "holiday" | "event" | "meeting" | "vacation" | "sports";

interface CalendarEvent {
  id: number;
  title: string;
  titleBn?: string;
  date: string;        // YYYY-MM-DD
  endDate?: string;    // YYYY-MM-DD (for multi-day)
  type: EventType;
  description?: string;
}

/* ─── Data ─────────────────────────────────────────────────── */
const events: CalendarEvent[] = [
  // January
  { id: 1, title: "New Year's Day", titleBn: "নববর্ষ", date: "2025-01-01", type: "holiday", description: "Public holiday" },
  { id: 2, title: "Annual Result Publication", date: "2025-01-15", type: "exam", description: "SSC Annual Exam Result" },
  { id: 3, title: "Class Re-open", date: "2025-01-19", type: "event", description: "School reopens after winter break" },

  // February
  { id: 4, title: "Language Martyrs Day", titleBn: "শহীদ দিবস", date: "2025-02-21", type: "holiday", description: "International Mother Language Day" },
  { id: 5, title: "1st Half Yearly Exam", date: "2025-02-10", endDate: "2025-02-20", type: "exam", description: "Mid-term examination" },

  // March
  { id: 6, title: "Independence Day", titleBn: "স্বাধীনতা দিবস", date: "2025-03-26", type: "holiday", description: "National holiday" },
  { id: 7, title: "Annual Sports Day", date: "2025-03-15", type: "sports", description: "Inter-school sports competition" },
  { id: 8, title: "Parent-Teacher Meeting", date: "2025-03-22", type: "meeting", description: "PTM for all classes" },

  // April
  { id: 9, title: "Bangla New Year", titleBn: "পহেলা বৈশাখ", date: "2025-04-14", type: "holiday", description: "Bengali New Year celebration" },
  { id: 10, title: "Eid-ul-Fitr Break", date: "2025-04-01", endDate: "2025-04-07", type: "vacation", description: "Eid vacation" },

  // May
  { id: 11, title: "May Day", date: "2025-05-01", type: "holiday" },
  { id: 12, title: "Half Yearly Exam", date: "2025-05-18", endDate: "2025-05-30", type: "exam", description: "Half yearly examination" },

  // June
  { id: 13, title: "Summer Vacation", date: "2025-06-10", endDate: "2025-06-25", type: "vacation", description: "Summer recess" },

  // July
  { id: 14, title: "School Reopens", date: "2025-07-01", type: "event" },
  { id: 15, title: "Science Fair", date: "2025-07-20", type: "event", description: "Annual inter-class science fair" },

  // August
  { id: 16, title: "Annual Exam Begins", date: "2025-08-10", endDate: "2025-08-25", type: "exam", description: "Annual examination" },
  { id: 17, title: "National Mourning Day", titleBn: "জাতীয় শোক দিবস", date: "2025-08-15", type: "holiday" },

  // September
  { id: 18, title: "Result Publication", date: "2025-09-05", type: "exam", description: "Annual exam result" },
  { id: 19, title: "Cultural Week", date: "2025-09-15", endDate: "2025-09-20", type: "event", description: "Annual cultural programme" },

  // October
  { id: 20, title: "Durga Puja Vacation", date: "2025-10-01", endDate: "2025-10-05", type: "vacation" },
  { id: 21, title: "Prize Giving Ceremony", date: "2025-10-20", type: "event", description: "Annual prize giving & cultural programme" },

  // November
  { id: 22, title: "Pre-Test Exam", date: "2025-11-03", endDate: "2025-11-15", type: "exam" },
  { id: 23, title: "Parent Meeting", date: "2025-11-25", type: "meeting" },

  // December
  { id: 24, title: "Victory Day", titleBn: "বিজয় দিবস", date: "2025-12-16", type: "holiday" },
  { id: 25, title: "Winter Vacation", date: "2025-12-20", endDate: "2025-12-31", type: "vacation", description: "Winter recess" },
  { id: 26, title: "Final Exam", date: "2025-12-01", endDate: "2025-12-12", type: "exam" },
];

/* ─── Config ────────────────────────────────────────────────── */
const EVENT_CONFIG: Record<EventType, { label: string; icon: React.ReactNode; bg: string; text: string; dot: string }> = {
  exam:     { label: "Exam",     icon: <BookOpen className="w-3.5 h-3.5" />,  bg: "bg-blue-50 border-blue-200",    text: "text-blue-800",   dot: "bg-blue-500" },
  holiday:  { label: "Holiday",  icon: <Flag className="w-3.5 h-3.5" />,      bg: "bg-red-50 border-red-200",      text: "text-red-800",    dot: "bg-red-500" },
  event:    { label: "Event",    icon: <Star className="w-3.5 h-3.5" />,      bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500" },
  meeting:  { label: "Meeting",  icon: <Award className="w-3.5 h-3.5" />,     bg: "bg-purple-50 border-purple-200", text: "text-purple-800", dot: "bg-purple-500" },
  vacation: { label: "Vacation", icon: <Umbrella className="w-3.5 h-3.5" />, bg: "bg-amber-50 border-amber-200",  text: "text-amber-800",  dot: "bg-amber-500" },
  sports:   { label: "Sports",   icon: <Coffee className="w-3.5 h-3.5" />,    bg: "bg-lime-50 border-lime-200",    text: "text-lime-800",   dot: "bg-lime-600" },
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ─── Helpers ────────────────────────────────────────────────── */
function eventsForMonth(month: number, year: number) {
  return events.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function AcademicCalendar() {
  const [viewMonth, setViewMonth] = useState(0); // 0 = January
  const year = 2025;
  const [filter, setFilter] = useState<EventType | "all">("all");

  const monthEvents = eventsForMonth(viewMonth, year).filter(
    (e) => filter === "all" || e.type === filter
  );

  const allFiltered = events.filter((e) => filter === "all" || e.type === filter);

  const prev = () => setViewMonth((m) => (m === 0 ? 11 : m - 1));
  const next = () => setViewMonth((m) => (m === 11 ? 0 : m + 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-emerald-50/20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-widest">Academic</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">Academic Calendar</h1>
          <p className="text-primary-foreground/75 text-sm">All events, exams, holidays & vacations · {year}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === "all" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary/30"}`}
            >
              All Events
            </button>
            {(Object.entries(EVENT_CONFIG) as [EventType, typeof EVENT_CONFIG[EventType]][]).map(([type, cfg]) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === type ? `${cfg.bg} ${cfg.text} border-current` : "bg-white text-gray-600 border-gray-200 hover:border-primary/30"}`}
              >
                {cfg.icon} {cfg.label}
              </button>
            ))}
          </div>
          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm transition-all">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Month View ───────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Month Navigator */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <button onClick={prev} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <h2 className="text-base font-bold text-gray-900">{MONTHS[viewMonth]} {year}</h2>
                <button onClick={next} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Events for selected month */}
              {monthEvents.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No events this month</p>
              ) : (
                <div className="space-y-2">
                  {monthEvents.map((e) => {
                    const cfg = EVENT_CONFIG[e.type];
                    return (
                      <div key={e.id} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg}`}>
                        <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${cfg.text} bg-white/60`}>
                          {cfg.icon}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold leading-tight ${cfg.text}`}>{e.title}</p>
                          {e.titleBn && <p className="text-[10px] text-gray-500">{e.titleBn}</p>}
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {formatDate(e.date)}{e.endDate ? ` – ${formatDate(e.endDate)}` : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Legend</h3>
              <div className="space-y-2">
                {(Object.entries(EVENT_CONFIG) as [EventType, typeof EVENT_CONFIG[EventType]][]).map(([type, cfg]) => (
                  <div key={type} className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${cfg.dot}`} />
                    <span className="text-xs text-gray-700 font-medium">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Full Year List ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {MONTHS.map((month, mi) => {
              const mEvents = eventsForMonth(mi, year).filter((e) => filter === "all" || e.type === filter);
              if (mEvents.length === 0) return null;
              return (
                <div key={month} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                    <span className="w-8 h-8 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                      {month.slice(0, 3).toUpperCase()}
                    </span>
                    <h3 className="font-bold text-gray-800 text-sm">{month} {year}</h3>
                    <span className="ml-auto text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                      {mEvents.length} event{mEvents.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {mEvents.map((e) => {
                      const cfg = EVENT_CONFIG[e.type];
                      return (
                        <div key={e.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                          {/* Date box */}
                          <div className={`shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border ${cfg.bg}`}>
                            <span className={`text-sm font-black leading-none ${cfg.text}`}>
                              {new Date(e.date).getDate()}
                            </span>
                            <span className={`text-[9px] font-semibold uppercase ${cfg.text} opacity-70`}>
                              {month.slice(0, 3)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-gray-900">{e.title}</p>
                              {e.titleBn && <p className="text-xs text-gray-500">({e.titleBn})</p>}
                              <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text}`}>
                                {cfg.icon} {cfg.label}
                              </span>
                            </div>
                            {e.endDate && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                📅 {formatDate(e.date)} – {formatDate(e.endDate)}
                              </p>
                            )}
                            {e.description && (
                              <p className="text-xs text-gray-500 mt-0.5">{e.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
