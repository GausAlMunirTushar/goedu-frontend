"use client";

import { AxiosAPI } from "@/apis/configs";
import { verifyCertificateUrl } from "@/apis/endpoints/certificate_apis";
import FormInput from "@/components/form/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Title from "@/components/ui/custom-ui/title";
import React from "react";
import { toast } from "sonner";

export function CertificateVerifyView() {
    const [code, setCode] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [certificate, setCertificate] = React.useState<any>();
    const verify = async () => {
        if (!code.trim()) return;
        setLoading(true);
        try {
            const res = await AxiosAPI.get(verifyCertificateUrl(code.trim()));
            setCertificate(res.data?.data);
            toast.success("Certificate found");
        } catch (e: any) {
            setCertificate(undefined);
            toast.error(e.response?.data?.message || "Certificate not found");
        } finally {
            setLoading(false);
        }
    };
    return <div className="p-2 space-y-4"><Card><CardHeader className="bg-white border-b border-gray-100"><Title>Verify Certificate</Title><p className="text-xs text-muted-foreground mt-1">Check a certificate by verification code.</p></CardHeader><CardContent className="bg-white rounded-b-xl space-y-4"><div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end"><FormInput id="code" label="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="CERT-XXXXXX-XXXX" /><Button onClick={verify} disabled={loading}>{loading ? "Checking..." : "Verify"}</Button></div>{certificate && <div className="border rounded-md p-4 space-y-2"><p className="text-sm font-semibold">{certificate.title}</p><p className="text-sm whitespace-pre-wrap">{certificate.body}</p><div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground"><span>No: {certificate.certificateNo}</span><span>Status: {certificate.status}</span><span>Institution: {certificate.institution?.name}</span></div></div>}</CardContent></Card></div>;
}
