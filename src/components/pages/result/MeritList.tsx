"use client";

import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, Trophy, Medal } from "lucide-react";
import {
  getResultRoll,
  getResultStudentName,
  ResultLookupForm,
  useResultLookup,
} from "./ResultLookup";

export function MeritListPage() {
  const lookup = useResultLookup();
  const meritList = [...lookup.results].sort((a: any, b: any) => {
    if ((a.position || 0) && (b.position || 0)) return a.position - b.position;
    return Number(b.obtainedMarks || 0) - Number(a.obtainedMarks || 0);
  });

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Merit List</Title>
          <p className="text-sm text-muted-foreground mt-1">Class-wise top performers and ranking based on processed results.</p>
        </div>
        {lookup.activeFilters && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" /> Print List
            </Button>
          </div>
        )}
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <ResultLookupForm lookup={lookup} buttonText="Generate List" />
        </CardContent>
      </Card>

      {lookup.activeFilters ? (
        lookup.isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading merit list...</div>
        ) : meritList.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No processed results found for this selection.</div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {meritList.slice(0, 3).map((student: any, index: number) => (
                <Card key={student.id} className={`shadow-md border-2 ${index === 0 ? "border-yellow-400 bg-yellow-50/30" : index === 1 ? "border-gray-300 bg-gray-50/30" : "border-amber-600/30 bg-amber-50/20"}`}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {index === 0 ? <Trophy className="w-12 h-12 text-yellow-500" /> : <Medal className={`w-12 h-12 ${index === 1 ? "text-gray-400" : "text-amber-700"}`} />}
                    </div>
                    <h3 className="text-lg font-bold truncate">{getResultStudentName(student)}</h3>
                    <p className="text-sm text-muted-foreground">Roll: {getResultRoll(student)} | Position: {student.position || index + 1}</p>
                    <div className="mt-4 pt-4 border-t border-black/5">
                      <p className="text-2xl font-black text-primary">{student.obtainedMarks}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Obtained Marks</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-base font-bold">Class Merit List</CardTitle>
                <CardDescription className="text-xs">Ranking based on processed result position and total marks.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Rank</th>
                        <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Student Name</th>
                        <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Roll</th>
                        <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Marks</th>
                        <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">GPA</th>
                        <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meritList.map((res: any, index: number) => (
                        <tr key={res.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                          <td className="py-3.5">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${index < 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                              {res.position || index + 1}
                            </span>
                          </td>
                          <td className="py-3.5 font-bold">{getResultStudentName(res)}</td>
                          <td className="py-3.5 text-muted-foreground">{getResultRoll(res)}</td>
                          <td className="py-3.5 text-center font-black">{res.obtainedMarks}</td>
                          <td className="py-3.5 text-center font-bold text-primary">{Number(res.gpa).toFixed(2)}</td>
                          <td className="py-3.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${res.grade === "A+" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-700"}`}>
                              {res.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Trophy className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No List Generated</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Choose the specific exam, class and section to view the top performers.
          </p>
        </div>
      )}
    </div>
  );
}
