export const certificateDashboardUrl = "/certificates/dashboard";
export const certificateTemplatesUrl = "/certificates/templates";
export const certificateTemplateDetailUrl = (id: string) => `/certificates/templates/${id}`;
export const generatedCertificatesUrl = "/certificates/issued";
export const generateCertificateUrl = "/certificates/generate";
export const revokeCertificateUrl = (id: string) => `/certificates/issued/${id}/revoke`;
export const verifyCertificateUrl = (code: string) => `/certificates/verify/${code}`;
