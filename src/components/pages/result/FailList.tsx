"use client";

import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, AlertTriangle } from "lucide-react";
import {
  getResultRoll,
  getResultStudentName,
  ResultLookupForm,
  useResultLookup,
} from "./ResultLookup";

export function FailListPage() {
  const lookup = useResultLookup();
  const failList = lookup.results.filter((result: any) => result.status === "Fail");

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title>Fail List</Title>
          <p className="text-sm text-muted-foreground mt-1">List of students who were unsuccessful in the examination.</p>
        </div>
        {lookup.activeFilters && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
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
        <Card className="shadow-sm border-red-100 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-red-50/50">
            <div>
              <CardTitle className="text-base font-bold text-red-700">Unsuccessful Students</CardTitle>
              <CardDescription className="text-xs text-red-600/70">Total Failed: {failList.length}</CardDescription>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left bg-gray-50/50">
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Roll</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Student Name</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Marks</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">GPA</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lookup.isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">Loading fail list...</td>
                    </tr>
                  ) : failList.length > 0 ? (
                    failList.map((res: any) => (
                      <tr key={res.id} className="border-b last:border-0 hover:bg-red-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-medium">{getResultRoll(res)}</td>
                        <td className="py-3.5 px-4 font-bold">{getResultStudentName(res)}</td>
                        <td className="py-3.5 px-4 text-center font-semibold">{res.obtainedMarks}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-red-600">{Number(res.gpa).toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            FAILED
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground italic">
                        No failed students found for this class/section.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
          <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Select Filters</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
            Load the fail list by selecting the specific exam, class and section above.
          </p>
        </div>
      )}
    </div>
  );
}
