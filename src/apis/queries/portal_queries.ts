import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import {
    guardianPortalChildSummaryUrl,
    guardianPortalChildrenUrl,
    studentPortalAttendanceUrl,
    studentPortalSummaryUrl,
} from "@/apis/endpoints/portal_apis";

export const useStudentPortalSummaryQuery = () => useQuery<TResponse<any>>(studentPortalSummaryUrl);

export const useStudentPortalAttendanceQuery = () => useQuery<TResponse<any[]>>(studentPortalAttendanceUrl);

export const useGuardianPortalChildrenQuery = () => useQuery<TResponse<any[]>>(guardianPortalChildrenUrl);

export const useGuardianPortalChildSummaryQuery = (studentId?: string) =>
    useQuery<TResponse<any>>(studentId ? guardianPortalChildSummaryUrl(studentId) : null);
