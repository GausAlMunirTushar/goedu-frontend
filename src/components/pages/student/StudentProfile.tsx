"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Edit3, 
  User, 
  BookOpen, 
  CalendarDays, 
  Award, 
  Wallet, 
  FileText, 
  Heart, 
  Users, 
  Activity,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";
import { useStudentProfileQuery } from "@/apis/queries/student_queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import { useModalStore } from "@/stores/modalStore";

export function StudentProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");
  const openModal = useModalStore((state) => state.openModal);

  const [activeTab, setActiveTab] = useState("overview");

  const { data: response, isLoading } = useStudentProfileQuery(studentId || "");
  const student = response?.data;

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "academic", label: "Academic", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: CalendarDays },
    { id: "results", label: "Results", icon: Award },
    { id: "fees", label: "Fees", icon: Wallet },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "health", label: "Health", icon: Heart },
    { id: "parent", label: "Parent", icon: Users },
    { id: "activity", label: "Activity Logs", icon: Activity },
  ];

  if (!studentId) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-xs border">
        <p className="font-semibold text-gray-600">No Student ID provided.</p>
        <Button className="mt-4" variant="outline" onClick={() => router.push("/student/list")}>
          Go back to Student List
        </Button>
      </div>
    );
  }

  if (isLoading) return <TableSkeleton />;
  if (!student) return <div className="p-6 text-red-500 font-medium">Student profile not found.</div>;

  const fullName = `${student.firstName || ""} ${student.lastName || ""}`;

  return (
    <div className="p-2 space-y-6">
      {/* Header Profile Info card */}
      <Card className="border border-gray-100 shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.back()} className="shrink-0 h-9 w-9">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-16 h-16 bg-primary/10 text-primary font-black rounded-2xl flex items-center justify-center text-2xl uppercase border-2 border-primary/20 shadow-xs">
                {student.firstName?.[0] || ""}{student.lastName?.[0] || ""}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-gray-900 leading-tight">{fullName}</h2>
                  <Badge
                    variant={student.status === "Active" ? "default" : "secondary"}
                    className={
                      student.status === "Active" 
                        ? "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200/50 px-2 py-0" 
                        : "bg-gray-50 text-gray-500 border border-gray-200/50 px-2 py-0"
                    }
                  >
                    {student.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  ID: <span className="text-gray-700 font-bold">{student.studentId}</span> • Class: <span className="text-gray-700 font-bold">{student.class?.name || "N/A"}</span> • Roll: <span className="text-gray-700 font-bold">{student.roll || "N/A"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => openModal("student-id-card", { studentId: student.id, studentName: fullName })} 
                className="h-9 text-xs font-semibold flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" /> ID Card
              </Button>
              <Button 
                onClick={() => router.push(`/student/registration?id=${student.id}`)} 
                className="h-9 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            </div>
          </div>

          {/* Navigation Tabs bar */}
          <div className="flex items-center gap-1 overflow-x-auto border-t border-gray-100 mt-6 pt-4 scrollbar-none">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-xs" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Content */}
      <Card className="border border-gray-100 shadow-xs">
        <CardContent className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">Student Overview</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Quick summary and contact information.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Demographics */}
                <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Demographics</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Gender:</span><span className="font-semibold text-gray-900">{student.gender || "N/A"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth:</span><span className="font-semibold text-gray-900">{student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Blood Group:</span><span className="font-semibold text-gray-900">{student.bloodGroup || "N/A"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Religion:</span><span className="font-semibold text-gray-900">{student.religion || "N/A"}</span></div>
                  </div>
                </div>

                {/* Login Access mapping */}
                <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Portal Access Account</h4>
                  {student.user ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-semibold text-gray-900">@{student.user.username}</span></div>
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-semibold text-gray-900">{student.user.phone || "N/A"}</span></div>
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-semibold text-gray-900">{student.user.email || "N/A"}</span></div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No login portal account created yet.</p>
                  )}
                </div>

                {/* Address & Emergency info */}
                <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Emergency info</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-semibold text-gray-900">{student.user?.phone || "N/A"}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-semibold text-gray-900">Main Campus Area</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-semibold text-gray-900">Enrolled: {new Date(student.createdAt).toLocaleDateString()}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">Academic Placement</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Enrolled class, section, shift, and syllabus details.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-xl p-4 space-y-3 bg-white">
                  <span className="text-xs text-muted-foreground font-bold">Class Enrollment</span>
                  <div className="text-2xl font-black text-gray-900">{student.class?.name || "N/A"}</div>
                  <div className="text-xs text-muted-foreground">Sections: {student.section?.name || "N/A"}</div>
                </div>
                <div className="border rounded-xl p-4 space-y-3 bg-white">
                  <span className="text-xs text-muted-foreground font-bold">Assigned Roll</span>
                  <div className="text-2xl font-black text-gray-900">#{student.roll || "N/A"}</div>
                  <div className="text-xs text-muted-foreground">Class placement order</div>
                </div>
                <div className="border rounded-xl p-4 space-y-3 bg-white">
                  <span className="text-xs text-muted-foreground font-bold">Active Session</span>
                  <div className="text-xl font-bold text-gray-900">{student.session?.name || "Not Assigned"}</div>
                  <div className="text-xs text-muted-foreground">Shift: {student.shift?.name || "Not Assigned"}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">Attendance Analytics</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Summary of presence, absent logs, and compliance rate.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4 bg-emerald-50/30 border-emerald-100">
                  <span className="text-xs font-bold text-emerald-700">Attendance Rate</span>
                  <div className="text-3xl font-black text-emerald-600 mt-2">95.4%</div>
                  <span className="text-xs text-emerald-800/70 font-semibold mt-1 block">Excellent status</span>
                </div>
                <div className="border rounded-xl p-4 bg-gray-50/50">
                  <span className="text-xs font-bold text-gray-600">Total Classes Conducted</span>
                  <div className="text-3xl font-black text-gray-800 mt-2">120 Days</div>
                  <span className="text-xs text-muted-foreground mt-1 block">Academic year 2026</span>
                </div>
                <div className="border rounded-xl p-4 bg-rose-50/30 border-rose-100">
                  <span className="text-xs font-bold text-rose-700">Days Absent</span>
                  <div className="text-3xl font-black text-rose-600 mt-2">5 Days</div>
                  <span className="text-xs text-rose-800/70 font-semibold mt-1 block">5 Approved Leaves</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "results" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">Academic Grading & Performance</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Exam score summary and GPA tracking.</p>
              </div>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 border-b text-gray-600 font-bold">
                    <tr>
                      <th className="p-3">Exam Term</th>
                      <th className="p-3">Total Marks</th>
                      <th className="p-3">Obtained Marks</th>
                      <th className="p-3">GPA</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700 font-medium">
                    <tr>
                      <td className="p-3 font-semibold text-gray-900">First Term Exam 2026</td>
                      <td className="p-3">600</td>
                      <td className="p-3">510</td>
                      <td className="p-3 text-primary font-bold">4.82 (A)</td>
                      <td className="p-3"><Badge className="bg-green-50 text-green-700 border-none shadow-none">Passed</Badge></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900">Mid Term Exam 2026</td>
                      <td className="p-3">600</td>
                      <td className="p-3">545</td>
                      <td className="p-3 text-primary font-bold">5.00 (A+)</td>
                      <td className="p-3"><Badge className="bg-green-50 text-green-700 border-none shadow-none">Passed</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">Fees & Ledger Payments</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Due tuition invoices, caution deposits, and receipts.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="border p-4 rounded-xl flex justify-between items-center bg-gray-50/50">
                  <div>
                    <span className="text-xs text-muted-foreground font-semibold">Outstanding Due</span>
                    <div className="text-xl font-black text-rose-600 mt-1">$120.00</div>
                  </div>
                  <Badge variant="outline" className="border-rose-300 text-rose-600 bg-rose-50">Pending Payment</Badge>
                </div>
                <div className="border p-4 rounded-xl flex justify-between items-center bg-gray-50/50">
                  <div>
                    <span className="text-xs text-muted-foreground font-semibold">Paid Fees (Yearly)</span>
                    <div className="text-xl font-black text-green-700 mt-1">$1,450.00</div>
                  </div>
                  <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">Compliant</Badge>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">Academic Documents Vault</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Birth certificates, previous school transcripts, and passport photos.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border p-3 rounded-lg flex items-center justify-between bg-white hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">birth_certificate_stu.pdf</div>
                      <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Uploaded 2026-05-12 • 1.2 MB</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">View File</Button>
                </div>
                <div className="border p-3 rounded-lg flex items-center justify-between bg-white hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">previous_school_transcript.pdf</div>
                      <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Uploaded 2026-05-14 • 2.4 MB</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">View File</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">Health & Medical Profile</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Blood group, height/weight metrics, and allergy records.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-xl p-4 bg-white">
                  <span className="text-xs text-muted-foreground font-bold">Blood Group</span>
                  <div className="text-2xl font-black text-rose-600 mt-1">{student.bloodGroup || "Not Provided"}</div>
                  <div className="text-xs text-gray-400 font-semibold mt-0.5">Emergency matching type</div>
                </div>
                <div className="border rounded-xl p-4 bg-white">
                  <span className="text-xs text-muted-foreground font-bold">Physical Stats</span>
                  <div className="text-xl font-bold text-gray-800 mt-1">Height: 152 cm</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Weight: 44.5 kg</div>
                </div>
                <div className="border rounded-xl p-4 bg-white">
                  <span className="text-xs text-muted-foreground font-bold">Allergy & Warnings</span>
                  <div className="text-xs text-amber-600 font-bold mt-2">No known drug allergies reported.</div>
                  <div className="text-xs text-gray-400 font-semibold mt-0.5">Updated: May 2026</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "parent" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">Parent & Guardian Contacts</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Parents profile, linked accounts, and contacts details.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border rounded-xl p-4 space-y-3 bg-white shadow-xs">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Father's Information</h4>
                  <div className="space-y-1.5 text-xs">
                    <div><span className="text-muted-foreground">Name:</span> <span className="font-semibold text-gray-800">John Doe Sr.</span></div>
                    <div><span className="text-muted-foreground">Mobile:</span> <span className="font-semibold text-gray-800">01712222222</span></div>
                    <div><span className="text-muted-foreground">Occupation:</span> <span className="font-semibold text-gray-800">Business Consultant</span></div>
                  </div>
                </div>
                <div className="border rounded-xl p-4 space-y-3 bg-white shadow-xs">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Mother's Information</h4>
                  <div className="space-y-1.5 text-xs">
                    <div><span className="text-muted-foreground">Name:</span> <span className="font-semibold text-gray-800">Jane Doe</span></div>
                    <div><span className="text-muted-foreground">Mobile:</span> <span className="font-semibold text-gray-800">01712222223</span></div>
                    <div><span className="text-muted-foreground">Occupation:</span> <span className="font-semibold text-gray-800">School Principal</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">System Activity Logs</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Audit logs trail for this student profile history.</p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Student Profile created in database</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">By Super Admin (system) • {new Date(student.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">ID card PDF generated and printed</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">By Institution Admin • 2026-06-25 14:22 PM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
