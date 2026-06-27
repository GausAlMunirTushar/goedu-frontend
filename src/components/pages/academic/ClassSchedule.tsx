"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Printer, Download, BookOpen, Clock, User, MapPin, Calendar, ChevronDown } from "lucide-react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import { useClassesQuery, useSectionsQuery, useRoutinesQuery } from "@/apis/queries/academic_queries";

/* ─── Configs & Days ─────────────────────────────────────────── */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const DAYS_ENUM_MAP: Record<string, string> = {
  Sunday: "SUNDAY",
  Monday: "MONDAY",
  Tuesday: "TUESDAY",
  Wednesday: "WEDNESDAY",
  Thursday: "THURSDAY",
};

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
  "English Literature": "bg-emerald-50 border-emerald-200 text-emerald-900",
  "General Science ": "bg-purple-50 border-purple-200 text-purple-900",
  "History & Civics": "bg-rose-50 border-rose-200 text-rose-900"
};

/* ─── Main Component ─────────────────────────────────────────── */
export default function ClassSchedule() {
  // DB Queries
  const { data: classesRes, isLoading: loadingClasses } = useClassesQuery();
  const classesList = classesRes?.data || [];

  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");

  // Set default class once loaded
  useEffect(() => {
    if (classesList.length > 0 && selectedClass === "all") {
      setSelectedClass(classesList[0].id);
    }
  }, [classesList, selectedClass]);

  const { data: sectionsRes } = useSectionsQuery(
    selectedClass !== "all" ? selectedClass : undefined
  );
  const sectionsList = sectionsRes?.data || [];

  // Reset section or set default once sections are loaded
  useEffect(() => {
    if (sectionsList.length > 0) {
      setSelectedSection(sectionsList[0].id);
    } else {
      setSelectedSection("all");
    }
  }, [sectionsList]);

  // Fetch routine from DB SWR query
  const { data: routinesRes, isLoading: loadingRoutines } = useRoutinesQuery({
    classId: selectedClass !== "all" ? selectedClass : undefined,
    sectionId: selectedSection !== "all" ? selectedSection : undefined,
  });

  const routines = routinesRes?.data || [];

  // Parse routine into the timeline grid map
  const parsedRoutineMap = useMemo(() => {
    const map: RoutineMap = {};
    DAYS.forEach((day) => {
      map[day] = {};
    });

    routines.forEach((r: any) => {
      const dayStr = Object.keys(DAYS_ENUM_MAP).find(
        (key) => DAYS_ENUM_MAP[key] === r.dayOfWeek
      );
      if (dayStr) {
        TIME_SLOTS.forEach((slot) => {
          if (!slot.isBreak && r.startTime.startsWith(slot.start.substring(0, 5))) {
            const subjectName = r.subject?.name || "Subject";
            const teacherName = r.teacher
              ? `${r.teacher.firstName || ""} ${r.teacher.lastName || r.teacher.username || ""}`.trim()
              : "Staff";
            const roomName = r.room?.name || "Room";
            map[dayStr][slot.start] = {
              subject: subjectName,
              teacher: teacherName,
              room: roomName,
              color: subjectColors[subjectName] || "bg-blue-50 border-blue-200 text-blue-900",
            };
          }
        });
      }
    });

    return map;
  }, [routines]);

  const handlePrint = () => window.print();

  if (loadingClasses || loadingRoutines) return <TableSkeleton />;

  const activeClassName = classesList.find((c: any) => c.id === selectedClass)?.name || "Class";
  const activeSectionName = sectionsList.find((s: any) => s.id === selectedSection)?.name || "Section";

  return (
    <div className="p-2 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-white pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <Title>Class Schedule</Title>
              <p className="text-xs text-muted-foreground mt-1">Weekly class timetable routine by Class & Section.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200 text-xs font-semibold">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select Class</SelectItem>
                  {classesList.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedSection} 
                onValueChange={setSelectedSection}
                disabled={selectedClass === "all"}
              >
                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-gray-50 border-gray-200 text-xs font-semibold disabled:opacity-50">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select Section</SelectItem>
                  {sectionsList.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{activeClassName}</span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">{activeSectionName}</span>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">Sun – Thu</span>
          </div>
        </CardHeader>
      </Card>

      {/* Timetable Grid */}
      <Card className="border-gray-100 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex flex-wrap gap-3">
            {Object.entries(subjectColors).slice(0, 7).map(([subj, cls]) => (
              <span key={subj} className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cls}`}>
                {subj}
              </span>
            ))}
          </div>

          {/* Timetable desktop table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-36">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Time Period
                    </span>
                  </th>
                  {DAYS.map((day) => (
                    <th key={day} className="py-3 px-3 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => {
                  if (slot.isBreak) {
                    return (
                      <tr key={slot.start} className="bg-amber-50/50 border-y border-amber-100">
                        <td className="py-2.5 px-4">
                          <p className="text-xs font-bold text-amber-700">{slot.label}</p>
                          <p className="text-[10px] text-amber-600">
                            {slot.start} – {slot.end}
                          </p>
                        </td>
                        <td colSpan={5} className="text-center text-xs text-amber-700 font-bold tracking-wider">
                          ☕ {slot.label}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={slot.start} className="border-b border-gray-50 hover:bg-gray-50/20 transition-colors">
                      <td className="py-3.5 px-4 align-top">
                        <p className="text-xs font-bold text-gray-600">{slot.label}</p>
                        <p className="text-[10px] text-gray-400">
                          {slot.start} – {slot.end}
                        </p>
                      </td>
                      {DAYS.map((day) => {
                        const period = parsedRoutineMap[day]?.[slot.start];
                        if (!period) {
                          return (
                            <td key={day} className="py-3.5 px-2 align-top">
                              <div className="h-full flex items-center justify-center text-gray-200 text-lg">-</div>
                            </td>
                          );
                        }

                        return (
                          <td key={day} className="py-2 px-2 align-top">
                            <div className={`rounded-lg border px-3 py-2.5 ${period.color} h-full shadow-2xs`}>
                              <p className="font-black text-xs leading-tight mb-1.5">{period.subject}</p>
                              <p className="flex items-center gap-1 text-[10px] opacity-75 font-semibold">
                                <User className="w-2.5 h-2.5 shrink-0" /> {period.teacher}
                              </p>
                              <p className="flex items-center gap-1 text-[10px] opacity-75 mt-0.5 font-semibold">
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
        </CardContent>
      </Card>

      {/* Timetable footer metadata info */}
      <div className="bg-primary/5 rounded-xl border border-primary/10 p-5 flex flex-wrap gap-6 text-xs font-semibold">
        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen className="w-4 h-4 text-primary" />
          <span>Active Academic Year: <strong>2026 Session</strong></span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-primary" />
          <span>Routine Hours: <strong>09:00 AM – 03:00 PM</strong></span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Working Days: <strong>Sunday – Thursday</strong></span>
        </div>
      </div>
    </div>
  );
}
