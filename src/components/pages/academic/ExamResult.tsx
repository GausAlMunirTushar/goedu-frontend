"use client";

import React, { useState } from "react";
import { Search, Trophy, BookOpen, ChevronDown, Download, Printer } from "lucide-react";

const classes = ["All Classes", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X"];
const exams   = ["All Exams", "Half Yearly 2024", "Annual 2024", "Pre-Test 2024"];

type Grade = "A+" | "A" | "A-" | "B" | "C" | "F";

interface Result {
  id: number;
  roll: string;
  name: string;
  class: string;
  exam: string;
  subjects: { name: string; marks: number; total: number; grade: Grade }[];
  gpa: number;
  totalMarks: number;
  obtainedMarks: number;
  position: number;
  session: string;
  status: "Passed" | "Failed";
}

const GRADE_CONFIG: Record<Grade, string> = {
  "A+": "bg-emerald-100 text-emerald-700",
  "A":  "bg-green-100 text-green-700",
  "A-": "bg-lime-100 text-lime-700",
  "B":  "bg-blue-100 text-blue-700",
  "C":  "bg-amber-100 text-amber-700",
  "F":  "bg-red-100 text-red-700",
};

const results: Result[] = [
  { id: 1, roll: "001", name: "Ayasha Siddiqua", class: "Class X", exam: "Annual 2024", gpa: 5.00, totalMarks: 600, obtainedMarks: 590, position: 1, session: "2024", status: "Passed",
    subjects: [{ name: "Bangla", marks: 98, total: 100, grade: "A+" }, { name: "English", marks: 97, total: 100, grade: "A+" }, { name: "Math", marks: 99, total: 100, grade: "A+" }, { name: "Science", marks: 98, total: 100, grade: "A+" }, { name: "ICT", marks: 99, total: 100, grade: "A+" }, { name: "History", marks: 99, total: 100, grade: "A+" }] },
  { id: 2, roll: "002", name: "Md. Raihan Islam", class: "Class X", exam: "Annual 2024", gpa: 5.00, totalMarks: 600, obtainedMarks: 585, position: 2, session: "2024", status: "Passed",
    subjects: [{ name: "Bangla", marks: 97, total: 100, grade: "A+" }, { name: "English", marks: 96, total: 100, grade: "A+" }, { name: "Math", marks: 98, total: 100, grade: "A+" }, { name: "Science", marks: 97, total: 100, grade: "A+" }, { name: "ICT", marks: 98, total: 100, grade: "A+" }, { name: "History", marks: 99, total: 100, grade: "A+" }] },
  { id: 3, roll: "003", name: "Fatema Akter", class: "Class IX", exam: "Annual 2024", gpa: 4.94, totalMarks: 600, obtainedMarks: 570, position: 3, session: "2024", status: "Passed",
    subjects: [{ name: "Bangla", marks: 93, total: 100, grade: "A+" }, { name: "English", marks: 94, total: 100, grade: "A+" }, { name: "Math", marks: 96, total: 100, grade: "A+" }, { name: "Science", marks: 95, total: 100, grade: "A+" }, { name: "ICT", marks: 96, total: 100, grade: "A+" }, { name: "History", marks: 96, total: 100, grade: "A+" }] },
  { id: 4, roll: "004", name: "Sabbir Hossain", class: "Class VIII", exam: "Half Yearly 2024", gpa: 4.88, totalMarks: 600, obtainedMarks: 558, position: 4, session: "2024", status: "Passed",
    subjects: [{ name: "Bangla", marks: 90, total: 100, grade: "A+" }, { name: "English", marks: 91, total: 100, grade: "A+" }, { name: "Math", marks: 95, total: 100, grade: "A+" }, { name: "Science", marks: 92, total: 100, grade: "A+" }, { name: "ICT", marks: 95, total: 100, grade: "A+" }, { name: "History", marks: 95, total: 100, grade: "A+" }] },
  { id: 5, roll: "005", name: "Nusrat Jahan", class: "Class X", exam: "Pre-Test 2024", gpa: 4.83, totalMarks: 600, obtainedMarks: 545, position: 5, session: "2024", status: "Passed",
    subjects: [{ name: "Bangla", marks: 88, total: 100, grade: "A+" }, { name: "English", marks: 89, total: 100, grade: "A+" }, { name: "Math", marks: 93, total: 100, grade: "A+" }, { name: "Science", marks: 90, total: 100, grade: "A+" }, { name: "ICT", marks: 93, total: 100, grade: "A+" }, { name: "History", marks: 92, total: 100, grade: "A+" }] },
  { id: 6, roll: "006", name: "Tanvir Ahmed", class: "Class IX", exam: "Half Yearly 2024", gpa: 4.78, totalMarks: 600, obtainedMarks: 535, position: 6, session: "2024", status: "Passed",
    subjects: [{ name: "Bangla", marks: 85, total: 100, grade: "A+" }, { name: "English", marks: 87, total: 100, grade: "A+" }, { name: "Math", marks: 91, total: 100, grade: "A+" }, { name: "Science", marks: 88, total: 100, grade: "A+" }, { name: "ICT", marks: 92, total: 100, grade: "A+" }, { name: "History", marks: 92, total: 100, grade: "A+" }] },
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

export default function ExamResult() {
  const [search, setSearch] = useState("");
  const [cls, setCls]       = useState(classes[0]);
  const [exam, setExam]     = useState(exams[0]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = results.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.roll.includes(search);
    const matchClass  = cls === "All Classes" || r.class === cls;
    const matchExam   = exam === "All Exams" || r.exam === exam;
    return matchSearch && matchClass && matchExam;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-emerald-50/20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-white/70">Students</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">Exam Results</h1>
          <p className="text-white/70 text-sm">Published results for all examinations · Session 2024</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by name or roll..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <SelectBox value={cls}  onChange={setCls}  options={classes} />
              <SelectBox value={exam} onChange={setExam} options={exams} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                <Printer className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Results table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Result Sheet
            </h2>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{filtered.length} records</span>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map(r => (
              <div key={r.id}>
                {/* Row */}
                <button
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
                    {/* Position */}
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mr-4">
                      #{r.position}
                    </div>
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                      <p className="text-xs text-gray-500">Roll: {r.roll} · {r.class} · {r.exam}</p>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm shrink-0">
                      <div className="text-center">
                        <p className="font-bold text-primary">{r.gpa.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">GPA</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-800">{r.obtainedMarks}<span className="text-gray-400 font-normal">/{r.totalMarks}</span></p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Marks</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.status === "Passed" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {r.status}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded === r.id ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded subject breakdown */}
                {expanded === r.id && (
                  <div className="px-6 pb-5 pt-1 bg-gray-50/40 border-t border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Subject-wise Marks</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {r.subjects.map(sub => (
                        <div key={sub.name} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
                          <p className="text-xs text-gray-500 mb-1 font-medium">{sub.name}</p>
                          <p className="text-lg font-bold text-gray-900">{sub.marks}</p>
                          <p className="text-[10px] text-gray-400">/ {sub.total}</p>
                          <span className={`mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${GRADE_CONFIG[sub.grade]}`}>
                            {sub.grade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No results found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
