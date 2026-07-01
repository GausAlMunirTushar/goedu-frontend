"use client";

import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, CheckCircle2 } from "lucide-react";
import {
  getResultRoll,
  getResultStudentName,
  ResultLookupForm,
  useResultLookup,
} from "./ResultLookup";

export function PassListPage() {
  const lookup = useResultLookup();
  const passList = lookup.results.filter((result: any) => result.status === "Pass");

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Pass List</Title>
          <p className="text-sm text-muted-foreground mt-1">List of students who successfully passed the examination.</p>
        </div>
        {lookup.activeFilters && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
        )}
      </div>

      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-5">
          <ResultLookupForm lookup={lookup} buttonText="Filter Students" />
        </CardContent>
      </Card>

      {lookup.activeFilters ? (
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-bold">Successful Students</CardTitle>
              <CardDescription className="text-xs">Total Passed: {passList.length}</CardDescription>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardHeader>
          <CardContent>
            {lookup.isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading pass list...</div>
            ) : passList.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No passed students found for this selection.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Roll</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Student Name</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Marks</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">GPA</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passList.map((res: any) => (
                      <tr key={res.id} className="border-b last:border-0 hover:bg-emerald-50/50 transition-colors">
                        <td className="py-3.5 font-medium">{getResultRoll(res)}</td>
                        <td className="py-3.5 font-bold">{getResultStudentName(res)}</td>
                        <td className="py-3.5 text-center font-semibold">{res.obtainedMarks}</td>
                        <td className="py-3.5 text-center font-bold text-primary">{Number(res.gpa).toFixed(2)}</td>
                        <td className="py-3.5 text-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            {res.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
          <CheckCircle2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Select Filters</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Load the pass list by selecting the specific exam, class and section above.
          </p>
        </div>
      )}
    </div>
  );
}
