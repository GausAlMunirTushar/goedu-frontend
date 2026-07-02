import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import { hrAttendanceUrl, hrDashboardUrl, hrLeavesUrl, hrLeaveTypesUrl, hrStaffUrl } from "@/apis/endpoints/hr_apis";

export const useHrDashboardQuery = () => useQuery<TResponse<any>>(hrDashboardUrl);

export const useHrStaffQuery = () => useQuery<TResponse<any[]>>(hrStaffUrl);

export const useHrAttendanceQuery = (date?: string) =>
    useQuery<TResponse<any[]>>(date ? `${hrAttendanceUrl}?date=${date}` : null);

export const useHrLeaveTypesQuery = () => useQuery<TResponse<any[]>>(hrLeaveTypesUrl);

export const useHrLeavesQuery = (filters?: { status?: string; userId?: string }) => {
    const parts = [];
    if (filters?.status) parts.push(`status=${filters.status}`);
    if (filters?.userId) parts.push(`userId=${filters.userId}`);
    return useQuery<TResponse<any[]>>(`${hrLeavesUrl}${parts.length ? `?${parts.join("&")}` : ""}`);
};
