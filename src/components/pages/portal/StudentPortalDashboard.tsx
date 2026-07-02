"use client";

import { useStudentPortalSummaryQuery } from "@/apis/queries/portal_queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { Award, CalendarCheck, FileText, UserRound } from "lucide-react";

export function StudentPortalDashboard() {
    const { data: response, isLoading } = useStudentPortalSummaryQuery();
    const data = response?.data;
    const student = data?.student;
    const attendance = data?.attendance?.totals || {};

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-4 space-y-4">
            <div>
                <Title>My Portal</Title>
                <p className="text-xs text-muted-foreground mt-1">Academic profile, attendance, routine, results, and documents.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Card className="lg:col-span-2">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center">
                            <UserRound className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">{student ? `${student.firstName} ${student.lastName}` : "Student"}</p>
                            <p className="text-sm text-muted-foreground">
                                {student?.class?.name || "-"} / {student?.section?.name || "-"} / Roll {student?.roll || "-"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <StatCard label="Attendance Records" value={attendance.total || 0} icon={CalendarCheck} />
                <StatCard label="Published Results" value={data?.results?.length || 0} icon={Award} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-base">Recent Results</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {(data?.results || []).map((result: any) => (
                            <div key={result.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                                <span>{result.exam?.name || "Exam"}</span>
                                <span className="font-semibold">{result.grade} / GPA {result.gpa}</span>
                            </div>
                        ))}
                        {!data?.results?.length && <p className="text-sm text-muted-foreground">No result published yet.</p>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Documents</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {(data?.documents || []).map((doc: any) => (
                            <div key={doc.id} className="flex items-center gap-2 rounded-md border p-3 text-sm">
                                <FileText className="h-4 w-4 text-slate-500" />
                                <span>{doc.fileName || doc.type}</span>
                            </div>
                        ))}
                        {!data?.documents?.length && <p className="text-sm text-muted-foreground">No documents available.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-2xl font-semibold mt-1">{value}</p>
                </div>
                <div className="h-10 w-10 rounded-md bg-slate-50 text-slate-700 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                </div>
            </CardContent>
        </Card>
    );
}
