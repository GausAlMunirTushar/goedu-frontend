"use client";

import { AxiosAPI } from "@/apis/configs";
import { generateCertificateUrl, revokeCertificateUrl } from "@/apis/endpoints/certificate_apis";
import { useCertificateTemplatesQuery, useGeneratedCertificatesQuery } from "@/apis/queries/certificate_queries";
import { useUsersQuery } from "@/apis/queries/auth_queries";
import { useStudentProfilesQuery } from "@/apis/queries/student_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, ShieldX } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { GenerateCertificateDialog } from "./CertificateForms";
import type { GeneratedCertificateData } from "./certificateTypes";

export function GeneratedCertificateListView() {
    const openModal = useModalStore((s) => s.openModal);
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useGeneratedCertificatesQuery();
    const { data: templateRes } = useCertificateTemplatesQuery();
    const { data: studentRes } = useStudentProfilesQuery({ status: "Active" });
    const { data: staffRes } = useUsersQuery();
    const rows = response?.data || [];
    const templates = templateRes?.data || [];
    const students = studentRes?.data || [];
    const staff = staffRes?.data || [];
    const filtered = rows.filter((r: GeneratedCertificateData) => r.certificateNo?.toLowerCase().includes(search.toLowerCase()) || r.verificationCode?.toLowerCase().includes(search.toLowerCase()) || r.type?.toLowerCase().includes(search.toLowerCase()));
    const generate = async (data: Partial<GeneratedCertificateData>) => { setSaving(true); try { const payload = { ...data, studentId: data.recipientType === "Student" ? data.studentId : undefined, staffId: data.recipientType === "Staff" ? data.staffId : undefined }; const res = await AxiosAPI.post(generateCertificateUrl, payload); if (res.data?.success) { toast.success("Certificate generated"); mutate(); setOpen(false); } } catch (e: any) { toast.error(e.response?.data?.message || "Generate failed"); } finally { setSaving(false); } };
    const revoke = (id: string) => openModal("confirm-delete", { title: "Revoke certificate", description: "This certificate will no longer verify as issued.", onConfirm: async () => { try { await AxiosAPI.post(revokeCertificateUrl(id), {}); toast.success("Certificate revoked"); mutate(); } catch (e: any) { toast.error(e.response?.data?.message || "Revoke failed"); } } });
    const columns: ColumnDef<GeneratedCertificateData>[] = [{ accessorKey: "certificateNo", header: "Certificate No" }, { accessorKey: "type", header: "Type" }, { header: "Recipient", cell: ({ row }) => row.original.student ? `${row.original.student.firstName} ${row.original.student.lastName}` : row.original.staff?.username || "-" }, { accessorKey: "verificationCode", header: "Verify Code" }, { accessorKey: "status", header: "Status" }, { id: "actions", header: "Actions", cell: ({ row }) => <TableActions extraActions={[{ label: "Revoke", icon: <ShieldX size={16} />, destructive: true, disabled: row.original.status === "Revoked", onClick: () => revoke(row.original.id!) }]} /> }];
    if (isLoading) return <TableSkeleton />;
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><div className="flex justify-between items-center gap-4"><div><Title>Issued Certificates</Title><p className="text-xs text-muted-foreground mt-1">Generate, track, and revoke issued certificates.</p></div><Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Generate</Button></div></CardHeader><CardContent className="bg-white rounded-b-xl"><DataTable columns={columns} data={filtered} searchKey="certificateNo" searchPlaceholder="Search certificates..." searchValue={search} onSearch={setSearch} /></CardContent></Card><GenerateCertificateDialog templates={templates} students={students} staff={staff} isOpen={open} isSubmitting={saving} onClose={() => setOpen(false)} onSubmit={generate} /></div>;
}
