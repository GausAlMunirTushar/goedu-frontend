"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Download, Filter, FileSpreadsheet, Printer, TrendingUp } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function SalaryReportsPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({
        department: "",
        month: "",
        year: "",
        employee_type: "",
    });

    const sampleSalaryData = [
        {
            id: 1,
            emp_id: "EMP001",
            name: "John Doe",
            department: "IT",
            basic: 50000,
            allowances: 15000,
            deductions: 5000,
            net_salary: 60000,
        },
        {
            id: 2,
            emp_id: "EMP002",
            name: "Jane Smith",
            department: "HR",
            basic: 60000,
            allowances: 18000,
            deductions: 6000,
            net_salary: 72000,
        },
        {
            id: 3,
            emp_id: "EMP003",
            name: "Mike Johnson",
            department: "Finance",
            basic: 45000,
            allowances: 12000,
            deductions: 4500,
            net_salary: 52500,
        },
        {
            id: 4,
            emp_id: "EMP004",
            name: "Sarah Williams",
            department: "IT",
            basic: 70000,
            allowances: 21000,
            deductions: 7000,
            net_salary: 84000,
        },
    ];

    const handleExport = (format: string) => {
        console.log("Exporting to", format);
    };

    const totalBasic = sampleSalaryData.reduce((sum, emp) => sum + emp.basic, 0);
    const totalAllowances = sampleSalaryData.reduce((sum, emp) => sum + emp.allowances, 0);
    const totalDeductions = sampleSalaryData.reduce((sum, emp) => sum + emp.deductions, 0);
    const totalNet = sampleSalaryData.reduce((sum, emp) => sum + emp.net_salary, 0);

    return (
        <section className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{t("salary_reports")}</h1>
                    <p className="text-sm text-gray-500">{t("salary_reports_description")}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleExport("pdf")}>
                        <FileSpreadsheet className="w-4 h-4" /> PDF
                    </Button>
                    <Button variant="outline" onClick={() => handleExport("excel")}>
                        <Download className="w-4 h-4" /> Excel
                    </Button>
                    <Button variant="outline" onClick={() => handleExport("print")}>
                        <Printer className="w-4 h-4" /> {t("print")}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-green-600" />
                        <div>
                            <CardTitle>{t("filters")}</CardTitle>
                            <CardDescription>{t("filter_salary_reports")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label>{t("department")}</Label>
                            <Select
                                value={filters.department}
                                onValueChange={(v) => setFilters({ ...filters, department: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("select_department")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("all_departments")}</SelectItem>
                                    <SelectItem value="IT">IT</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>{t("month")}</Label>
                            <Select
                                value={filters.month}
                                onValueChange={(v) => setFilters({ ...filters, month: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("select_month")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">January</SelectItem>
                                    <SelectItem value="2">February</SelectItem>
                                    <SelectItem value="3">March</SelectItem>
                                    <SelectItem value="4">April</SelectItem>
                                    <SelectItem value="5">May</SelectItem>
                                    <SelectItem value="6">June</SelectItem>
                                    <SelectItem value="7">July</SelectItem>
                                    <SelectItem value="8">August</SelectItem>
                                    <SelectItem value="9">September</SelectItem>
                                    <SelectItem value="10">October</SelectItem>
                                    <SelectItem value="11">November</SelectItem>
                                    <SelectItem value="12">December</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>{t("year")}</Label>
                            <Select
                                value={filters.year}
                                onValueChange={(v) => setFilters({ ...filters, year: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("select_year")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full">
                                <Filter className="w-4 h-4" /> {t("apply_filters")}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("total_basic")}</p>
                                <p className="text-2xl font-bold">
                                    ৳ {totalBasic.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("total_allowances")}</p>
                                <p className="text-2xl font-bold">
                                    ৳ {totalAllowances.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <Filter className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("total_deductions")}</p>
                                <p className="text-2xl font-bold">
                                    ৳ {totalDeductions.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("total_net_salary")}</p>
                                <p className="text-2xl font-bold">৳ {totalNet.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Salary Details Report */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                            <CardTitle>{t("salary_breakdown_report")}</CardTitle>
                            <CardDescription>{t("detailed_salary_information")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("employee_id")}</TableHead>
                                <TableHead>{t("employee_name")}</TableHead>
                                <TableHead>{t("department")}</TableHead>
                                <TableHead className="text-right">{t("basic_salary")}</TableHead>
                                <TableHead className="text-right">{t("allowances")}</TableHead>
                                <TableHead className="text-right">{t("deductions")}</TableHead>
                                <TableHead className="text-right">{t("net_salary")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sampleSalaryData.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium">{emp.emp_id}</TableCell>
                                    <TableCell>{emp.name}</TableCell>
                                    <TableCell>{emp.department}</TableCell>
                                    <TableCell className="text-right">
                                        ৳ {emp.basic.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ৳ {emp.allowances.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ৳ {emp.deductions.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-semibold text-right">
                                        ৳ {emp.net_salary.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </section>
    );
}
