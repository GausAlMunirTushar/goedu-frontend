"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, BookOpen, ChevronDown, Download, Printer, Search } from "lucide-react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const exams   = ["Annual Exam 2024", "Half Yearly 2024", "Pre-Test 2024"];
const classes = ["All Classes", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X"];

type Status = "Scheduled" | "Ongoing" | "Completed" | "Postponed";

interface Schedule {
  id: number;
  date: string;
  day: string;
  subject: string;
  class: string;
  startTime: string;
  endTime: string;
  room: string;
  totalMarks: number;
  status: Status;
}

const STATUS_CONFIG: Record<Status, string> = {
  Scheduled:  "bg-primary/10 text-primary",
  Ongoing:    "bg-amber-100 text-amber-700",
  Completed:  "bg-emerald-100 text-emerald-700",
  Postponed:  "bg-red-100 text-red-700",
};

const scheduleData: Schedule[] = [
  { id: 1,  date: "01 Dec 2024", day: "Sunday",    subject: "Bangla Paper I",       class: "Class X",   startTime: "10:00 AM", endTime: "01:00 PM", room: "Hall A", totalMarks: 100, status: "Completed" },
  { id: 2,  date: "02 Dec 2024", day: "Monday",    subject: "Bangla Paper II",      class: "Class X",   startTime: "10:00 AM", endTime: "12:00 PM", room: "Hall A", totalMarks: 100, status: "Completed" },
  { id: 3,  date: "03 Dec 2024", day: "Tuesday",   subject: "English Paper I",      class: "Class X",   startTime: "10:00 AM", endTime: "01:00 PM", room: "Hall B", totalMarks: 100, status: "Completed" },
  { id: 4,  date: "04 Dec 2024", day: "Wednesday", subject: "English Paper II",     class: "Class X",   startTime: "10:00 AM", endTime: "12:00 PM", room: "Hall B", totalMarks: 100, status: "Completed" },
  { id: 5,  date: "05 Dec 2024", day: "Thursday",  subject: "Mathematics",          class: "Class X",   startTime: "10:00 AM", endTime: "01:00 PM", room: "Hall A", totalMarks: 100, status: "Completed" },
  { id: 6,  date: "08 Dec 2024", day: "Sunday",    subject: "General Science",      class: "Class X",   startTime: "10:00 AM", endTime: "01:00 PM", room: "Lab A",  totalMarks: 100, status: "Scheduled" },
  { id: 7,  date: "09 Dec 2024", day: "Monday",    subject: "ICT",                  class: "Class X",   startTime: "10:00 AM", endTime: "12:00 PM", room: "Computer Lab", totalMarks: 100, status: "Scheduled" },
  { id: 8,  date: "10 Dec 2024", day: "Tuesday",   subject: "History & World Civ.", class: "Class X",   startTime: "10:00 AM", endTime: "01:00 PM", room: "Hall C", totalMarks: 100, status: "Scheduled" },
  { id: 9,  date: "11 Dec 2024", day: "Wednesday", subject: "Bangla Paper I",       class: "Class IX",  startTime: "10:00 AM", endTime: "01:00 PM", room: "Hall D", totalMarks: 100, status: "Scheduled" },
  { id: 10, date: "12 Dec 2024", day: "Thursday",  subject: "Mathematics",          class: "Class IX",  startTime: "10:00 AM", endTime: "01:00 PM", room: "Hall D", totalMarks: 100, status: "Scheduled" },
  { id: 11, date: "15 Dec 2024", day: "Sunday",    subject: "English Paper I",      class: "Class IX",  startTime: "10:00 AM", endTime: "01:00 PM", room: "Hall B", totalMarks: 100, status: "Scheduled" },
  { id: 12, date: "16 Dec 2024", day: "Monday",    subject: "Mathematics",          class: "Class VIII",startTime: "10:00 AM", endTime: "01:00 PM", room: "Hall E", totalMarks: 100, status: "Scheduled" },
];

function SelectBox({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

export default function ExamSchedule() {
  const [selectedExam, setSelectedExam] = useState(exams[0]);
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [search, setSearch] = useState("");

  const filtered = scheduleData.filter(s => {
    const matchClass  = selectedClass === "All Classes" || s.class === selectedClass;
    const matchSearch = s.subject.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchSearch;
  });

  const completed  = filtered.filter(s => s.status === "Completed").length;
  const scheduled  = filtered.filter(s => s.status === "Scheduled").length;
  const postponed  = filtered.filter(s => s.status === "Postponed").length;

  return (
    <div className="p-2 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-white pb-4">
          <div>
            <Title>Exam Schedules</Title>
            <p className="text-xs text-muted-foreground mt-1">
              Detailed timetable of dates, times, rooms, and marks for {selectedExam}.
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Completed", value: completed, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
            { label: "Upcoming",  value: scheduled,  color: "bg-primary/8 text-primary border-primary/10" },
            { label: "Postponed", value: postponed,  color: "bg-red-50 text-red-600 border-red-100" },
          ].map(stat => (
            <div key={stat.label} className={`rounded-2xl border p-4 text-center ${stat.color} bg-white`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider mt-0.5 opacity-70">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search subject..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <SelectBox value={selectedExam}  onChange={setSelectedExam}  options={exams} />
              <SelectBox value={selectedClass} onChange={setSelectedClass} options={classes} />
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all">
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> {selectedExam}
            </h2>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{filtered.length} exams</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  {["Date", "Day", "Subject", "Class", "Time", "Room", "Marks", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-primary/3 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-gray-700 font-medium whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" /> {s.date}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{s.day}</td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 whitespace-nowrap">{s.subject}</td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{s.class}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" /> {s.startTime} – {s.endTime}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {s.room}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-gray-800">{s.totalMarks}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_CONFIG[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No schedule found.</div>
            )}
          </div>
        </div>

        {/* Info footer */}
        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-700"><Clock className="w-4 h-4 text-primary" /> Exam starts at <strong>10:00 AM</strong> sharp</div>
          <div className="flex items-center gap-2 text-gray-700"><BookOpen className="w-4 h-4 text-primary" /> Admit card mandatory</div>
          <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4 text-primary" /> Report 30 min before start</div>
        </div>
      </div>
    </div>
  );
}
