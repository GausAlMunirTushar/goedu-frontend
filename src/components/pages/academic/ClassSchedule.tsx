"use client";

import React, { useState } from "react";
import { Printer, Download, BookOpen, Clock, User, MapPin, Calendar, ChevronDown } from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────── */
const classes = ["Class VI", "Class VII", "Class VIII", "Class IX", "Class X"];
const sections = ["Section A", "Section B", "Section C"];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const TIME_SLOTS = [
  { start: "09:00", end: "09:45", label: "1st Period" },
  { start: "09:45", end: "10:30", label: "2nd Period" },
  { start: "10:30", end: "10:45", label: "Tiffin Break", isBreak: true },
  { start: "10:45", end: "11:30", label: "3rd Period" },
  { start: "11:30", end: "12:15", label: "4th Period" },
  { start: "12:15", end: "13:00", label: "5th Period" },
  { start: "13:00", end: "13:30", label: "Lunch Break", isBreak: true },
  { start: "13:30", end: "14:15", label: "6th Period" },
  { start: "14:15", end: "15:00", label: "7th Period" },
];

interface Period {
  subject: string;
  teacher: string;
  room: string;
  color: string;
}

type RoutineMap = Record<string, Record<string, Period | null>>;

const subjectColors: Record<string, string> = {
  Mathematics:        "bg-blue-50 border-blue-200 text-blue-900",
  "English":          "bg-emerald-50 border-emerald-200 text-emerald-900",
  "Bangla":           "bg-amber-50 border-amber-200 text-amber-900",
  "General Science":  "bg-purple-50 border-purple-200 text-purple-900",
  "ICT":              "bg-cyan-50 border-cyan-200 text-cyan-900",
  "History":          "bg-rose-50 border-rose-200 text-rose-900",
  "Geography":        "bg-orange-50 border-orange-200 text-orange-900",
  "Physical Education": "bg-lime-50 border-lime-200 text-lime-900",
  "Religion":         "bg-teal-50 border-teal-200 text-teal-900",
};

const sampleRoutine: RoutineMap = {
  Sunday: {
    "09:00": { subject: "Mathematics", teacher: "Mr. Zaman", room: "Room 101", color: subjectColors["Mathematics"] },
    "09:45": { subject: "English", teacher: "Ms. Rahman", room: "Room 101", color: subjectColors["English"] },
    "10:45": { subject: "General Science", teacher: "Dr. Kamal", room: "Lab B", color: subjectColors["General Science"] },
    "11:30": { subject: "History", teacher: "Mrs. Begum", room: "Room 101", color: subjectColors["History"] },
    "13:30": { subject: "Bangla", teacher: "Mr. Haque", room: "Room 101", color: subjectColors["Bangla"] },
    "14:15": { subject: "Geography", teacher: "Mrs. Begum", room: "Room 101", color: subjectColors["Geography"] },
  },
  Monday: {
    "09:00": { subject: "English", teacher: "Ms. Rahman", room: "Room 101", color: subjectColors["English"] },
    "09:45": { subject: "Mathematics", teacher: "Mr. Zaman", room: "Room 101", color: subjectColors["Mathematics"] },
    "10:45": { subject: "ICT", teacher: "Mr. Islam", room: "Computer Lab", color: subjectColors["ICT"] },
    "11:30": { subject: "Physical Education", teacher: "Mr. Rana", room: "Playground", color: subjectColors["Physical Education"] },
    "13:30": { subject: "General Science", teacher: "Dr. Kamal", room: "Lab B", color: subjectColors["General Science"] },
    "14:15": { subject: "Religion", teacher: "Mr. Ali", room: "Room 101", color: subjectColors["Religion"] },
  },
  Tuesday: {
    "09:00": { subject: "General Science", teacher: "Dr. Kamal", room: "Lab B", color: subjectColors["General Science"] },
    "09:45": { subject: "Bangla", teacher: "Mr. Haque", room: "Room 101", color: subjectColors["Bangla"] },
    "10:45": { subject: "Mathematics", teacher: "Mr. Zaman", room: "Room 101", color: subjectColors["Mathematics"] },
    "11:30": { subject: "English", teacher: "Ms. Rahman", room: "Room 101", color: subjectColors["English"] },
    "13:30": { subject: "History", teacher: "Mrs. Begum", room: "Room 101", color: subjectColors["History"] },
    "14:15": { subject: "ICT", teacher: "Mr. Islam", room: "Computer Lab", color: subjectColors["ICT"] },
  },
  Wednesday: {
    "09:00": { subject: "Bangla", teacher: "Mr. Haque", room: "Room 101", color: subjectColors["Bangla"] },
    "09:45": { subject: "History", teacher: "Mrs. Begum", room: "Room 101", color: subjectColors["History"] },
    "10:45": { subject: "English", teacher: "Ms. Rahman", room: "Room 101", color: subjectColors["English"] },
    "11:30": { subject: "Mathematics", teacher: "Mr. Zaman", room: "Room 101", color: subjectColors["Mathematics"] },
    "13:30": { subject: "Physical Education", teacher: "Mr. Rana", room: "Playground", color: subjectColors["Physical Education"] },
    "14:15": { subject: "General Science", teacher: "Dr. Kamal", room: "Lab B", color: subjectColors["General Science"] },
  },
  Thursday: {
    "09:00": { subject: "ICT", teacher: "Mr. Islam", room: "Computer Lab", color: subjectColors["ICT"] },
    "09:45": { subject: "Geography", teacher: "Mrs. Begum", room: "Room 101", color: subjectColors["Geography"] },
    "10:45": { subject: "Bangla", teacher: "Mr. Haque", room: "Room 101", color: subjectColors["Bangla"] },
    "11:30": { subject: "Religion", teacher: "Mr. Ali", room: "Room 101", color: subjectColors["Religion"] },
    "13:30": { subject: "Mathematics", teacher: "Mr. Zaman", room: "Room 101", color: subjectColors["Mathematics"] },
    "14:15": { subject: "English", teacher: "Ms. Rahman", room: "Room 101", color: subjectColors["English"] },
  },
};

