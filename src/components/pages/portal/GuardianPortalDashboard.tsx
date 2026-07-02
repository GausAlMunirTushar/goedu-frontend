"use client";

import { useGuardianPortalChildSummaryQuery, useGuardianPortalChildrenQuery } from "@/apis/queries/portal_queries";
import SelectInput from "@/components/form/SelectInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import React from "react";

const studentLabel = (student: any) => `${student.firstName} ${student.lastName} (${student.class?.name || "-"}-${student.section?.name || "-"})`;

export function GuardianPortalDashboard() {
    const { data: childrenResponse, isLoading } = useGuardianPortalChildrenQuery();
    const children = childrenResponse?.data || [];
    const [selectedStudentId, setSelectedStudentId] = React.useState("");

    React.useEffect(() => {
        if (!selectedStudentId && children.length) setSelectedStudentId(children[0].student.id);
    }, [children, selectedStudentId]);

    const { data: summaryResponse, isLoading: summaryLoading } = useGuardianPortalChildSummaryQuery(selectedStudentId);
    const summary = summaryResponse?.data;
    const student = summary?.student;
    const totals = summary?.attendance?.totals || {};

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <Title>Guardian Portal</Title>
                    <p className="text-xs text-muted-foreground mt-1">View linked child profile, attendance, routine, results, and documents.</p>
                </div>
                <div className="w-full md:w-80">
                    <SelectInput
                        label="Child"
                        showNoneOption={false}
                        options={children.map((item: any) => ({ value: item.student.id, label: studentLabel(item.student) }))}
                        value={selectedStudentId}
                        onChange={setSelectedStudentId}
                    />
                </div>
            </div>

            {summaryLoading ? <TableSkeleton /> : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <Card className="lg:col-span-2">
                            <CardContent className="p-4">
                                <p className="text-lg font-semibold">{student ? `${student.firstName} ${student.lastName}` : "Student"}</p>
                                <p className="text-sm text-muted-foreground">
                                    {student?.class?.name || "-"} / {student?.section?.name || "-"} / Roll {student?.roll || "-"}
                                </p>
                            </CardContent>
                        </Card>
                        <Metric label="Present" value={totals.PRESENT || 0} />
                        <Metric label="Absent" value={totals.ABSENT || 0} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Recent Attendance</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {(summary?.attendance?.recent || []).map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                                        <span>{item.date?.slice?.(0, 10)}</span>
                                        <span className="font-medium">{item.status}</span>
                                    </div>
                                ))}
                                {!summary?.attendance?.recent?.length && <p className="text-sm text-muted-foreground">No attendance records yet.</p>}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-base">Recent Results</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {(summary?.results || []).map((result: any) => (
                                    <div key={result.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                                        <span>{result.exam?.name || "Exam"}</span>
                                        <span className="font-semibold">{result.grade} / GPA {result.gpa}</span>
                                    </div>
                                ))}
                                {!summary?.results?.length && <p className="text-sm text-muted-foreground">No result published yet.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}

function Metric({ label, value }: { label: string; value: number }) {
    return (
        <Card>
            <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-semibold mt-1">{value}</p>
            </CardContent>
        </Card>
    );
}
