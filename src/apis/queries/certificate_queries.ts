import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import { certificateDashboardUrl, certificateTemplatesUrl, generatedCertificatesUrl, verifyCertificateUrl } from "../endpoints/certificate_apis";

export const useCertificateDashboardQuery = () => useQuery<TResponse<any>>(certificateDashboardUrl);
export const useCertificateTemplatesQuery = () => useQuery<TResponse<any>>(certificateTemplatesUrl);
export const useGeneratedCertificatesQuery = () => useQuery<TResponse<any>>(generatedCertificatesUrl);
export const useVerifyCertificateQuery = (code?: string) => useQuery<TResponse<any>>(code ? verifyCertificateUrl(code) : null);