/* ─── Select Component ──────────────────────────────────────── */
function Select({
  value, onChange, options, label,
}: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 cursor-pointer"
        >
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function ClassSchedule() {
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedSection, setSelectedSection] = useState(sections[0]);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-blue-50/30">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-widest">Academic</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">Class Schedule</h1>
          <p className="text-primary-foreground/75 text-sm">Weekly class routine · Academic Year 2024–2025</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Filter Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Select Class" value={selectedClass} onChange={setSelectedClass} options={classes} />
              <Select label="Select Section" value={selectedSection} onChange={setSelectedSection} options={sections} />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-sm transition-all">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
          {/* Badge */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{selectedClass}</span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold">{selectedSection}</span>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold">Sun – Thu</span>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Legend */}
          <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex flex-wrap gap-3">
            {Object.entries(subjectColors).slice(0, 6).map(([subj, cls]) => (
              <span key={subj} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${cls}`}>{subj}</span>
            ))}
          </div>

          {/* Grid – desktop */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-36">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Time</span>
                  </th>
                  {DAYS.map((day) => (
                    <th key={day} className="py-3 px-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => {
                  if (slot.isBreak) {
                    return (
                      <tr key={slot.start} className="bg-amber-50/60 border-y border-amber-100">
                        <td className="py-2 px-4">
                          <p className="text-xs font-bold text-amber-700">{slot.label}</p>
                          <p className="text-[10px] text-amber-600">{slot.start} – {slot.end}</p>
                        </td>
                        <td colSpan={5} className="text-center text-xs text-amber-600 font-semibold tracking-wider">
                          ☕ {slot.label}
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={slot.start} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                      {/* Time col */}
                      <td className="py-3 px-4 align-top">
                        <p className="text-xs font-bold text-gray-600">{slot.label}</p>
                        <p className="text-[10px] text-gray-400">{slot.start} – {slot.end}</p>
                      </td>
                      {/* Day cols */}
                      {DAYS.map((day) => {
                        const period = sampleRoutine[day]?.[slot.start];
                        if (!period) {
                          return (
                            <td key={day} className="py-3 px-2 align-top">
                              <div className="h-full flex items-center justify-center text-gray-200 text-lg">–</div>
                            </td>
                          );
                        }
                        return (
                          <td key={day} className="py-2 px-2 align-top">
                            <div className={`rounded-xl border px-3 py-2.5 ${period.color} h-full`}>
                              <p className="font-bold text-xs leading-tight mb-1.5">{period.subject}</p>
                              <p className="flex items-center gap-1 text-[10px] opacity-75">
                                <User className="w-2.5 h-2.5 shrink-0" /> {period.teacher}
                              </p>
                              <p className="flex items-center gap-1 text-[10px] opacity-75 mt-0.5">
                                <MapPin className="w-2.5 h-2.5 shrink-0" /> {period.room}
                              </p>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="block sm:hidden space-y-4">
          {DAYS.map((day) => (
            <div key={day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-primary px-4 py-2.5">
                <h3 className="text-sm font-bold text-primary-foreground">{day}</h3>
              </div>
              <div className="p-3 space-y-2">
                {TIME_SLOTS.filter(s => !s.isBreak).map((slot) => {
                  const period = sampleRoutine[day]?.[slot.start];
                  if (!period) return null;
                  return (
                    <div key={slot.start} className={`rounded-xl border px-3 py-2.5 ${period.color}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-xs">{period.subject}</p>
                          <p className="text-[10px] opacity-70 flex items-center gap-1 mt-1">
                            <User className="w-2.5 h-2.5" /> {period.teacher}
                            <span className="mx-1">·</span>
                            <MapPin className="w-2.5 h-2.5" /> {period.room}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold opacity-60 shrink-0">{slot.start}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Academic Year: <strong>2024–2025</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-primary" />
            <span>School Hours: <strong>09:00 AM – 03:00 PM</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Working Days: <strong>Sunday – Thursday</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
