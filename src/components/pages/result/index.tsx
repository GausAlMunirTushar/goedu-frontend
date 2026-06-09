"use client";

import React from "react";
import Title from "@/components/ui/custom-ui/title";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  FileSpreadsheet, 
  Award, 
  ShieldCheck, 
  ChartLine, 
  Globe,
  ArrowRight
} from "lucide-react";

export function ResultPage() {
  const cards = [
    {
      title: "Marksheet",
      desc: "Generate and view detailed academic transcripts for individual students.",
      icon: FileText,
      path: "/result/marksheet",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Tabulation Sheet",
      desc: "Full class-wise result breakdown including marks and grade points.",
      icon: FileSpreadsheet,
      path: "/result/tabulation-sheet",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Merit List",
      desc: "Class-wise top performers and overall ranking based on performance.",
      icon: Award,
      path: "/result/merit-list",
      color: "text-yellow-600",
      bg: "bg-yellow-50"
    },
    {
      title: "Pass List",
      desc: "List of students who successfully cleared the examinations.",
      icon: ShieldCheck,
      path: "/result/pass-list",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Fail List",
      desc: "List of students who were unsuccessful in the current examination.",
      icon: ChartLine,
      path: "/result/fail-list",
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "Result Publish",
      desc: "Enable online result viewing and send notifications to parents.",
      icon: Globe,
      path: "/result/result-publish",
      color: "text-primary",
      bg: "bg-primary/5"
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <Title>Result Management</Title>
        <p className="text-sm text-muted-foreground mt-1">Generate reports, analyze performance and publish examination results.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="shadow-sm border-primary/10 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden">
              <div className={`h-1 ${card.bg.replace('bg-', 'bg-').replace('/5', '')}`} />
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-base font-bold">{card.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed pt-1">{card.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-6">
                <Button asChild variant="ghost" size="sm" className={`w-full text-xs font-semibold ${card.color} hover:${card.bg} justify-between px-2`}>
                  <Link href={card.path}>
                    Explore <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
