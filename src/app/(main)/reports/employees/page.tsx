"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Download, Filter, FileSpreadsheet, Printer } from "lucide-react";
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

export default function EmployeeReportsPage() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({
        department: "",
        employee_type: "",
        employment_status: "",
        date_from: "",
        date_to: "",
    });

    const sampleEmployees = [
        {
            id: 1,
            name: "John Doe",
            emp_id: "EMP001",
            department: "IT",
            designation: "Developer",
            type: "Permanent",
            status: "Active",
            joining_date: "2023-01-15",
        },
        {
            id: 2,
            name: "Jane Smith",
            emp_id: "EMP002",
            department: "HR",
            designation: "Manager",
            type: "Permanent",
            status: "Active",
            joining_date: "2022-06-01",
        },
        {
            id: 3,
            name: "Mike Johnson",
            emp_id: "EMP003",
            department: "Finance",
            designation: "Accountant",
            type: "Contract",
            status: "Active",
            joining_date: "2023-03-20",
        },
        {
            id: 4,
            name: "Sarah Williams",
            emp_id: "EMP004",
            department: "IT",
            designation: "Senior Developer",
            type: "Permanent",
            status: "Active",
            joining_date: "2021-09-10",
        },
    ];

    const handleExport = (format: string) => {
        console.log("Exporting to", format);
    };

    return (
        <section className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{t("employee_reports")}</h1>
                    <p className="text-sm text-gray-500">{t("employee_reports_description")}</p>
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
                        <Filter className="w-5 h-5 text-blue-600" />
                        <div>
                            <CardTitle>{t("filters")}</CardTitle>
                            <CardDescription>{t("filter_employee_reports")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <Label>{t("employee_type")}</Label>
                            <Select
                                value={filters.employee_type}
                                onValueChange={(v) => setFilters({ ...filters, employee_type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("select_employee_type")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("all_types")}</SelectItem>
                                    <SelectItem value="permanent">{t("permanent")}</SelectItem>
                                    <SelectItem value="contract">{t("contract")}</SelectItem>
                                    <SelectItem value="temporary">{t("temporary")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>{t("employment_status")}</Label>
                            <Select
                                value={filters.employment_status}
                                onValueChange={(v) =>
                                    setFilters({ ...filters, employment_status: v })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("select_status")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("all_status")}</SelectItem>
                                    <SelectItem value="active">{t("active")}</SelectItem>
                                    <SelectItem value="inactive">{t("inactive")}</SelectItem>
                                    <SelectItem value="suspended">{t("suspended")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>{t("date_from")}</Label>
                            <Input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) =>
                                    setFilters({ ...filters, date_from: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label>{t("date_to")}</Label>
                            <Input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) =>
                                    setFilters({ ...filters, date_to: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full">
                                <Filter className="w-4 h-4" /> {t("apply_filters")}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Employee List Report */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                            <CardTitle>{t("employee_list_report")}</CardTitle>
                            <CardDescription>{t("detailed_employee_information")}</CardDescription>
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
                                <TableHead>{t("designation")}</TableHead>
                                <TableHead>{t("type")}</TableHead>
                                <TableHead>{t("status")}</TableHead>
                                <TableHead>{t("joining_date")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sampleEmployees.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium">{emp.emp_id}</TableCell>
                                    <TableCell>{emp.name}</TableCell>
                                    <TableCell>{emp.department}</TableCell>
                                    <TableCell>{emp.designation}</TableCell>
                                    <TableCell>{emp.type}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${
                                                emp.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {emp.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{emp.joining_date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">{t("total_employees")}</p>
                            <p className="text-3xl font-bold text-blue-600">4</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">{t("active_employees")}</p>
                            <p className="text-3xl font-bold text-green-600">4</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">{t("permanent")}</p>
                            <p className="text-3xl font-bold text-purple-600">3</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">{t("contract")}</p>
                            <p className="text-3xl font-bold text-orange-600">1</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
