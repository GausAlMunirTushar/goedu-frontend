"use client";

import React, { useState } from "react";
import { Search, Users, GraduationCap, ChevronDown, Filter } from "lucide-react";

const classes = ["All Classes", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X"];
const sections = ["All Sections", "Section A", "Section B", "Section C"];

const students = [
  { id: 1, roll: "001", name: "Ayasha Siddiqua", nameBn: "আয়েশা সিদ্দিকা", class: "Class X", section: "Section A", gender: "Female", gpa: "5.00", session: "2024", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=80&h=80&fit=crop" },
  { id: 2, roll: "002", name: "Md. Raihan Islam", nameBn: "মো. রায়হান ইসলাম", class: "Class X", section: "Section A", gender: "Male", gpa: "5.00", session: "2024", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&h=80&fit=crop" },
  { id: 3, roll: "003", name: "Fatema Akter", nameBn: "ফাতেমা আক্তার", class: "Class IX", section: "Section B", gender: "Female", gpa: "4.94", session: "2024", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=80&h=80&fit=crop" },
  { id: 4, roll: "004", name: "Sabbir Hossain", nameBn: "সাব্বির হোসেন", class: "Class VIII", section: "Section A", gender: "Male", gpa: "4.88", session: "2024", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=80&h=80&fit=crop" },
  { id: 5, roll: "005", name: "Nusrat Jahan", nameBn: "নুসরাত জাহান", class: "Class X", section: "Section B", gender: "Female", gpa: "4.83", session: "2024", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=80&h=80&fit=crop" },
  { id: 6, roll: "006", name: "Tanvir Ahmed", nameBn: "তানভীর আহমেদ", class: "Class IX", section: "Section A", gender: "Male", gpa: "4.78", session: "2024", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=80&h=80&fit=crop" },
  { id: 7, roll: "007", name: "Sadia Islam", nameBn: "সাদিয়া ইসলাম", class: "Class VII", section: "Section C", gender: "Female", gpa: "4.70", session: "2024", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=80&h=80&fit=crop" },
  { id: 8, roll: "008", name: "Rakib Hasan", nameBn: "রাকিব হাসান", class: "Class VI", section: "Section A", gender: "Male", gpa: "4.63", session: "2024", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=80&h=80&fit=crop" },
  { id: 9, roll: "009", name: "Mitu Akter", nameBn: "মিতু আক্তার", class: "Class VIII", section: "Section B", gender: "Female", gpa: "4.55", session: "2024", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=80&h=80&fit=crop" },
  { id: 10, roll: "010", name: "Imran Khan", nameBn: "ইমরান খান", class: "Class X", section: "Section C", gender: "Male", gpa: "4.50", session: "2024", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=80&h=80&fit=crop" },
  { id: 11, roll: "011", name: "Riya Sharma", nameBn: "রিয়া শর্মা", class: "Class VII", section: "Section A", gender: "Female", gpa: "4.44", session: "2024", photo: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=80&h=80&fit=crop" },
  { id: 12, roll: "012", name: "Arif Hossain", nameBn: "আরিফ হোসেন", class: "Class VI", section: "Section B", gender: "Male", gpa: "4.38", session: "2024", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=80&h=80&fit=crop" },
];

function SelectBox({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

export default function StudentsList() {
  const [search, setSearch]     = useState("");
  const [cls, setCls]           = useState(classes[0]);
  const [section, setSection]   = useState(sections[0]);
  const [gender, setGender]     = useState("All");

  const filtered = students.filter(s => {
    const matchSearch  = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search);
    const matchClass   = cls === "All Classes" || s.class === cls;
    const matchSection = section === "All Sections" || s.section === section;
    const matchGender  = gender === "All" || s.gender === gender;
    return matchSearch && matchClass && matchSection && matchGender;
  });

  const total   = filtered.length;
  const males   = filtered.filter(s => s.gender === "Male").length;
  const females = filtered.filter(s => s.gender === "Female").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-emerald-50/20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-white/70">Students</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">Students List</h1>
          <p className="text-white/70 text-sm">Academic Year 2024–2025 · All enrolled students</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Students", value: total, icon: <Users className="w-5 h-5" />, color: "text-primary bg-primary/10" },
            { label: "Male", value: males, icon: <GraduationCap className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
            { label: "Female", value: females, icon: <GraduationCap className="w-5 h-5" />, color: "text-pink-600 bg-pink-50" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or roll..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
              <SelectBox value={cls} onChange={setCls} options={classes} />
              <SelectBox value={section} onChange={setSection} options={sections} />
              <SelectBox value={gender} onChange={setGender} options={["All", "Male", "Female"]} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">All Students</h2>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{filtered.length} students</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  {["Roll", "Student", "Class", "Section", "Gender", "GPA", "Session"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-primary/3 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-600 text-xs">{s.roll}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.nameBn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.class}</td>
                    <td className="px-4 py-3 text-gray-600">{s.section}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.gender === "Female" ? "bg-pink-50 text-pink-700" : "bg-blue-50 text-blue-700"}`}>
                        {s.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-primary">{s.gpa}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.session}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No students found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
