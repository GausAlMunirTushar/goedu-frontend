"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AxiosAPI } from "@/apis/configs";
import { studentIdCardImageUrl } from "@/apis/endpoints/student_apis";
import { downloadStudentIdCard } from "@/apis/mutations/student_mutations";
import { toast } from "sonner";
import { Loader2, Download, Printer } from "lucide-react";

interface StudentIdCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string | null;
  studentName: string | null;
}

export function StudentIdCardModal({
  open,
  onOpenChange,
  studentId,
  studentName,
}: StudentIdCardModalProps) {
  const [svgHtml, setSvgHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (open && studentId) {
      setLoading(true);
      AxiosAPI.get(studentIdCardImageUrl(studentId))
        .then((res) => {
          setSvgHtml(res.data);
        })
        .catch((err) => {
          toast.error("Failed to load ID card preview");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSvgHtml("");
    }
  }, [open, studentId]);

  const handleDownload = async () => {
    if (!studentId || !studentName) return;
    try {
      setDownloading(true);
      await downloadStudentIdCard(studentId, studentName);
      toast.success("ID Card PDF downloaded successfully");
    } catch (err) {
      toast.error("Failed to download ID card PDF");
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    // Open a print window with the SVG
    if (!svgHtml) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print ID Card - ${studentName}</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
              svg {
                width: 240px;
                height: 360px;
              }
              @media print {
                body {
                  height: auto;
                }
              }
            </style>
          </head>
          <body>
            ${svgHtml}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] bg-white rounded-xl overflow-hidden p-0 shadow-lg border-none">
        <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100">
          <DialogTitle className="text-base font-bold text-slate-800">
            Student ID Card Preview
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 bg-slate-100 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-slate-500">Generating preview...</p>
            </div>
          ) : svgHtml ? (
            <div
              className="bg-white rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105"
              dangerouslySetInnerHTML={{ __html: svgHtml }}
              style={{ width: "240px", height: "360px" }}
            />
          ) : (
            <p className="text-sm text-red-500">Failed to load preview.</p>
          )}
        </div>

        <DialogFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-row gap-3 justify-end items-center">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            disabled={loading || !svgHtml}
            className="flex items-center gap-1.5 h-9 text-slate-700 border-slate-200"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={loading || downloading || !svgHtml}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-9 flex items-center gap-1.5"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
