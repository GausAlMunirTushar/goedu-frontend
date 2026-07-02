export interface CertificateTemplateData {
    id?: string;
    name: string;
    type: string;
    title: string;
    body: string;
    footer?: string;
    status: string;
}

export interface GeneratedCertificateData {
    id?: string;
    certificateNo: string;
    verificationCode: string;
    templateId: string;
    type: string;
    recipientType: string;
    studentId?: string;
    staffId?: string;
    title: string;
    body: string;
    issueDate: string;
    status: string;
    template?: CertificateTemplateData;
    student?: any;
    staff?: any;
    institution?: any;
    generatedBy?: any;
}
